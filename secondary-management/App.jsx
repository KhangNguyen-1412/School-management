import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { User, BookUser, Banknote, LayoutDashboard, Plus, X, Edit, Trash2, Search, AlertCircle, LogOut, FileUp, Users, ShieldCheck, CreditCard, Landmark, Home, UserCheck, Library, Briefcase, Calendar, Star, Users2, ChevronDown, Moon, Sun } from 'lucide-react';

// === Dữ liệu khởi tạo (Trong ứng dụng thực tế sẽ là CSDL) ===
const initialLecturers = [
    { id: 1, name: 'Trần Thị A', title: 'TS.', gender: 'Nữ', dob: '1985-10-20', phone: '0912345678', facultyId: 1, role: 'head_of_department' },
    { id: 2, name: 'Lê Văn B', title: 'ThS.', gender: 'Nam', dob: '1980-05-15', phone: '0987654321', facultyId: 2, role: 'lecturer' },
    { id: 3, name: 'Nguyễn Thị C', title: 'PGS.TS.', gender: 'Nữ', dob: '1990-01-01', phone: '0905556677', facultyId: 1, role: 'lecturer' },
];
const initialFaculties = [
    { id: 1, name: 'Khoa Công nghệ thông tin' },
    { id: 2, name: 'Khoa Quản trị kinh doanh' }
];
const initialCourses = [
    { id: 1, name: 'Lập trình Web', code: 'IT4420', credits: 3, facultyId: 1 },
    { id: 2, name: 'Cơ sở dữ liệu', code: 'IT3080', credits: 3, facultyId: 1 },
    { id: 3, name: 'Marketing căn bản', code: 'MK1010', credits: 2, facultyId: 2 },
    { id: 4, name: 'Quản trị nhân sự', code: 'HR2020', credits: 2, facultyId: 2 },
];
const initialClassSections = [ // Lớp tín chỉ
    { id: 1, name: 'Lập trình Web - Nhóm 1', courseId: 1, lecturerId: 3, semester: '2024.1' },
    { id: 2, name: 'Marketing căn bản - CLC', courseId: 3, lecturerId: 2, semester: '2024.1' },
    { id: 3, name: 'Cơ sở dữ liệu - Nhóm 2', courseId: 2, lecturerId: 1, semester: '2024.1' },
];
const initialSchedules = [ // Lịch học
    { id: 1, lecturerId: 1, classSectionId: 3, day: 'Thứ 2', period: 1 },
    { id: 2, lecturerId: 1, classSectionId: 3, day: 'Thứ 2', period: 2 },
    { id: 3, lecturerId: 2, classSectionId: 2, day: 'Thứ 3', period: 3 },
    { id: 4, lecturerId: 3, classSectionId: 1, day: 'Thứ 5', period: 4 },
];
const initialUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'sinhvien_an', password: 'password', role: 'student', studentId: 1 },
    { id: 3, username: 'gv_a', password: 'password', role: 'lecturer', lecturerId: 1 },
    { id: 4, username: 'gv_c', password: 'password', role: 'lecturer', lecturerId: 3 },
];
const initialStudents = [
    { id: 1, name: 'Nguyễn Văn An', studentCode: '20221234', gender: 'Nam', dob: '2004-05-15', major: 'Kỹ thuật phần mềm', address: '123 Đường ABC, Quận 1', email: 'an.nv20221234@university.edu.vn', phone: '0901234567' },
    { id: 2, name: 'Trần Thị Bình', studentCode: '20225678', gender: 'Nữ', dob: '2004-09-22', major: 'Marketing', address: '456 Đường XYZ, Quận 3', email: 'binh.tt20225678@university.edu.vn', phone: '0912345678' },
    { id: 3, name: 'Lê Hoàng Cường', studentCode: '20239012', gender: 'Nam', dob: '2005-02-10', major: 'Kỹ thuật máy tính', address: '789 Đường LMN, Quận 10', email: 'cuong.lh20239012@university.edu.vn', phone: '0987654321' },
];
// Enrollment: Mảng liên kết sinh viên với lớp tín chỉ
const initialEnrollments = [
    { studentId: 1, classSectionId: 1 },
    { studentId: 1, classSectionId: 3 },
    { studentId: 2, classSectionId: 2 },
    { studentId: 3, classSectionId: 1 },
];
// Grades: Cấu trúc điểm linh hoạt hơn
const initialGrades = [
    { id: 1, studentId: 1, courseId: 1, components: { 'Chuyên cần': 9, 'Giữa kỳ': 8.5 }, final: 9.5, weights: { 'Chuyên cần': 0.1, 'Giữa kỳ': 0.3, 'final': 0.6 } },
    { id: 2, studentId: 1, courseId: 2, components: { 'Chuyên cần': 8, 'Giữa kỳ': 7.5 }, final: 8, weights: { 'Chuyên cần': 0.2, 'Giữa kỳ': 0.3, 'final': 0.5 } },
];
const initialFees = [
    { id: 1, studentId: 1, feeName: 'Học phí Kỳ 2024.1', amount: 15000000, status: 'Chưa thanh toán', dueDate: '2024-08-30' }
];
const lecturerRoles = { dean: 'Trưởng khoa', vice_dean: 'Phó Khoa', head_of_department: 'Trưởng bộ môn', lecturer: 'Giảng viên' };

// === Theme Context for Dark/Light Mode ===
const ThemeContext = createContext(null);
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
const useTheme = () => useContext(ThemeContext);
const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();
    if (!theme) return null;
    return (
        <button onClick={toggleTheme} title="Đổi giao diện" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>
    );
};

// === Main App Component ===
function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userFromSession = sessionStorage.getItem('currentUser');
    if (userFromSession) {
      setCurrentUser(JSON.parse(userFromSession));
    }
    setLoading(false);
  }, []);

  const handleLogin = (username, password) => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || initialUsers;
    const allLecturers = JSON.parse(localStorage.getItem('lecturers')) || initialLecturers;

    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
      let userData = { ...user };
      if(user.role === 'lecturer' && user.lecturerId) {
          const lecturerInfo = allLecturers.find(t => t.id === user.lecturerId);
          userData = { ...userData, ...lecturerInfo };
      }
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Đang tải...</div>;
  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  
  const roleComponent = {
      admin: <AdminApplication currentUser={currentUser} onLogout={handleLogout} />,
      student: <StudentPortalApplication currentUser={currentUser} onLogout={handleLogout} />,
      lecturer: <LecturerApplication currentUser={currentUser} onLogout={handleLogout} />,
  };
  return roleComponent[currentUser.role] || <LoginScreen onLogin={handleLogin}/>;
}

// === Login Screen ===
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); const success = await onLogin(username, password); if (!success) setError('Tên đăng nhập hoặc mật khẩu không đúng.'); };
  return ( <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"><h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Cổng Thông Tin Đại Học</h2><form onSubmit={handleSubmit} className="space-y-6"><div><label className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Tên đăng nhập</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" required /></div><div><label className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Mật khẩu</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" required /></div>{error && <p className="text-red-500 text-sm text-center">{error}</p>}<div><button type="submit" className="w-full py-3 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Đăng nhập</button></div><div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-600"><p className="font-semibold mb-2">Tài khoản mẫu:</p><p><span className="font-medium">Admin:</span> admin / admin123</p><p><span className="font-medium">Giảng viên (Trưởng BM):</span> gv_a / password</p><p><span className="font-medium">Sinh viên:</span> sinhvien_an / password</p></div></form></div></div> );
};

