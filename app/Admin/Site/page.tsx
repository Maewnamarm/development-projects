'use client';

import { ChevronDown, Edit, Eye, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


interface Activity {
  id: number;
  description: string;
  start_date: string | null;
  end_date: string | null;
}

interface Document {
  id: number;
  name: string;
  file_url: string;
  is_public: boolean;
}

interface Project {
  id: number;
  name: string;
  code: string;
  department: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  objective: string | null;
  status: string | null;
  category: string | null;
  budget: number | null;
  responsible_person: string | null;
  contact_info: string | null;
  created_at?: string;
  activities?: Activity[];
  documents?: Document[];
}

export default function HomeDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isSortByDateOpen, setIsSortByDateOpen] = useState(false);
  const [selectedSortByDate, setSelectedSortByDate] = useState('ใหม่ที่สุด');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ทั้งหมด');
  const router = useRouter();

  // โหลดข้อมูลโครงการ + join activities, documents
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleSortByDate = () => {
    setIsSortByDateOpen(!isSortByDateOpen);
    setIsStatusFilterOpen(false);
  };

  const selectSortByDate = (option: string) => {
    setSelectedSortByDate(option);
    setIsSortByDateOpen(false);

    if (option === 'ใหม่ที่สุด') {
      setProjects([...projects].sort((a, b) => (a.created_at! < b.created_at! ? 1 : -1)));
    } else if (option === 'เก่าที่สุด') {
      setProjects([...projects].sort((a, b) => (a.created_at! > b.created_at! ? 1 : -1)));
    }
  };

  const toggleStatusFilter = () => {
    setIsStatusFilterOpen(!isStatusFilterOpen);
    setIsSortByDateOpen(false);
  };

  const selectStatusFilter = (option: string) => {
    setSelectedStatusFilter(option);
    setIsStatusFilterOpen(false);
  };

  const handleEditProject = (projectId: number) => {
    router.push(`/Admin/EditProject/${projectId}`);
  };

  const navigateTo = (path: string) => router.push(path);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'กำลังดำเนินการ':
        return 'bg-yellow-400';
      case 'เสร็จสิ้น':
        return 'bg-green-500';
      case 'ระงับ':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };


  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <img
              src="https://placehold.co/40x40/ffffff/000000?text=LOGO"
              alt="โลโก้"
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">การจัดการโครงการพัฒนาเทศบาลตำบลปะโค</h1>
            <p className="text-sm">อำเภอเมืองหนองคาย จังหวัดหนองคาย</p>
          </div>
        </div>
      </header>

      {/* Navbar */}
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
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                  ออกจากระบบ
                </li>
              </ul>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">โครงการทั้งหมด</h2>
              <div className="flex space-x-4">
                {/* Sort */}
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">เรียงจาก</span>
                </div>

                <div className="relative">
                  <div
                    className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={toggleSortByDate}
                  >
                    <span className="font-medium">{selectedSortByDate}</span>
                    <ChevronDown
                      className={`ml-1 transform transition-transform duration-200 ${
                        isSortByDateOpen ? 'rotate-180' : ''
                      }`}
                      size={16}
                    />
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

                {/* Filter */}
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">หมวดหมู่</span>
                </div>

                <div className="relative">
                  <div
                    className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={toggleStatusFilter}
                  >
                    <span className="font-medium">{selectedStatusFilter}</span>
                    <ChevronDown
                      className={`ml-1 transform transition-transform duration-200 ${
                        isStatusFilterOpen ? 'rotate-180' : ''
                      }`}
                      size={16}
                    />
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

            {/* Project List */}
            <div className="space-y-4">
              {projects
                .filter((p) =>
                  selectedStatusFilter === 'ทั้งหมด' ? true : p.status === selectedStatusFilter
                )
                .map((project) => {
                  const isExpanded = expandedProjectId === project.id;
                  return (
                    <div
                      key={project.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Header Section (always visible) */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
                            onClick={() => toggleExpand(project.id)}
                          >
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            เริ่ม: {project.start_date || '-'} | สิ้นสุด: {project.end_date || '-'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(project.status)}`}
                          ></span>
                          <span className="text-gray-700 font-medium">{project.status}</span>
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                            onClick={() => router.push(`/Admin/Trace/${project.id}`)}
                          >
                            <Eye size={16} className="mr-1" />
                            ติดตาม
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                            onClick={() => handleEditProject(project.id)}
                          >
                            <Edit size={16} className="mr-1" />
                            แก้ไข
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">รหัสโครงการ:</span> {project.code || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">หน่วยงานรับผิดชอบ:</span> {project.department || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">สถานที่:</span> {project.location || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">งบประมาณ:</span> {project.budget ?? '-'} บาท
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">ผู้รับผิดชอบ:</span> {project.responsible_person || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">ติดต่อ:</span> {project.contact_info || '-'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">วัตถุประสงค์:</span> {project.objective || '-'}
                          </p>

                          {/* Activities */}
                          {project.activities && project.activities.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700">กิจกรรม:</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {project.activities.map((a) => (
                                  <li key={a.id}>
                                    {a.description} ({a.start_date || '-'} ถึง {a.end_date || '-'})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Documents */}
                          {project.documents && project.documents.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700">เอกสาร:</h4>
                              <ul className="list-disc list-inside text-sm text-blue-600">
                                {project.documents.map((d) => (
                                  <li key={d.id}>
                                    <a
                                      href={d.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      {d.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
