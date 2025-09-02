'use client';

import { createClient } from '@supabase/supabase-js';
import {
  ChevronDown,
  Home,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Activity = {
  id: number;
  detail: string;
  start: string; // yyyy-mm-dd
  end: string; // yyyy-mm-dd
};

type DocRow = {
  id: number;
  name: string;
  file: File | null; // << เก็บไฟล์จริงไว้ที่นี่
  isPublic: boolean;
};

const supabase = createClient(
  'https://jecdfalkxnomccvgrbre.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplY2RmYWxreG5vbWNjdmdyYnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjY1OTksImV4cCI6MjA2ODg0MjU5OX0.mqeYcn2Lh1cIAm-U4TuEw9sCJs1v-FkggU9o8RJNMHo'
);

// Example query
async function getProjects() {
  const { data, error } = await supabase.from('project').select('*');
  if (error) console.error('Error fetching projects:', error);
  return data;
}

const STATUS_OPTIONS = [
  {
    status: 'กำลังดำเนินการ',
    color: 'bg-yellow-200 text-yellow-800 border-yellow-300',
    dot: 'bg-yellow-500',
  },
  {
    status: 'ระงับ',
    color: 'bg-red-200 text-red-800 border-red-300',
    dot: 'bg-red-500',
  },
  {
    status: 'เสร็จสิ้น',
    color: 'bg-green-200 text-green-800 border-green-300',
    dot: 'bg-green-500',
  },
];

const PLACEHOLDER_LOGO = 'https://placehold.co/40x40/ffffff/000000?text=LOGO';
const getStatusMeta = (status: string) =>
  STATUS_OPTIONS.find((opt) => opt.status === status) || STATUS_OPTIONS[0];
const nextId = (arr: { id: number }[]) =>
  arr.length > 0 ? arr[arr.length - 1].id + 1 : 1;

export default function AddProjectPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  // ===== Activities (เก็บเป็นโครง JSON) =====
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, detail: '', start: '', end: '' },
  ]);

  const addActivity = () => {
    setActivities((prev) => [
      ...prev,
      { id: nextId(prev), detail: '', start: '', end: '' },
    ]);
  };
  const removeLastActivity = () =>
    setActivities((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));

  const updateActivity = (id: number, patch: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  // ===== Documents (เก็บไฟล์จริง + เมตาดาต้า) =====
  const [newDocument, setNewDocument] = useState<{
    name: string;
    file: File | null;
  }>({ name: '', file: null });
  const [documents, setDocuments] = useState<DocRow[]>([]);

  const handlePublicSelect = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc
      )
    );
  };
  const handleDeleteDocument = (id: number) =>
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    id?: number
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (id) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, file } : doc))
      );
    } else {
      setNewDocument((prev) => ({ ...prev, file }));
    }
  };

  const addDocument = () => {
    if (newDocument.name && newDocument.file) {
      setDocuments((prev) => [
        ...prev,
        {
          id: nextId(prev),
          name: newDocument.name,
          file: newDocument.file, // << เก็บเป็น File
          isPublic: false,
        },
      ]);
      setNewDocument({ name: '', file: null });
    } else {
      alert('กรุณาระบุชื่อไฟล์และเลือกไฟล์ก่อนบันทึก');
    }
  };

  // ===== Project meta =====
  const [selectedStatus, setSelectedStatus] = useState('กำลังดำเนินการ');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusMeta = useMemo(
    () => getStatusMeta(selectedStatus),
    [selectedStatus]
  );
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  };

  const handleSave = async () => {
    const name = (
      document.getElementById('projectName') as HTMLInputElement
    )?.value?.trim();
    if (!name) {
      alert('กรุณากรอกชื่อโครงการ');
      return;
    }

    // กรอกข้อมูลจากฟอร์ม
    const project_code =
      (
        document.getElementById('projectCode') as HTMLInputElement
      )?.value?.trim() || null;
    const department =
      (
        document.getElementById('department') as HTMLInputElement
      )?.value?.trim() || null;
    const location =
      (
        document.getElementById('location') as HTMLInputElement
      )?.value?.trim() || null;
    const start_date =
      (document.getElementById('startDate') as HTMLInputElement)?.value || '';
    const end_date =
      (document.getElementById('endDate') as HTMLInputElement)?.value || '';
    const objective =
      (document.getElementById('objective') as HTMLTextAreaElement)?.value ||
      '';
    const category =
      (document.getElementById('category') as HTMLSelectElement)?.value || '';
    const budget =
      (document.getElementById('budget') as HTMLInputElement)?.value || '';
    const responsible_by =
      (document.getElementById('responsiblePerson') as HTMLInputElement)
        ?.value || '';
    const contact_info =
      (document.getElementById('additionalInfo') as HTMLInputElement)?.value ||
      '';

    // แปลงกิจกรรมเป็น JSON
    const activitiesJson = activities.map((a, idx) => ({
      order: idx + 1,
      detail: a.detail,
      start: a.start || null,
      end: a.end || null,
    }));

    // เตรียมข้อมูลสำหรับการส่งไปยัง Supabase
    const projectData = {
      name,
      project_code,
      department,
      location,
      start_date,
      end_date,
      objective,
      category,
      budget,
      responsible_by,
      contact_info,
      activities: activitiesJson, // ข้อมูลกิจกรรม
    };

    const formData = new FormData();

    // เพิ่มข้อมูลโปรเจกต์ไปที่ FormData
    formData.append('projectData', JSON.stringify(projectData));

    // เพิ่มไฟล์เอกสารไปที่ FormData
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`document_${index}`, doc.file);
      }
    });

    try {
      // ส่งข้อมูลไปยัง API route
      const response = await fetch('/api/addProject', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('โครงการถูกบันทึกเรียบร้อยแล้ว');
        console.log(data);
      } else {
        const error = await response.json();
        alert('เกิดข้อผิดพลาดในการบันทึกโครงการ');
        console.error(error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <img
              src={PLACEHOLDER_LOGO}
              alt="เทศบาลตำบลปะโค Logo"
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_LOGO;
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              การจัดการโครงการพัฒนาเทศบาลตำบลปะโค
            </h1>
            <p className="text-sm">อำเภอเมืองหนองคาย จังหวัดหนองคาย</p>
          </div>
        </div>
      </header>

      {/* Top Nav */}
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
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-lg min-h-[calc(100vh-120px)]">
          <div className="mb-6">
            <div
              className="flex items-center justify-between p-3 bg-blue-100 rounded-md mb-2 cursor-pointer hover:bg-blue-200"
              onClick={toggleMenu}
            >
              <span className="font-semibold text-gray-800">เมนู</span>
              <ChevronDown
                className={`text-gray-600 transform transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
                size={18}
              />
            </div>

            {isMenuOpen && (
              <ul className="space-y-1">
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/Site')}
                >
                  โครงการทั้งหมด
                </li>
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/AddProject')}
                >
                  เพิ่มโครงการ
                </li>
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/Statistics')}
                >
                  สถิติ
                </li>
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Logout')}
                >
                  ออกจากระบบ
                </li>
              </ul>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Section 1: Project Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                แก้ไขข้อมูลโครงการ
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  บันทึก
                </button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 flex items-center">
                  <X size={18} className="mr-2" />
                  ยกเลิก
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <Field label="ชื่อโครงการ" htmlFor="projectName">
                  <input
                    type="text"
                    id="projectName"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="รหัสโครงการ" htmlFor="projectCode">
                  <input
                    type="text"
                    id="projectCode"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="หน่วยงาน" htmlFor="department">
                  <input
                    type="text"
                    id="department"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="สถานที่" htmlFor="location">
                  <input
                    type="text"
                    id="location"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <div className="flex items-center">
                  <label htmlFor="dates" className="w-40 text-gray-700">
                    วันที่เริ่มต้น
                  </label>
                  <div className="flex flex-1 space-x-2">
                    <input
                      id="startDate"
                      type="date"
                      className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="flex items-center text-gray-500">
                      วันที่สิ้นสุด
                    </span>
                    <input
                      id="endDate"
                      type="date"
                      className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label htmlFor="objective" className="w-40 text-gray-700">
                    วัตถุประสงค์
                  </label>
                  <textarea
                    id="objective"
                    rows={3}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-end relative">
                  <label className="mr-4 text-gray-700">สถานะ :</label>
                  <div
                    className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${statusMeta.color}`}
                    onClick={() => setIsStatusDropdownOpen((v) => !v)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${statusMeta.dot}`}
                    ></div>
                    {selectedStatus}
                    <ChevronDown
                      size={16}
                      className={`ml-2 transform transition-transform duration-200 ${
                        isStatusDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {isStatusDropdownOpen && (
                    <ul className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      {STATUS_OPTIONS.map((option) => (
                        <li
                          key={option.status}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black"
                          onClick={() => handleStatusSelect(option.status)}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}
                          ></div>
                          {option.status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Field label="หมวดหมู่" htmlFor="category">
                  <select
                    id="category"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>เลือกหมวดหมู่</option>
                    <option>โครงสร้างพื้นฐาน</option>
                    <option>สิ่งแวดล้อม</option>
                    <option>สวัสดิการ</option>
                    <option>สาธารณสุข</option>
                  </select>
                </Field>

                <Field label="งบประมาณ" htmlFor="budget">
                  <input
                    type="number"
                    step="0.01"
                    id="budget"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="ผู้รับผิดชอบ" htmlFor="responsiblePerson">
                  <input
                    type="text"
                    id="responsiblePerson"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                <Field label="ข้อมูลติดต่อ" htmlFor="additionalInfo">
                  <input
                    type="text"
                    id="additionalInfo"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2: Activities */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              กิจกรรม
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th className="w-12">ลำดับ</Th>
                    <Th>รายละเอียดขั้นตอน/วิธีดำเนินการ</Th>
                    <Th className="w-64">ระยะเวลาดำเนินการ</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <Td>{activity.id}</Td>
                      <Td>
                        <input
                          type="text"
                          value={activity.detail}
                          onChange={(e) =>
                            updateActivity(activity.id, {
                              detail: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </Td>
                      <Td>
                        <div className="flex space-x-2">
                          <input
                            type="date"
                            value={activity.start}
                            onChange={(e) =>
                              updateActivity(activity.id, {
                                start: e.target.value,
                              })
                            }
                            className="w-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            placeholder="เริ่มต้น"
                          />
                          <input
                            type="date"
                            value={activity.end}
                            onChange={(e) =>
                              updateActivity(activity.id, {
                                end: e.target.value,
                              })
                            }
                            className="w-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            placeholder="สิ้นสุด"
                          />
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addActivity}
              className="mt-4 w-full bg-blue-500 text-white py-3 rounded-md shadow-sm hover:bg-blue-600 flex items-center justify-center font-semibold"
            >
              <Plus size={20} className="mr-2" /> เพิ่ม
            </button>

            <button
              onClick={removeLastActivity}
              className="mt-4 w-full bg-red-400 text-white py-3 rounded-md shadow-sm hover:bg-red-300 flex items-center justify-center font-semibold"
            >
              <X size={20} className="mr-2" /> ลบ
            </button>
          </div>

          {/* Section 3: Document Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              เอกสาร
            </h2>

            {/* Add Document */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                เพิ่มเอกสาร
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="docName" className="text-gray-600 mb-1">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    id="docName"
                    value={newDocument.name}
                    onChange={(e) =>
                      setNewDocument((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fileUpload" className="text-gray-600 mb-1">
                    ไฟล์เอกสาร
                  </label>
                  <label
                    htmlFor="fileUpload"
                    className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                  >
                    <Upload size={18} className="mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      {newDocument.file ? newDocument.file.name : 'Upload file'}
                    </span>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={addDocument}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                >
                  บันทึก
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                เอกสารทั้งหมด
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th center>สาธารณะ</Th>
                      <Th>ชื่อ</Th>
                      <Th>เอกสาร</Th>
                      <Th right>ลบ</Th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <Td center>
                          <input
                            type="checkbox"
                            checked={!!doc.isPublic}
                            onChange={() => handlePublicSelect(doc.id)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                          />
                        </Td>
                        <Td>{doc.name}</Td>
                        <Td>
                          {doc.file ? (
                            <span className="text-gray-700">
                              {doc.file.name}
                            </span>
                          ) : (
                            <label
                              htmlFor={`file-upload-${doc.id}`}
                              className="cursor-pointer"
                            >
                              <span className="text-gray-500 hover:text-blue-500 flex items-center">
                                Upload file
                                <input
                                  id={`file-upload-${doc.id}`}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, doc.id)}
                                />
                              </span>
                            </label>
                          )}
                        </Td>
                        <Td right>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <label htmlFor={htmlFor} className="w-40 text-gray-700">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Th({ children, className = '', center = false, right = false }: any) {
  const align = center ? 'text-center' : right ? 'text-right' : 'text-left';
  return (
    <th
      scope="col"
      className={`px-6 py-3 ${align} text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '', center = false, right = false }: any) {
  const align = center ? 'text-center' : right ? 'text-right' : '';
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${align} ${className}`}
    >
      {children}
    </td>
  );
}
