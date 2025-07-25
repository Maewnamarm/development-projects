'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Home } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useRouter } from 'next/navigation';



const allProjects = [
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
  {
    id: 6,
    title: 'โครงการปรับปรุงภูมิทัศน์',
    status: 'กำลังดำเนินการ',
    statusColor: 'bg-yellow-400',
    lastUpdated: 'แก้ไขล่าสุด 16/07/2568 เวลา 09:00 นาที',
  },
  {
    id: 7,
    title: 'โครงการสร้างอาคารเอนกประสงค์',
    status: 'เสร็จสิ้น',
    statusColor: 'bg-green-500',
    lastUpdated: 'แก้ไขล่าสุด 13/07/2568 เวลา 11:00 นาที',
  },
  {
    id: 8,
    title: 'โครงการพัฒนาแหล่งน้ำ',
    status: 'กำลังดำเนินการ',
    statusColor: 'bg-yellow-400',
    lastUpdated: 'แก้ไขล่าสุด 17/07/2568 เวลา 14:00 นาที',
  },
];


const barChartData = [
  { name: 'เทคโนโลยี', count: 2 },
  { name: 'การศึกษา', count: 5 },
  { name: 'สาธารณสุข', count: 6 },
  { name: 'เศรษฐกิจ', count: 3 },
  { name: 'สังคม', count: 7 },
  { name: 'โครงสร้างพื้นฐาน', count: 6 },
  { name: 'สิ่งแวดล้อม', count: 2 },
  { name: 'การบริหาร', count: 1 },
  { name: 'อื่นๆ', count: 1 },
  { name: 'หมวดหมู่', count: 0 }, 
];

export default function StatisticsDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);

  const router = useRouter();

  const COLORS = {
    'กำลังดำเนินการ': '#FFBB28', 
    'เสร็จสิ้น': '#00C49F', 
    'ระงับ': '#8884d8', 
  };

  useEffect(() => {
    const statusCounts: { [key: string]: number } = {
      'กำลังดำเนินการ': 0,
      'เสร็จสิ้น': 0,
      'ระงับ': 0,
    };

    allProjects.forEach(project => {
      if (statusCounts.hasOwnProperty(project.status)) {
        statusCounts[project.status]++;
      }
    });

    const data = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
    }));
    setPieChartData(data);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
              <h2 className="text-2xl font-bold text-gray-800">สถิติ</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">จำนวนโครงการตามหมวดหมู่</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: 'จำนวน', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="จำนวนโครงการ" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">สถานะโครงการ</h3>
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
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
