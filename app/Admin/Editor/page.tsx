'use client';

import { ChevronDown, Home, Save, Search, Trash2, Upload, X } from 'lucide-react'; // เพิ่ม Trash2 icon
import { useState } from 'react';

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const [activities, setActivities] = useState([
    { id: 1, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00' },
    { id: 2, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00' },
    { id: 3, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00' },
  ]);

  const addActivity = () => {
    const newId = activities.length > 0 ? activities[activities.length - 1].id + 1 : 1;
    setActivities([...activities, { id: newId, description: '', startDate: '', endDate: '' }]);
  };

  const removeLastActivity = () => {
    if (activities.length > 0) {
      setActivities(activities.slice(0, -1));
    }
  };

  const [newDocument, setNewDocument] = useState({ name: '', file: null, data: '' });
  const [documents, setDocuments] = useState([]);

  const handleDocumentSelect = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, isSelected: !doc.isSelected } : doc
    ));
  };

  const handlePublicSelect = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc
    ));
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleFileUpload = (e, id) => {
    const file = e.target.files[0];
    if (id) {
      setDocuments(documents.map(doc =>
        doc.id === id ? { ...doc, file: file.name } : doc
      ));
    } else {
      setNewDocument({ ...newDocument, file: file });
    }
  };

  const addDocument = () => {
    if (newDocument.name && newDocument.file) {
      const newId = documents.length > 0 ? documents[documents.length - 1].id + 1 : 1;
      setDocuments([...documents, { id: newId, name: newDocument.name, file: newDocument.file.name, isSelected: false, isPublic: false }]);
      setNewDocument({ name: '', file: null, data: '' });
    }
  };

  const [selectedStatus, setSelectedStatus] = useState('กำลังดำเนินการ');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusOptions = [
    { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
    { status: 'ระงับ', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },
    { status: 'เสร็จสิ้น', color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
  ];

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  };

  const getStatusClasses = () => {
    const statusObj = statusOptions.find(opt => opt.status === selectedStatus);
    return statusObj ? statusObj.color : '';
  };

  const getStatusDotColor = () => {
    const statusObj = statusOptions.find(opt => opt.status === selectedStatus);
    return statusObj ? statusObj.dot : '';
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <img
              src="https://placehold.co/40x40/ffffff/000000?text=LOGO"
              alt="เทศบาลตำบลปะโค Logo"
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/40x40/ffffff/000000?text=LOGO';
              }}
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

        {/* Main content - Editor Page */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Section 1: Project Information Editor */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">แก้ไขข้อมูลโครงการ</h2>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center">
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
              <div className="space-y-4">
                <div className="flex items-center">
                  <label htmlFor="projectName" className="w-40 text-gray-700">ชื่อโครงการ</label>
                  <input
                    type="text"
                    id="projectName"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    defaultValue=" "
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="projectCode" className="w-40 text-gray-700">รหัสโครงการ</label>
                  <input
                    type="text"
                    id="projectCode"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="department" className="w-40 text-gray-700">หน่วยงาน</label>
                  <input
                    type="text"
                    id="department"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="location" className="w-40 text-gray-700">สถานที่</label>
                  <input
                    type="text"
                    id="location"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  />
                </div>
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
                  <textarea
                    id="objective"
                    rows="3"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  ></textarea>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-end relative">
                  <label htmlFor="status" className="mr-4 text-gray-700">สถานะ :</label>
                  <div 
                    className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${getStatusClasses()}`}
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor()}`}></div>
                    {selectedStatus}
                    <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isStatusDropdownOpen && (
                    <ul className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      {statusOptions.map((option) => (
                        <li 
                          key={option.status}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black"
                          onClick={() => handleStatusSelect(option.status)}
                        >
                          <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                          {option.status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center">
                  <label htmlFor="category" className="w-40 text-gray-700">หมวดหมู่</label>
                  <select id="category" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400">
                    <option>เลือกหมวดหมู่</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label htmlFor="budget" className="w-40 text-gray-700">งบประมาณ</label>
                  <input type="text" id="budget" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </div>
                <div className="flex items-center">
                  <label htmlFor="responsiblePerson" className="w-40 text-gray-700">ผู้รับผิดชอบ</label>
                  <input type="text" id="responsiblePerson" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" />
                </div>
                <div className="flex items-center">
                  <label htmlFor="additionalInfo" className="w-40 text-gray-700">ข้อมูลติดต่อ</label>
                  <input type="text" id="additionalInfo" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ring-blue-500 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Document Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">เอกสาร</h2>

            {/* Sub-section: Add Document */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-medium text-gray-700 mb-4">เพิ่มเอกสาร</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="docName" className="text-gray-600 mb-1">ชื่อ</label>
                  <input
                    type="text"
                    id="docName"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="fileUpload" className="text-gray-600 mb-1">ไฟล์เอกสาร</label>
                  <label htmlFor="fileUpload" className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                    <Upload size={18} className="mr-2 text-gray-500" />
                    <span className="text-gray-500">{newDocument.file ? newDocument.file.name : 'Upload file'}</span>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileUpload}
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

            {/* Sub-section: Document List - Table format */}
            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-700 mb-2">เอกสารทั้งหมด</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สาธารณะ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เอกสาร
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ลบ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            checked={doc.isPublic}
                            onChange={() => handlePublicSelect(doc.id)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {doc.file !== 'Upload file' ? (
                            <a href="#" className="text-blue-500 hover:underline">{doc.file}</a>
                          ) : (
                            <label htmlFor={`file-upload-${doc.id}`} className="cursor-pointer">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
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
