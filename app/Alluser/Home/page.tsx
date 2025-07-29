'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Home, XCircle, MessageSquare } from 'lucide-react';

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
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'โครงการซ่อมถนนด้วยยางมะตอย',
    status: 'กำลังดำเนินการ',
    statusColor: 'bg-yellow-400',
    lastUpdated: 'แก้ไขล่าสุด 15/07/2568 เวลา 10:30 นาที',
    description: 'โครงการนี้มีวัตถุประสงค์เพื่อปรับปรุงและซ่อมแซมพื้นผิวถนนที่ชำรุดเสียหายด้วยยางมะตอย เพื่อเพิ่มความปลอดภัยและความสะดวกสบายในการสัญจรของประชาชนในพื้นที่ รวมถึงลดปัญหาการจราจรติดขัดและอุบัติเหตุที่อาจเกิดขึ้นจากสภาพถนนที่ไม่ดี โครงการนี้จะดำเนินการในหลายจุดทั่วเทศบาลตำบลปะโค และคาดว่าจะแล้วเสร็จภายในระยะเวลาที่กำหนด',
    responsiblePerson: 'นายสมชาย ใจดี',
    location: 'บ้านโพธิ์ หมู่ 88',
    startDate: '1 กรกฎาคม 2568',
    endDate: '8 ตุลาคม 2568',
    estimatedBudget: '1,100,000 บาท',
    images: [
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+1',
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+2',
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+3',
      'https://placehold.co/100x100/A0A0A0/FFFFFF?text=Image+4',
    ],
    comments: [
      { user: 'นายประเมินผล', text: 'งานล่าช้ามากครับ ทำมา 2 ปีแล้ว ยังไม่คืบหน้าเลย ไม่เอาภาษีคนหนองคายไปกินนะคุณผู้รับเหมา', date: '17/07/2568' },
    ],
  },
  {
    id: 2,
    title: 'โครงการขยายถนนบ้านโพธิ์',
    status: 'เสร็จสิ้น',
    statusColor: 'bg-green-500',
    lastUpdated: 'แก้ไขล่าสุด 14/07/2568 เวลา 16:00 นาที',
    description: 'โครงการขยายถนนเพื่อรองรับการจราจรที่เพิ่มขึ้นในพื้นที่บ้านโพธิ์ เพื่อให้การเดินทางสะดวกและรวดเร็วยิ่งขึ้น โดยมีการขยายผิวจราจรและปรับปรุงระบบระบายน้ำ คาดว่าจะช่วยลดปัญหาการจราจรติดขัดและส่งเสริมการพัฒนาเศรษฐกิจในท้องถิ่น',
    responsiblePerson: 'นางสาวสุดาพร มีสุข',
    location: 'บ้านโพธิ์',
    startDate: '1 มกราคม 2568',
    endDate: '30 มิถุนายน 2568',
    estimatedBudget: '850,000 บาท',
    images: [
      'https://placehold.co/100x100/B0B0B0/FFFFFF?text=Image+A',
      'https://placehold.co/100x100/B0B0B0/FFFFFF?text=Image+B',
    ],
    comments: [
      { user: 'ผู้ดูแลระบบ', text: 'โครงการนี้เสร็จสมบูรณ์ตามแผนที่วางไว้', date: '01/07/2568' },
    ],
  },
  {
    id: 3,
    title: 'โครงการต่อเติมหลังคาบ้านท้าย',
    status: 'ระงับ',
    statusColor: 'bg-gray-400',
    lastUpdated: 'แก้ไขล่าสุด 12/07/2568 เวลา 09:15 นาที',
    description: 'โครงการต่อเติมหลังคาบ้านท้าย เพื่อเพิ่มพื้นที่ใช้สอยและปรับปรุงโครงสร้างให้แข็งแรงขึ้น แต่เนื่องจากปัญหาด้านงบประมาณ จึงถูกระงับชั่วคราว',
    responsiblePerson: 'นายวิชัย ก่อสร้าง',
    location: 'บ้านท้าย',
    startDate: '10 มีนาคม 2568',
    endDate: 'ยังไม่กำหนด',
    estimatedBudget: '200,000 บาท',
    images: [
      'https://placehold.co/100x100/C0C0C0/FFFFFF?text=Image+X',
    ],
    comments: [],
  },
  {
    id: 4,
    title: 'โครงการทำถนนสี่เลน',
    status: 'ระงับ',
    statusColor: 'bg-gray-400',
    lastUpdated: 'แก้ไขล่าสุด 10/07/2568 เวลา 11:45 นาที',
    description: 'โครงการขนาดใหญ่เพื่อพัฒนาโครงสร้างพื้นฐานด้านคมนาคมขนส่งในระยะยาว โดยมีแผนการขยายถนนเป็นสี่เลนเพื่อรองรับปริมาณรถที่เพิ่มขึ้นในอนาคต อย่างไรก็ตาม โครงการยังอยู่ในขั้นตอนการศึกษาความเป็นไปได้และถูกระงับชั่วคราว',
    responsiblePerson: 'บริษัท ถนนดี จำกัด',
    location: 'ทั่วเทศบาล',
    startDate: '1 มกราคม 2567',
    endDate: 'ยังไม่กำหนด',
    estimatedBudget: '50,000,000 บาท',
    images: [],
    comments: [],
  },
  {
    id: 5,
    title: 'โครงการอ่างเก็บน้ำ',
    status: 'ระงับ',
    statusColor: 'bg-gray-400',
    lastUpdated: 'แก้ไขล่าสุด 08/07/2568 เวลา 14:20 นาที',
    description: 'โครงการก่อสร้างอ่างเก็บน้ำเพื่อการเกษตรและอุปโภคบริโภคของประชาชน เพื่อแก้ไขปัญหาการขาดแคลนน้ำในฤดูแล้งและส่งเสริมการเพาะปลูก แต่โครงการยังคงถูกระงับเนื่องจากปัญหาด้านสิ่งแวดล้อมและการจัดหาที่ดิน',
    responsiblePerson: 'กรมชลประทาน',
    location: 'พื้นที่ห่างไกล',
    startDate: '1 มกราคม 2566',
    endDate: 'ยังไม่กำหนด',
    estimatedBudget: '15,000,000 บาท',
    images: [],
    comments: [],
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSortByDate = () => {
    setIsSortByDateOpen(!isSortByDateOpen);
    setIsStatusFilterOpen(false);
  };

  const selectSortByDate = (option: string) => {
    setSelectedSortByDate(option);
    setIsSortByDateOpen(false);
  };

  const toggleStatusFilter = () => {
    setIsStatusFilterOpen(!isStatusFilterOpen);
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

  const handleCloseProjectDetails = () => {
    setSelectedProject(null);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const currentUser = 'ผู้ใช้งานปัจจุบัน'; 
    const currentDate = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (selectedProject) {
      const updatedProjects = initialProjects.map((proj) =>
        proj.id === selectedProject.id
          ? {
              ...proj,
              comments: [...(proj.comments || []), { user: currentUser, text: newComment, date: currentDate }],
            }
          : proj
      );
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
    setShowCommentBox(false); 
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
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
                className={`text-gray-600 transform transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
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
            // Project Detail View
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <button
                onClick={handleCloseProjectDetails}
                className="absolute top-15 right-7 text-gray-500 hover:text-gray-700"
                aria-label="ปิด"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">รายละเอียด:</span> {selectedProject.description || 'ไม่มีรายละเอียด'}
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
                    <span className="font-semibold">งบประมาณโดยประมาณ:</span> {selectedProject.estimatedBudget || '-'}
                  </p>
                </div>
              </div>

              {/* Images Section */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">รูปภาพ</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedProject.images.map((imgSrc, index) => (
                      <img
                        key={index}
                        src={imgSrc}
                        alt={`รูปภาพโครงการ ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/100x100/CCCCCC/333333?text=No+Image';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">ความคิดเห็น</h3>
                <div className="space-y-3 mb-4">
                  {selectedProject.comments && selectedProject.comments.length > 0 ? (
                    selectedProject.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm font-medium text-gray-800">
                          {comment.user} <span className="text-gray-500 text-xs ml-2">{comment.date}</span>
                        </p>
                        <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">ยังไม่มีความคิดเห็น</p>
                  )}
                </div>
                <button
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <MessageSquare size={18} className="mr-2" />
                  แสดงความคิดเห็น
                </button>

                {showCommentBox && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">เพิ่มความคิดเห็นของคุณ</h4>
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="ชื่อผู้ใช้งาน (จะถูกใส่โดยอัตโนมัติ)"
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-700 cursor-not-allowed"
                        value="ผู้ใช้งานปัจจุบัน" // Placeholder for current user
                        disabled
                      />
                    </div>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                      rows={3}
                      placeholder="เขียนความคิดเห็นของคุณที่นี่..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        ส่ง
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Project List View
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">โครงการทั้งหมด</h2>
                <div className="flex space-x-4">
                  {/* เรียงจาก - No dropdown */}
                  <div className="flex items-center text-blue-600">
                    <span className="font-medium">เรียงจาก</span>
                  </div>

                  <div className="relative">
                    <div
                      className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={toggleSortByDate}
                    >
                      <span className="font-medium">{selectedSortByDate}</span>
                      <ChevronDown className={`ml-1 transform transition-transform duration-200 ${isSortByDateOpen ? 'rotate-180' : ''}`} size={16} />
                    </div>
                    {isSortByDateOpen && (
                      <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {['ใหม่ที่สุด', 'เก่าที่สุด', 'ทั้งหมด'].map((option) => (
                            <a
                              key={option}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={(e) => {
                                e.preventDefault();
                                selectSortByDate(option);
                              }}
                            >
                              {option}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-blue-600">
                    <span className="font-medium">หมวดหมู่</span>
                  </div>

                  <div className="relative">
                    <div
                      className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={toggleStatusFilter}
                    >
                      <span className="font-medium">{selectedStatusFilter}</span>
                      <ChevronDown className={`ml-1 transform transition-transform duration-200 ${isStatusFilterOpen ? 'rotate-180' : ''}`} size={16} />
                    </div>
                    {isStatusFilterOpen && (
                      <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {['ระงับ', 'เสร็จสิ้น', 'กำลังดำเนินการ', 'ทั้งหมด'].map((option) => (
                            <a
                              key={option}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={(e) => {
                                e.preventDefault();
                                selectStatusFilter(option);
                              }}
                            >
                              {option}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {initialProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleProjectClick(project)} // Add click handler
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
