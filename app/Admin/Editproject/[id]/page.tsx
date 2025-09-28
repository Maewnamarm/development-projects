'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, Save, X, Plus, Upload, Trash2,LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const STATUS_OPTIONS = [
  { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
  { status: 'ระงับ', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },
  { status: 'เสร็จสิ้น', color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
];

const PLACEHOLDER_LOGO = 'https://placehold.co/40x40/ffffff/000000?text=LOGO';

const getStatusMeta = (status: string) => STATUS_OPTIONS.find(opt => opt.status === status) || STATUS_OPTIONS[0];
const nextId = (arr: any[]) => (arr.length > 0 ? arr[arr.length - 1].id + 1 : 1);

export default function EditProject() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);

  /** Project Info */
  const [projectInfo, setProjectInfo] = useState({
    projName: '',
    projCode: '',
    department: '',
    location: '',
    startDate: '',
    endDate: '',
    objective: '',
    category: '',
    budget: '',
    responsiblePerson: '',
    contactInfo: ''
  });

  const [activities, setActivities] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocument, setNewDocument] = useState<{ name: string; file: File | null }>({ name: '', file: null });

  const [selectedStatus, setSelectedStatus] = useState('กำลังดำเนินการ');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusMeta = useMemo(() => getStatusMeta(selectedStatus), [selectedStatus]);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => setIsMenuOpen(v => !v);
  const navigateTo = (path: string) => { router.push(path); };

  const safeNumber = (n: any) => {
    if (n === "" || n === null || n === undefined) return null;
    const num = Number(n);
    return isNaN(num) ? null : num;
  };

  /** Fetch project + activities + documents */
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // 1️⃣ fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            id, name, code, department, location, start_date, end_date,
            objective, category, budget, responsible_person, contact_info, status
          `)
          .eq('id', id)
          .single();

        if (projectError) throw projectError;

        if (projectData) {
          setProjectInfo({
            projName: projectData.name,
            projCode: projectData.code,
            department: projectData.department,
            location: projectData.location,
            startDate: projectData.start_date,
            endDate: projectData.end_date,
            objective: projectData.objective,
            category: projectData.category,
            budget: projectData.budget,
            responsiblePerson: projectData.responsible_person,
            contactInfo: projectData.contact_info,
          });
          setSelectedStatus(projectData.status || 'กำลังดำเนินการ');
        }

        const projectId = Number(id);

        // 2️⃣ fetch activities by project_id
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('project_id',projectId);

        if (activitiesError) throw activitiesError;

        setActivities((activitiesData || []).map(a => ({
          id: a.id,
          description: a.description,
          startDate: a.start_date,
          endDate: a.end_date
        })));

        // 3️⃣ fetch documents by project_id
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('project_id', projectId);

        if (documentsError) throw documentsError;

        setDocuments((documentsData || []).map(d => ({
          id: d.id,
          name: d.name,
          fileUrl: d.file_url,
          isPublic: d.is_public
        })));

      } catch (err: any) {
        toast.error("โหลดข้อมูลโครงการล้มเหลว: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  /** Handlers */
  const handleProjectChange = (field: string, value: string) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  const addActivity = () => setActivities(prev => [...prev, { id: nextId(prev), description: '', startDate: '', endDate: '' }]);
  const removeLastActivity = () => setActivities(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
  const handleActivityChange = (id: number, field: string, value: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewDocument(prev => ({ ...prev, file }));
  };

  const addDocument = async () => {
    if (!newDocument.name || !newDocument.file) {
      toast.error("กรุณากรอกชื่อเอกสารและเลือกไฟล์ก่อนบันทึก");
      return;
    }

    try {
      const file = newDocument.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // get public URL
      const { data: publicData } = supabase.storage.from('project-files').getPublicUrl(fileName);
      const publicUrl = publicData?.publicUrl;

      setDocuments(prev => [
        ...prev,
        { id: nextId(prev), name: newDocument.name, fileUrl: publicUrl, isPublic: false }
      ]);

      setNewDocument({ name: '', file: null });
      toast.success("เพิ่มเอกสารเรียบร้อย");
    } catch (err: any) {
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์: " + err.message);
    }
  };

  const handlePublicSelect = (id: number) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc));
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("ลบเอกสารสำเร็จ");
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  };

  /** Save Project */
  const handleSave = async () => {
    try {
      const payload = {
        project: {
          id,
          name: projectInfo.projName,
          code: projectInfo.projCode,
          department: projectInfo.department,
          location: projectInfo.location,
          start_date: projectInfo.startDate,
          end_date: projectInfo.endDate,
          objective: projectInfo.objective,
          category: projectInfo.category,
          budget: safeNumber(projectInfo.budget),
          responsible_person: projectInfo.responsiblePerson,
          contact_info: projectInfo.contactInfo,
          status: selectedStatus
        },
        activities: activities.map(a => ({
          id: a.id,
          project_id: id,
          description: a.description,
          start_date: a.startDate,
          end_date: a.endDate
        })),
        documents: documents.map(d => ({
          id: d.id,
          project_id: id,
          name: d.name,
          file_url: d.fileUrl || null,
          is_public: d.isPublic ?? false
        }))
      };

      const res = await fetch("/api/updateProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "อัปเดตไม่สำเร็จ");
      }

      toast.success("บันทึกโครงการเรียบร้อย");
      setTimeout(() => router.push("/Admin/Site"), 1000);
    } catch (err: any) {
      toast.error("อัปเดตไม่สำเร็จ: " + err.message);
    }
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

  if (loading) return <div className="p-6">⏳ กำลังโหลดข้อมูล...</div>;

  /** Render */
  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <img src={PLACEHOLDER_LOGO} alt="Logo" className="h-10 w-10 rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold">การจัดการโครงการ</h1>
            <p className="text-sm">อำเภอเมืองแมว จังหวัดดาวอังคาร</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-lg min-h-[calc(100vh-64px)]">
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 bg-blue-100 rounded-md mb-2 cursor-pointer hover:bg-blue-200" onClick={toggleMenu}>
              <span className="font-semibold text-gray-800">เมนู</span>
              <ChevronDown className={`text-gray-600 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} size={18} />
            </div>
            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Site')}>โครงการทั้งหมด</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>เพิ่มโครงการ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>สถิติ</li>
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

        {/* Main */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Project Info */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">แก้ไขโครงการ</h2>
            <Field label="ชื่อโครงการ">
              <input type="text" value={projectInfo.projName} onChange={e => handleProjectChange('projName', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="รหัสโครงการ">
              <input type="text" value={projectInfo.projCode} onChange={e => handleProjectChange('projCode', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="หน่วยงาน">
              <input type="text" value={projectInfo.department} onChange={e => handleProjectChange('department', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="สถานที่">
              <input type="text" value={projectInfo.location} onChange={e => handleProjectChange('location', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <div className="flex space-x-2">
              <Field label="วันที่เริ่มต้น">
                <input type="date" value={projectInfo.startDate} onChange={e => handleProjectChange('startDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
              </Field>
              <Field label="วันที่สิ้นสุด">
                <input type="date" value={projectInfo.endDate} onChange={e => handleProjectChange('endDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
              </Field>
            </div>
            <Field label="วัตถุประสงค์">
              <textarea value={projectInfo.objective} onChange={e => handleProjectChange('objective', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" rows={3}></textarea>
            </Field>

            {/* Status */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">สถานะ:</label>
              <div className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${statusMeta.color}`} onClick={() => setIsStatusDropdownOpen(v => !v)}>
                <div className={`w-3 h-3 rounded-full mr-2 ${statusMeta.dot}`}></div>
                {selectedStatus}
                <ChevronDown size={16} className={`ml-2 transform transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isStatusDropdownOpen && (
                <ul className="absolute mt-10 w-48 bg-white border rounded shadow z-10">
                  {STATUS_OPTIONS.map(opt => (
                    <li key={opt.status} className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center" onClick={() => handleStatusSelect(opt.status)}>
                      <div className={`w-3 h-3 rounded-full mr-2 ${opt.dot}`}></div>
                      {opt.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Field label="หมวดหมู่">
              <input type="text" value={projectInfo.category} onChange={e => handleProjectChange('category', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="งบประมาณ">
              <input type="text" value={projectInfo.budget || ''} onChange={e => handleProjectChange('budget', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="ผู้รับผิดชอบ">
              <input type="text" value={projectInfo.responsiblePerson} onChange={e => handleProjectChange('responsiblePerson', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>
            <Field label="ข้อมูลติดต่อ">
              <input type="text" value={projectInfo.contactInfo} onChange={e => handleProjectChange('contactInfo', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </Field>

            <div className="flex space-x-2">
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"><Save size={18} className="mr-2" /> บันทึก</button>
              <button onClick={() => navigateTo('/Admin/Site')} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"><X size={18} className="mr-2" /> ยกเลิก</button>
            </div>
          </div>

          {/* Activities Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black">กิจกรรม</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <Th>ลำดับ</Th>
                  <Th>รายละเอียด</Th>
                  <Th>ระยะเวลา</Th>
                </tr>
              </thead>
              <tbody>
                {activities.map(act => (
                  <tr key={act.id}>
                    <Td>{act.id}</Td>
                    <Td><input type="text" value={act.description || ''} onChange={e => handleActivityChange(act.id, 'description', e.target.value)} className="w-full p-2 border rounded-md" /></Td>
                    <Td className="flex space-x-2">
                      <input type="date" value={act.startDate || ''} onChange={e => handleActivityChange(act.id, 'startDate', e.target.value)} className="p-2 border rounded-md" />
                      <input type="date" value={act.endDate || ''} onChange={e => handleActivityChange(act.id, 'endDate', e.target.value)} className="p-2 border rounded-md" />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex space-x-2 mt-2">
              <button onClick={addActivity} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"><Plus size={18} className="mr-1" /> เพิ่ม</button>
              <button onClick={removeLastActivity} className="bg-red-400 text-white px-4 py-2 rounded-md flex items-center"><X size={18} className="mr-1" /> ลบ</button>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black">เอกสาร</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
              <Field label="ชื่อเอกสาร">
                <input type="text" value={newDocument.name} onChange={e => setNewDocument(prev => ({ ...prev, name: e.target.value }))} className="w-full p-2 border rounded-md text-black" />
              </Field>
              <Field label="ไฟล์เอกสาร">
                <label className="flex items-center justify-center p-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 text-gray-300">
                  <Upload size={18} className="mr-2" />
                  {newDocument.file ? newDocument.file.name : 'Upload file'}
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </Field>
            </div>
            <button onClick={addDocument} className="bg-blue-500 text-white px-4 py-2 rounded-md">บันทึกเอกสาร</button>

            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  <Th center>สาธารณะ</Th>
                  <Th>ชื่อ</Th>
                  <Th>เอกสาร</Th>
                  <Th>ลบ</Th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <Td center>
                      <input type="checkbox" checked={!!doc.isPublic} onChange={() => handlePublicSelect(doc.id)} />
                    </Td>
                    <Td>{doc.name}</Td>
                    <Td>
                      {doc.fileUrl ? (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {doc.name}
                        </a>
                      ) : (
                        <span>{doc.name}</span>
                      )}
                    </Td>
                    <Td>
                      <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

/** Helper Components */
function Field({ label, children }: any) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <label className="w-48 text-gray-700 font-medium">{label}:</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Th({ children, center }: any) {
  return (
    <th className={`px-4 py-2 text-left text-sm font-medium text-gray-500 ${center ? 'text-center' : ''}`}>{children}</th>
  );
}

function Td({ children, center }: any) {
  return (
    <td className={`px-4 py-2 text-sm text-gray-700 ${center ? 'text-center' : ''}`}>{children}</td>
  );
}
