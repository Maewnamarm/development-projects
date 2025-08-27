'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Home, Plus, Save, X, Trash2, Upload } from 'lucide-react';

// Define the type for an activity for better code readability
interface Activity {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  status: 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'ระงับ';
}

interface StatusUpdate {
  id: number;
  activity: string;
  problem: string;
  solution: string;
  date: string;
  updater: string;
  position: string;
}

export default function FollowPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00', status: 'กำลังดำเนินการ' },
    { id: 2, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00', status: 'เสร็จสิ้น' },
    { id: 3, description: 'XXXXXXXXXXXXXXXXXXXXXX', startDate: '00/00/00', endDate: '00/00/00', status: 'ระงับ' }, // Changed 'รอ' to 'ระงับ'
  ]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([
    { id: 1, activity: 'XXXXXXXXXX', problem: 'XXXXXXXXXX', solution: 'XXXXXXXXXX', date: '01/01/69', updater: 'นายพรชัย โคตจัง', position: 'กองคลัง' },
    { id: 2, activity: 'XXXXXXXXXX', problem: 'XXXXXXXXXX', solution: 'XXXXXXXXXX', date: '01/01/69', updater: 'นายพรชัย โคตจัง', position: 'กองคลัง' },
    { id: 3, activity: 'XXXXXXXXXX', problem: 'XXXXXXXXXX', solution: 'XXXXXXXXXX', date: '01/01/69', updater: 'นายพรชัย โคตจัง', position: 'กองคลัง' },
  ]);
  const [updateForm, setUpdateForm] = useState({
    activity: '',
    problem: '',
    solution: '',
    updater: '',
    position: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [receivedBudget, setReceivedBudget] = useState<string>('');
  const [totalExpenses, setTotalExpenses] = useState<string>('');
  const [balance, setBalance] = useState<string>('1,100,000');
  const [progress, setProgress] = useState<number>(0);

  // State for project status dropdown
  const [isProjectStatusDropdownOpen, setIsProjectStatusDropdownOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState('กำลังดำเนินการ');
  
  // State for activity status dropdowns
  const [isActivityStatusDropdownOpen, setIsActivityStatusDropdownOpen] = useState<{ [key: number]: boolean }>({});

  const statusOptions = [
    { status: 'กำลังดำเนินการ', color: 'bg-yellow-200 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
    { status: 'เสร็จสิ้น', color: 'bg-green-200 text-green-800 border-green-300', dot: 'bg-green-500' },
    { status: 'ระงับ', color: 'bg-red-200 text-red-800 border-red-300', dot: 'bg-red-500' }, // Changed 'รอ' to 'ระงับ' with red color
  ];

  // useEffect to recalculate progress whenever activities change
  useEffect(() => {
    calculateProgress();
  }, [activities]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const addActivity = () => {
    const newId = activities.length > 0 ? activities[activities.length - 1].id + 1 : 1;
    setActivities([...activities, { id: newId, description: '', startDate: '', endDate: '', status: 'ระงับ' }]);
  };

  const removeLastActivity = () => {
    if (activities.length > 0) {
      setActivities(activities.slice(0, -1));
    }
  };

  const handleActivityDescriptionChange = (id: number, newDescription: string) => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, description: newDescription } : activity
    ));
  };
  
  const handleActivityDateChange = (id: number, field: 'startDate' | 'endDate', value: string) => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };

  const handleActivityStatusChange = (id: number, newStatus: 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'ระงับ') => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, status: newStatus } : activity
    ));
    setIsActivityStatusDropdownOpen({ ...isActivityStatusDropdownOpen, [id]: false });
  };
  
  const handleProjectStatusSelect = (status: string) => {
    setSelectedProjectStatus(status);
    setIsProjectStatusDropdownOpen(false);
  };

  const calculateProgress = () => {
    const completed = activities.filter(activity => activity.status === 'เสร็จสิ้น').length;
    const total = activities.length;
    const newProgress = total > 0 ? (completed / total) * 100 : 0;
    setProgress(newProgress);
  };

  const handleUpdateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleUpdateFormSubmit = () => {
    const newUpdate: StatusUpdate = {
      id: statusUpdates.length > 0 ? statusUpdates[statusUpdates.length - 1].id + 1 : 1,
      activity: updateForm.activity,
      problem: updateForm.problem,
      solution: updateForm.solution,
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      updater: updateForm.updater,
      position: updateForm.position,
    };
    setStatusUpdates([...statusUpdates, newUpdate]);
    setUpdateForm({
      activity: '',
      problem: '',
      solution: '',
      updater: '',
      position: '',
    });
  };

  const getStatusClasses = (status: string) => {
    return statusOptions.find(opt => opt.status === status)?.color || '';
  };

  const getStatusDotColor = (status: string) => {
    return statusOptions.find(opt => opt.status === status)?.dot || '';
  };

  const handleExpenseChange = (field: 'budget' | 'expenses', value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    const budget = parseFloat(receivedBudget.replace(/,/g, ''));
    const expenses = parseFloat(totalExpenses.replace(/,/g, ''));

    if (field === 'budget') {
      setReceivedBudget(value);
      setBalance(isNaN(numericValue - expenses) ? '0' : (numericValue - expenses).toLocaleString('th-TH'));
    } else {
      setTotalExpenses(value);
      setBalance(isNaN(budget - numericValue) ? '0' : (budget - numericValue).toLocaleString('th-TH'));
    }
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
              <ChevronDown className={`text-gray-600 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} size={18} />
            </div>
            {isMenuOpen && (
              <ul className="space-y-1">
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Site')}>โครงการทั้งหมด</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/AddProject')}>เพิ่มโครงการ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Admin/Statistics')}>สถิติ</li>
                <li className="p-3 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => navigateTo('/Logout')}>ออกจากระบบ</li>
              </ul>
            )}
          </div>
        </aside>
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">ติดตามสถานะโครงการ</h2>
              <div className="flex items-center">
                <label htmlFor="status" className="mr-4 text-gray-700">สถานะ :</label>
                <div
                  className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${getStatusClasses(selectedProjectStatus)}`}
                  onClick={() => setIsProjectStatusDropdownOpen(!isProjectStatusDropdownOpen)}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(selectedProjectStatus)}`}></div>
                  {selectedProjectStatus}
                  <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isProjectStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isProjectStatusDropdownOpen && (
                  <ul className="absolute top-10 right-14 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                    {statusOptions.map((option) => (
                      <li
                        key={option.status}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black"
                        onClick={() => handleProjectStatusSelect(option.status)}
                      >
                        <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                        {option.status}
                      </li>
                    ))}
                  </ul>
                )}
                <button className="bg-gray-500 text-white px-4 py-2 ml-4 rounded-md shadow-sm hover:bg-gray-600">ยกเลิก</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <p><strong>ชื่อโครงการ:</strong> ปลาทูน่าสีน้ำเงิน</p>
              <p><strong>รหัสโครงการ:</strong> BG045-652232332</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">อัปเดตสถานะโครงการ</h3>
              <div className="space-y-2">
                <label className="block text-gray-700">กิจกรรม</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" rows={2} value={updateForm.activity} onChange={(e) => setUpdateForm({ ...updateForm, activity: e.target.value })}></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">ปัญหา</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" rows={2} value={updateForm.problem} onChange={(e) => setUpdateForm({ ...updateForm, problem: e.target.value })}></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">แนวทางการแก้ไข</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" rows={2} value={updateForm.solution} onChange={(e) => setUpdateForm({ ...updateForm, solution: e.target.value })}></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">ผู้บันทึกข้อมูล</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" value={updateForm.updater} onChange={(e) => setUpdateForm({ ...updateForm, updater: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">ตำแหน่ง</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400" value={updateForm.position} onChange={(e) => setUpdateForm({ ...updateForm, position: e.target.value })} />
              </div>
              <div className="space-y-2">
              <label className="block text-gray-700">รูปภาพ</label>
              <div className="space-y-2">
                <input type="file" id="image-upload" className="hidden" multiple onChange={handleUpdateImageUpload} accept="image/*" />
                <label htmlFor="image-upload" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer flex items-center w-fit">
                  <Upload size={18} className="mr-2" /> อัปโหลดรูปภาพ
                </label>
              </div>
            </div>
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600" onClick={handleUpdateFormSubmit}>บันทึก</button>
              </div>
            </div>
            <hr className="my-6 border-gray-200" />
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">ตารางสรุปสถานะ</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลำดับ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">กิจกรรม</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ปัญหา</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แนวทางการแก้ไข</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้บันทึก</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ตำแหน่ง</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statusUpdates.map(update => (
                      <tr key={update.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{update.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{update.activity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{update.problem}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{update.solution}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{update.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{update.updater}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{update.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <hr className="my-6 border-gray-200" />
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">รูปภาพ</h3>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
                    <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs text-center p-2">
                        รูปภาพ {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">กิจกรรม</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลำดับ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายละเอียดขั้นตอน/วิธีดำเนินการ</th>
                    <th scope="col" className="px-24 py-3 text-left text-xs font-medium text-gray-500 uppercase">ระยะเวลาดำเนินการ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.id}</td>
                      <td className="w-full px-6 py-4 text-sm text-gray-900">
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={activity.description}
                          rows={2}
                          onChange={(e) => handleActivityDescriptionChange(activity.id, e.target.value)}
                        />
                      </td>
                      <td className="px-24 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="เริ่มต้น" defaultValue={activity.startDate} onChange={(e) => handleActivityDateChange(activity.id, 'startDate', e.target.value)} />
                          <input type="text" className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" placeholder="สิ้นสุด" defaultValue={activity.endDate} onChange={(e) => handleActivityDateChange(activity.id, 'endDate', e.target.value)} />
                        </div>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                        <div
                          className={`flex items-center px-4 py-2 rounded-full border cursor-pointer ${getStatusClasses(activity.status)}`}
                          onClick={() => setIsActivityStatusDropdownOpen({ ...isActivityStatusDropdownOpen, [activity.id]: !isActivityStatusDropdownOpen[activity.id] })}
                        >
                          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(activity.status)}`}></div>
                          {activity.status}
                          <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${isActivityStatusDropdownOpen[activity.id] ? 'rotate-180' : ''}`} />
                        </div>
                        {isActivityStatusDropdownOpen[activity.id] && (
                          <ul className="absolute top-full mt-2 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            {statusOptions.map((option) => (
                              <li
                                key={option.status}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-black"
                                onClick={() => handleActivityStatusChange(activity.id, option.status as 'เสร็จสิ้น' | 'กำลังดำเนินการ' | 'ระงับ')}
                              >
                                <div className={`w-3 h-3 rounded-full mr-2 ${option.dot}`}></div>
                                {option.status}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button
                  onClick={addActivity}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center justify-center font-semibold"
                >
                  <Plus size={20} className="mr-2" />
                  เพิ่มกิจกรรม
                </button>
                <button
                  onClick={removeLastActivity}
                  className="bg-red-400 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-500 flex items-center justify-center font-semibold"
                >
                  <Trash2 size={20} className="mr-2" />
                  ลบกิจกรรมล่าสุด
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">ความสำเร็จ</span>
                <div className="w-48 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-800">{progress.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">สรุปรายการค่าใช้จ่าย</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-48 text-gray-700">งบประมาณที่ได้รับ</label>
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={receivedBudget}
                    onChange={(e) => handleExpenseChange('budget', e.target.value)}
                  />
                  <span className="ml-2 text-gray-600">บาท</span>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-48 text-gray-700">งบประมาณที่ใช้ไป</label>
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={totalExpenses}
                    onChange={(e) => handleExpenseChange('expenses', e.target.value)}
                  />
                  <span className="ml-2 text-gray-600">บาท</span>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-48 text-gray-700">งบประมาณที่เหลือ</label>
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                    value={balance}
                    readOnly
                  />
                  <span className="ml-2 text-gray-600">บาท</span>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ข้อมูลโครงการจากเอกสาร</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-1">-----------</h3>
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}