// === Admin Application ===
const AdminApplication = ({ currentUser, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('students')) || initialStudents);
  const [grades, setGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || initialGrades);
  const [fees, setFees] = useState(() => JSON.parse(localStorage.getItem('fees')) || initialFees);
  const [lecturers, setLecturers] = useState(() => JSON.parse(localStorage.getItem('lecturers')) || initialLecturers);
  const [classSections, setClassSections] = useState(() => JSON.parse(localStorage.getItem('classSections')) || initialClassSections);
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem('courses')) || initialCourses);
  const [faculties, setFaculties] = useState(() => JSON.parse(localStorage.getItem('faculties')) || initialFaculties);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || initialUsers);
  const [schedules, setSchedules] = useState(() => JSON.parse(localStorage.getItem('schedules')) || initialSchedules);
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem('enrollments')) || initialEnrollments);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const data = { students, grades, fees, lecturers, classSections, courses, faculties, users, schedules, enrollments };
    for (const key in data) { localStorage.setItem(key, JSON.stringify(data[key])); }
  }, [students, grades, fees, lecturers, classSections, courses, faculties, users, schedules, enrollments]);

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });
  const handleDelete = (action) => { setConfirmAction(() => action); setIsConfirmModalOpen(true); };
  const handleCloseConfirmModal = () => { setIsConfirmModalOpen(false); setConfirmAction(null); };

  const handleSave = (type, data) => {
    const saveData = (state, setState) => { if (data.id) { setState(state.map(item => item.id === data.id ? data : item)); } else { const newId = state.length > 0 ? Math.max(...state.map(i => i.id)) + 1 : 1; setState([...state, { ...data, id: newId }]); } };
    const map = { student: [students, setStudents], lecturer: [lecturers, setLecturers], classSection: [classSections, setClassSections], user: [users, setUsers], schedule: [schedules, setSchedules], course: [courses, setCourses] };
    if (map[type]) saveData(...map[type]);
    closeModal();
  };
  
  const handleSaveFaculty = (facultyData, newCourses) => {
      let savedFaculty = facultyData;
      if(facultyData.id) { setFaculties(faculties.map(d => d.id === facultyData.id ? facultyData : d)); } else { const newId = faculties.length > 0 ? Math.max(...faculties.map(i => i.id)) + 1 : 1; savedFaculty = { ...facultyData, id: newId }; setFaculties([...faculties, savedFaculty]); }
      const otherCourses = courses.filter(s => s.facultyId !== savedFaculty.id);
      const updatedCourses = newCourses.map((sub, index) => { if(typeof sub.id === 'number') return {...sub, facultyId: savedFaculty.id }; const newCourseId = (courses.length > 0 ? Math.max(...courses.map(s => s.id).filter(id => typeof id === 'number')) : 0) + Date.now() + index; return { ...sub, id: newCourseId, facultyId: savedFaculty.id }; });
      setCourses([...otherCourses, ...updatedCourses]);
      closeModal();
  }

  const renderView = () => {
    const views = {
        dashboard: <DashboardView studentCount={students.length} lecturerCount={lecturers.length} courseCount={courses.length} />,
        profiles: <StudentProfileView allStudents={students} onAdd={(data) => openModal('student', data)} onEdit={(s) => openModal('student', s)} onDelete={(id) => handleDelete(() => { setStudents(students.filter(s => s.id !== id)); handleCloseConfirmModal(); })} />,
        grades: <GradeManagementView students={students} grades={grades} setGrades={setGrades} classSections={classSections} courses={courses} />,
        fees: <FeeManagementView allStudents={students} fees={fees} setFees={setFees} />,
        users: <UserManagementView users={users} onAdd={() => openModal('user')} onEdit={(user) => openModal('user', user)} onDelete={(id) => handleDelete(() => { if (id === 1) return alert("Không thể xóa Admin gốc."); setUsers(users.filter(u => u.id !== id)); handleCloseConfirmModal(); })} />,
        lecturers: <LecturerManagementView allLecturers={lecturers} faculties={faculties} onAdd={() => openModal('lecturer')} onEdit={(t) => openModal('lecturer', t)} onDelete={(id) => handleDelete(() => { setLecturers(lecturers.filter(t => t.id !== id)); handleCloseConfirmModal(); })} />,
        classSections: <ClassSectionManagementView classSections={classSections} lecturers={lecturers} enrollments={enrollments} courses={courses} onAdd={() => openModal('classSection')} onEdit={(c) => openModal('classSection', c)} onDelete={(id) => handleDelete(() => { setClassSections(classSections.filter(c => c.id !== id)); handleCloseConfirmModal(); })} />,
        faculties: <FacultyManagementView faculties={faculties} courses={courses} lecturers={lecturers} onAddDept={() => openModal('faculty')} onEditDept={(d) => openModal('faculty', d)} onDeleteDept={(id) => handleDelete(() => { setFaculties(faculties.filter(d => d.id !== id)); handleCloseConfirmModal(); })} />,
        courses: <CourseManagementView courses={courses} faculties={faculties} onAdd={() => openModal('course')} onEdit={(c) => openModal('course', c)} onDelete={(id) => handleDelete(() => { setCourses(courses.filter(c => c.id !== id)); handleCloseConfirmModal(); })} />,
        schedules: <ScheduleManagementView schedules={schedules} setSchedules={setSchedules} lecturers={lecturers} classSections={classSections} courses={courses} />
    };
    return views[currentView] || views.dashboard;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <SidebarAdmin currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto"><HeaderAdmin currentUser={currentUser} onLogout={onLogout} /><div className="space-y-6">{renderView()}</div></main>
      {modal.type === 'student' && <StudentFormModal student={modal.data} onSave={(d) => handleSave('student', d)} onClose={closeModal} />}
      {modal.type === 'lecturer' && <LecturerFormModal lecturer={modal.data} faculties={faculties} onSave={(d) => handleSave('lecturer', d)} onClose={closeModal} />}
      {modal.type === 'classSection' && <ClassSectionFormModal classSectionData={modal.data} lecturers={lecturers} courses={courses} onSave={(d) => handleSave('classSection', d)} onClose={closeModal} />}
      {modal.type === 'faculty' && <FacultyFormModal faculty={modal.data} allCourses={courses} onSave={handleSaveFaculty} onClose={closeModal} />}
      {modal.type === 'course' && <CourseFormModal courseData={modal.data} faculties={faculties} onSave={(d) => handleSave('course', d)} onClose={closeModal} />}
      {modal.type === 'user' && <UserFormModal user={modal.data} students={students} lecturers={lecturers} users={users} onSave={(d) => handleSave('user', d)} onClose={closeModal} />}
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal} onConfirm={confirmAction} title="Xác nhận Xóa" message="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác." />
    </div>
  );
};

