'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Home, Plus, Save, X, Upload } from 'lucide-react';

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
  const [documents, setDocuments] = useState([
    { id: 1, name: 'ข้อมูลโครงการฉบับเต็ม', file: 'เอกสาร.pdf', isSelected: true },
    { id: 2, name: 'หนังสือเสนอ', file: 'เอกสาร.pdf', isSelected: false },
    { id: 3, name: 'การจัดซื้อจัดจ้าง', file: 'เอกสาร.pdf', isSelected: false },
    { id: 4, name: 'วิเคราะห์', file: 'เอกสาร.pdf', isSelected: false },
    { id: 5, name: 'หนังสือสัญญาจ้าง', file: 'เอกสาร.pdf', isSelected: false },
    { id: 6, name: 'เอกสารส่งมอบ', file: 'เอกสาร.pdf', isSelected: false },
    { id: 7, name: 'แผนการใช้จ่ายงบประมาณ', file: 'เอกสาร.pdf', isSelected: true },
    { id: 8, name: 'ไฟล์ยืนยันงบประมาณ', file: 'เอกสาร.pdf', isSelected: false },
    { id: 9, name: 'เอกสารอนุมัติงบประมาณ', file: 'เอกสาร.pdf', isSelected: false },
    { id: 10, name: 'เอกสารสำเร็จโครงการ', file: 'เอกสาร.pdf', isSelected: false },
  ]);

  const handleDocumentSelect = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, isSelected: !doc.isSelected } : doc
    ));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewDocument({ ...newDocument, file: file });
  };

  const addDocument = () => {
    if (newDocument.name && newDocument.file) {
      setDocuments([...documents, { id: documents.length + 1, name: newDocument.name, file: newDocument.file.name, isSelected: false }]);
      setNewDocument({ name: '', file: null, data: '' });
      console.log("Document added:", newDocument);
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
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="ซ่อมถนนด้วยหอยมดง"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="projectCode" className="w-40 text-gray-700">รหัสโครงการ</label>
                  <input
                    type="text"
                    id="projectCode"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="department" className="w-40 text-gray-700">หน่วยงาน</label>
                  <input
                    type="text"
                    id="department"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="location" className="w-40 text-gray-700">สถานที่</label>
                  <input
                    type="text"
                    id="location"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="dates" className="w-40 text-gray-700">วันที่เริ่มต้น</label>
                  <div className="flex flex-1 space-x-2">
                    <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="flex items-center text-gray-500">วันที่สิ้นสุด</span>
                    <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex items-center">
                  <label htmlFor="objective" className="w-40 text-gray-700">วัตถุประสงค์</label>
                  <textarea
                    id="objective"
                    rows="3"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <select id="category" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>เลือกหมวดหมู่</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label htmlFor="budget" className="w-40 text-gray-700">งบประมาณ</label>
                  <input type="text" id="budget" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center">
                  <label htmlFor="responsiblePerson" className="w-40 text-gray-700">ผู้รับผิดชอบ</label>
                  <input type="text" id="responsiblePerson" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center">
                  <label htmlFor="additionalInfo" className="w-40 text-gray-700">ข้อมูลติดต่อ</label>
                  <input type="text" id="additionalInfo" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ring-blue-500" />
                </div>
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      ลำดับ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียดขั้นตอน/วิธีดำเนินการ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      ระยะเวลาดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={activity.description}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="เริ่มต้น" />
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="สิ้นสุด" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addActivity}
              className="mt-4 w-full bg-blue-500 text-white py-3 rounded-md shadow-sm hover:bg-blue-600 flex items-center justify-center font-semibold"
            >
              <Plus size={20} className="mr-2" />
              เพิ่ม
            </button>
            <button
              onClick={removeLastActivity}
              className="mt-4 w-full bg-red-400 text-white py-3 rounded-md shadow-sm hover:bg-red-300 flex items-center justify-center font-semibold"
            >
              <X size={20} className="mr-2" />
              ลบ
            </button>
          </div>

          {/* Section 3: Document Management */}
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
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="md:col-span-2">
                  <label htmlFor="docData" className="text-gray-600 mb-1">ข้อมูลที่ต้องการให้แสดง</label>
                  <textarea
                    id="docData"
                    rows="4"
                    value={newDocument.data}
                    onChange={(e) => setNewDocument({ ...newDocument, data: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
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

            {/* Sub-section: Document List */}
            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-700 mb-2">เอกสาร</h3>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={doc.isSelected}
                      onChange={() => handleDocumentSelect(doc.id)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                    />
                    <span className="ml-3 text-gray-700">{doc.name}</span>
                    <a href="#" className="ml-auto text-blue-500 hover:underline">{doc.file}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Project Data from Documents */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ข้อมูลโครงการจากเอกสาร</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-1">ชื่อเอกสาร: <span className="font-normal">ข้อมูลโครงการฉบับเต็ม</span></h3>
                <h4 className="font-semibold text-gray-800">เป้าหมายของโครงการ</h4>
                <ul className="list-decimal list-inside text-gray-700 pl-4">
                  <li>เพื่อซ่อมแซมถนนที่ชำรุดเสียหายในพื้นที่ (ระบุชื่อพื้นที่ให้สามารถใช้งานได้อย่างมีประสิทธิภาพ</li>
                  <li>เพื่ออำนวยความสะดวกและความปลอดภัยแก่ประชาชนในการสัญจร</li>
                  <li>เพื่อเพิ่มคุณภาพโครงสร้างพื้นฐานในพื้นที่ ส่งเสริมการคมนาคมและเศรษฐกิจชุมชน</li>
                  <li>เพื่อลดอุบัติเหตุที่เกิดจากพื้นผิวถนนที่ไม่เรียบหรือมีหลุมบ่อ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mt-4">งบประมาณและแหล่งที่มาของงบประมาณ</h4>
                <ul className="list-disc list-inside text-gray-700 pl-4">
                  <li>งบประมาณในการดำเนินโครงการจำนวน 350,000 (สามแสนห้าหมื่นบาทถ้วน)</li>
                  <li>โดยใช้จ่ายในรายการหลัก รายการรายละเอียดจำนวนเงิน</li>
                  <li>ค่าปรับพื้นผิวและเตรียมพื้นผิวงานถนนเดิม 30,000</li>
                  <li>ค่าวัสดุยางมะตอยยางมะตอยพร้อมขนส่ง 200,000</li>
                  <li>ค่าแรงงานและเครื่องจักรแรงงานพร้อมรถบดอัด 100,000</li>
                  <li>ค่าดำเนินการอื่น ๆ ค่าใช้จ่ายเบ็ดเตล็ด 20,000</li>
                  <li>รวมทั้งสิ้น 350,000</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-medium text-gray-700 mb-1">ชื่อเอกสาร: <span className="font-normal">หนังสือเสนอ</span></h3>
                <h4 className="font-semibold text-gray-800">ขอบเขต</h4>
                <ul className="list-disc list-inside text-gray-700 pl-4">
                  <li>พื้นที่ดำเนินโครงการ</li>
                  <ul className="list-disc list-inside text-gray-700 pl-8">
                    <li>ถนนในเขต หมู่ที่ 3 ตำบลทุ่งใหญ่ อำเภอเมือง จังหวัดนครราชสีมา</li>
                    <li>ความยาวถนนที่ซ่อมแซมประมาณ 500 เมตร ความกว้างเฉลี่ย 5 เมตร</li>
                  </ul>
                  <li>ลักษณะของงานซ่อมแซม</li>
                  <ul className="list-disc list-inside text-gray-700 pl-8">
                    <li>การปรับระดับพื้นถนนเดิมและทำความสะอาดผิวหน้าถนน</li>
                    <li>การลาดยางมะตอยแบบร้อน หนาเฉลี่ยประมาณ 5 เซนติเมตร</li>
                    <li>อุดรอยแตก รอยแยก และหลุมบ่อที่เกิดจากการใช้งาน</li>
                    <li>ติดตั้งแผงเสริมความแข็งแรงบริเวณขอบถนน</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}