'use client';

import { ChevronDown, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CATEGORY_OPTIONS = [
  'เทคโนโลยี',
  'การศึกษา',
  'สาธารณสุข',
  'เศรษฐกิจ',
  'สังคม',
  'โครงสร้างพื้นฐาน',
  'สิ่งแวดล้อม',
  'การบริหาร',
  'อื่นๆ'
];

export default function StatisticsDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const COLORS = {
    'กำลังดำเนินการ': '#FFBB28', 
    'เสร็จสิ้น': '#00C49F', 
    'ระงับ': '#FF8042', 
  };

  // Fetch projects data
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลโครงการได้');
      }
      
      const data = await response.json();
      setProjects(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts from projects table
  useEffect(() => {
    if (projects.length > 0) {
      // Process status data for pie chart from projects.status column
      const statusCounts = {
        'กำลังดำเนินการ': 0,
        'เสร็จสิ้น': 0,
        'ระงับ': 0,
      };

      // Count projects by status from the projects table
      projects.forEach(project => {
        const status = project.status;
        if (status && statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });

      const statusData = Object.keys(statusCounts)
        .map(status => ({
          name: status,
          value: statusCounts[status],
        }))
        .filter(item => item.value > 0); // Only show statuses that have projects
      
      setPieChartData(statusData);

      // Process category data for bar chart from projects.category column
      const categoryCounts = {};
      
      // Initialize all categories with 0
      CATEGORY_OPTIONS.forEach(category => {
        categoryCounts[category] = 0;
      });

      // Count projects by category from projects table
      projects.forEach(project => {
        const category = project.category;
        if (category && categoryCounts.hasOwnProperty(category)) {
          categoryCounts[category]++;
        } else if (category) {
          // If category exists but not in our predefined list, add to 'อื่นๆ'
          categoryCounts['อื่นๆ']++;
        } else {
          // If no category, also add to 'อื่นๆ'
          categoryCounts['อื่นๆ']++;
        }
      });

      const categoryData = Object.keys(categoryCounts).map(category => ({
        name: category,
        count: categoryCounts[category],
      }));
      
      setBarChartData(categoryData);
    } else {
      // Set empty data if no projects
      setPieChartData([]);
      setBarChartData(CATEGORY_OPTIONS.map(category => ({ name: category, count: 0 })));
    }
  }, [projects]);

  // Fetch data on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  // Calculate total projects and percentages
  const totalProjects = projects.length;
  const getPercentage = (value) => totalProjects > 0 ? ((value / totalProjects) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
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
                <li 
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => navigateTo('/Admin/AddProject')}
                >
                  เพิ่มโครงการ
                </li>
                <li
                  className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer bg-blue-50 border-l-4 border-blue-500"
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
              <h2 className="text-2xl font-bold text-gray-800">สถิติโครงการ</h2>
              <button
                onClick={fetchProjects}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                รีเฟรชข้อมูล
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">กำลังโหลดข้อมูล...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>เกิดข้อผิดพลาด:</strong> {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">โครงการทั้งหมด</h3>
                    <p className="text-2xl font-bold text-blue-900">{totalProjects}</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800">กำลังดำเนินการ</h3>
                    <p className="text-2xl font-bold text-yellow-900">
                      {pieChartData.find(item => item.name === 'กำลังดำเนินการ')?.value || 0}
                    </p>
                    <p className="text-sm text-yellow-700">
                      ({getPercentage(pieChartData.find(item => item.name === 'กำลังดำเนินการ')?.value || 0)}%)
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800">เสร็จสิ้น</h3>
                    <p className="text-2xl font-bold text-green-900">
                      {pieChartData.find(item => item.name === 'เสร็จสิ้น')?.value || 0}
                    </p>
                    <p className="text-sm text-green-700">
                      ({getPercentage(pieChartData.find(item => item.name === 'เสร็จสิ้น')?.value || 0)}%)
                    </p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-800">ระงับ</h3>
                    <p className="text-2xl font-bold text-orange-900">
                      {pieChartData.find(item => item.name === 'ระงับ')?.value || 0}
                    </p>
                    <p className="text-sm text-orange-700">
                      ({getPercentage(pieChartData.find(item => item.name === 'ระงับ')?.value || 0)}%)
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Bar Chart */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">จำนวนโครงการตามหมวดหมู่</h3>
                    {barChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} />
                          <YAxis label={{ value: 'จำนวน', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" name="จำนวนโครงการ" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        ไม่มีข้อมูลโครงการ
                      </div>
                    )}
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">สถานะโครงการ</h3>
                    {pieChartData.length > 0 && totalProjects > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name" 
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        ไม่มีข้อมูลโครงการ
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}