const StudentPortalApplication = ({ currentUser, onLogout }) => {
  const [currentView, setCurrentView] = useState('grades');
  const [fees, setFees] = useState(() => JSON.parse(localStorage.getItem('fees')) || initialFees);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingFee, setPayingFee] = useState(null);

  const allStudents = JSON.parse(localStorage.getItem('students')) || [];
  const allGrades = JSON.parse(localStorage.getItem('grades')) || [];
  const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
  const myStudent = useMemo(() => allStudents.find(s => s.id === currentUser.studentId), [allStudents, currentUser.studentId]);
  const myGrades = useMemo(() => allGrades.filter(g => g.studentId === currentUser.studentId), [allGrades, currentUser.studentId]);
  const myFees = useMemo(() => fees.filter(f => f.studentId === currentUser.studentId), [fees, currentUser.studentId]);
  
  useEffect(() => { localStorage.setItem('fees', JSON.stringify(fees)); }, [fees]);

  const handleOpenPaymentModal = (fee) => { setPayingFee(fee); setIsPaymentModalOpen(true); };
  const handleClosePaymentModal = () => { setIsPaymentModalOpen(false); setPayingFee(null); };
  const handleConfirmPayment = () => { setFees(prevFees => prevFees.map(fee => fee.id === payingFee.id ? { ...fee, status: 'Đã thanh toán' } : fee)); handleClosePaymentModal(); alert(`Đã xác nhận thanh toán cho khoản "${payingFee.feeName}".`); };
  
  const renderView = () => {
    if (!myStudent) { return <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">Không tìm thấy thông tin sinh viên.</div> }
    switch (currentView) {
      case 'grades': return <StudentGradeView grades={myGrades} courses={allCourses} />;
      case 'fees': return <StudentFeeView fees={myFees} onPay={handleOpenPaymentModal} />;
      default: return <StudentGradeView grades={myGrades} courses={allCourses} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <SidebarStudent currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <HeaderStudent currentUser={currentUser} studentName={myStudent?.name} onLogout={onLogout} />
        {renderView()}
      </main>
      {isPaymentModalOpen && <PaymentModal fee={payingFee} onClose={handleClosePaymentModal} onConfirm={handleConfirmPayment} />}
    </div>
  );
};


const LecturerApplication = ({ currentUser, onLogout }) => {
    const [currentView, setCurrentView] = useState('grades');
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];
    const [allGrades, setAllGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || initialGrades);
    const allClassSections = JSON.parse(localStorage.getItem('classSections')) || [];
    const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const allSchedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const allLecturers = JSON.parse(localStorage.getItem('lecturers')) || [];
    
    const allDerivedSchedules = useMemo(() => allSchedules.map(a => { 
        const classSection = allClassSections.find(c => c.id === a.classSectionId); 
        const course = allCourses.find(s => s.id === classSection?.courseId); 
        return { id: a.id, lecturerId: a.lecturerId, day: a.day, period: a.period, className: classSection?.name || '---', courseName: course?.name || '---' }; 
    }), [allSchedules, allClassSections, allCourses]);
    
    const myClassSections = useMemo(() => allClassSections.filter(cs => cs.lecturerId === currentUser.id), [allClassSections, currentUser.id]);
    const mySchedule = useMemo(() => allDerivedSchedules.filter(s => s.lecturerId === currentUser.id), [allDerivedSchedules, currentUser.id]);
    const myDepartmentMembers = useMemo(() => { if (currentUser.role !== 'head_of_department') return []; return allLecturers.filter(t => t.facultyId === currentUser.facultyId); }, [allLecturers, currentUser]);
    
    useEffect(() => { localStorage.setItem('grades', JSON.stringify(allGrades)); }, [allGrades]);

    const renderView = () => {
        const views = {
            grades: <GradeManagementView students={allStudents} grades={allGrades} setGrades={setAllGrades} classSections={myClassSections} courses={allCourses} />,
            schedule: <ScheduleView schedule={mySchedule} title="Thời khóa biểu cá nhân" />,
            department: currentUser.role === 'head_of_department' ? <DepartmentScheduleView lecturers={myDepartmentMembers} schedules={allDerivedSchedules} /> : null
        };
        return views[currentView] || views.grades;
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <SidebarLecturer currentUser={currentUser} currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <HeaderAdmin currentUser={currentUser} onLogout={onLogout} />
                {renderView()}
            </main>
        </div>
    );
};


