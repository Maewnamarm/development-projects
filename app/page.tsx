'use client';

import { createClient } from '@supabase/supabase-js';
import { ChevronDown, Eye, FileText, LogIn, MessageSquare, Search, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface Comment {
  user: string;
  text: string;
  date: string;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isSortByDateOpen, setIsSortByDateOpen] = useState(false);
  const [selectedSortByDate, setSelectedSortByDate] = useState('ใหม่ที่สุด');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [projectComments, setProjectComments] = useState<{[key: number]: Comment[]}>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try { 
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          console.error('Failed to fetch projects:', response.statusText);
          return;
        }

        const data = await response.json();
        
        const projectsWithPublicDocs = data.map((project: Project) => ({
          ...project,
          documents: project.documents?.filter(doc => doc.is_public === true) || []
        }));

        setProjects(projectsWithPublicDocs);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

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

    if (option === 'ใหม่ที่สุด') {
      setProjects([...projects].sort((a, b) => (a.created_at! < b.created_at! ? 1 : -1)));
    } else if (option === 'เก่าที่สุด') {
      setProjects([...projects].sort((a, b) => (a.created_at! > b.created_at! ? 1 : -1)));
    }
  };

  const selectStatusFilter = (option: string) => {
    setSelectedStatusFilter(option);
    setIsStatusFilterOpen(false);
  };
  
  const navigateTo = (path: string) => router.push(path);

  const fetchComments = async (projectId: number) => {
    try {
      const res = await fetch(`/api/comment?project_id=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProjectComments(prev => ({
          ...prev,
          [projectId]: (data as { citizen_name: string, content: string, comm_date: string }[]).map((c) => ({
            user: c.citizen_name,
            text: c.content,
            date: new Date(c.comm_date).toLocaleDateString('th-TH')
          }))
        }));
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowCommentBox(false);
    fetchComments(project.id);
  };

  const handleCloseProjectDetails = () => setSelectedProject(null);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return budget.toLocaleString('th-TH') + ' บาท';
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !selectedProject) return;
  
    const currentUser = commenterName.trim() === '' ? 'ผู้ไม่ประสงค์ออกนาม' : commenterName;
  
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          citizen_name: currentUser,
          project_id: selectedProject.id,
        }),
      });
  
      if (res.ok) {
        const savedComment = await res.json();
        setProjectComments(prev => ({
          ...prev,
          [selectedProject.id]: [...(prev[selectedProject.id] || []), {
            user: savedComment.citizen_name,
            text: savedComment.content,
            date: new Date(savedComment.comm_date).toLocaleDateString('th-TH')
          }]
        }));
        setNewComment('');
        setCommenterName('');
        setShowCommentBox(false);
      } else {
        console.error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  
  const filteredProjects = projects
    .filter(project => 
      selectedStatusFilter === 'ทั้งหมด' ? true : project.status === selectedStatusFilter
    )
    .filter(project =>
      searchTerm === '' ? true : 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.responsible_person && project.responsible_person.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
        <button
          onClick={() => navigateTo('/Alluser/Login')}
          className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
        >
          <LogIn size={18} className="mr-2" />
          เข้าสู่ระบบ
        </button>
      </header>

      {/* Search Bar */}
      <nav className="bg-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex items-center bg-white rounded-lg overflow-hidden shadow-md">
            <Search className="absolute left-4 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="ค้นหาโครงการ สถานที่ หรือผู้รับผิดชอบ..."
              className="w-full p-4 pl-14 pr-4 text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {selectedProject ? (
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <button
                onClick={handleCloseProjectDetails}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>

              <div className="flex items-center justify-between mb-6 pr-10">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(selectedProject.status)}`}></span>
                  <span className="text-gray-700 font-medium">{selectedProject.status || 'ไม่ระบุ'}</span>
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">หน่วยงานรับผิดชอบ:</span> {selectedProject.department || '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">สถานที่:</span> {selectedProject.location || '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">ผู้รับผิดชอบ:</span> {selectedProject.responsible_person || '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">ติดต่อ:</span> {selectedProject.contact_info || '-'}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">วันที่เริ่มต้น:</span> {formatDate(selectedProject.start_date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">วันที่สิ้นสุด:</span> {formatDate(selectedProject.end_date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">งบประมาณ:</span> {formatBudget(selectedProject.budget)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">หมวดหมู่:</span> {selectedProject.category || '-'}
                  </p>
                </div>
              </div>

              {/* Objective */}
              {selectedProject.objective && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">วัตถุประสงค์</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                    {selectedProject.objective}
                  </p>
                </div>
              )}

              {/* Activities */}
              {selectedProject.activities && selectedProject.activities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">กิจกรรม</h3>
                  <div className="space-y-2">
                    {selectedProject.activities.map((activity) => (
                      <div key={activity.id} className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                        <p className="text-sm text-gray-800 font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(activity.start_date)} ถึง {formatDate(activity.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedProject.documents && selectedProject.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">เอกสาร</h3>
                  <ul className="space-y-2">
                    {selectedProject.documents.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FileText size={18} className="mr-2" /> 
                          {doc.name}
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">สาธารณะ</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">ความคิดเห็น</h3>
                <div className="space-y-3 mb-4">
                  {projectComments[selectedProject.id] && projectComments[selectedProject.id].length > 0 ? (
                    projectComments[selectedProject.id].map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md border">
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
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={18} className="mr-2" /> แสดงความคิดเห็น
                </button>

                {showCommentBox && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md border">
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
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setShowCommentBox(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={handleAddComment}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        ส่ง
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">โครงการทั้งหมด</h2>
                <div className="flex space-x-4">
                  {/* Sort Options */}
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

                  {/* Filter Options */}
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
                      <div className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {['ทั้งหมด', 'ระงับ', 'เสร็จสิ้น', 'กำลังดำเนินการ'].map((option) => (
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

              {/* Project Cards */}
              <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">ไม่พบโครงการที่ตรงกับเงื่อนไขที่ค้นหา</p>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`border-l-8 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer ${
                        project.status === 'เสร็จสิ้น' ? 'bg-green-50 border-green-500' :
                        project.status === 'กำลังดำเนินการ' ? 'bg-yellow-50 border-yellow-500' :
                        project.status === 'ล่าช้า' ? 'bg-red-50 border-red-400' :
                        project.status === 'ระงับ' ? 'bg-gray-50 border-gray-400' :
                        'bg-white border-gray-300'
                      }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors mb-3">
                            {project.name}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-base text-gray-800 font-medium">
                              📅 เริ่ม: {formatDate(project.start_date)} | สิ้นสุด: {formatDate(project.end_date)}
                            </p>
                            <p className="text-base text-gray-800">
                              📍 สถานที่: <span className="font-semibold">{project.location || '-'}</span>
                            </p>
                            <p className="text-base text-gray-800">
                              👤 ผู้รับผิดชอบ: <span className="font-semibold">{project.responsible_person || '-'}</span>
                            </p>
                            {project.budget && (
                              <p className="text-base text-gray-800">
                                💰 งบประมาณ: <span className="font-bold text-blue-700">{formatBudget(project.budget)}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-3 ml-4">
                          <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                            project.status === 'เสร็จสิ้น' ? 'bg-green-500 text-white' :
                            project.status === 'กำลังดำเนินการ' ? 'bg-yellow-500 text-white' :
                            project.status === 'ล่าช้า' ? 'bg-red-400 text-white' :
                            project.status === 'ระงับ' ? 'bg-gray-400 text-white' :
                            'bg-gray-300 text-gray-700'
                          }`}>
                            {project.status || 'ไม่ระบุ'}
                          </div>
                          <button
                            className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project);
                            }}
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}