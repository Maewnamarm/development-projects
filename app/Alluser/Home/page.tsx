'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Home, XCircle, MessageSquare, FileText } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  status: string;
  statusColor: string;
  lastUpdated: string;
  description?: string;
  responsiblePerson?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  estimatedBudget?: string;
  images?: string[];
  comments?: { user: string; text: string; date: string }[];
  documents?: { name: string; url: string }[];
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'โครงการซ่อมถนนด้วยยางมะตอย',
    status: 'กำลังดำเนินการ',
    statusColor: 'bg-yellow-400',
    lastUpdated: 'แก้ไขล่าสุด 15/07/2568 เวลา 10:30 นาที',
    description: 'โครงการนี้มีวัตถุประสงค์เพื่อปรับปรุงและซ่อมแซมพื้นผิวถนน...',
    responsiblePerson: 'นายสมชาย ใจดี',
    location: 'บ้านโพธิ์ หมู่ 88',
    startDate: '1 กรกฎาคม 2568',
    endDate: '8 ตุลาคม 2568',
    estimatedBudget: '1,100,000 บาท',
    images: [
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+1',
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+2',
    ],
    comments: [
      { user: 'นายประเมินผล', text: 'งานล่าช้า...', date: '17/07/2568' },
    ],
    documents: [
      { name: 'สัญญาจ้าง.pdf', url: '/docs/contract.pdf' },
      { name: 'แผนงาน.xlsx', url: '/docs/plan.xlsx' },
    ],
  },
  {
    id: 2,
    title: 'โครงการขยายถนนบ้านโพธิ์',
    status: 'เสร็จสิ้น',
    statusColor: 'bg-green-500',
    lastUpdated: 'แก้ไขล่าสุด 14/07/2568 เวลา 16:00 นาที',
    description: 'โครงการขยายถนนเพื่อรองรับการจราจรที่เพิ่มขึ้น...',
    responsiblePerson: 'นางสาวสุดาพร มีสุข',
    location: 'บ้านโพธิ์',
    startDate: '1 มกราคม 2568',
    endDate: '30 มิถุนายน 2568',
    estimatedBudget: '850,000 บาท',
    comments: [
      { user: 'ผู้ดูแลระบบ', text: 'โครงการนี้เสร็จสมบูรณ์ตามแผน', date: '01/07/2568' },
    ],
    documents: [
      { name: 'รายงานผล.pdf', url: '/docs/report.pdf' },
    ],
  },
];

export default function HomeDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isSortByDateOpen, setIsSortByDateOpen] = useState(false);
  const [selectedSortByDate, setSelectedSortByDate] = useState('ใหม่ที่สุด');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ทั้งหมด');

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState(''); // 🟨 เพิ่ม state สำหรับชื่อผู้แสดงความคิดเห็น

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSortByDate = () => {
    setIsSortByDateOpen(!isSortByDateOpen);
    setIsStatusFilterOpen(false);
  };
  const toggleStatusFilter = () => {
    setIsStatusFilterOpen(!isStatusFilterOpen);
    setIsSortByDateOpen(false);
  };
  const selectSortByDate = (option: string) => {
    setSelectedSortByDate(option);
    setIsSortByDateOpen(false);
  };
  const selectStatusFilter = (option: string) => {
    setSelectedStatusFilter(option);
    setIsStatusFilterOpen(false);
  };
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowCommentBox(false);
  };
  const handleCloseProjectDetails = () => setSelectedProject(null);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    // 🟨 ตรวจสอบชื่อที่กรอก หากไม่มี ให้ใช้ค่า default
    const currentUser = commenterName.trim() === '' ? 'ผู้ไม่ประสงค์ออกนาม' : commenterName;
    const currentDate = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (selectedProject) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), { user: currentUser, text: newComment, date: currentDate }],
            }
          : null
      );
    }
    setNewComment('');
    setCommenterName(''); // 🟨 ล้างค่าช่องชื่อหลังจากส่ง
    setShowCommentBox(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <img
              src="https://placehold.co/40x40/ffffff/000000?text=LOGO"
              alt="Logo"
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
              className="p-2 pl-4 pr-10 bg-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <Search className="absolute right-3 text-gray-500" size={20} />
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-lg min-h-[calc(100vh-120px)]">
          <div className="mb-6">
            <div
              className="flex items-center justify-between p-3 bg-blue-100 rounded-md mb-2 cursor-pointer hover:bg-blue-200"
              onClick={toggleMenu}
            >
              <span className="font-semibold text-gray-800">เมนู</span>
              <ChevronDown
                className={`text-gray-600 transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </div>
            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                  โครงการทั้งหมด
                </li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                  ออกจากระบบ
                </li>
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 p-6">
          {selectedProject ? (
            // Project Detail
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <button
                onClick={handleCloseProjectDetails}
                className="absolute top-15 right-7 text-gray-500 hover:text-gray-700"
              >
                <XCircle size={36} />
              </button>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.title}</h2>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${selectedProject.statusColor}`}></span>
                  <span className="text-gray-700 font-medium">{selectedProject.status}</span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">รายละเอียด:</span> {selectedProject.description || '-'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">ผู้รับผิดชอบ:</span> {selectedProject.responsiblePerson || '-'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">สถานที่:</span> {selectedProject.location || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">วันที่เริ่มต้น:</span> {selectedProject.startDate || '-'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">วันที่สิ้นสุด:</span> {selectedProject.endDate || '-'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">งบประมาณ:</span> {selectedProject.estimatedBudget || '-'}
                  </p>
                </div>
              </div>

              {/* Images */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">รูปภาพ</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`รูปภาพ ${i + 1}`}
                        className="w-full h-24 object-cover rounded-md shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedProject.documents && selectedProject.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">เอกสาร</h3>
                  <ul className="space-y-2">
                    {selectedProject.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 underline"
                        >
                          <FileText size={18} className="mr-2" /> {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">ความคิดเห็น</h3>
                <div className="space-y-3 mb-4">
                  {selectedProject.comments && selectedProject.comments.length > 0 ? (
                    selectedProject.comments.map((c, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-md border">
                        <p className="text-sm font-medium text-gray-800">
                          {c.user} <span className="text-gray-500 text-xs ml-2">{c.date}</span>
                        </p>
                        <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">ยังไม่มีความคิดเห็น</p>
                  )}
                </div>
                <button
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <MessageSquare size={18} className="mr-2" /> แสดงความคิดเห็น
                </button>
                {showCommentBox && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md border">
                    {/* 🟨 เพิ่มช่องกรอกชื่อ */}
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md mb-2 text-black"
                      placeholder="ชื่อ-นามสกุล หรือชื่อเล่น"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                    />
                    <textarea
                      className="w-full p-2 border rounded-md text-black"
                      rows={3}
                      placeholder="เขียนความคิดเห็น..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                      >
                        ส่ง
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Project List
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">โครงการทั้งหมด</h2>
              <div className="space-y-4">
                {initialProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.lastUpdated}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${project.statusColor}`}></span>
                      <span className="text-gray-700 font-medium">{project.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}