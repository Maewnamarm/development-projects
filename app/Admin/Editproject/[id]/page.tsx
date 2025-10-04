'use client';

import { createClient } from '@supabase/supabase-js';
import { ChevronDown, LogOut, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type ProjectInfo = {
    projName: string;
    projCode: string;
    department: string;
    location: string;
    startDate: string;
    endDate: string;
    objective: string;
    category: string;
    budget: string;
    responsiblePerson: string;
    contactInfo: string;
};

type Activity = {
    id: number;
    description: string;
    startDate: string;
    endDate: string;
};

type DocumentItem = {
    id: number;
    name: string;
    fileUrl: string | null;
    isPublic: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const STATUS_OPTIONS = [
    { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
    { status: 'ระงับ', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },
    { status: 'เสร็จสิ้น', color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
    { status: 'ล่าช้า', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },

];

const CATEGORY_OPTIONS = [
  'เทคโนโลยี',
  'การศึกษา',
  'สาธารณสุข',
  'เศรษฐกิจ',
  'สังคม',
  'โครงสร้างพื้นฐาน',
  'สิ่งแวดล้อม',
  'การบริหาร',
  'อื่นๆ'
];

const PLACEHOLDER_LOGO = 'https://placehold.co/40x40/ffffff/000000?text=LOGO';

const getStatusMeta = (status: string) => STATUS_OPTIONS.find(opt => opt.status === status) || STATUS_OPTIONS[0];
const nextId = (arr: { id: number }[]) => (arr.length > 0 ? arr[arr.length - 1].id + 1 : 1);

export default function EditProject() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [loading, setLoading] = useState(true);

    const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
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

    const [activities, setActivities] = useState<Activity[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [newDocument, setNewDocument] = useState<{ name: string; file: File | null }>({ name: '', file: null });

    const [selectedStatus, setSelectedStatus] = useState('กำลังดำเนินการ');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusMeta = useMemo(() => getStatusMeta(selectedStatus), [selectedStatus]);

    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const toggleMenu = () => setIsMenuOpen(v => !v);
    const navigateTo = (path: string) => { router.push(path); };

    const safeNumber = (n: string | number | null | undefined): number | null => {
        if (n === "" || n === null || n === undefined) return null;
        const num = Number(n);
        return isNaN(num) ? null : num;
    };

    useEffect(() => {
        if (!id) {
            setLoading(false);
            toast.error("ไม่พบรหัสโครงการ");
            return;
        }

        const fetchProjectData = async () => {
            try {
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
                        startDate: projectData.start_date || '',
                        endDate: projectData.end_date || '',
                        objective: projectData.objective,
                        category: projectData.category,
                        budget: projectData.budget?.toString() || '',
                        responsiblePerson: projectData.responsible_person,
                        contactInfo: projectData.contact_info,
                    });
                    setSelectedStatus(projectData.status || 'กำลังดำเนินการ');
                }

                const projectId = Number(id);

                const { data: activitiesData, error: activitiesError } = await supabase
                    .from('activities')
                    .select('id, description, start_date, end_date')
                    .eq('project_id', projectId);

                if (activitiesError) throw activitiesError;

                setActivities((activitiesData || []).map(a => ({
                    id: a.id,
                    description: a.description || '',
                    startDate: a.start_date || '',
                    endDate: a.end_date || ''
                })));

                const { data: documentsData, error: documentsError } = await supabase
                    .from('documents')
                    .select('id, name, file_url, is_public')
                    .eq('project_id', projectId);

                if (documentsError) throw documentsError;

                setDocuments((documentsData || []).map(d => ({
                    id: d.id,
                    name: d.name || '',
                    fileUrl: d.file_url || null,
                    isPublic: d.is_public ?? false
                })));

            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
                toast.error("โหลดข้อมูลโครงการล้มเหลว: " + errorMessage);
                router.push('/Admin/Site');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id, router]);

    const handleProjectChange = (field: keyof ProjectInfo, value: string) => {
        setProjectInfo(prev => ({ ...prev, [field]: value }));
    };

    const addActivity = () => setActivities(prev => [...prev, { id: nextId(prev), description: '', startDate: '', endDate: '' } as Activity]);
    
    const handleActivityChange = (activityId: number, field: keyof Omit<Activity, 'id'>, value: string) => {
        setActivities(prev => prev.map(a => a.id === activityId ? { ...a, [field]: value } : a));
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
            const fileName = `${id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('project-files')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage.from('project-files').getPublicUrl(uploadData.path);
            const publicUrl = publicData?.publicUrl;

            setDocuments(prev => [
                ...prev,
                { id: nextId(prev), name: newDocument.name, fileUrl: publicUrl, isPublic: false } as DocumentItem
            ]);

            setNewDocument({ name: '', file: null });
            (document.getElementById('file-upload-input') as HTMLInputElement).value = '';
            toast.success("เพิ่มเอกสารเรียบร้อย");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error during file upload";
            toast.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์: " + errorMessage);
        }
    };

    const handlePublicSelect = (documentId: number) => {
        setDocuments(prev => prev.map(doc => doc.id === documentId ? { ...doc, isPublic: !doc.isPublic } : doc));
    };

    const handleDeleteDocument = (documentId: number) => {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast.success("ลบเอกสารสำเร็จ");
    };

    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status);
        setIsStatusDropdownOpen(false);
    };
    
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const handleCategorySelect = (category: string) => { 
        handleProjectChange('category', category); 
        setIsCategoryDropdownOpen(false); 
    };

    const handleSave = async () => {
        if (!id) {
            toast.error("ไม่พบรหัสโครงการสำหรับการบันทึก");
            return;
        }
        
        try {
            const payload = {
                project: {
                    id: Number(id),
                    name: projectInfo.projName,
                    code: projectInfo.projCode,
                    department: projectInfo.department,
                    location: projectInfo.location,
                    start_date: projectInfo.startDate || null,
                    end_date: projectInfo.endDate || null,
                    objective: projectInfo.objective,
                    category: projectInfo.category,
                    budget: safeNumber(projectInfo.budget),
                    responsible_person: projectInfo.responsiblePerson,
                    contact_info: projectInfo.contactInfo,
                    status: selectedStatus
                },
                activities: activities.map(a => ({
                    id: a.id, 
                    project_id: Number(id),
                    description: a.description,
                    start_date: a.startDate || null,
                    end_date: a.endDate || null
                })),
                documents: documents.map(d => ({
                    id: d.id,
                    project_id: Number(id),
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
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error during project update";
            toast.error("อัปเดตไม่สำเร็จ: " + errorMessage);
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

            const data: { message?: string, ok?: boolean } = await response.json();

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

    if (loading) return <div className="p-6">⏳ กำลังโหลดข้อมูล...</div>;
    
    return (
        <div className="min-h-screen bg-blue-200 font-inter flex flex-col">
            <Toaster position="top-right" />

            <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                        <Image 
                            src={PLACEHOLDER_LOGO} 
                            alt="Logo" 
                            className="h-10 w-10 rounded-full" 
                            width={40} 
                            height={40}
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">การจัดการโครงการ</h1>
                        <p className="text-sm">อำเภอเมืองแมว จังหวัดดาวอังคาร</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
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

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
                        <h2 className="text-2xl font-semibold text-gray-800">แก้ไขโครงการ</h2>
                        
                        <div className="space-y-4">
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
                                            <li key={opt.status} className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100 flex items-center" onClick={() => handleStatusSelect(opt.status)}>
                                                <div className={`w-3 h-3 rounded-full mr-2 ${opt.dot}`}></div>
                                                {opt.status}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <Field label="หมวดหมู่">
                                <div className="relative">
                                    <div 
                                        className="w-full p-2 border border-gray-300 rounded-md text-black cursor-pointer flex items-center justify-between bg-white"
                                        onClick={() => setIsCategoryDropdownOpen(v => !v)}
                                    >
                                        <span>{projectInfo.category || 'เลือกหมวดหมู่'}</span>
                                        <ChevronDown size={16} className={`transform transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isCategoryDropdownOpen && (
                                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {CATEGORY_OPTIONS.map(cat => (
                                                <li 
                                                    key={cat} 
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                                                    onClick={() => handleCategorySelect(cat)}
                                                >
                                                    {cat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
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
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">กิจกรรม</h2>
                                <button onClick={addActivity} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600">
                                    <Plus size={18} className="mr-1" /> เพิ่มกิจกรรม
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {activities.map(act => (
                                    <div key={act.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <label className="text-gray-700 font-medium">รายละเอียดกิจกรรม</label>
                                            <button 
                                                onClick={() => setActivities(prev => prev.filter(a => a.id !== act.id))} 
                                                className="text-red-600 hover:text-red-900 flex items-center"
                                                title="ลบกิจกรรม"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={act.description || ''} 
                                            onChange={e => handleActivityChange(act.id, 'description', e.target.value)} 
                                            className="w-full p-2 border border-gray-300 rounded-md mb-3 text-black" 
                                            placeholder="กรอกรายละเอียดกิจกรรม"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm text-gray-600 mb-1 block">วันที่เริ่มต้น</label>
                                                <input 
                                                    type="date" 
                                                    value={act.startDate || ''} 
                                                    onChange={e => handleActivityChange(act.id, 'startDate', e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-md text-black" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 mb-1 block">วันที่สิ้นสุด</label>
                                                <input 
                                                    type="date" 
                                                    value={act.endDate || ''} 
                                                    onChange={e => handleActivityChange(act.id, 'endDate', e.target.value)} 
                                                    className="w-full p-2 border border-gray-300 rounded-md text-black" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">เอกสาร</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Field label="ชื่อเอกสาร">
                                    <input type="text" value={newDocument.name} onChange={e => setNewDocument(prev => ({ ...prev, name: e.target.value }))} className="w-full p-2 border rounded-md text-black" />
                                </Field>
                                <Field label="ไฟล์เอกสาร">
                                    <label htmlFor="file-upload-input" className="flex items-center justify-center p-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Upload size={18} className="mr-2" />
                                        {newDocument.file ? newDocument.file.name : 'Upload file'}
                                        <input type="file" id="file-upload-input" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </Field>
                            </div>
                            <button onClick={addDocument} className="bg-blue-500 text-white px-4 py-2 rounded-md">บันทึกเอกสาร</button>

                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead>
                                    <tr>
                                        <Th center={true}>สาธารณะ</Th>
                                        <Th center={false}>ชื่อ</Th>
                                        <Th center={false}>เอกสาร</Th>
                                        <Th center={false}>ลบ</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map(doc => (
                                        <tr key={doc.id}>
                                            <Td center={true}>
                                                <input type="checkbox" checked={!!doc.isPublic} onChange={() => handlePublicSelect(doc.id)} />
                                            </Td>
                                            <Td center={false}>{doc.name}</Td>
                                            <Td center={false}>
                                                {doc.fileUrl ? (
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {doc.name}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">ยังไม่ได้อัปโหลด</span>
                                                )}
                                            </Td>
                                            <Td center={false}>
                                                <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 size={18} />
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <button onClick={() => navigateTo('/Admin/Site')} className="bg-red-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-red-700">
                                <X size={18} className="mr-2" /> ยกเลิก
                            </button>
                            <button onClick={handleSave} className="bg-green-500 text-white px-6 py-2 rounded-md flex items-center hover:bg-green-700">
                                <Save size={18} className="mr-2" /> บันทึก
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    children: React.ReactNode;
}
function Field({ label, children }: FieldProps) {
    return (
        <div className="flex items-center space-x-4 mb-4">
            <label className="w-48 text-gray-700 font-medium">{label}:</label>
            <div className="flex-1">{children}</div>
        </div>
    );
}

interface TableCellProps {
    children: React.ReactNode;
    center: boolean;
    className?: string;
}

function Th({ children, center }: TableCellProps) {
    return (
        <th className={`px-4 py-2 text-left text-sm font-medium text-gray-500 ${center ? 'text-center' : ''}`}>{children}</th>
    );
}

function Td({ children, center }: TableCellProps) {
    return (
        <td className={`px-4 py-2 text-sm text-gray-700 ${center ? 'text-center' : ''}`}>{children}</td>
    );
}