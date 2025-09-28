'use client';

import { createClient } from '@supabase/supabase-js';
import { ChevronDown, Home, Search, Upload, LogOut } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react'; // ✅ Import useCallback
import toast, { Toaster } from 'react-hot-toast';
// import { v4 as uuidv4 } from 'uuid'; // ❌ REMOVED: uuidv4 is not used

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface Activity {
  id: number;
  description: string;
  start_date: string;
  end_date: string;
  status: 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'ระงับ';
  project_id: number;
  statusUpdates?: StatusUpdate[];
}

interface StatusUpdate {
  stat_id: number;
  problem: string;
  solving: string;
  action: string;
  reporter: string;
  stat_date: string;
  role: string;
  picture?: string;
  project_id: number;
  activity_id?: number;
}

interface Project {
  id: number;
  name: string;
  code: string;
  department: string;
  status: string;
  budget: number;
  responsible_person: string;
  start_date: string;
  end_date: string;
}

// Type สำหรับข้อมูลดิบที่ได้จาก Supabase ก่อนจัดรูปแบบวันที่
type RawActivity = Omit<Activity, 'start_date' | 'end_date'> & { start_date: string | null; end_date: string | null };
type RawStatusUpdate = Omit<StatusUpdate, 'stat_date'> & { stat_date: string | null };

export default function TracePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const projectId = Number(params.id);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);

  const [updateForm, setUpdateForm] = useState({
    problem: '',
    solving: '',
    action: '',
    reporter: '',
    role: '',
  });

  const [statusUpdateFile, setStatusUpdateFile] = useState<File | null>(null);
  // ❌ REMOVED: progress is assigned but never used.
  // const [progress, setProgress] = useState<number>(0); 
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [showActivityStatus, setShowActivityStatus] = useState<{ [key: number]: boolean }>({});

  const [isProjectStatusDropdownOpen, setIsProjectStatusDropdownOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState('กำลังดำเนินการ');
  // ❌ REMOVED: isActivityStatusDropdownOpen & setIsActivityStatusDropdownOpen are unused.
  // const [isActivityStatusDropdownOpen, setIsActivityStatusDropdownOpen] = useState<{ [key: number]: boolean }>({});

  const statusOptions = [
    { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
    { status: 'เสร็จสิ้น', color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
    { status: 'ระงับ', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },
  ];

  // ✅ Wrap fetch functions in useCallback to stabilize dependencies
  const fetchProjectData = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
    if (error) {
      toast.error('โหลดโครงการไม่สำเร็จ');
    } else if (data) {
      // ✅ Explicitly cast data to Project
      setProject(data as Project);
      setSelectedProjectStatus((data as Project).status || 'กำลังดำเนินการ');
    }
  }, [projectId]);

  // ✅ Wrap fetch functions in useCallback to stabilize dependencies
  const fetchActivities = useCallback(async () => {
    const { data, error } = await supabase.from('activities').select('*').eq('project_id', projectId);
    if (error) {
      toast.error('โหลดกิจกรรมไม่สำเร็จ');
    } else {
      // ✅ Use RawActivity type instead of 'any'
      setActivities(
        (data || []).map((a: RawActivity) => ({
          ...a,
          start_date: a.start_date ? new Date(a.start_date).toLocaleDateString('th-TH') : '',
          end_date: a.end_date ? new Date(a.end_date).toLocaleDateString('th-TH') : '',
        }))
      );
    }
  }, [projectId]);

  // ✅ Wrap fetch functions in useCallback to stabilize dependencies
  const fetchStatusUpdates = useCallback(async () => {
    const { data, error } = await supabase.from('status').select('*').eq('project_id', projectId);
    if (error) {
      toast.error('โหลดสถานะอัปเดตไม่สำเร็จ');
    } else {
      // ✅ Use RawStatusUpdate type instead of 'any'
      setStatusUpdates(
        (data || []).map((u: RawStatusUpdate) => ({
          ...u,
          stat_date: u.stat_date ? new Date(u.stat_date).toLocaleDateString('th-TH') : '',
        }))
      );
    }
  }, [projectId]);

  // ✅ Wrap calculateProgress in useCallback to stabilize dependency
  const calculateProgress = useCallback(() => {
    const completed = activities.filter(activity => activity.status === 'เสร็จสิ้น').length;
    const total = activities.length;
    // ❌ setProgress() removed as progress state is removed
    return total > 0 ? (completed / total) * 100 : 0;
  }, [activities]);

  // ✅ Fixed missing dependencies
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
      fetchActivities();
      fetchStatusUpdates();
    }
  }, [projectId, fetchProjectData, fetchActivities, fetchStatusUpdates]);

  // ✅ Fixed missing dependency (calculateProgress)
  useEffect(() => {
    calculateProgress();
  }, [activities, calculateProgress]);

  // ใช้ navigate
  const navigateTo = (path: string) => {
    router.push(path);
  };

  // คลาสสีของสถานะโครงการ
  const getStatusClasses = (status: string) => {
    const option = statusOptions.find(o => o.status === status);
    return option ? option.color : '';
  };

  const getStatusDotColor = (status: string) => {
    const option = statusOptions.find(o => o.status === status);
    return option ? option.dot : '';
  };

  // อัปเดตสถานะโครงการ (TODO: call API ถ้าต้องการบันทึกลง DB)
  const updateProjectStatus = (status: string) => {
    setSelectedProjectStatus(status);
    setIsProjectStatusDropdownOpen(false);
  };

  // เลือกไฟล์รูป
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStatusUpdateFile(e.target.files[0]);
    }
  };

  // บันทึกฟอร์มอัปเดต
  const handleUpdateFormSubmit = async () => {
    if (!updateForm.action && !updateForm.problem && !updateForm.solving) {
      toast.error("กรุณากรอกข้อมูลอย่างน้อยหนึ่งช่อง");
      return;
    }

    const currentUserName = updateForm.reporter || "ไม่ระบุ";
    const userRole = updateForm.role || "ไม่ระบุ";
    // NOTE: In a real app, you should upload statusUpdateFile to a storage service (like Supabase Storage) here
    // and use the returned URL, not URL.createObjectURL, which is only client-side temporary.
    const uploadedFileUrl = statusUpdateFile ? URL.createObjectURL(statusUpdateFile) : null;

    const res = await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectId,
        activity_id: selectedActivityId,
        problem: updateForm.problem,
        solving: updateForm.solving,
        action: updateForm.action,
        reporter: currentUserName,
        role: userRole,
        picture: uploadedFileUrl,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("บันทึกสถานะเรียบร้อย");
      // ✅ Cast result to StatusUpdate
      setStatusUpdates(prev => [...prev, result as StatusUpdate]);
      setUpdateForm({
        problem: '',
        solving: '',
        action: '',
        reporter: '',
        role: '',
      });
      setStatusUpdateFile(null);
      setSelectedActivityId(null);
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาด");
    }
  };


