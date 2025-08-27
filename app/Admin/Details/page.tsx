'use client';

import React, { useState } from 'react';
import { Home, Search, ChevronDown, FileText, Download } from 'lucide-react';

export default function DetailPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const projectData = {
    name: 'ซ่อมถนนด้วยหอยมดง',
    code: 'BG045-652232532',
    department: 'เทศบาลตำบลปะโค',
    location: 'บ้านไร่ ถนน 471 หมู่ 88',
    startDate: '14 กพ 2569',
    endDate: '8 มีค 2569',
    objective: 'เพื่อใช้เป็นงบกลางในการซ่อมแซมถนนที่ชำรุด',
    category: 'โครงการซ่อมแซม',
    budget: '1,100,000',
    responsiblePerson: 'นาง มดจิ๊ด โงจินะ',
    contactInfo: '054-826-8626',
    status: 'กำลังดำเนินการ',
  };

  const statusOptions = {
    'กำลังดำเนินการ': { color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
    'ระงับ': { color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' },
    'เสร็จสิ้น': { color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
  };

  const getStatusClasses = (status) => {
    return statusOptions[status]?.color || '';
  };

  const getStatusDotColor = (status) => {
    return statusOptions[status]?.dot || '';
  };

  // The dummy URL for a placeholder PDF document. This should be replaced with an actual file URL from Supabase storage.
  const dummyFileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  const documents = [
    { name: 'ข้อมูลโครงการฉบับเต็ม', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'หนังสือเสนอ', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'การจัดซื้อจัดจ้าง', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'วิเคราะห์', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'หนังสือสัญญาจ้าง', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'เอกสารส่งมอบ', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'แผนการใช้จ่ายงบประมาณ', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'ไฟล์ยืนยันงบประมาณ', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'เอกสารอนุมัติงบประมาณ', file: 'เอกสาร.pdf', url: dummyFileUrl },
    { name: 'เอกสารสำเร็จโครงการ', file: 'เอกสาร.pdf', url: dummyFileUrl },
  ];

  const activities = [
    { id: 1, description: 'XXXXXXXXXXXXXXXXXXXXXX', duration: '00/00/00 - 00/00/00' },
    { id: 2, description: 'XXXXXXXXXXXXXXXXXXXXXX', duration: '00/00/00 - 00/00/00' },
    { id: 3, description: 'XXXXXXXXXXXXXXXXXXXXXX', duration: '00/00/00 - 00/00/00' },
  ];

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

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Section 1: Project Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">ข้อมูลโครงการ</h2>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">สถานะ :</span>
                <span
                  className={`flex items-center px-4 py-2 rounded-full border ${getStatusClasses(projectData.status)}`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(projectData.status)}`}></div>
                  {projectData.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div className="space-y-3">
                <div className="flex">
                  <span className="font-semibold w-40">ชื่อโครงการ :</span>
                  <span className="flex-1">{projectData.name}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">รหัสโครงการ :</span>
                  <span className="flex-1">{projectData.code}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">หน่วยงาน :</span>
                  <span className="flex-1">{projectData.department}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">สถานที่ :</span>
                  <span className="flex-1">{projectData.location}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">วันที่เริ่มต้น :</span>
                  <span className="flex-1">{projectData.startDate}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">วันที่สิ้นสุด :</span>
                  <span className="flex-1">{projectData.endDate}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="font-semibold w-40">วัตถุประสงค์ :</span>
                  <span className="flex-1">{projectData.objective}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">หมวดหมู่ :</span>
                  <span className="flex-1">{projectData.category}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">งบประมาณ :</span>
                  <span className="flex-1">{projectData.budget} บาท</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">ผู้รับผิดชอบ :</span>
                  <span className="flex-1">{projectData.responsiblePerson}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-40">ข้อมูลติดต่อ :</span>
                  <span className="flex-1">{projectData.contactInfo}</span>
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
                        {activity.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Documents (Updated to a table format with clickable links) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">เอกสาร</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อเอกสาร
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ไฟล์เอกสาร
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Download</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <FileText className="text-gray-400 mr-2" size={16} />
                          {doc.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          {doc.file}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={doc.url} download className="text-blue-600 hover:text-blue-900">
                          <Download size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Project Data from Documents (Empty) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ข้อมูลโครงการจากเอกสาร</h2>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="pt-4 border-t border-gray-200 first:border-t-0">
                  <h3 className="text-xl font-medium text-gray-700 mb-1">ชื่อเอกสาร: <span className="font-normal">{doc.name}</span></h3>
                  <div className="space-y-2 text-gray-700 pl-4">
                    <h4 className="font-semibold text-gray-800">ข้อมูลเอกสาร:</h4>
                    {/* Placeholder for document data */}
                    <div className="text-gray-500 italic">ไม่มีข้อมูลที่แสดง</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}