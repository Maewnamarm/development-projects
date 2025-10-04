'use client';

import { createClient } from '@supabase/supabase-js';
import { ChevronDown, Home, LogOut, Search, Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Activity {
  id: number;
  description: string;
  start_date: string;
  end_date: string;
  project_id: number;
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
  status: 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'รอดำเนินการ' | 'ล่าช้า';
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

  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [showActivityStatus, setShowActivityStatus] = useState<{ [key: number]: boolean }>({});

  const [isProjectStatusDropdownOpen, setIsProjectStatusDropdownOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<string>('รอดำเนินการ');

  const statusOptions = [
    { status: 'รอดำเนินการ', color: 'bg-white text-black border-gray-500', dot: 'bg-gray-500' },
    { status: 'กำลังดำเนินการ', color: 'bg-white text-black border-gray-500', dot: 'bg-yellow-300' },
    { status: 'เสร็จสิ้น', color: 'bg-white text-black border-gray-500', dot: 'bg-green-500' },
  ];
 
  const fetchProjectData = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
    if (error) {
      toast.error('โหลดโครงการไม่สำเร็จ');
    } else if (data) {
      setProject(data as Project);
    }
  }, [projectId]);

  const fetchActivities = useCallback(async () => {
    const { data, error } = await supabase.from('activities').select('*').eq('project_id', projectId);
    if (error) {
      toast.error('โหลดกิจกรรมไม่สำเร็จ');
    } else {
      setActivities(
        (data || []).map((a: RawActivity) => ({
          ...a,
          start_date: a.start_date ? new Date(a.start_date).toLocaleDateString('th-TH') : '',
          end_date: a.end_date ? new Date(a.end_date).toLocaleDateString('th-TH') : '',
        }))
      );
    }
  }, [projectId]);

  const fetchStatusUpdates = useCallback(async () => {
    const { data, error } = await supabase
      .from('status')
      .select('*')
      .eq('project_id', projectId)
      .order('stat_date', { ascending: false });
    
    if (error) {
      toast.error('โหลดสถานะอัปเดตไม่สำเร็จ');
    } else {
      setStatusUpdates(
        (data || []).map((u: RawStatusUpdate) => ({
          ...u,
          stat_date: u.stat_date ? new Date(u.stat_date).toLocaleDateString('th-TH') : '',
        }))
      );
    }
  }, [projectId]);

  const getLatestActivityStatus = (activityId: number): string => {
    const activityUpdates = statusUpdates.filter(u => u.activity_id === activityId);
    if (activityUpdates.length === 0) return 'รอดำเนินการ';
    return activityUpdates[0].status;
  };

  const calculateProgress = useCallback(() => {
    const activityStatuses = activities.map(activity => {
      const latestStatus = getLatestActivityStatus(activity.id);
      return latestStatus;
    });
    
    const completed = activityStatuses.filter(status => status === 'เสร็จสิ้น').length;
    const total = activities.length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [activities, statusUpdates]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
      fetchActivities();
      fetchStatusUpdates();
    }
  }, [projectId, fetchProjectData, fetchActivities, fetchStatusUpdates]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getStatusClasses = (status: string) => {
    const option = statusOptions.find(o => o.status === status);
    return option ? option.color : '';
  };

  const getStatusDotColor = (status: string) => {
    const option = statusOptions.find(o => o.status === status);
    return option ? option.dot : '';
  };

  const updateProjectStatus = (status: string) => {
    setSelectedProjectStatus(status);
    setIsProjectStatusDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStatusUpdateFile(e.target.files[0]);
    }
  };

  const handleUpdateFormSubmit = async () => {
    if (!updateForm.action || !updateForm.problem || !updateForm.solving || !updateForm.reporter || !updateForm.role || !selectedActivityId) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่องและเลือกกิจกรรม");
      return;
    }

    const currentUserName = updateForm.reporter;
    const userRole = updateForm.role;
    const uploadedFileUrl = statusUpdateFile ? URL.createObjectURL(statusUpdateFile) : null;

    // บันทึกข้อมูลทั้งหมดลงตาราง status (รวมสถานะด้วย)
    const { data: statusData, error: statusError } = await supabase
      .from('status')
      .insert({
        project_id: projectId,
        activity_id: selectedActivityId,
        problem: updateForm.problem,
        solving: updateForm.solving,
        action: updateForm.action,
        reporter: currentUserName,
        role: userRole,
        picture: uploadedFileUrl,
        status: selectedProjectStatus,
        stat_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (statusError) {
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
      console.error('Status insert error:', statusError);
      return;
    }

    toast.success('บันทึกข้อมูลเรียบร้อย');

    // รีเฟรชข้อมูล
    setStatusUpdates(prev => [statusData as StatusUpdate, ...prev]);
    setUpdateForm({
      problem: '',
      solving: '',
      action: '',
      reporter: '',
      role: '',
    });
    setStatusUpdateFile(null);
    setSelectedActivityId(null);
    setSelectedProjectStatus('รอดำเนินการ');
  };

  const getActivityStatusUpdates = (activityId: number) => {
    return statusUpdates.filter(update => update.activity_id === activityId);
  };

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
        window.location.href = '/';
      } else {
        console.error('Logout failed:', data.message);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getCompletedActivitiesCount = () => {
    return activities.filter(activity => {
      const latestStatus = getLatestActivityStatus(activity.id);
      return latestStatus === 'เสร็จสิ้น';
    }).length;
  };

  return (
    <div className="min-h-screen bg-blue-200 font-inter flex flex-col">
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
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
            <Home className="text-gray-700 mr-2" size={18} />
            <span className="text-gray-800 font-semibold">หน้าหลัก</span>
          </div>
          <div className="relative flex items-center bg-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="ค้นหาข้อมูลที่นี่..."
              className="p-2 pl-4 pr-10 bg-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md font-medium"
            />
            <Search className="absolute right-3 text-gray-600" size={20} />
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
              <span className="font-bold text-gray-900">เมนู</span>
              <ChevronDown className={`text-gray-700 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} size={18} />
            </div>
            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-800 font-medium hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Site')}>โครงการทั้งหมด</li>
                <li className="p-3 text-gray-800 font-medium hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>เพิ่มโครงการ</li>
                <li className="p-3 text-gray-800 font-medium hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Statistics')}>สถิติ</li>
                <li
                  className="p-3 text-red-700 font-semibold hover:bg-red-50 rounded-md cursor-pointer flex items-center space-x-2"
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">ติดตามสถานะโครงการ</h2>
              <div className="flex items-center">
                <label htmlFor="status" className="mr-4 text-gray-900 font-semibold">สถานะ :</label>
                {selectedActivityId ? (
                  <div className="relative">
                    <div
                      className={`flex items-center px-4 py-2 rounded-full border cursor-pointer font-semibold ${getStatusClasses(selectedProjectStatus)}`}
                      onClick={() => setIsProjectStatusDropdownOpen(!isProjectStatusDropdownOpen)}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(selectedProjectStatus)}`}></div>
                      {selectedProjectStatus}
                      <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isProjectStatusDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isProjectStatusDropdownOpen && (
                      <ul className="absolute top-12 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {statusOptions.map((option) => (
                          <li
                            key={option.status}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-gray-900 font-medium"
                            onClick={() => updateProjectStatus(option.status)}
                          >
                            <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                            {option.status}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-2 text-gray-500 font-semibold">-</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900 mb-6">
              <p className="font-medium"><strong className="font-bold">ชื่อโครงการ:</strong> {project?.name || 'Loading...'}</p>
              <p className="font-medium"><strong className="font-bold">รหัสโครงการ:</strong> {project?.code || 'Loading...'}</p>
              <p className="font-medium"><strong className="font-bold">หน่วยงาน:</strong> {project?.department || 'Loading...'}</p>
              <p className="font-medium"><strong className="font-bold">ผู้รับผิดชอบ:</strong> {project?.responsible_person || 'Loading...'}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">อัปเดตสถานะโครงการ</h3>
              <div className="space-y-2">
                <label className="block text-gray-900 font-semibold">เลือกกิจกรรม</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                  value={selectedActivityId || ''}
                  onChange={(e) => {
                    const actId = e.target.value ? parseInt(e.target.value) : null;
                    setSelectedActivityId(actId);
                    
                    // ดึงสถานะล่าสุดของกิจกรรมที่เลือก
                    if (actId) {
                      const latestStatus = getLatestActivityStatus(actId);
                      setSelectedProjectStatus(latestStatus);
                    } else {
                      setSelectedProjectStatus('รอดำเนินการ');
                    }
                  }}
                >
                  <option value="">-- เลือกกิจกรรม --</option>
                  {activities.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      กิจกรรม {activity.id}: {activity.description.substring(0, 70)}...
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-900 font-semibold">กิจกรรม/รายละเอียด *</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium"
                  rows={2}
                  value={updateForm.action}
                  onChange={(e) => setUpdateForm({ ...updateForm, action: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-900 font-semibold">ปัญหา *</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium"
                    rows={2}
                    value={updateForm.problem}
                    onChange={(e) => setUpdateForm({ ...updateForm, problem: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-900 font-semibold">แนวทางการแก้ไข *</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium"
                    rows={2}
                    value={updateForm.solving}
                    onChange={(e) => setUpdateForm({ ...updateForm, solving: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-900 font-semibold">ผู้บันทึกข้อมูล *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium"
                    value={updateForm.reporter}
                    onChange={(e) => setUpdateForm({ ...updateForm, reporter: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-900 font-semibold">ตำแหน่ง *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium"
                    value={updateForm.role}
                    onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-900 font-semibold">รูปภาพ</label>
                <input type="file" id="image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                <label htmlFor="image-upload" className="bg-gray-200 text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer flex items-center w-fit">
                  <Upload size={18} className="mr-2" />
                  {statusUpdateFile ? 'เปลี่ยนรูปภาพ' : 'อัปโหลดรูปภาพ'}
                </label>
                {statusUpdateFile && <span className="text-sm text-gray-800 font-medium ml-3">{statusUpdateFile.name}</span>}
              </div>
              <div className="flex justify-end">
                <button onClick={handleUpdateFormSubmit} className="bg-green-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700">บันทึก</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">กิจกรรม</h2>
            </div>
            <div className="space-y-4">
              {activities.map(activity => {
                const latestStatus = getLatestActivityStatus(activity.id);
                return (
                  <div key={activity.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{activity.description}</h3>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center px-3 py-1 rounded-full border font-semibold text-sm ${getStatusClasses(latestStatus)}`}>
                          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${getStatusDotColor(latestStatus)}`}></div>
                          {latestStatus}
                        </div>
                        <button
                          className="text-blue-600 font-semibold text-sm hover:text-blue-800"
                          onClick={() => setShowActivityStatus(prev => ({ ...prev, [activity.id]: !prev[activity.id] }))}
                        >
                          {showActivityStatus[activity.id] ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
                        </button>
                      </div>
                    </div>

                    {showActivityStatus[activity.id] && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-300">
                        <h4 className="font-bold text-gray-900 mb-2">ประวัติการอัปเดตของกิจกรรมนี้</h4>
                        <div className="space-y-3">
                          {getActivityStatusUpdates(activity.id).map(update => (
                            <div key={update.stat_id} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-gray-900">ลำดับที่: {update.stat_id}</span>
                                  <div className={`flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${getStatusClasses(update.status)}`}>
                                    <div className={`w-2 h-2 rounded-full mr-1 ${getStatusDotColor(update.status)}`}></div>
                                    {update.status}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-800 font-medium">{update.stat_date}</span>
                              </div>
                              <div className="space-y-1 text-gray-900">
                                <p className="font-medium"><strong className="font-bold">รายละเอียด:</strong> {update.action}</p>
                                <p className="font-medium"><strong className="font-bold">ปัญหา:</strong> {update.problem}</p>
                                <p className="font-medium"><strong className="font-bold">แนวทางแก้ไข:</strong> {update.solving}</p>
                              </div>
                              {update.picture && (
                                <div className="mt-3">
                                  <img src={update.picture} alt={`Update image for ${update.stat_id}`} className="rounded-lg object-cover max-h-48" />
                                </div>
                              )}
                              <div className="text-right text-xs text-gray-800 font-semibold mt-2">
                                โดย: {update.reporter} ({update.role})
                              </div>
                            </div>
                          ))}
                          {getActivityStatusUpdates(activity.id).length === 0 && (
                            <p className="text-sm text-gray-700 font-medium italic">ยังไม่มีการอัปเดตสถานะสำหรับกิจกรรมนี้</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">ความคืบหน้าโครงการ</h3>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-blue-600 h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              >
                {calculateProgress().toFixed(0)}%
              </div>
            </div>
            <p className="text-sm text-gray-800 font-semibold mt-2">
              เสร็จสิ้น {getCompletedActivitiesCount()} จาก {activities.length} กิจกรรม
            </p>
          </div>
        </main>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}