const getActivityStatusUpdates = (activityId: number) => {
  return statusUpdates.filter(update => update.activity_id === activityId);
};

// ❌ REMOVED: handleAddStatus function was a duplicate and unused.
/*
const handleAddStatus = async () => {
  // ... (duplicate logic)
};
*/

const handleLogout = async () => {
  if (isLoggingOut) return;

  setIsLoggingOut(true);

  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.ok) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_type');
      localStorage.clear();

      window.location.href = '/';
    } else {
      console.error('Logout failed:', data.message);
      localStorage.clear();
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.clear();
    window.location.href = '/';
  } finally {
    setIsLoggingOut(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      {/* Header and Nav are fine, no changes needed */}
       <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            {/* Warning remains as per instruction: not to change UI/Front, so no change to <img> */}
            <img
              src="https://placehold.co/40x40/ffffff/000000?text=LOGO"
              alt="เทศบาลตำบลปะโค Logo"
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">การจัดการโครงการพัฒนาเทศบาลตำบลปะโค</h1>
            <p className="text-sm">อำเภอเมืองหนองคาย จังหวัดหนองคาย</p>
          </div>
        </div>
      </header>
      <nav className="bg-gray-200 p-3 shadow-sm">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <Home className="text-gray-600 mr-2" size={18} />
            <span className="text-gray-700 font-medium">หน้าหลัก</span>
          </div>
          <div className="relative flex items-center bg-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="ค้นหาข้อมูลที่นี่..."
              className="p-2 pl-4 pr-10 bg-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            />
            <Search className="absolute right-3 text-gray-500" size={20} />
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-lg min-h-[calc(100vh-120px)]">
          <div className="mb-6">
            <div
              className="flex items-center justify-between p-3 bg-blue-100 rounded-md mb-2 cursor-pointer hover:bg-blue-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="font-semibold text-gray-800">เมนู</span>
              <ChevronDown className={`text-gray-600 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} size={18} />
            </div>
            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Site')}>โครงการทั้งหมด</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>เพิ่มโครงการ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Statistics')}>สถิติ</li>
                <li
                  className="p-3 text-red-600 hover:bg-red-50 rounded-md cursor-pointer flex items-center space-x-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>{isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</span>
                </li>
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Project Status Section */}
              <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">ติดตามสถานะโครงการ</h2>
              <div className="flex items-center">
                <label htmlFor="status" className="mr-4 text-gray-700">สถานะ :</label>
                <div
                  className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${getStatusClasses(selectedProjectStatus)}`}
                  onClick={() => setIsProjectStatusDropdownOpen(!isProjectStatusDropdownOpen)}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(selectedProjectStatus)}`}></div>
                  {selectedProjectStatus}
                  <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isProjectStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isProjectStatusDropdownOpen && (
                  <ul className="absolute top-10 right-14 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                    {statusOptions.map((option) => (
                      <li
                        key={option.status}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black"
                        onClick={() => updateProjectStatus(option.status)}
                      >
                        <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                        {option.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <p><strong>ชื่อโครงการ:</strong> {project?.name || 'Loading...'}</p>
              <p><strong>รหัสโครงการ:</strong> {project?.code || 'Loading...'}</p>
              <p><strong>หน่วยงาน:</strong> {project?.department || 'Loading...'}</p>
              <p><strong>ผู้รับผิดชอบ:</strong> {project?.responsible_person || 'Loading...'}</p>
            </div>
            {/* Status Update Form */}
            <div className="space-y-4">
               <h3 className="text-xl font-semibold text-gray-800">อัปเดตสถานะโครงการ</h3>
                 <div className="space-y-2">
                    <label className="block text-gray-700">เลือกกิจกรรม (ไม่บังคับ)</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      value={selectedActivityId || ''}
                      onChange={(e) => setSelectedActivityId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">-- อัปเดตสถานะโดยรวมของโครงการ --</option>
                      {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                          กิจกรรม {activity.id}: {activity.description.substring(0, 70)}...
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700">กิจกรรม/รายละเอียด</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      rows={2}
                      value={updateForm.action}
                      onChange={(e) => setUpdateForm({ ...updateForm, action: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-gray-700">ปัญหา</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md text-black"
                        rows={2}
                        value={updateForm.problem}
                        onChange={(e) => setUpdateForm({ ...updateForm, problem: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-gray-700">แนวทางการแก้ไข</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md text-black"
                        rows={2}
                        value={updateForm.solving}
                        onChange={(e) => setUpdateForm({ ...updateForm, solving: e.target.value })}
                      />
                    </div>
                  </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="block text-gray-700">ผู้บันทึกข้อมูล</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                            value={updateForm.reporter}
                            onChange={(e) => setUpdateForm({ ...updateForm, reporter: e.target.value })}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="block text-gray-700">ตำแหน่ง</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                            value={updateForm.role}
                            onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}
                          />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-gray-700">รูปภาพ</label>
                      <input type="file" id="image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                      <label htmlFor="image-upload" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer flex items-center w-fit">
                          <Upload size={18} className="mr-2" />
                          {statusUpdateFile ? 'เปลี่ยนรูปภาพ' : 'อัปโหลดรูปภาพ'}
                      </label>
                      {statusUpdateFile && <span className="text-sm text-gray-600 ml-3">{statusUpdateFile.name}</span>}
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleUpdateFormSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">บันทึก</button>
                    </div>
            </div>

            <hr className="my-6" />

            {/* General status table can remain if desired */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">ตารางสรุปสถานะโดยรวม</h3>
                {/* Table JSX... */}
            </div>
          </div>

          {/* Activities Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">กิจกรรม</h2>
            </div>
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">{activity.description}</h3>
                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => setShowActivityStatus(prev => ({ ...prev, [activity.id]: !prev[activity.id] }))}
                    >
                      {showActivityStatus[activity.id] ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
                    </button>
                  </div>

                  {showActivityStatus[activity.id] && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200">
                      <h4 className="font-semibold text-gray-700 mb-2">ประวัติการอัปเดตของกิจกรรมนี้</h4>
                      <div className="space-y-3">
                        {getActivityStatusUpdates(activity.id).map(update => (
                          <div key={update.stat_id} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-gray-700">ลำดับที่: {update.stat_id}</span>
                              <span className="text-xs text-gray-500">{update.stat_date}</span>
                            </div>
                            <div className="space-y-1">
                              <p><strong>รายละเอียด:</strong> {update.action}</p>
                              <p><strong>ปัญหา:</strong> {update.problem}</p>
                              <p><strong>แนวทางแก้ไข:</strong> {update.solving}</p>
                            </div>
                            {update.picture && (
                              <div className="mt-3">
                                {/* Warning remains as per instruction: not to change UI/Front, so no change to <img> */}
                                <img src={update.picture} alt={`Update image for ${update.stat_id}`} className="rounded-lg object-cover max-h-48" />
                              </div>
                            )}
                            <div className="text-right text-xs text-gray-500 mt-2">
                              โดย: {update.reporter} ({update.role})
                            </div>
                          </div>
                        ))}
                        {getActivityStatusUpdates(activity.id).length === 0 && (
                          <p className="text-sm text-gray-500 italic">ยังไม่มีการอัปเดตสถานะสำหรับกิจกรรมนี้</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* A general image gallery section seems redundant now, you can remove it if not needed */}
        </main>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}