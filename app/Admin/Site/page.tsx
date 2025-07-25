'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Home, Edit, Eye } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export default function HomeDashboard() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'โครงการซ่อมถนนด้วยยางมะตอย',
      status: 'กำลังดำเนินการ',
      statusColor: 'bg-yellow-400',
      lastUpdated: 'แก้ไขล่าสุด 15/07/2568 เวลา 10:30 นาที',
    },
    {
      id: 2,
      title: 'โครงการขยายถนนบ้านโพธิ์',
      status: 'เสร็จสิ้น',
      statusColor: 'bg-green-500',
      lastUpdated: 'แก้ไขล่าสุด 14/07/2568 เวลา 16:00 นาที',
    },
    {
      id: 3,
      title: 'โครงการต่อเติมหลังคาบ้านท้าย',
      status: 'ระงับ',
      statusColor: 'bg-gray-400',
      lastUpdated: 'แก้ไขล่าสุด 12/07/2568 เวลา 09:15 นาที',
    },
    {
      id: 4,
      title: 'โครงการทำถนนสี่เลน',
      status: 'ระงับ',
      statusColor: 'bg-gray-400',
      lastUpdated: 'แก้ไขล่าสุด 10/07/2568 เวลา 11:45 นาที',
    },
    {
      id: 5,
      title: 'โครงการอ่างเก็บน้ำ',
      status: 'ระงับ',
      statusColor: 'bg-gray-400',
      lastUpdated: 'แก้ไขล่าสุด 08/07/2568 เวลา 14:20 นาที',
    },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const [isSortByDateOpen, setIsSortByDateOpen] = useState(false);
  const [selectedSortByDate, setSelectedSortByDate] = useState('ใหม่ที่สุด');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ทั้งหมด');
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<number | null>(null);

  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSortByDate = () => {
    setIsSortByDateOpen(!isSortByDateOpen);
    setIsStatusFilterOpen(false);
    setOpenStatusDropdownId(null); 
  };

  const selectSortByDate = (option: string) => {
    setSelectedSortByDate(option);
    setIsSortByDateOpen(false);
  };

  const toggleStatusFilter = () => {
    setIsStatusFilterOpen(!isStatusFilterOpen);
    setIsSortByDateOpen(false);
    setOpenStatusDropdownId(null); 
  };

  const selectStatusFilter = (option: string) => {
    setSelectedStatusFilter(option);
    setIsStatusFilterOpen(false);
  };

  const handleToggleStatusDropdown = (projectId: number) => {
    setOpenStatusDropdownId(openStatusDropdownId === projectId ? null : projectId);
  };

  const updateProjectStatus = (projectId: number, newStatus: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          let newStatusColor = '';
          switch (newStatus) {
            case 'กำลังดำเนินการ':
              newStatusColor = 'bg-yellow-400';
              break;
            case 'เสร็จสิ้น':
              newStatusColor = 'bg-green-500';
              break;
            case 'ระงับ':
              newStatusColor = 'bg-gray-400';
              break;
            default:
              newStatusColor = 'bg-gray-400'; 
          }
          return { ...project, status: newStatus, statusColor: newStatusColor };
        }
        return project;
      })
    );
    setOpenStatusDropdownId(null); 
  };

  const handleEditProject = (projectId: number) => {
    console.log(`แก้ไขโครงการ ID: ${projectId}`);
  };

  const navigateTo = (path: string) => {
    router.push(path);
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
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/Site')}
                >
                  โครงการทั้งหมด
                </li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                  เพิ่มโครงการ
                </li>
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/Statistics')}
                >
                  สถิติ
                </li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                  ออกจาระบบ
                </li>
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 p-6">
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
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.lastUpdated}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`w-3 h-3 rounded-full mr-2 ${project.statusColor}`}></span>
                    <span className="text-gray-700 font-medium">{project.status}</span>
                    <div className="relative">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                        onClick={() => handleToggleStatusDropdown(project.id)}
                      >
                        <Eye size={16} className="mr-1" />
                        ติดตามสถานะ
                      </button>
                      {openStatusDropdownId === project.id && (
                        <div className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 right-0">
                          <div className="py-1">
                            {['กำลังดำเนินการ', 'เสร็จสิ้น', 'ระงับ'].map((statusOption) => (
                              <a
                                key={statusOption}
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateProjectStatus(project.id, statusOption);
                                }}
                              >
                                {statusOption}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* "แก้ไข" button */}
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
                      onClick={() => handleEditProject(project.id)}
                    >
                      <Edit size={16} className="mr-1" />
                      แก้ไข
                    </button>
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
