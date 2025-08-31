'use client';

import { ChevronDown, Home, Plus, Save, Search, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const STATUS_OPTIONS = [
  { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
  { status: 'ระงับ',         color: 'bg-red-200 text-red-800 border-red-300',     dot: 'bg-red-500' },
  { status: 'เสร็จสิ้น',     color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
];

const PLACEHOLDER_LOGO = 'https://placehold.co/40x40/ffffff/000000?text=LOGO';

const getStatusMeta = (status) => STATUS_OPTIONS.find((opt) => opt.status === status) || STATUS_OPTIONS[0];

const nextId = (arr) => (arr.length > 0 ? arr[arr.length - 1].id + 1 : 1);

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const navigateTo = (path) => { window.location.href = path; };

  const [activities, setActivities] = useState([
    { id: 1, description: '', startDate: '00/00/00', endDate: '00/00/00' },
  ]);

  const addActivity = () => {
    setActivities((prev) => [...prev, { id: nextId(prev), description: '', startDate: '', endDate: '' }]);
  };
  const removeLastActivity = () => setActivities((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));

  const [newDocument, setNewDocument] = useState({ name: '', file: null, data: '' });
  const [documents, setDocuments] = useState([]);

  const handleDocumentSelect = (id) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isSelected: !doc.isSelected } : doc)));
  };

  const handlePublicSelect = (id) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc)));
  };

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleFileUpload = (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (id) {
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, file: file.name } : doc)));
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
          file: newDocument.file.name,
          isSelected: false,
          isPublic: false,
        },
      ]);
      setNewDocument({ name: '', file: null, data: '' });
    }
  };

  const [selectedStatus, setSelectedStatus] = useState('กำลังดำเนินการ');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusMeta = useMemo(() => getStatusMeta(selectedStatus), [selectedStatus]);
  const handleStatusSelect = (status) => { setSelectedStatus(status); setIsStatusDropdownOpen(false); };

  const handleSave = async () => {
    const projName = document.getElementById('projectName')?.value;
    const projInformation = document.getElementById('objective')?.value;
    const actionPlanID = activities.map((a) => a.id).join(',');

    try {
      const response = await fetch('http://localhost:3000/api/saveProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projName, projInformation, actionPlanID }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Project data saved successfully');
        window.location.href = '/Admin/Site';
      } else {
        alert('Failed to save project data: ' + data.message);
      }
    } catch (error) {
      alert('Error saving project data: ' + error.message);
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
              onError={(e) => { e.currentTarget.src = PLACEHOLDER_LOGO; }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">การจัดการโครงการพัฒนาเทศบาลตำบลปะโค</h1>
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
                className={`text-gray-600 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </div>

            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Site')}>โครงการทั้งหมด</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>เพิ่มโครงการ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Statistics')}>สถิติ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Logout')}>ออกจากระบบ</li>
              </ul>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Section 1: Project Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">แก้ไขข้อมูลโครงการ</h2>
              <div className="flex space-x-2">
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center">
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
                  <input type="text" id="projectName" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" defaultValue=" " />
                </Field>

                <Field label="รหัสโครงการ" htmlFor="projectCode">
                  <input type="text" id="projectCode" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </Field>

                <Field label="หน่วยงาน" htmlFor="department">
                  <input type="text" id="department" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </Field>

                <Field label="สถานที่" htmlFor="location">
                  <input type="text" id="location" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </Field>

                <div className="flex items-center">
                  <label htmlFor="dates" className="w-40 text-gray-700">วันที่เริ่มต้น</label>
                  <div className="flex flex-1 space-x-2">
                    <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                    <span className="flex items-center text-gray-500">วันที่สิ้นสุด</span>
                    <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center">
                  <label htmlFor="objective" className="w-40 text-gray-700">วัตถุประสงค์</label>
                  <textarea id="objective" rows="3" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"></textarea>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-end relative">
                  <label htmlFor="status" className="mr-4 text-gray-700">สถานะ :</label>
                  <div
                    className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${statusMeta.color}`}
                    onClick={() => setIsStatusDropdownOpen((v) => !v)}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${statusMeta.dot}`}></div>
                    {selectedStatus}
                    <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isStatusDropdownOpen && (
                    <ul className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      {STATUS_OPTIONS.map((option) => (
                        <li key={option.status} className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black" onClick={() => handleStatusSelect(option.status)}>
                          <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                          {option.status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Field label="หมวดหมู่" htmlFor="category">
                  <select id="category" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400">
                    <option>เลือกหมวดหมู่</option>
                  </select>
                </Field>

                <Field label="งบประมาณ" htmlFor="budget">
                  <input type="text" id="budget" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </Field>

                <Field label="ผู้รับผิดชอบ" htmlFor="responsiblePerson">
                  <input type="text" id="responsiblePerson" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </Field>

                <Field label="ข้อมูลติดต่อ" htmlFor="additionalInfo">
                  <input type="text" id="additionalInfo" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ring-blue-500 text-gray-400" />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2: Activities */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">กิจกรรม</h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th className="w-12">ลำดับ</Th>
                    <Th>รายละเอียดขั้นตอน/วิธีดำเนินการ</Th>
                    <Th className="w-48">ระยะเวลาดำเนินการ</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <Td>{activity.id}</Td>
                      <Td>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={activity.description} />
                      </Td>
                      <Td>
                        <div className="flex space-x-2">
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="เริ่มต้น" />
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="สิ้นสุด" />
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addActivity} className="mt-4 w-full bg-blue-500 text-white py-3 rounded-md shadow-sm hover:bg-blue-600 flex items-center justify-center font-semibold">
              <Plus size={20} className="mr-2" /> เพิ่ม
            </button>

            <button onClick={removeLastActivity} className="mt-4 w-full bg-red-400 text-white py-3 rounded-md shadow-sm hover:bg-red-300 flex items-center justify-center font-semibold">
              <X size={20} className="mr-2" /> ลบ
            </button>
          </div>

          {/* Section 3: Document Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">เอกสาร</h2>

            {/* Add Document */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-medium text-gray-700 mb-4">เพิ่มเอกสาร</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="docName" className="text-gray-600 mb-1">ชื่อ</label>
                  <input
                    type="text"
                    id="docName"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="fileUpload" className="text-gray-600 mb-1">ไฟล์เอกสาร</label>
                  <label htmlFor="fileUpload" className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                    <Upload size={18} className="mr-2 text-gray-500" />
                    <span className="text-gray-500">{newDocument.file ? newDocument.file.name : 'Upload file'}</span>
                    <input type="file" id="fileUpload" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={addDocument} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">บันทึก</button>
              </div>
            </div>

            {/* Document List */}
            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-700 mb-2">เอกสารทั้งหมด</h3>
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
                          <input type="checkbox" checked={!!doc.isPublic} onChange={() => handlePublicSelect(doc.id)} className="form-checkbox h-5 w-5 text-blue-600 rounded-md" />
                        </Td>
                        <Td>{doc.name}</Td>
                        <Td>
                          {doc.file !== 'Upload file' ? (
                            <a href="#" className="text-blue-500 hover:underline">{doc.file}</a>
                          ) : (
                            <label htmlFor={`file-upload-${doc.id}`} className="cursor-pointer">
                              <span className="text-gray-500 hover:text-blue-500 flex items-center">
                                Upload file
                                <input id={`file-upload-${doc.id}`} type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                              </span>
                            </label>
                          )}
                        </Td>
                        <Td right>
                          <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100">
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

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex items-center">
      <label htmlFor={htmlFor} className="w-40 text-gray-700">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Th({ children, className = '', center = false, right = false }) {
  const align = center ? 'text-center' : right ? 'text-right' : 'text-left';
  return (
    <th scope="col" className={`px-6 py-3 ${align} text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>
  );
}

function Td({ children, className = '', center = false, right = false }) {
  const align = center ? 'text-center' : right ? 'text-right' : '';
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${align} ${className}`}>{children}</td>
  );
}
