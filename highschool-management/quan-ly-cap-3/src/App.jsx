import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { User, BookUser, Banknote, LayoutDashboard, Plus, X, Edit, Trash2, Search, AlertCircle, LogOut, Users, ShieldCheck, CreditCard, Landmark, Home, UserCheck, Library, Briefcase, Calendar, Star, Users2, ChevronDown, Moon, Sun } from 'lucide-react';

// === Dữ liệu khởi tạo (Trong ứng dụng thực tế sẽ là CSDL) ===
const initialTeachers = [
    { id: 1, name: 'Trần Văn Long', specialization: 'Toán', gender: 'Nam', dob: '1985-10-20', phone: '0912345678', departmentId: 1, role: 'head_of_group' },
    { id: 2, name: 'Lê Thị Mai', specialization: 'Ngữ Văn', gender: 'Nữ', dob: '1980-05-15', phone: '0987654321', departmentId: 2, role: 'teacher' },
    { id: 3, name: 'Nguyễn Hoàng An', specialization: 'Vật Lý', gender: 'Nam', dob: '1990-01-01', phone: '0905556677', departmentId: 1, role: 'teacher' },
];
const initialDepartments = [
    { id: 1, name: 'Tổ Toán - Lý - Tin' },
    { id: 2, name: 'Tổ Văn - Sử - Địa' },
    { id: 3, name: 'Tổ Hóa - Sinh' },
];
const initialSubjects = [
    { id: 1, name: 'Toán 10', code: 'T10', periods: 4, departmentId: 1 },
    { id: 2, name: 'Vật Lý 11', code: 'VL11', periods: 3, departmentId: 1 },
    { id: 3, name: 'Ngữ Văn 12', code: 'NV12', periods: 4, departmentId: 2 },
    { id: 4, name: 'Hóa Học 10', code: 'HH10', periods: 3, departmentId: 3 },
];
const initialClasses = [ // Lớp học
    { id: 1, name: 'Lớp 10A1', subjectId: 1, teacherId: 1, academicYear: '2024-2025' },
    { id: 2, name: 'Lớp 12A3', subjectId: 3, teacherId: 2, academicYear: '2024-2025' },
    { id: 3, name: 'Lớp 11B2', subjectId: 2, teacherId: 3, academicYear: '2024-2025' },
];
const initialSchedules = [ // Thời khóa biểu
    { id: 1, teacherId: 1, classId: 1, day: 'Thứ 2', period: 1 },
    { id: 2, teacherId: 1, classId: 1, day: 'Thứ 2', period: 2 },
    { id: 3, teacherId: 2, classId: 2, day: 'Thứ 3', period: 3 },
    { id: 4, teacherId: 3, classId: 3, day: 'Thứ 5', period: 4 },
];
const initialUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'hs_an', password: 'password', role: 'student', studentId: 1 },
    { id: 3, username: 'gv_long', password: 'password', role: 'teacher', teacherId: 1 },
];
const initialStudents = [
    { id: 1, name: 'Nguyễn Văn An', studentCode: 'HS2024001', gender: 'Nam', dob: '2008-05-15', className: '10A1', address: '123 Đường ABC, Quận 1', email: 'an.nv2024001@thpt.edu.vn', phone: '0901234567' },
    { id: 2, name: 'Trần Thị Bình', studentCode: 'HS2023056', gender: 'Nữ', dob: '2007-09-22', className: '11B2', address: '456 Đường XYZ, Quận 3', email: 'binh.tt2023056@thpt.edu.vn', phone: '0912345678' },
    { id: 3, name: 'Lê Hoàng Cường', studentCode: 'HS2022112', gender: 'Nam', dob: '2006-02-10', className: '12A3', address: '789 Đường LMN, Quận 10', email: 'cuong.lh2022112@thpt.edu.vn', phone: '0987654321' },
];
// Enrollment: Mảng liên kết học sinh với lớp học
const initialEnrollments = [
    { studentId: 1, classId: 1 },
    { studentId: 2, classId: 3 },
    { studentId: 3, classId: 2 },
    { studentId: 1, classId: 3 }, // An học cả lớp 10A1 và 11B2 (ví dụ)
];
// Grades: Cấu trúc điểm linh hoạt hơn
const initialGrades = [
    { id: 1, studentId: 1, subjectId: 1, components: { 'Miệng': 9, '15 phút': 8.5, '1 tiết': 8.0 }, final: 9.5, semester: 1 },
    { id: 2, studentId: 1, subjectId: 2, components: { 'Miệng': 8, '1 tiết': 7.5 }, final: 8, semester: 1 },
];
const initialFees = [
    { id: 1, studentId: 1, feeName: 'Học phí Học kỳ 1 (2024-2025)', amount: 2500000, status: 'Chưa thanh toán', dueDate: '2024-09-30' }
];
const teacherRoles = { head_of_group: 'Tổ trưởng', teacher: 'Giáo viên' };

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
    const allTeachers = JSON.parse(localStorage.getItem('teachers')) || initialTeachers;

    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
      let userData = { ...user };
      if(user.role === 'teacher' && user.teacherId) {
          const teacherInfo = allTeachers.find(t => t.id === user.teacherId);
          userData = { ...userData, ...teacherInfo };
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
      teacher: <TeacherApplication currentUser={currentUser} onLogout={handleLogout} />,
  };
  return roleComponent[currentUser.role] || <LoginScreen onLogin={handleLogin}/>;
}

// === Login Screen ===
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); const success = await onLogin(username, password); if (!success) setError('Tên đăng nhập hoặc mật khẩu không đúng.'); };
  return ( <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"><h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Hệ Thống Quản Lý Trường THPT</h2><form onSubmit={handleSubmit} className="space-y-6"><div><label className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Tên đăng nhập</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500" required /></div><div><label className="text-sm font-bold text-gray-600 dark:text-gray-300 block">Mật khẩu</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500" required /></div>{error && <p className="text-red-500 text-sm text-center">{error}</p>}<div><button type="submit" className="w-full py-3 mt-4 font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600">Đăng nhập</button></div><div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-600"><p className="font-semibold mb-2">Tài khoản mẫu:</p><p><span className="font-medium">Admin:</span> admin / admin123</p><p><span className="font-medium">Giáo viên (Tổ trưởng):</span> gv_long / password</p><p><span className="font-medium">Học sinh:</span> hs_an / password</p></div></form></div></div> );
};