// === Reusable & General Components ===
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 text-center"><div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"><AlertCircle className="h-6 w-6 text-red-600" /></div><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">{title}</h3><div className="mt-2"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div><div className="mt-5 flex justify-center gap-4"><button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Hủy</button><button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 font-medium text-white hover:bg-red-700">Xác nhận</button></div></div></div> ); };
const DashboardView = ({ studentCount, lecturerCount, courseCount }) => ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-blue-500"><div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full"><Users className="text-blue-500 dark:text-blue-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Sinh viên</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{studentCount}</p></div></div> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-green-500"><div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full"><UserCheck className="text-green-500 dark:text-green-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Giảng viên</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{lecturerCount}</p></div></div> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-yellow-500"><div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full"><Library className="text-yellow-500 dark:text-yellow-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Học phần</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{courseCount}</p></div></div> </div> );
const FormModal = ({ title, onClose, onSubmit, children }) => ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h3><button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} /></button></div><form onSubmit={onSubmit} className="space-y-4">{children}<div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button><button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow">Lưu</button></div></form></div></div> );
const FormInput = ({ label, name, value, onChange, required = false, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><input name={name} value={value} onChange={onChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required={required} {...props} /></div>);
const FormSelect = ({ label, name, value, onChange, children, required = false }) => (<div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required={required}>{children}</select></div>);
const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => ( <div className="relative"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /> <input type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200" /> </div> );

// === Admin Components ===
const SidebarAdmin = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard }, { id: 'faculties', label: 'Quản lý Khoa', icon: Library }, { id: 'lecturers', label: 'Quản lý Giảng viên', icon: UserCheck }, { id: 'courses', label: 'Quản lý Học phần', icon: BookUser }, { id: 'classSections', label: 'Quản lý Lớp tín chỉ', icon: Home }, { id: 'schedules', label: 'Xếp lịch học', icon: Briefcase }, { id: 'profiles', label: 'Quản lý Sinh viên', icon: Users }, { id: 'grades', label: 'Quản lý Điểm số', icon: Star }, { id: 'fees', label: 'Quản lý Học phí', icon: Banknote }, { id: 'users', label: 'Quản lý Tài khoản', icon: ShieldCheck }, ]; return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">QLĐT</span><span className="hidden lg:inline">Quản Lý Đào Tạo</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderAdmin = ({ currentUser, onLogout }) => ( <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center"> <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Hệ thống Quản lý Đại học</h2> <div className="flex items-center gap-3"><ThemeToggleButton /><span className="text-gray-600 dark:text-gray-300 hidden md:inline">Chào, <span className="font-bold">{currentUser.name || 'Admin'}</span></span><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full"><LogOut size={22} /></button></div></header>);
const FacultyManagementView = ({ faculties, courses, lecturers, onAddDept, onEditDept, onDeleteDept }) => { const [selectedFacultyId, setSelectedFacultyId] = useState(faculties.length > 0 ? faculties[0].id : null); const facultyLecturers = useMemo(() => lecturers.filter(t => t.facultyId === selectedFacultyId), [lecturers, selectedFacultyId]); const facultyCourses = useMemo(() => courses.filter(s => s.facultyId === selectedFacultyId), [courses, selectedFacultyId]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <div> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Khoa</h3> <button onClick={onAddDept} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">Thêm Khoa</button> </div> <ul className="space-y-2">{faculties.map(dept => (<li key={dept.id} onClick={() => setSelectedFacultyId(dept.id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 ${selectedFacultyId === dept.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}><span className="font-medium">{dept.name}</span><div className="space-x-2"><button onClick={(e) => { e.stopPropagation(); onEditDept(dept); }} className="p-1 text-blue-600"><Edit size={16}/></button><button onClick={(e) => { e.stopPropagation(); onDeleteDept(dept.id);}} className="p-1 text-red-600"><Trash2 size={16}/></button></div></li>))}</ul> </div> <div> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Thông tin Khoa: {faculties.find(d=>d.id === selectedFacultyId)?.name}</h3> {selectedFacultyId ? ( <div className="space-y-6"> <div> <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Các học phần</h4> <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">{facultyCourses.map(sub => <li key={sub.id}>{sub.name} ({sub.code})</li>)}</ul> </div> <div> <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Giảng viên trong Khoa</h4> <ul className="space-y-2">{facultyLecturers.map(lecturer => { return ( <li key={lecturer.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"> <div className="text-gray-800 dark:text-gray-200"> <p className="font-medium">{`${lecturer.title} ${lecturer.name}`}</p> </div> </li> )})}</ul> </div> </div> ) : <p className="text-gray-500 dark:text-gray-400">Chọn một khoa để xem chi tiết.</p>} </div> </div> </div> ); };
const FacultyFormModal = ({ faculty, allCourses, onSave, onClose }) => { const [name, setName] = useState(faculty?.name || ''); const [courses, setCourses] = useState(() => allCourses.filter(s => s.facultyId === faculty?.id)); const [newCourse, setNewCourse] = useState({name: '', code: '', credits: 3}); const handleAddCourse = () => { if(newCourse.name.trim() === '' || newCourse.code.trim() === '') return; setCourses([...courses, { id: `new-${Date.now()}`, ...newCourse }]); setNewCourse({name: '', code: '', credits: 3}); }; const handleRemoveCourse = (courseId) => setCourses(courses.filter(s => s.id !== courseId)); const handleSubmit = (e) => { e.preventDefault(); onSave({ ...faculty, name }, courses); }; return ( <FormModal title={faculty ? 'Sửa thông tin Khoa' : 'Thêm Khoa mới'} onClose={onClose} onSubmit={handleSubmit}> <FormInput label="Tên Khoa" name="name" value={name} onChange={e => setName(e.target.value)} required /> <div> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Các học phần</label> <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md"> {courses.map(sub => ( <div key={sub.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200"> <span>{sub.name} ({sub.code})</span> <button type="button" onClick={() => handleRemoveCourse(sub.id)} className="p-1 text-red-500 hover:text-red-700"> <X size={16}/> </button> </div> ))} </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2"> <input type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} placeholder="Tên học phần" className="sm:col-span-2 border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"/> <input type="text" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} placeholder="Mã HP" className="border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"/> <button type="button" onClick={handleAddCourse} className="sm:col-span-3 bg-green-500 text-white px-4 py-2 rounded-lg">Thêm học phần</button> </div> </div> </FormModal> ); };
const LecturerManagementView = ({ allLecturers, faculties, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredLecturers = useMemo(() => allLecturers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())), [allLecturers, searchTerm]); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Quản lý Giảng viên</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm giảng viên..." /><button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm</button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">Giới tính</th><th className="p-4 font-semibold">Chức vụ</th><th className="p-4 font-semibold">Khoa</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredLecturers.map(t => { const faculty = faculties.find(d => d.id === t.facultyId); return (<tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{`${t.title || ''} ${t.name}`}</td><td className="p-4">{t.gender}</td><td className="p-4">{lecturerRoles[t.role] || t.role}</td><td className="p-4">{faculty?.name || 'Chưa có'}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(t)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(t.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>)})}</tbody></table></div></div>);};
const LecturerFormModal = ({ lecturer, faculties, onSave, onClose }) => { const [formData, setFormData] = useState({ name: lecturer?.name || '', title: lecturer?.title || 'ThS.', gender: lecturer?.gender || 'Nam', dob: lecturer?.dob || '', phone: lecturer?.phone || '', facultyId: lecturer?.facultyId || '', role: lecturer?.role || 'lecturer' }); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...lecturer, ...formData, facultyId: parseInt(formData.facultyId) }); }; return (<FormModal title={ lecturer ? 'Sửa thông tin Giảng viên' : 'Thêm Giảng viên' } onClose={onClose} onSubmit={handleSubmit}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Học vị" name="title" value={formData.title} onChange={handleChange} placeholder="VD: TS., ThS., PGS.TS."/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required /><FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></FormSelect><FormSelect label="Khoa" name="facultyId" value={formData.facultyId} onChange={handleChange}><option value="">Chọn khoa</option>{faculties.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</FormSelect></div><FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}>{Object.entries(lecturerRoles).map(([roleKey, roleName]) => ( <option key={roleKey} value={roleKey}>{roleName}</option> ))}</FormSelect></FormModal>); };
const CourseManagementView = ({ courses, faculties, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredCourses = useMemo(() => courses.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase())), [courses, searchTerm]); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Quản lý Học phần</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm học phần..." /><button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm</button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Mã học phần</th><th className="p-4 font-semibold">Tên học phần</th><th className="p-4 font-semibold text-center">Số tín chỉ</th><th className="p-4 font-semibold">Khoa</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredCourses.map(c => { const faculty = faculties.find(f => f.id === c.facultyId); return (<tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{c.code}</td><td className="p-4">{c.name}</td><td className="p-4 text-center">{c.credits}</td><td className="p-4">{faculty?.name || '---'}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(c)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(c.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>)})}</tbody></table></div></div>);};
const CourseFormModal = ({ courseData, faculties, onSave, onClose }) => { const [formData, setFormData] = useState({ name: courseData?.name || '', code: courseData?.code || '', credits: courseData?.credits || 3, facultyId: courseData?.facultyId || '' }); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...courseData, ...formData, credits: parseInt(formData.credits), facultyId: parseInt(formData.facultyId) }); }; return (<FormModal title={courseData ? 'Sửa Học phần' : 'Thêm Học phần'} onClose={onClose} onSubmit={handleSubmit}><FormInput label="Tên học phần" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Mã học phần" name="code" value={formData.code} onChange={handleChange} required /><FormInput label="Số tín chỉ" name="credits" type="number" value={formData.credits} onChange={handleChange} required /><FormSelect label="Khoa" name="facultyId" value={formData.facultyId} onChange={handleChange} required><option value="">Chọn khoa</option>{faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</FormSelect></FormModal>);};
const ClassSectionManagementView = ({ classSections, lecturers, enrollments, courses, onAdd, onEdit, onDelete }) => ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Lớp tín chỉ</h3><button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm Lớp</button></div> <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên lớp tín chỉ</th><th className="p-4 font-semibold">Học phần</th><th className="p-4 font-semibold">Giảng viên</th><th className="p-4 font-semibold">Sĩ số</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{classSections.map(c => { const lecturer = lecturers.find(t => t.id === c.lecturerId); const course = courses.find(cr => cr.id === c.courseId); const enrolledStudentsCount = enrollments.filter(e => e.classSectionId === c.id).length; return (<tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{c.name}</td><td className="p-4">{course ? `${course.name} (${course.code})` : '---'}</td><td className="p-4">{lecturer ? `${lecturer.title} ${lecturer.name}` : 'Chưa phân công'}</td><td className="p-4">{enrolledStudentsCount}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(c)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(c.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>);})}</tbody></table></div> </div> );
const ClassSectionFormModal = ({ classSectionData, lecturers, courses, onSave, onClose }) => { const [formData, setFormData] = useState({ name: classSectionData?.name || '', lecturerId: classSectionData?.lecturerId || '', courseId: classSectionData?.courseId || '', semester: classSectionData?.semester || '2024.1'}); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...classSectionData, ...formData, lecturerId: parseInt(formData.lecturerId), courseId: parseInt(formData.courseId) }); }; return (<FormModal title={classSectionData ? 'Sửa thông tin Lớp tín chỉ' : 'Thêm Lớp tín chỉ'} onClose={onClose} onSubmit={handleSubmit}><FormInput label="Tên lớp tín chỉ" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Học kỳ" name="semester" value={formData.semester} onChange={handleChange} placeholder="VD: 2024.1" required /><FormSelect label="Học phần" name="courseId" value={formData.courseId} onChange={handleChange} required><option value="">Chọn học phần</option>{courses.map(c => <option key={c.id} value={c.id}>{`${c.name} (${c.code})`}</option>)}</FormSelect><FormSelect label="Giảng viên" name="lecturerId" value={formData.lecturerId} onChange={handleChange}><option value="">Chọn giảng viên</option>{lecturers.map(t => <option key={t.id} value={t.id}>{`${t.title} ${t.name}`}</option>)}</FormSelect></FormModal>); };
const StudentProfileView = ({ allStudents, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = useMemo(() => { return allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentCode.includes(searchTerm)); }, [allStudents, searchTerm]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4 flex-wrap gap-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Hồ sơ Sinh viên</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"> <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm theo tên hoặc MSSV..." /> <button onClick={() => onAdd()} className="bg-blue-500 text-white px-4 py-2 rounded-lg shrink-0">Thêm SV</button> </div> </div> <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">MSSV</th><th className="p-4 font-semibold">Ngày sinh</th><th className="p-4 font-semibold">Ngành học</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredStudents.map(s => (<tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{s.name}</td><td className="p-4">{s.studentCode}</td><td className="p-4">{s.dob}</td><td className="p-4">{s.major}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(s)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(s.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div> </div> ); };
const StudentFormModal = ({ student, onSave, onClose }) => { const [formData, setFormData] = useState({ name: student?.name || '', studentCode: student?.studentCode || '', dob: student?.dob || '', gender: student?.gender || 'Nam', address: student?.address || '', major: student?.major || '', email: student?.email || '', phone: student?.phone || '' }); const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value })); const handleSubmit = (e) => { e.preventDefault(); onSave({ ...student, ...formData }); }; return ( <FormModal title={student?.id ? 'Sửa Hồ sơ Sinh viên' : 'Thêm Sinh viên mới'} onClose={onClose} onSubmit={handleSubmit}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Mã số sinh viên" name="studentCode" value={formData.studentCode} onChange={handleChange} required /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></FormSelect><FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required /></div><FormInput label="Ngành học" name="major" value={formData.major} onChange={handleChange} /><FormInput label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} /><FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} /></div></FormModal> ); };
const GradeManagementView = ({ students, grades, setGrades, classSections, courses }) => {
    const [selectedClassSectionId, setSelectedClassSectionId] = useState(classSections.length > 0 ? classSections[0].id : null);
    
    const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
    const classSectionStudents = useMemo(() => {
        if (!selectedClassSectionId) return [];
        const studentIds = allEnrollments.filter(e => e.classSectionId === selectedClassSectionId).map(e => e.studentId);
        return students.filter(s => studentIds.includes(s.id));
    }, [students, selectedClassSectionId, allEnrollments]);

    const selectedCourseId = useMemo(() => {
        const section = classSections.find(cs => cs.id === selectedClassSectionId);
        return section?.courseId;
    }, [classSections, selectedClassSectionId]);

    const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId), [courses, selectedCourseId]);

    const [editingCell, setEditingCell] = useState(null); // { studentId, courseId, type, key }
    const [cellValue, setCellValue] = useState('');

    const handleCellClick = (studentId, courseId, type, key, currentValue) => {
        if (!courseId) return;
        setEditingCell({ studentId, courseId, type, key });
        setCellValue(currentValue ?? '');
    };

    const handleUpdateGrade = () => {
        if (!editingCell) return;
        const { studentId, courseId, type, key } = editingCell;
        const newScore = parseFloat(cellValue);
        
        if (isNaN(newScore) && cellValue !== '') {
            setEditingCell(null);
            return;
        }
        const scoreToSave = cellValue === '' ? null : newScore;

        setGrades(prevGrades => {
            const gradeRecordIndex = prevGrades.findIndex(g => g.studentId === studentId && g.courseId === courseId);
            const newGrades = [...prevGrades];

            if (gradeRecordIndex > -1) {
                const updatedGrade = { ...newGrades[gradeRecordIndex] };
                if (type === 'final') {
                    updatedGrade.final = scoreToSave;
                } else if (type === 'component') {
                    const newComponents = { ...updatedGrade.components };
                    if (scoreToSave === null) {
                        delete newComponents[key];
                    } else {
                        newComponents[key] = scoreToSave;
                    }
                    updatedGrade.components = newComponents;
                }
                newGrades[gradeRecordIndex] = updatedGrade;
                return newGrades;
            } else {
                if (scoreToSave === null) return prevGrades;
                const newGrade = { 
                    id: Date.now(), 
                    studentId, 
                    courseId, 
                    components: {}, 
                    final: null,
                    weights: {}
                };
                if (type === 'final') {
                    newGrade.final = scoreToSave;
                } else if (type === 'component') {
                    newGrade.components[key] = scoreToSave;
                }
                return [...newGrades, newGrade];
            }
        });
        setEditingCell(null);
    };

    const calculateOverallGrade = (grade) => {
        if (!grade) return '-';
        const { components = {}, final, weights = {} } = grade;
        if (Object.keys(components).length === 0 && final == null) return '-';

        let totalPoints = 0;
        let totalWeight = 0;

        for (const compKey in components) {
            if (weights[compKey] != null && components[compKey] != null) {
                totalPoints += components[compKey] * weights[compKey];
                totalWeight += weights[compKey];
            }
        }
        
        if (weights.final != null && final != null) {
            totalPoints += final * weights.final;
            totalWeight += weights.final;
        }

        if (totalWeight === 0) {
            const allScores = [...Object.values(components), final].filter(s => s != null);
            if(allScores.length === 0) return '-';
            return (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2);
        }
        
        return (totalPoints / totalWeight).toFixed(2);
    };
    
    const EditableCell = ({ studentId, courseId, type, componentKey, value }) => {
        const isEditing = editingCell?.studentId === studentId && 
                          editingCell?.courseId === courseId &&
                          editingCell?.type === type && 
                          editingCell?.key === componentKey;
        
        if (isEditing) {
            return (
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cellValue}
                    onChange={e => setCellValue(e.target.value)}
                    onBlur={handleUpdateGrade}
                    onKeyDown={e => { if (e.key === 'Enter') handleUpdateGrade(); if (e.key === 'Escape') setEditingCell(null); }}
                    autoFocus
                    className="w-16 text-center bg-yellow-100 dark:bg-yellow-800 border-blue-500 border-2 rounded"
                />
            );
        }
        
        return (
            <span 
                onClick={() => handleCellClick(studentId, courseId, type, componentKey, value)}
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded px-1"
            >
                {value ?? '-'}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
                <label className="font-medium text-gray-800 dark:text-gray-200">Chọn lớp tín chỉ:</label>
                <select value={selectedClassSectionId || ''} onChange={(e) => setSelectedClassSectionId(Number(e.target.value))} className="border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    <option value="" disabled>-- Không có lớp --</option>
                    {classSections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {selectedCourse && <span className="font-semibold text-gray-700 dark:text-gray-300">Học phần: {selectedCourse.name}</span>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center text-gray-800 dark:text-gray-200">
                    <thead className="text-gray-700 dark:text-gray-200">
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-2 border border-gray-300 dark:border-gray-600 min-w-[200px] text-left">Sinh viên</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Điểm Quá Trình</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Điểm Thi CK</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Điểm HP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classSectionStudents.map(student => {
                            const grade = grades.find(g => g.studentId === student.id && g.courseId === selectedCourseId) || {};
                            const components = grade.components || {};
                            
                            return (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 font-medium text-left">{student.name} ({student.studentCode})</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-sm space-x-2">
                                        {Object.keys(components).length > 0 ? (
                                            Object.entries(components).map(([key, value]) => (
                                                <span key={key} className="inline-block p-1">
                                                    {key}: <EditableCell studentId={student.id} courseId={selectedCourseId} type="component" componentKey={key} value={value} />
                                                </span>
                                            ))
                                        ) : (
                                             <EditableCell studentId={student.id} courseId={selectedCourseId} type="component" componentKey="Chuyên cần" value={null} />
                                        )}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-sm">
                                        <EditableCell studentId={student.id} courseId={selectedCourseId} type="final" componentKey="final" value={grade.final} />
                                    </td>
                                    <td 
                                        className="p-2 border border-gray-300 dark:border-gray-600 text-sm font-semibold bg-gray-50 dark:bg-gray-700/50"
                                        title="Điểm học phần được tính tự động."
                                    >
                                        {calculateOverallGrade(grade)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const FeeManagementView = ({ allStudents, fees, setFees }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = useMemo(() => allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentCode.includes(searchTerm)), [allStudents, searchTerm]); const [selectedStudentId, setSelectedStudentId] = useState(filteredStudents.length > 0 ? filteredStudents[0].id : null); useEffect(() => { if (!filteredStudents.find(s => s.id === selectedStudentId)) { setSelectedStudentId(filteredStudents.length > 0 ? filteredStudents[0].id : null); } }, [filteredStudents, selectedStudentId]); const [newFee, setNewFee] = useState({ feeName: '', amount: '', dueDate: '' }); const studentFees = useMemo(() => fees.filter(f => f.studentId === selectedStudentId), [fees, selectedStudentId]); const handleFeeChange = (e) => setNewFee({ ...newFee, [e.target.name]: e.target.value }); const handleAddFeeSubmit = (e) => { e.preventDefault(); const amount = parseFloat(newFee.amount); if (!newFee.feeName || isNaN(amount) || !newFee.dueDate) return alert("Vui lòng nhập đầy đủ thông tin."); const newId = fees.length > 0 ? Math.max(...fees.map(i => i.id)) + 1 : 1; setFees([...fees, { id: newId, studentId: selectedStudentId, feeName: newFee.feeName, amount, dueDate: newFee.dueDate, status: 'Chưa thanh toán' }]); setNewFee({ feeName: '', amount: '', dueDate: '' }); }; const toggleStatus = (feeId) => setFees(fees.map(f => f.id === feeId ? { ...f, status: f.status === 'Đã thanh toán' ? 'Chưa thanh toán' : 'Đã thanh toán' } : f)); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6"><div className="flex items-center gap-4 flex-wrap"><label className="font-medium shrink-0 text-gray-800 dark:text-gray-200">Quản lý học phí cho:</label><div className="flex-grow min-w-[200px]"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm sinh viên..."/></div><div className="flex-grow min-w-[200px]"><FormSelect name="studentId" value={selectedStudentId || ''} onChange={(e) => setSelectedStudentId(Number(e.target.value))}>{filteredStudents.length > 0 ? filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>) : <option>Không tìm thấy sinh viên</option>}</FormSelect></div></div>{selectedStudentId ? <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{studentFees.map(f => (<tr key={f.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{f.status}</span></td><td className="p-4 text-center"><button onClick={() => toggleStatus(f.id)} className="text-sm bg-indigo-500 text-white px-3 py-1 rounded">Đổi</button></td></tr>))}</tbody><tfoot className="text-gray-800 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><td className="p-2"><input type="text" name="feeName" value={newFee.feeName} onChange={handleFeeChange} placeholder="Tên khoản thu" className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"/></td><td className="p-2"><input type="number" name="amount" value={newFee.amount} onChange={handleFeeChange} placeholder="Số tiền" className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"/></td><td className="p-2"><input type="date" name="dueDate" value={newFee.dueDate} onChange={handleFeeChange} className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"/></td><td className="p-2 text-center" colSpan="2"><button onClick={handleAddFeeSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">Thêm</button></td></tr></tfoot></table></div> : <p className="text-gray-500 dark:text-gray-400">Vui lòng chọn một sinh viên.</p>}</div>);};
const UserManagementView = ({ users, onAdd, onEdit, onDelete }) => { return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Tài khoản</h3> <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm Tài khoản</button> </div> <div className="overflow-x-auto"> <table className="w-full text-left text-gray-800 dark:text-gray-300"> <thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên hiển thị</th><th className="p-4 font-semibold">Tên đăng nhập</th><th className="p-4 font-semibold">Vai trò</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead> <tbody>{users.map(user => ( <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"> <td className="p-4">{user.name}</td> <td className="p-4">{user.username}</td> <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : user.role === 'lecturer' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>{user.role}</span></td> <td className="p-4 text-center space-x-2"> <button onClick={() => onEdit(user)} className="p-2 text-blue-600 disabled:opacity-50" disabled={user.role === 'admin'}><Edit size={18} /></button> <button onClick={() => onDelete(user.id)} className="p-2 text-red-600 disabled:opacity-50" disabled={user.role === 'admin'}><Trash2 size={18} /></button> </td> </tr> ))}</tbody> </table> </div> </div> ); };
const UserFormModal = ({ user, students, lecturers, users, onSave, onClose }) => { const isEditing = !!user?.id; const [formData, setFormData] = useState({ username: user?.username || '', password: user?.password || '', role: user?.role || 'student', linkedId: user?.studentId || user?.lecturerId || '', }); const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value, linkedId: name === 'role' ? '' : prev.linkedId })); }; const handleSubmit = (e) => { e.preventDefault(); if (!formData.username || (isEditing ? false : !formData.password) || (!isEditing && !formData.linkedId)) { return alert('Vui lòng điền đầy đủ thông tin. Mật khẩu là bắt buộc khi tạo mới.'); } if (!isEditing && users.some(u => u.username === formData.username)) { return alert('Tên đăng nhập đã tồn tại.'); } let finalData = { ...user, ...formData }; if(!formData.password && isEditing) { finalData.password = user.password; } if (!isEditing) { let name = ''; if (formData.role === 'student') { const student = students.find(s => s.id === parseInt(formData.linkedId)); name = `SV: ${student?.name}`; finalData.studentId = parseInt(formData.linkedId); delete finalData.lecturerId; } else { const lecturer = lecturers.find(t => t.id === parseInt(formData.linkedId)); name = `${lecturer.title} ${lecturer?.name}`; finalData.lecturerId = parseInt(formData.linkedId); delete finalData.studentId; } finalData.name = name; } onSave('user', finalData); }; return ( <FormModal title={isEditing ? 'Sửa Tài khoản' : 'Thêm Tài khoản mới'} onClose={onClose} onSubmit={handleSubmit}> <FormInput label="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} required /> <FormInput label="Mật khẩu" name="password" type="password" placeholder={isEditing ? "Để trống nếu không đổi" : ""} value={formData.password} onChange={handleChange} required={!isEditing} /> {!isEditing && ( <> <FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}> <option value="student">Sinh viên</option> <option value="lecturer">Giảng viên</option> </FormSelect> <FormSelect label={formData.role === 'student' ? 'Liên kết với SV' : 'Liên kết với GV'} name="linkedId" value={formData.linkedId} onChange={handleChange} required> <option value="">-- Chọn --</option> {formData.role === 'student' ? students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>) : lecturers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)} </FormSelect> </> )} </FormModal> ); };
const SidebarStudent = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'grades', label: 'Kết quả học tập', icon: BookUser }, { id: 'fees', label: 'Thông tin Học phí', icon: Banknote }, ]; return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">SV</span><span className="hidden lg:inline">Cổng Sinh viên</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderStudent = ({ currentUser, studentName, onLogout }) => ( <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center flex-wrap gap-2"><div><h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sinh viên: {studentName}</h2><p className="text-gray-500 dark:text-gray-400">Chào mừng, {currentUser.name.replace('SV: ','')}</p></div><div className="flex items-center gap-3"><ThemeToggleButton /><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full"><LogOut size={22} /></button></div></header>);
const StudentGradeView = ({ grades, courses }) => { const calculateOverallGrade = (grade) => { if (!grade) return { text: '-', score: -1 }; if (grade.final == null) return { text: 'Chưa có', score: -1 }; const score = grade.final; return { text: score.toFixed(2), score: score }; }; const getGradeForLetter = (score) => { if (score >= 9.0) return 'A+'; if (score >= 8.5) return 'A'; if (score >= 8.0) return 'B+'; if (score >= 7.0) return 'B'; if (score >= 6.5) return 'C+'; if (score >= 5.5) return 'C'; if (score >= 5.0) return 'D+'; if (score >= 4.0) return 'D'; return 'F'; }; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Bảng điểm học kỳ</h3><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Mã HP</th><th className="p-4 font-semibold">Tên học phần</th><th className="p-4 font-semibold text-center">Điểm QT</th><th className="p-4 font-semibold text-center">Điểm CK</th><th className="p-4 font-semibold text-center">Điểm chữ</th></tr></thead><tbody>{grades.map(grade => { const course = courses.find(c => c.id === grade.courseId); if (!course) return null; const overall = calculateOverallGrade(grade); return (<tr key={grade.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4 font-medium">{course.code}</td><td className="p-4">{course.name}</td><td className="p-4 text-center">{grade.components ? Object.values(grade.components).join('; ') : '-'}</td><td className="p-4 text-center">{grade.final?.toFixed(1) || '-'}</td><td className="p-4 font-bold text-blue-600 dark:text-blue-400 text-center">{overall.score >= 0 ? getGradeForLetter(overall.score) : '-'}</td></tr>);})}</tbody></table></div></div> ); };
const StudentFeeView = ({ fees, onPay }) => ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Các khoản phí</h3><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{fees.length > 0 ? fees.map(f => (<tr key={f.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{f.status}</span></td><td className="p-4 text-center">{f.status === 'Chưa thanh toán' ? <button onClick={() => onPay(f)} className="py-1 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Thanh toán</button> : <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />}</td></tr>)) : <tr><td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">Không có khoản phí nào.</td></tr>}</tbody></table></div></div> );
const PaymentModal = ({ fee, onClose, onConfirm }) => { const [paymentMethod, setPaymentMethod] = useState('bank'); return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4"><div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Thanh toán Học phí</h3><button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} /></button></div><div className="space-y-4 text-gray-800 dark:text-gray-200"><p><span className="font-semibold">Khoản phí:</span> {fee.feeName}</p><p className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.amount)}</p><div className="pt-4 border-t border-gray-200 dark:border-gray-600"><p className="font-semibold mb-2">Chọn phương thức:</p><div className="space-y-2"><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><Landmark size={20}/> Chuyển khoản</span></label><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-5 h-5"/> Ví MoMo</span></label><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><CreditCard size={20}/> Thẻ tín dụng</span></label></div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button><button type="button" onClick={onConfirm} className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow">Xác nhận</button></div></div></div></div> ); };
const SidebarLecturer = ({ currentUser, currentView, setCurrentView }) => { const navItems = [ { id: 'grades', label: 'Quản lý điểm', icon: BookUser }, { id: 'schedule', label: 'TKB Cá nhân', icon: Calendar }, ]; if(currentUser.role === 'head_of_department') { navItems.push({ id: 'department', label: 'Bộ môn', icon: Users2 }); } return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">GV</span><span className="hidden lg:inline">Cổng Giảng viên</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const ScheduleView = ({ schedule, title }) => { const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']; const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">{title}</h3> <div className="overflow-x-auto"> <table className="w-full border-collapse"> <thead className="text-gray-700 dark:text-gray-200"> <tr className="bg-gray-100 dark:bg-gray-700"> <th className="p-2 border border-gray-300 dark:border-gray-600">Tiết</th> {days.map(day => <th key={day} className="p-2 border border-gray-300 dark:border-gray-600">{day}</th>)} </tr> </thead> <tbody className="text-gray-800 dark:text-gray-300"> {periods.map(period => ( <tr key={period}> <td className="p-2 border border-gray-300 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-700/50 text-center">{period}</td> {days.map(day => { const s = schedule.find(item => item.day === day && item.period === period); return ( <td key={day} className="p-2 border border-gray-300 dark:border-gray-600 text-center h-16"> {s ? <div><p className="font-semibold">{s.courseName}</p><p className="text-sm text-gray-500 dark:text-gray-400">{s.className}</p></div> : ''} </td> ) })} </tr> ))} </tbody> </table> </div> </div> ); };
const DepartmentScheduleView = ({ lecturers, schedules }) => { const [selectedLecturerId, setSelectedLecturerId] = useState(lecturers.length > 0 ? lecturers[0].id : null); const selectedSchedule = useMemo(() => schedules.filter(s => s.lecturerId === selectedLecturerId), [schedules, selectedLecturerId]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Thời khóa biểu Giảng viên trong Khoa</h3> <div className="flex items-center gap-4"> <label className="font-medium text-gray-800 dark:text-gray-200">Chọn giảng viên:</label> <FormSelect value={selectedLecturerId || ''} onChange={(e) => setSelectedLecturerId(Number(e.target.value))}> {lecturers.map(t => <option key={t.id} value={t.id}>{`${t.title || ''} ${t.name}`}</option>)} </FormSelect> </div> {selectedLecturerId ? <ScheduleView schedule={selectedSchedule} title={`TKB của ${lecturers.find(t=>t.id === selectedLecturerId)?.name}`} /> : <p className="text-gray-500 dark:text-gray-400">Chưa có giảng viên trong khoa này.</p>} </div> ) };
const MultiSelectDropdown = ({ label, options, selectedValues, onChange, displayKey = 'name', valueKey = 'id' }) => { const [isOpen, setIsOpen] = useState(false); const dropdownRef = useRef(null); const handleToggle = () => setIsOpen(!isOpen); const handleOptionClick = (value) => { const newSelectedValues = selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value]; onChange(newSelectedValues); }; useEffect(() => { const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [dropdownRef]); const getDisplayText = () => { if (selectedValues.length === 0) return `-- Chọn --`; if (selectedValues.length === 1) { if (label === "Tiết") return `Tiết ${selectedValues[0]}`; const selectedOption = options.find(opt => (typeof opt === 'object' ? opt[valueKey] : opt) === selectedValues[0]); return typeof selectedOption === 'object' ? selectedOption[displayKey] : selectedOption; } return `${selectedValues.length} mục đã chọn`; }; return ( <div className="relative" ref={dropdownRef}> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label> <button type="button" onClick={handleToggle} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-left flex justify-between items-center text-gray-800 dark:text-gray-200" > <span className="truncate">{getDisplayText()}</span> <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /> </button> {isOpen && ( <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"> <ul className="text-gray-800 dark:text-gray-200"> {options.map(option => { const value = typeof option === 'object' ? option[valueKey] : option; const display = typeof option === 'object' ? option[displayKey] : option; return ( <li key={value} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center" onClick={() => handleOptionClick(value)} > <input type="checkbox" checked={selectedValues.includes(value)} readOnly className="mr-2" /> <span>{display}</span> </li> ); })} </ul> </div> )} </div> ); };
const ScheduleManagementView = ({ schedules, setSchedules, lecturers, classSections, courses }) => { const [editing, setEditing] = useState(null); const [form, setForm] = useState({ lecturerId: '', classSectionId: '', days: [], periods: [] }); const dayOptions = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']; const periodOptions = Array.from({ length: 12 }, (_, i) => i + 1); const handleEdit = (schedule) => { setEditing(schedule); setForm({ lecturerId: schedule.lecturerId, classSectionId: schedule.classSectionId, days: [schedule.day], periods: [schedule.period] }); }; const handleDelete = (id) => { if (window.confirm("Bạn có chắc chắn muốn xóa lịch học này?")) { setSchedules(schedules.filter(a => a.id !== id)); } }; const handleChange = (e) => { const { name, value } = e.target; const isNumericField = ['lecturerId', 'classSectionId'].includes(name); const processedValue = isNumericField && value ? parseInt(value, 10) : value; setForm({ ...form, [name]: processedValue }); }; const handleMultiSelectChange = (name, values) => { setForm({ ...form, [name]: values }); }; const handleSubmit = (e) => { e.preventDefault(); const { lecturerId, classSectionId, days, periods } = form; if (!lecturerId || !classSectionId || days.length === 0 || periods.length === 0) { alert("Vui lòng điền đầy đủ thông tin, bao gồm ít nhất một ngày và một tiết."); return; } const checkConflict = (day, period, currentScheduleId = null) => { return schedules.find(a => a.day === day && a.period === period && (a.lecturerId === lecturerId || a.classSectionId === classSectionId) && a.id !== currentScheduleId); }; if (editing) { const day = days[0]; const period = periods[0]; const conflict = checkConflict(day, period, editing.id); if (conflict) { alert(`Lịch bị trùng! ${conflict.lecturerId === lecturerId ? `Giảng viên` : `Lớp tín chỉ`} đã có lịch vào thời gian này.`); return; } setSchedules(schedules.map(a => a.id === editing.id ? { ...a, lecturerId, classSectionId, day, period } : a )); } else { const newSchedules = []; let isConflict = false; let lastId = schedules.length > 0 ? Math.max(...schedules.map(a => a.id)) : 0; for (const day of days) { for (const period of periods) { const conflict = checkConflict(day, period); if (conflict) { alert(`Lịch bị trùng! Không thể thêm lịch cho ${day} - Tiết ${period}.`); isConflict = true; break; } newSchedules.push({ id: ++lastId, lecturerId, classSectionId, day, period }); } if(isConflict) break; } if (!isConflict) { setSchedules([...schedules, ...newSchedules]); } } handleCancel(); }; const handleCancel = () => { setEditing(null); setForm({ lecturerId: '', classSectionId: '', days: [], periods: [] }); }; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Xếp Lịch học</h3> <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4"> <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{editing ? "Chỉnh sửa Lịch học" : "Thêm Lịch học mới"}</h4> <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"> <FormSelect label="Giảng viên" name="lecturerId" value={form.lecturerId || ''} onChange={handleChange} required> <option value="">-- Chọn GV --</option> {lecturers.map(t => <option key={t.id} value={t.id}>{`${t.title} ${t.name}`}</option>)} </FormSelect> <FormSelect label="Lớp tín chỉ" name="classSectionId" value={form.classSectionId || ''} onChange={handleChange} required> <option value="">-- Chọn lớp --</option> {classSections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </FormSelect> <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end"> <MultiSelectDropdown label="Ngày" options={dayOptions} selectedValues={form.days} onChange={(values) => handleMultiSelectChange('days', values)} /> <MultiSelectDropdown label="Tiết" options={periodOptions} selectedValues={form.periods} onChange={(values) => handleMultiSelectChange('periods', values.sort((a,b) => a-b))} /> <div className="flex gap-2 col-span-full md:col-span-1 self-end"> <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"> {editing ? "Cập nhật" : "Thêm"} </button> {editing && ( <button type="button" onClick={handleCancel} className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"> Hủy </button> )} </div> </div> </form> </div> <div className="overflow-x-auto"> <table className="w-full text-left mt-4 text-gray-800 dark:text-gray-300"> <thead className="text-gray-700 dark:text-gray-200"> <tr className="bg-gray-50 dark:bg-gray-700"> <th className="p-4 font-semibold">Giảng viên</th> <th className="p-4 font-semibold">Lớp tín chỉ</th> <th className="p-4 font-semibold">Học phần</th> <th className="p-4 font-semibold">Ngày</th> <th className="p-4 font-semibold">Tiết</th> <th className="p-4 font-semibold text-center">Hành động</th> </tr> </thead> <tbody> {schedules.sort((a,b) => dayOptions.indexOf(a.day) - dayOptions.indexOf(b.day) || a.period - b.period).map(a => { const lecturer = lecturers.find(t => t.id === a.lecturerId); const cls = classSections.find(c => c.id === a.classSectionId); const course = courses.find(s => s.id === cls?.courseId); return ( <tr key={a.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"> <td className="p-4">{lecturer ? `${lecturer.title} ${lecturer.name}` : '---'}</td> <td className="p-4">{cls?.name || '---'}</td> <td className="p-4">{course?.name || '---'}</td> <td className="p-4">{a.day}</td> <td className="p-4 text-center">{a.period}</td> <td className="p-4 text-center space-x-2"> <button onClick={() => handleEdit(a)} className="p-2 text-blue-600"><Edit size={18} /></button> <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600"><Trash2 size={18} /></button> </td> </tr> ); })} </tbody> </table> </div> </div> ); };

export default function App() {
    // Khởi tạo dữ liệu trong localStorage nếu chưa tồn tại
    useEffect(() => {
        const dataToInit = {
            lecturers: initialLecturers,
            faculties: initialFaculties,
            courses: initialCourses,
            classSections: initialClassSections,
            schedules: initialSchedules,
            users: initialUsers,
            students: initialStudents,
            enrollments: initialEnrollments,
            grades: initialGrades,
            fees: initialFees,
        };
        for (const key in dataToInit) {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(dataToInit[key]));
            }
        }
    }, []);

    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