// === Admin Application ===
const AdminApplication = ({ currentUser, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('students')) || initialStudents);
  const [grades, setGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || initialGrades);
  const [fees, setFees] = useState(() => JSON.parse(localStorage.getItem('fees')) || initialFees);
  const [teachers, setTeachers] = useState(() => JSON.parse(localStorage.getItem('teachers')) || initialTeachers);
  const [classes, setClasses] = useState(() => JSON.parse(localStorage.getItem('classes')) || initialClasses);
  const [subjects, setSubjects] = useState(() => JSON.parse(localStorage.getItem('subjects')) || initialSubjects);
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('departments')) || initialDepartments);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || initialUsers);
  const [schedules, setSchedules] = useState(() => JSON.parse(localStorage.getItem('schedules')) || initialSchedules);
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem('enrollments')) || initialEnrollments);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const data = { students, grades, fees, teachers, classes, subjects, departments, users, schedules, enrollments };
    for (const key in data) { localStorage.setItem(key, JSON.stringify(data[key])); }
  }, [students, grades, fees, teachers, classes, subjects, departments, users, schedules, enrollments]);

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });
  const handleDelete = (action) => { setConfirmAction(() => action); setIsConfirmModalOpen(true); };
  const handleCloseConfirmModal = () => { setIsConfirmModalOpen(false); setConfirmAction(null); };

  const handleSave = (type, data) => {
    const saveData = (state, setState) => { if (data.id) { setState(state.map(item => item.id === data.id ? data : item)); } else { const newId = state.length > 0 ? Math.max(...state.map(i => i.id)) + 1 : 1; setState([...state, { ...data, id: newId }]); } };
    const map = { student: [students, setStudents], teacher: [teachers, setTeachers], class: [classes, setClasses], user: [users, setUsers], schedule: [schedules, setSchedules], subject: [subjects, setSubjects] };
    if (map[type]) saveData(...map[type]);
    closeModal();
  };
  
  const handleSaveDepartment = (departmentData, newSubjects) => {
      let savedDepartment = departmentData;
      if(departmentData.id) { setDepartments(departments.map(d => d.id === departmentData.id ? departmentData : d)); } else { const newId = departments.length > 0 ? Math.max(...departments.map(i => i.id)) + 1 : 1; savedDepartment = { ...departmentData, id: newId }; setDepartments([...departments, savedDepartment]); }
      const otherSubjects = subjects.filter(s => s.departmentId !== savedDepartment.id);
      const updatedSubjects = newSubjects.map((sub, index) => { if(typeof sub.id === 'number') return {...sub, departmentId: savedDepartment.id }; const newSubjectId = (subjects.length > 0 ? Math.max(...subjects.map(s => s.id).filter(id => typeof id === 'number')) : 0) + Date.now() + index; return { ...sub, id: newSubjectId, departmentId: savedDepartment.id }; });
      setSubjects([...otherSubjects, ...updatedSubjects]);
      closeModal();
  }

  const renderView = () => {
    const views = {
        dashboard: <DashboardView studentCount={students.length} teacherCount={teachers.length} subjectCount={subjects.length} />,
        profiles: <StudentProfileView allStudents={students} onAdd={(data) => openModal('student', data)} onEdit={(s) => openModal('student', s)} onDelete={(id) => handleDelete(() => { setStudents(students.filter(s => s.id !== id)); handleCloseConfirmModal(); })} />,
        grades: <GradeManagementView students={students} grades={grades} setGrades={setGrades} classes={classes} subjects={subjects} />,
        fees: <FeeManagementView allStudents={students} fees={fees} setFees={setFees} />,
        users: <UserManagementView users={users} onAdd={() => openModal('user')} onEdit={(user) => openModal('user', user)} onDelete={(id) => handleDelete(() => { if (id === 1) return alert("Không thể xóa Admin gốc."); setUsers(users.filter(u => u.id !== id)); handleCloseConfirmModal(); })} />,
        teachers: <TeacherManagementView allTeachers={teachers} departments={departments} onAdd={() => openModal('teacher')} onEdit={(t) => openModal('teacher', t)} onDelete={(id) => handleDelete(() => { setTeachers(teachers.filter(t => t.id !== id)); handleCloseConfirmModal(); })} />,
        classes: <ClassManagementView classes={classes} teachers={teachers} enrollments={enrollments} subjects={subjects} onAdd={() => openModal('class')} onEdit={(c) => openModal('class', c)} onDelete={(id) => handleDelete(() => { setClasses(classes.filter(c => c.id !== id)); handleCloseConfirmModal(); })} />,
        departments: <DepartmentManagementView departments={departments} subjects={subjects} teachers={teachers} onAddDept={() => openModal('department')} onEditDept={(d) => openModal('department', d)} onDeleteDept={(id) => handleDelete(() => { setDepartments(departments.filter(d => d.id !== id)); handleCloseConfirmModal(); })} />,
        subjects: <SubjectManagementView subjects={subjects} departments={departments} onAdd={() => openModal('subject')} onEdit={(c) => openModal('subject', c)} onDelete={(id) => handleDelete(() => { setSubjects(subjects.filter(c => c.id !== id)); handleCloseConfirmModal(); })} />,
        schedules: <ScheduleManagementView schedules={schedules} setSchedules={setSchedules} teachers={teachers} classes={classes} subjects={subjects} />
    };
    return views[currentView] || views.dashboard;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <SidebarAdmin currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto"><HeaderAdmin currentUser={currentUser} onLogout={onLogout} /><div className="space-y-6">{renderView()}</div></main>
      {modal.type === 'student' && <StudentFormModal student={modal.data} onSave={(d) => handleSave('student', d)} onClose={closeModal} />}
      {modal.type === 'teacher' && <TeacherFormModal teacher={modal.data} departments={departments} onSave={(d) => handleSave('teacher', d)} onClose={closeModal} />}
      {modal.type === 'class' && <ClassFormModal classData={modal.data} teachers={teachers} subjects={subjects} onSave={(d) => handleSave('class', d)} onClose={closeModal} />}
      {modal.type === 'department' && <DepartmentFormModal department={modal.data} allSubjects={subjects} onSave={handleSaveDepartment} onClose={closeModal} />}
      {modal.type === 'subject' && <SubjectFormModal subjectData={modal.data} departments={departments} onSave={(d) => handleSave('subject', d)} onClose={closeModal} />}
      {modal.type === 'user' && <UserFormModal user={modal.data} students={students} teachers={teachers} users={users} onSave={(d) => handleSave('user', d)} onClose={closeModal} />}
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
  const allSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
  const myStudent = useMemo(() => allStudents.find(s => s.id === currentUser.studentId), [allStudents, currentUser.studentId]);
  const myGrades = useMemo(() => allGrades.filter(g => g.studentId === currentUser.studentId), [allGrades, currentUser.studentId]);
  const myFees = useMemo(() => fees.filter(f => f.studentId === currentUser.studentId), [fees, currentUser.studentId]);
  
  useEffect(() => { localStorage.setItem('fees', JSON.stringify(fees)); }, [fees]);

  const handleOpenPaymentModal = (fee) => { setPayingFee(fee); setIsPaymentModalOpen(true); };
  const handleClosePaymentModal = () => { setIsPaymentModalOpen(false); setPayingFee(null); };
  const handleConfirmPayment = () => { setFees(prevFees => prevFees.map(fee => fee.id === payingFee.id ? { ...fee, status: 'Đã thanh toán' } : fee)); handleClosePaymentModal(); alert(`Đã xác nhận thanh toán cho khoản "${payingFee.feeName}".`); };
  
  const renderView = () => {
    if (!myStudent) { return <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">Không tìm thấy thông tin học sinh.</div> }
    switch (currentView) {
      case 'grades': return <StudentGradeView grades={myGrades} subjects={allSubjects} />;
      case 'fees': return <StudentFeeView fees={myFees} onPay={handleOpenPaymentModal} />;
      default: return <StudentGradeView grades={myGrades} subjects={allSubjects} />;
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


const TeacherApplication = ({ currentUser, onLogout }) => {
    const [currentView, setCurrentView] = useState('grades');
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];
    const [allGrades, setAllGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || initialGrades);
    const allclasses = JSON.parse(localStorage.getItem('classes')) || [];
    const allSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const allSchedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const allTeachers = JSON.parse(localStorage.getItem('teachers')) || [];
    
    const allDerivedSchedules = useMemo(() => allSchedules.map(a => { 
        const classInfo = allclasses.find(c => c.id === a.classId); 
        const subject = allSubjects.find(s => s.id === classInfo?.subjectId); 
        return { id: a.id, teacherId: a.teacherId, day: a.day, period: a.period, className: classInfo?.name || '---', subjectName: subject?.name || '---' }; 
    }), [allSchedules, allclasses, allSubjects]);
    
    const myClasses = useMemo(() => allclasses.filter(cs => cs.teacherId === currentUser.id), [allclasses, currentUser.id]);
    const mySchedule = useMemo(() => allDerivedSchedules.filter(s => s.teacherId === currentUser.id), [allDerivedSchedules, currentUser.id]);
    const myDepartmentMembers = useMemo(() => { if (currentUser.role !== 'head_of_group') return []; return allTeachers.filter(t => t.departmentId === currentUser.departmentId); }, [allTeachers, currentUser]);
    
    useEffect(() => { localStorage.setItem('grades', JSON.stringify(allGrades)); }, [allGrades]);

    const renderView = () => {
        const views = {
            grades: <GradeManagementView students={allStudents} grades={allGrades} setGrades={setAllGrades} classes={myClasses} subjects={allSubjects} />,
            schedule: <ScheduleView schedule={mySchedule} title="Thời khóa biểu cá nhân" />,
            department: currentUser.role === 'head_of_group' ? <DepartmentScheduleView teachers={myDepartmentMembers} schedules={allDerivedSchedules} /> : null
        };
        return views[currentView] || views.grades;
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <SidebarTeacher currentUser={currentUser} currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <HeaderAdmin currentUser={currentUser} onLogout={onLogout} />
                {renderView()}
            </main>
        </div>
    );
};


// === Reusable & General Components ===
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 text-center"><div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"><AlertCircle className="h-6 w-6 text-red-600" /></div><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">{title}</h3><div className="mt-2"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div><div className="mt-5 flex justify-center gap-4"><button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Hủy</button><button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 font-medium text-white hover:bg-red-700">Xác nhận</button></div></div></div> ); };
const DashboardView = ({ studentCount, teacherCount, subjectCount }) => ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-amber-500"><div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full"><Users className="text-amber-500 dark:text-amber-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Học sinh</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{studentCount}</p></div></div> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-green-500"><div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full"><UserCheck className="text-green-500 dark:text-green-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Giáo viên</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{teacherCount}</p></div></div> <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-sky-500"><div className="bg-sky-100 dark:bg-sky-900/50 p-4 rounded-full"><Library className="text-sky-500 dark:text-sky-300" size={32} /></div><div><h3 className="text-gray-500 dark:text-gray-400 text-lg">Tổng số Môn học</h3><p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{subjectCount}</p></div></div> </div> );
const FormModal = ({ title, onClose, onSubmit, children }) => ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h3><button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} /></button></div><form onSubmit={onSubmit} className="space-y-4">{children}<div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button><button type="submit" className="py-2 px-6 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow">Lưu</button></div></form></div></div> );
const FormInput = ({ label, name, value, onChange, required = false, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><input name={name} value={value} onChange={onChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500" required={required} {...props} /></div>);
const FormSelect = ({ label, name, value, onChange, children, required = false }) => (<div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500" required={required}>{children}</select></div>);
const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => ( <div className="relative"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /> <input type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500" /> </div> );

// === Admin Components ===
const SidebarAdmin = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard }, { id: 'departments', label: 'Quản lý Tổ CM', icon: Library }, { id: 'teachers', label: 'Quản lý Giáo viên', icon: UserCheck }, { id: 'subjects', label: 'Quản lý Môn học', icon: BookUser }, { id: 'classes', label: 'Quản lý Lớp học', icon: Home }, { id: 'schedules', label: 'Xếp TKB', icon: Briefcase }, { id: 'profiles', label: 'Quản lý Học sinh', icon: Users }, { id: 'grades', label: 'Quản lý Điểm số', icon: Star }, { id: 'fees', label: 'Quản lý Học phí', icon: Banknote }, { id: 'users', label: 'Quản lý Tài khoản', icon: ShieldCheck }, ]; return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-amber-600 text-center lg:text-left"><span className="lg:hidden">QLTHPT</span><span className="hidden lg:inline">Quản Lý THPT</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderAdmin = ({ currentUser, onLogout }) => ( <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center"> <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Hệ thống Quản lý Nhà trường</h2> <div className="flex items-center gap-3"><ThemeToggleButton /><span className="text-gray-600 dark:text-gray-300 hidden md:inline">Chào, <span className="font-bold">{currentUser.name || 'Admin'}</span></span><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full"><LogOut size={22} /></button></div></header>);
const DepartmentManagementView = ({ departments, subjects, teachers, onAddDept, onEditDept, onDeleteDept }) => { const [selectedDepartmentId, setSelectedDepartmentId] = useState(departments.length > 0 ? departments[0].id : null); const departmentTeachers = useMemo(() => teachers.filter(t => t.departmentId === selectedDepartmentId), [teachers, selectedDepartmentId]); const departmentSubjects = useMemo(() => subjects.filter(s => s.departmentId === selectedDepartmentId), [subjects, selectedDepartmentId]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <div> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Tổ chuyên môn</h3> <button onClick={onAddDept} className="bg-amber-500 text-white px-3 py-1 rounded-lg text-sm">Thêm Tổ</button> </div> <ul className="space-y-2">{departments.map(dept => (<li key={dept.id} onClick={() => setSelectedDepartmentId(dept.id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 ${selectedDepartmentId === dept.id ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}><span className="font-medium">{dept.name}</span><div className="space-x-2"><button onClick={(e) => { e.stopPropagation(); onEditDept(dept); }} className="p-1 text-amber-600"><Edit size={16}/></button><button onClick={(e) => { e.stopPropagation(); onDeleteDept(dept.id);}} className="p-1 text-red-600"><Trash2 size={16}/></button></div></li>))}</ul> </div> <div> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Thông tin Tổ: {departments.find(d=>d.id === selectedDepartmentId)?.name}</h3> {selectedDepartmentId ? ( <div className="space-y-6"> <div> <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Các môn học</h4> <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">{departmentSubjects.map(sub => <li key={sub.id}>{sub.name} ({sub.code})</li>)}</ul> </div> <div> <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Giáo viên trong Tổ</h4> <ul className="space-y-2">{departmentTeachers.map(teacher => { return ( <li key={teacher.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"> <div className="text-gray-800 dark:text-gray-200"> <p className="font-medium">{teacher.name}</p> <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.specialization}</p> </div> </li> )})}</ul> </div> </div> ) : <p className="text-gray-500 dark:text-gray-400">Chọn một tổ để xem chi tiết.</p>} </div> </div> </div> ); };
const DepartmentFormModal = ({ department, allSubjects, onSave, onClose }) => { const [name, setName] = useState(department?.name || ''); const [subjects, setSubjects] = useState(() => allSubjects.filter(s => s.departmentId === department?.id)); const [newSubject, setNewSubject] = useState({name: '', code: '', periods: 3}); const handleAddSubject = () => { if(newSubject.name.trim() === '' || newSubject.code.trim() === '') return; setSubjects([...subjects, { id: `new-${Date.now()}`, ...newSubject }]); setNewSubject({name: '', code: '', periods: 3}); }; const handleRemoveSubject = (subjectId) => setSubjects(subjects.filter(s => s.id !== subjectId)); const handleSubmit = (e) => { e.preventDefault(); onSave({ ...department, name }, subjects); }; return ( <FormModal title={department ? 'Sửa thông tin Tổ' : 'Thêm Tổ mới'} onClose={onClose} onSubmit={handleSubmit}> <FormInput label="Tên Tổ chuyên môn" name="name" value={name} onChange={e => setName(e.target.value)} required /> <div> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Các môn học</label> <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md"> {subjects.map(sub => ( <div key={sub.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200"> <span>{sub.name} ({sub.code})</span> <button type="button" onClick={() => handleRemoveSubject(sub.id)} className="p-1 text-red-500 hover:text-red-700"> <X size={16}/> </button> </div> ))} </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2"> <input type="text" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} placeholder="Tên môn học" className="sm:col-span-2 border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500"/> <input type="text" value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value})} placeholder="Mã môn" className="border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500"/> <button type="button" onClick={handleAddSubject} className="sm:col-span-3 bg-green-500 text-white px-4 py-2 rounded-lg">Thêm môn học</button> </div> </div> </FormModal> ); };
const TeacherManagementView = ({ allTeachers, departments, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredTeachers = useMemo(() => allTeachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())), [allTeachers, searchTerm]); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Quản lý Giáo viên</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm giáo viên..." /><button onClick={onAdd} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Thêm</button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">Giới tính</th><th className="p-4 font-semibold">Chức vụ</th><th className="p-4 font-semibold">Tổ chuyên môn</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredTeachers.map(t => { const department = departments.find(d => d.id === t.departmentId); return (<tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{t.name}</td><td className="p-4">{t.gender}</td><td className="p-4">{teacherRoles[t.role] || t.role}</td><td className="p-4">{department?.name || 'Chưa có'}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(t)} className="p-2 text-amber-600"><Edit size={18}/></button><button onClick={() => onDelete(t.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>)})}</tbody></table></div></div>);};
const TeacherFormModal = ({ teacher, departments, onSave, onClose }) => { const [formData, setFormData] = useState({ name: teacher?.name || '', specialization: teacher?.specialization || '', gender: teacher?.gender || 'Nam', dob: teacher?.dob || '', phone: teacher?.phone || '', departmentId: teacher?.departmentId || '', role: teacher?.role || 'teacher' }); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...teacher, ...formData, departmentId: parseInt(formData.departmentId) }); }; return (<FormModal title={ teacher ? 'Sửa thông tin Giáo viên' : 'Thêm Giáo viên' } onClose={onClose} onSubmit={handleSubmit}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Chuyên môn" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="VD: Toán, Ngữ Văn"/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required /><FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></FormSelect><FormSelect label="Tổ chuyên môn" name="departmentId" value={formData.departmentId} onChange={handleChange}><option value="">Chọn tổ</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</FormSelect></div><FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}>{Object.entries(teacherRoles).map(([roleKey, roleName]) => ( <option key={roleKey} value={roleKey}>{roleName}</option> ))}</FormSelect></FormModal>); };
const SubjectManagementView = ({ subjects, departments, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredSubjects = useMemo(() => subjects.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase())), [subjects, searchTerm]); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Quản lý Môn học</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm môn học..." /><button onClick={onAdd} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Thêm</button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Mã môn</th><th className="p-4 font-semibold">Tên môn học</th><th className="p-4 font-semibold text-center">Số tiết/tuần</th><th className="p-4 font-semibold">Tổ chuyên môn</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredSubjects.map(c => { const department = departments.find(f => f.id === c.departmentId); return (<tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{c.code}</td><td className="p-4">{c.name}</td><td className="p-4 text-center">{c.periods}</td><td className="p-4">{department?.name || '---'}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(c)} className="p-2 text-amber-600"><Edit size={18}/></button><button onClick={() => onDelete(c.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>)})}</tbody></table></div></div>);};
const SubjectFormModal = ({ subjectData, departments, onSave, onClose }) => { const [formData, setFormData] = useState({ name: subjectData?.name || '', code: subjectData?.code || '', periods: subjectData?.periods || 3, departmentId: subjectData?.departmentId || '' }); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...subjectData, ...formData, periods: parseInt(formData.periods), departmentId: parseInt(formData.departmentId) }); }; return (<FormModal title={subjectData ? 'Sửa Môn học' : 'Thêm Môn học'} onClose={onClose} onSubmit={handleSubmit}><FormInput label="Tên môn học" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Mã môn học" name="code" value={formData.code} onChange={handleChange} required /><FormInput label="Số tiết/tuần" name="periods" type="number" value={formData.periods} onChange={handleChange} required /><FormSelect label="Tổ chuyên môn" name="departmentId" value={formData.departmentId} onChange={handleChange} required><option value="">Chọn tổ</option>{departments.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</FormSelect></FormModal>);};
const ClassManagementView = ({ classes, teachers, enrollments, subjects, onAdd, onEdit, onDelete }) => ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Lớp học</h3><button onClick={onAdd} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Thêm Lớp</button></div> <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên lớp học</th><th className="p-4 font-semibold">Môn học</th><th className="p-4 font-semibold">Giáo viên</th><th className="p-4 font-semibold">Sĩ số</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{classes.map(c => { const teacher = teachers.find(t => t.id === c.teacherId); const subject = subjects.find(cr => cr.id === c.subjectId); const enrolledStudentsCount = enrollments.filter(e => e.classId === c.id).length; return (<tr key={c.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{c.name}</td><td className="p-4">{subject ? `${subject.name} (${subject.code})` : '---'}</td><td className="p-4">{teacher ? teacher.name : 'Chưa phân công'}</td><td className="p-4">{enrolledStudentsCount}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(c)} className="p-2 text-amber-600"><Edit size={18}/></button><button onClick={() => onDelete(c.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>);})}</tbody></table></div> </div> );
const ClassFormModal = ({ classData, teachers, subjects, onSave, onClose }) => { const [formData, setFormData] = useState({ name: classData?.name || '', teacherId: classData?.teacherId || '', subjectId: classData?.subjectId || '', academicYear: classData?.academicYear || '2024-2025'}); const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = e => { e.preventDefault(); onSave({ ...classData, ...formData, teacherId: parseInt(formData.teacherId), subjectId: parseInt(formData.subjectId) }); }; return (<FormModal title={classData ? 'Sửa thông tin Lớp học' : 'Thêm Lớp học'} onClose={onClose} onSubmit={handleSubmit}><FormInput label="Tên lớp học" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Năm học" name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="VD: 2024-2025" required /><FormSelect label="Môn học" name="subjectId" value={formData.subjectId} onChange={handleChange} required><option value="">Chọn môn học</option>{subjects.map(c => <option key={c.id} value={c.id}>{`${c.name} (${c.code})`}</option>)}</FormSelect><FormSelect label="Giáo viên" name="teacherId" value={formData.teacherId} onChange={handleChange}><option value="">Chọn giáo viên</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></FormModal>); };
const StudentProfileView = ({ allStudents, onAdd, onEdit, onDelete }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = useMemo(() => { return allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentCode.includes(searchTerm)); }, [allStudents, searchTerm]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4 flex-wrap gap-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Hồ sơ Học sinh</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"> <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm theo tên hoặc Mã HS..." /> <button onClick={() => onAdd()} className="bg-amber-500 text-white px-4 py-2 rounded-lg shrink-0">Thêm HS</button> </div> </div> <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">Mã HS</th><th className="p-4 font-semibold">Ngày sinh</th><th className="p-4 font-semibold">Lớp</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredStudents.map(s => (<tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{s.name}</td><td className="p-4">{s.studentCode}</td><td className="p-4">{s.dob}</td><td className="p-4">{s.className}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(s)} className="p-2 text-amber-600"><Edit size={18}/></button><button onClick={() => onDelete(s.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div> </div> ); };
const StudentFormModal = ({ student, onSave, onClose }) => { const [formData, setFormData] = useState({ name: student?.name || '', studentCode: student?.studentCode || '', dob: student?.dob || '', gender: student?.gender || 'Nam', address: student?.address || '', className: student?.className || '', email: student?.email || '', phone: student?.phone || '' }); const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value })); const handleSubmit = (e) => { e.preventDefault(); onSave({ ...student, ...formData }); }; return ( <FormModal title={student?.id ? 'Sửa Hồ sơ Học sinh' : 'Thêm Học sinh mới'} onClose={onClose} onSubmit={handleSubmit}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} required /><FormInput label="Mã số học sinh" name="studentCode" value={formData.studentCode} onChange={handleChange} required /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></FormSelect><FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required /></div><FormInput label="Lớp" name="className" value={formData.className} onChange={handleChange} /><FormInput label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} /><FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} /></div></FormModal> ); };
const GradeManagementView = ({ students, grades, setGrades, classes, subjects }) => {
    const [selectedClassId, setSelectedClassId] = useState(classes.length > 0 ? classes[0].id : null);
    
    const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
    const classStudents = useMemo(() => {
        if (!selectedClassId) return [];
        const studentIds = allEnrollments.filter(e => e.classId === selectedClassId).map(e => e.studentId);
        return students.filter(s => studentIds.includes(s.id));
    }, [students, selectedClassId, allEnrollments]);

    const selectedSubjectId = useMemo(() => {
        const section = classes.find(cs => cs.id === selectedClassId);
        return section?.subjectId;
    }, [classes, selectedClassId]);

    const selectedSubject = useMemo(() => subjects.find(c => c.id === selectedSubjectId), [subjects, selectedSubjectId]);

    const [editingCell, setEditingCell] = useState(null); // { studentId, subjectId, type, key }
    const [cellValue, setCellValue] = useState('');

    const handleCellClick = (studentId, subjectId, type, key, currentValue) => {
        if (!subjectId) return;
        setEditingCell({ studentId, subjectId, type, key });
        setCellValue(currentValue ?? '');
    };

    const handleUpdateGrade = () => {
        if (!editingCell) return;
        const { studentId, subjectId, type, key } = editingCell;
        const newScore = parseFloat(cellValue);
        
        if (isNaN(newScore) && cellValue !== '') {
            setEditingCell(null);
            return;
        }
        const scoreToSave = cellValue === '' ? null : newScore;

        setGrades(prevGrades => {
            const gradeRecordIndex = prevGrades.findIndex(g => g.studentId === studentId && g.subjectId === subjectId);
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
                    subjectId, 
                    components: {}, 
                    final: null,
                    semester: 1 // Default semester
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
        if (!grade || grade.final == null) return '-';
        
        const componentScores = Object.values(grade.components || {}).filter(s => s != null);
        const finalScore = grade.final;

        if (componentScores.length === 0) return finalScore.toFixed(1);

        const averageComponentScore = componentScores.reduce((a, b) => a + b, 0) / componentScores.length;

        // Điểm TB môn = (TBC điểm hệ số 1 + TBC điểm hệ số 2 * 2 + Điểm thi HK * 3) / (Tổng số cột điểm + 5)
        // This is a simplified example. High school grade calculation can be complex.
        // For simplicity: (Avg Component * 1 + Final * 2) / 3
        const overall = (averageComponentScore + finalScore * 2) / 3;
        return overall.toFixed(1);
    };
    
    const EditableCell = ({ studentId, subjectId, type, componentKey, value }) => {
        const isEditing = editingCell?.studentId === studentId && 
                          editingCell?.subjectId === subjectId &&
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
                    className="w-16 text-center bg-yellow-100 dark:bg-yellow-800 border-amber-500 border-2 rounded"
                />
            );
        }
        
        return (
            <span 
                onClick={() => handleCellClick(studentId, subjectId, type, componentKey, value)}
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded px-1"
            >
                {value ?? '-'}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
                <label className="font-medium text-gray-800 dark:text-gray-200">Chọn lớp học:</label>
                <select value={selectedClassId || ''} onChange={(e) => setSelectedClassId(Number(e.target.value))} className="border rounded-lg p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-amber-500 focus:border-amber-500">
                    <option value="" disabled>-- Không có lớp --</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {selectedSubject && <span className="font-semibold text-gray-700 dark:text-gray-300">Môn học: {selectedSubject.name}</span>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center text-gray-800 dark:text-gray-200">
                    <thead className="text-gray-700 dark:text-gray-200">
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-2 border border-gray-300 dark:border-gray-600 min-w-[200px] text-left">Học sinh</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Điểm Thường xuyên</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">Điểm Cuối kỳ</th>
                            <th className="p-2 border border-gray-300 dark:border-gray-600">TB Môn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classStudents.map(student => {
                            const grade = grades.find(g => g.studentId === student.id && g.subjectId === selectedSubjectId) || {};
                            const components = grade.components || {};
                            
                            return (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 font-medium text-left">{student.name} ({student.studentCode})</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-sm space-x-2">
                                        <EditableCell studentId={student.id} subjectId={selectedSubjectId} type="component" componentKey="Miệng" value={components['Miệng']} />
                                        <EditableCell studentId={student.id} subjectId={selectedSubjectId} type="component" componentKey="15 phút" value={components['15 phút']} />
                                        <EditableCell studentId={student.id} subjectId={selectedSubjectId} type="component" componentKey="1 tiết" value={components['1 tiết']} />
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-sm">
                                        <EditableCell studentId={student.id} subjectId={selectedSubjectId} type="final" componentKey="final" value={grade.final} />
                                    </td>
                                    <td 
                                        className="p-2 border border-gray-300 dark:border-gray-600 text-sm font-semibold bg-gray-50 dark:bg-gray-700/50"
                                        title="Điểm trung bình môn được tính tự động."
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
const FeeManagementView = ({ allStudents, fees, setFees }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = useMemo(() => allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentCode.includes(searchTerm)), [allStudents, searchTerm]); const [selectedStudentId, setSelectedStudentId] = useState(filteredStudents.length > 0 ? filteredStudents[0].id : null); useEffect(() => { if (!filteredStudents.find(s => s.id === selectedStudentId)) { setSelectedStudentId(filteredStudents.length > 0 ? filteredStudents[0].id : null); } }, [filteredStudents, selectedStudentId]); const [newFee, setNewFee] = useState({ feeName: '', amount: '', dueDate: '' }); const studentFees = useMemo(() => fees.filter(f => f.studentId === selectedStudentId), [fees, selectedStudentId]); const handleFeeChange = (e) => setNewFee({ ...newFee, [e.target.name]: e.target.value }); const handleAddFeeSubmit = (e) => { e.preventDefault(); const amount = parseFloat(newFee.amount); if (!newFee.feeName || isNaN(amount) || !newFee.dueDate) return alert("Vui lòng nhập đầy đủ thông tin."); const newId = fees.length > 0 ? Math.max(...fees.map(i => i.id)) + 1 : 1; setFees([...fees, { id: newId, studentId: selectedStudentId, feeName: newFee.feeName, amount, dueDate: newFee.dueDate, status: 'Chưa thanh toán' }]); setNewFee({ feeName: '', amount: '', dueDate: '' }); }; const toggleStatus = (feeId) => setFees(fees.map(f => f.id === feeId ? { ...f, status: f.status === 'Đã thanh toán' ? 'Chưa thanh toán' : 'Đã thanh toán' } : f)); return (<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6"><div className="flex items-center gap-4 flex-wrap"><label className="font-medium shrink-0 text-gray-800 dark:text-gray-200">Quản lý học phí cho:</label><div className="flex-grow min-w-[200px]"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm học sinh..."/></div><div className="flex-grow min-w-[200px]"><FormSelect name="studentId" value={selectedStudentId || ''} onChange={(e) => setSelectedStudentId(Number(e.target.value))}>{filteredStudents.length > 0 ? filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>) : <option>Không tìm thấy học sinh</option>}</FormSelect></div></div>{selectedStudentId ? <div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{studentFees.map(f => (<tr key={f.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{f.status}</span></td><td className="p-4 text-center"><button onClick={() => toggleStatus(f.id)} className="text-sm bg-indigo-500 text-white px-3 py-1 rounded">Đổi</button></td></tr>))}</tbody><tfoot className="text-gray-800 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><td className="p-2"><input type="text" name="feeName" value={newFee.feeName} onChange={handleFeeChange} placeholder="Tên khoản thu" className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-amber-500 focus:border-amber-500"/></td><td className="p-2"><input type="number" name="amount" value={newFee.amount} onChange={handleFeeChange} placeholder="Số tiền" className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-amber-500 focus:border-amber-500"/></td><td className="p-2"><input type="date" name="dueDate" value={newFee.dueDate} onChange={handleFeeChange} className="w-full border rounded p-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-amber-500 focus:border-amber-500"/></td><td className="p-2 text-center" colSpan="2"><button onClick={handleAddFeeSubmit} className="bg-amber-500 text-white px-4 py-2 rounded-lg w-full">Thêm</button></td></tr></tfoot></table></div> : <p className="text-gray-500 dark:text-gray-400">Vui lòng chọn một học sinh.</p>}</div>);};
const UserManagementView = ({ users, onAdd, onEdit, onDelete }) => { return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Danh sách Tài khoản</h3> <button onClick={onAdd} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Thêm Tài khoản</button> </div> <div className="overflow-x-auto"> <table className="w-full text-left text-gray-800 dark:text-gray-300"> <thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên hiển thị</th><th className="p-4 font-semibold">Tên đăng nhập</th><th className="p-4 font-semibold">Vai trò</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead> <tbody>{users.map(user => ( <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"> <td className="p-4">{user.name}</td> <td className="p-4">{user.username}</td> <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : user.role === 'teacher' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}`}>{user.role}</span></td> <td className="p-4 text-center space-x-2"> <button onClick={() => onEdit(user)} className="p-2 text-amber-600 disabled:opacity-50" disabled={user.role === 'admin'}><Edit size={18} /></button> <button onClick={() => onDelete(user.id)} className="p-2 text-red-600 disabled:opacity-50" disabled={user.role === 'admin'}><Trash2 size={18} /></button> </td> </tr> ))}</tbody> </table> </div> </div> ); };
const UserFormModal = ({ user, students, teachers, users, onSave, onClose }) => { const isEditing = !!user?.id; const [formData, setFormData] = useState({ username: user?.username || '', password: user?.password || '', role: user?.role || 'student', linkedId: user?.studentId || user?.teacherId || '', }); const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value, linkedId: name === 'role' ? '' : prev.linkedId })); }; const handleSubmit = (e) => { e.preventDefault(); if (!formData.username || (isEditing ? false : !formData.password) || (!isEditing && !formData.linkedId)) { return alert('Vui lòng điền đầy đủ thông tin. Mật khẩu là bắt buộc khi tạo mới.'); } if (!isEditing && users.some(u => u.username === formData.username)) { return alert('Tên đăng nhập đã tồn tại.'); } let finalData = { ...user, ...formData }; if(!formData.password && isEditing) { finalData.password = user.password; } if (!isEditing) { let name = ''; if (formData.role === 'student') { const student = students.find(s => s.id === parseInt(formData.linkedId)); name = `HS: ${student?.name}`; finalData.studentId = parseInt(formData.linkedId); delete finalData.teacherId; } else { const teacher = teachers.find(t => t.id === parseInt(formData.linkedId)); name = `GV: ${teacher?.name}`; finalData.teacherId = parseInt(formData.linkedId); delete finalData.studentId; } finalData.name = name; } onSave('user', finalData); }; return ( <FormModal title={isEditing ? 'Sửa Tài khoản' : 'Thêm Tài khoản mới'} onClose={onClose} onSubmit={handleSubmit}> <FormInput label="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} required /> <FormInput label="Mật khẩu" name="password" type="password" placeholder={isEditing ? "Để trống nếu không đổi" : ""} value={formData.password} onChange={handleChange} required={!isEditing} /> {!isEditing && ( <> <FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}> <option value="student">Học sinh</option> <option value="teacher">Giáo viên</option> </FormSelect> <FormSelect label={formData.role === 'student' ? 'Liên kết với HS' : 'Liên kết với GV'} name="linkedId" value={formData.linkedId} onChange={handleChange} required> <option value="">-- Chọn --</option> {formData.role === 'student' ? students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>) : teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)} </FormSelect> </> )} </FormModal> ); };
const SidebarStudent = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'grades', label: 'Kết quả học tập', icon: BookUser }, { id: 'fees', label: 'Thông tin Học phí', icon: Banknote }, ]; return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-amber-600 text-center lg:text-left"><span className="lg:hidden">HS</span><span className="hidden lg:inline">Cổng Học Sinh</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderStudent = ({ currentUser, studentName, onLogout }) => ( <header className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center flex-wrap gap-2"><div><h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Học sinh: {studentName}</h2><p className="text-gray-500 dark:text-gray-400">Chào mừng, {currentUser.name.replace('HS: ','')}</p></div><div className="flex items-center gap-3"><ThemeToggleButton /><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full"><LogOut size={22} /></button></div></header>);
const StudentGradeView = ({ grades, subjects }) => { const calculateOverallGrade = (grade) => { if (!grade || grade.final == null) return { text: '-', score: -1 }; const score = grade.final; return { text: score.toFixed(1), score: score }; }; const getGradeForLetter = (score) => { if (score >= 8.0) return 'Giỏi'; if (score >= 6.5) return 'Khá'; if (score >= 5.0) return 'TB'; if (score >= 3.5) return 'Yếu'; return 'Kém'; }; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Bảng điểm học kỳ</h3><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Mã môn</th><th className="p-4 font-semibold">Tên môn học</th><th className="p-4 font-semibold text-center">Điểm TX</th><th className="p-4 font-semibold text-center">Điểm CK</th><th className="p-4 font-semibold text-center">Xếp loại</th></tr></thead><tbody>{grades.map(grade => { const subject = subjects.find(c => c.id === grade.subjectId); if (!subject) return null; const overall = calculateOverallGrade(grade); return (<tr key={grade.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4 font-medium">{subject.code}</td><td className="p-4">{subject.name}</td><td className="p-4 text-center">{grade.components ? Object.values(grade.components).join('; ') : '-'}</td><td className="p-4 text-center">{grade.final?.toFixed(1) || '-'}</td><td className="p-4 font-bold text-amber-600 dark:text-amber-400 text-center">{overall.score >= 0 ? getGradeForLetter(overall.score) : '-'}</td></tr>);})}</tbody></table></div></div> ); };
const StudentFeeView = ({ fees, onPay }) => ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Các khoản phí</h3><div className="overflow-x-auto"><table className="w-full text-left text-gray-800 dark:text-gray-300"><thead className="text-gray-700 dark:text-gray-200"><tr className="bg-gray-50 dark:bg-gray-700"><th className="p-4 font-semibold">Tên khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{fees.length > 0 ? fees.map(f => (<tr key={f.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{f.status}</span></td><td className="p-4 text-center">{f.status === 'Chưa thanh toán' ? <button onClick={() => onPay(f)} className="py-1 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Thanh toán</button> : <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />}</td></tr>)) : <tr><td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">Không có khoản phí nào.</td></tr>}</tbody></table></div></div> );
const PaymentModal = ({ fee, onClose, onConfirm }) => { const [paymentMethod, setPaymentMethod] = useState('bank'); return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4"><div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Thanh toán Học phí</h3><button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} /></button></div><div className="space-y-4 text-gray-800 dark:text-gray-200"><p><span className="font-semibold">Khoản phí:</span> {fee.feeName}</p><p className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.amount)}</p><div className="pt-4 border-t border-gray-200 dark:border-gray-600"><p className="font-semibold mb-2">Chọn phương thức:</p><div className="space-y-2"><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><Landmark size={20}/> Chuyển khoản</span></label><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-5 h-5"/> Ví MoMo</span></label><label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><span className="ml-3 flex items-center gap-2"><CreditCard size={20}/> Thẻ tín dụng</span></label></div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button><button type="button" onClick={onConfirm} className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow">Xác nhận</button></div></div></div></div> ); };
const SidebarTeacher = ({ currentUser, currentView, setCurrentView }) => { const navItems = [ { id: 'grades', label: 'Quản lý điểm', icon: BookUser }, { id: 'schedule', label: 'TKB Cá nhân', icon: Calendar }, ]; if(currentUser.role === 'head_of_group') { navItems.push({ id: 'department', label: 'Tổ chuyên môn', icon: Users2 }); } return ( <nav className="w-20 lg:w-64 bg-white dark:bg-gray-800 shadow-lg"><div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl lg:text-2xl font-bold text-amber-600 text-center lg:text-left"><span className="lg:hidden">GV</span><span className="hidden lg:inline">Cổng Giáo viên</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const ScheduleView = ({ schedule, title }) => { const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']; const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">{title}</h3> <div className="overflow-x-auto"> <table className="w-full border-collapse"> <thead className="text-gray-700 dark:text-gray-200"> <tr className="bg-gray-100 dark:bg-gray-700"> <th className="p-2 border border-gray-300 dark:border-gray-600">Tiết</th> {days.map(day => <th key={day} className="p-2 border border-gray-300 dark:border-gray-600">{day}</th>)} </tr> </thead> <tbody className="text-gray-800 dark:text-gray-300"> {periods.map(period => ( <tr key={period}> <td className="p-2 border border-gray-300 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-700/50 text-center">{period}</td> {days.map(day => { const s = schedule.find(item => item.day === day && item.period === period); return ( <td key={day} className={`p-2 border border-gray-300 dark:border-gray-600 text-center h-16 ${s ? 'bg-amber-50 dark:bg-amber-900/40' : ''}`}> {s ? <div><p className="font-semibold">{s.subjectName}</p><p className="text-sm text-gray-500 dark:text-gray-400">{s.className}</p></div> : ''} </td> ) })} </tr> ))} </tbody> </table> </div> </div> ); };
const DepartmentScheduleView = ({ teachers, schedules }) => { const [selectedTeacherId, setSelectedTeacherId] = useState(teachers.length > 0 ? teachers[0].id : null); const selectedSchedule = useMemo(() => schedules.filter(s => s.teacherId === selectedTeacherId), [schedules, selectedTeacherId]); return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Thời khóa biểu Giáo viên trong Tổ</h3> <div className="flex items-center gap-4"> <label className="font-medium text-gray-800 dark:text-gray-200">Chọn giáo viên:</label> <FormSelect value={selectedTeacherId || ''} onChange={(e) => setSelectedTeacherId(Number(e.target.value))}> {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)} </FormSelect> </div> {selectedTeacherId ? <ScheduleView schedule={selectedSchedule} title={`TKB của ${teachers.find(t=>t.id === selectedTeacherId)?.name}`} /> : <p className="text-gray-500 dark:text-gray-400">Chưa có giáo viên trong tổ này.</p>} </div> ) };
const MultiSelectDropdown = ({ label, options, selectedValues, onChange, displayKey = 'name', valueKey = 'id' }) => { const [isOpen, setIsOpen] = useState(false); const dropdownRef = useRef(null); const handleToggle = () => setIsOpen(!isOpen); const handleOptionClick = (value) => { const newSelectedValues = selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value]; onChange(newSelectedValues); }; useEffect(() => { const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [dropdownRef]); const getDisplayText = () => { if (selectedValues.length === 0) return `-- Chọn --`; if (selectedValues.length === 1) { if (label === "Tiết") return `Tiết ${selectedValues[0]}`; const selectedOption = options.find(opt => (typeof opt === 'object' ? opt[valueKey] : opt) === selectedValues[0]); return typeof selectedOption === 'object' ? selectedOption[displayKey] : selectedOption; } return `${selectedValues.length} mục đã chọn`; }; return ( <div className="relative" ref={dropdownRef}> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label> <button type="button" onClick={handleToggle} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-left flex justify-between items-center text-gray-800 dark:text-gray-200" > <span className="truncate">{getDisplayText()}</span> <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /> </button> {isOpen && ( <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"> <ul className="text-gray-800 dark:text-gray-200"> {options.map(option => { const value = typeof option === 'object' ? option[valueKey] : option; const display = typeof option === 'object' ? option[displayKey] : option; return ( <li key={value} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center" onClick={() => handleOptionClick(value)} > <input type="checkbox" checked={selectedValues.includes(value)} readOnly className="mr-2 form-checkbox text-amber-500" /> <span>{display}</span> </li> ); })} </ul> </div> )} </div> ); };
const ScheduleManagementView = ({ schedules, setSchedules, teachers, classes, subjects }) => { const [editing, setEditing] = useState(null); const [form, setForm] = useState({ teacherId: '', classId: '', days: [], periods: [] }); const dayOptions = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']; const periodOptions = Array.from({ length: 10 }, (_, i) => i + 1); const handleEdit = (schedule) => { setEditing(schedule); setForm({ teacherId: schedule.teacherId, classId: schedule.classId, days: [schedule.day], periods: [schedule.period] }); }; const handleDelete = (id) => { if (window.confirm("Bạn có chắc chắn muốn xóa lịch học này?")) { setSchedules(schedules.filter(a => a.id !== id)); } }; const handleChange = (e) => { const { name, value } = e.target; const isNumericField = ['teacherId', 'classId'].includes(name); const processedValue = isNumericField && value ? parseInt(value, 10) : value; setForm({ ...form, [name]: processedValue }); }; const handleMultiSelectChange = (name, values) => { setForm({ ...form, [name]: values }); }; const handleSubmit = (e) => { e.preventDefault(); const { teacherId, classId, days, periods } = form; if (!teacherId || !classId || days.length === 0 || periods.length === 0) { alert("Vui lòng điền đầy đủ thông tin, bao gồm ít nhất một ngày và một tiết."); return; } const checkConflict = (day, period, currentScheduleId = null) => { return schedules.find(a => a.day === day && a.period === period && (a.teacherId === teacherId || a.classId === classId) && a.id !== currentScheduleId); }; if (editing) { const day = days[0]; const period = periods[0]; const conflict = checkConflict(day, period, editing.id); if (conflict) { alert(`Lịch bị trùng! ${conflict.teacherId === teacherId ? `Giáo viên` : `Lớp học`} đã có lịch vào thời gian này.`); return; } setSchedules(schedules.map(a => a.id === editing.id ? { ...a, teacherId, classId, day, period } : a )); } else { const newSchedules = []; let isConflict = false; let lastId = schedules.length > 0 ? Math.max(...schedules.map(a => a.id)) : 0; for (const day of days) { for (const period of periods) { const conflict = checkConflict(day, period); if (conflict) { alert(`Lịch bị trùng! Không thể thêm lịch cho ${day} - Tiết ${period}.`); isConflict = true; break; } newSchedules.push({ id: ++lastId, teacherId, classId, day, period }); } if(isConflict) break; } if (!isConflict) { setSchedules([...schedules, ...newSchedules]); } } handleCancel(); }; const handleCancel = () => { setEditing(null); setForm({ teacherId: '', classId: '', days: [], periods: [] }); }; return ( <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6"> <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Xếp Thời khóa biểu</h3> <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4"> <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{editing ? "Chỉnh sửa Lịch học" : "Thêm Lịch học mới"}</h4> <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"> <FormSelect label="Giáo viên" name="teacherId" value={form.teacherId || ''} onChange={handleChange} required> <option value="">-- Chọn GV --</option> {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)} </FormSelect> <FormSelect label="Lớp học" name="classId" value={form.classId || ''} onChange={handleChange} required> <option value="">-- Chọn lớp --</option> {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </FormSelect> <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end"> <MultiSelectDropdown label="Ngày" options={dayOptions} selectedValues={form.days} onChange={(values) => handleMultiSelectChange('days', values)} /> <MultiSelectDropdown label="Tiết" options={periodOptions} selectedValues={form.periods} onChange={(values) => handleMultiSelectChange('periods', values.sort((a,b) => a-b))} /> <div className="flex gap-2 col-span-full md:col-span-1 self-end"> <button type="submit" className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"> {editing ? "Cập nhật" : "Thêm"} </button> {editing && ( <button type="button" onClick={handleCancel} className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"> Hủy </button> )} </div> </div> </form> </div> <div className="overflow-x-auto"> <table className="w-full text-left mt-4 text-gray-800 dark:text-gray-300"> <thead className="text-gray-700 dark:text-gray-200"> <tr className="bg-gray-50 dark:bg-gray-700"> <th className="p-4 font-semibold">Giáo viên</th> <th className="p-4 font-semibold">Lớp học</th> <th className="p-4 font-semibold">Môn học</th> <th className="p-4 font-semibold">Ngày</th> <th className="p-4 font-semibold">Tiết</th> <th className="p-4 font-semibold text-center">Hành động</th> </tr> </thead> <tbody> {schedules.sort((a,b) => dayOptions.indexOf(a.day) - dayOptions.indexOf(b.day) || a.period - b.period).map(a => { const teacher = teachers.find(t => t.id === a.teacherId); const cls = classes.find(c => c.id === a.classId); const subject = subjects.find(s => s.id === cls?.subjectId); return ( <tr key={a.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"> <td className="p-4">{teacher ? teacher.name : '---'}</td> <td className="p-4">{cls?.name || '---'}</td> <td className="p-4">{subject?.name || '---'}</td> <td className="p-4">{a.day}</td> <td className="p-4 text-center">{a.period}</td> <td className="p-4 text-center space-x-2"> <button onClick={() => handleEdit(a)} className="p-2 text-amber-600"><Edit size={18} /></button> <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600"><Trash2 size={18} /></button> </td> </tr> ); })} </tbody> </table> </div> </div> ); };

export default function App() {
    // Khởi tạo dữ liệu trong localStorage nếu chưa tồn tại
    useEffect(() => {
        const dataToInit = {
            teachers: initialTeachers,
            departments: initialDepartments,
            subjects: initialSubjects,
            classes: initialClasses,
            schedules: initialSchedules,
            users: initialUsers,
            students: initialStudents,
            enrollments: initialEnrollments,
            grades: initialGrades,
            fees: initialFees,
        };
        for (const key in dataToInit) {
            // Chỉ khởi tạo nếu key chưa tồn tại, để tránh ghi đè dữ liệu người dùng đã thay đổi
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
