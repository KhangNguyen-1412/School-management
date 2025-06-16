import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, BookUser, Banknote, LayoutDashboard, Plus, X, Edit, Trash2, Search, AlertCircle, LogOut, FileUp, Users, ShieldCheck, CreditCard, Landmark, Home, UserCheck, Library, Briefcase, Calendar, Star, Users2 } from 'lucide-react';

// === Dữ liệu khởi tạo (Trong ứng dụng thực tế sẽ là CSDL) ===
const initialTeachers = [ { id: 1, name: 'Trần Thị A', gender: 'Nữ', dob: '1985-10-20', phone: '0912345678', departmentId: 1, role: 'department_head' }, { id: 2, name: 'Lê Văn B', gender: 'Nam', dob: '1980-05-15', phone: '0987654321', departmentId: 2, role: 'teacher' }, { id: 3, name: 'Nguyễn Thị C', gender: 'Nữ', dob: '1990-01-01', phone: '0905556677', departmentId: 1, role: 'teacher' }, ];
const initialDepartments = [ { id: 1, name: 'Tổ Tự nhiên' }, { id: 2, name: 'Tổ Xã hội' } ];
const initialSubjects = [ { id: 1, name: 'Toán', departmentId: 1 }, { id: 2, name: 'Vật lý', departmentId: 1 }, { id: 3, name: 'Ngữ Văn', departmentId: 2 }, { id: 4, name: 'Lịch Sử', departmentId: 2 }, ];
const initialClasses = [ { id: 1, name: 'Lớp 10A1', homeroomTeacherId: 3 }, { id: 2, name: 'Lớp 10A2', homeroomTeacherId: 2 }, { id: 3, name: 'Lớp 11B1', homeroomTeacherId: 1 }, ];
const initialAssignments = [ { id: 1, teacherId: 1, classId: 1, subjectId: 1}, { id: 2, teacherId: 1, classId: 2, subjectId: 1 }, { id: 3, teacherId: 2, classId: 2, subjectId: 3}, { id: 4, teacherId: 3, classId: 1, subjectId: 2}, ];
const initialSchedules = [ { id: 1, teacherId: 1, day: 'Thứ 2', period: 1, className: '10A1', subjectName: 'Toán' }, { id: 2, teacherId: 1, day: 'Thứ 2', period: 2, className: '10A2', subjectName: 'Toán' }, { id: 3, teacherId: 2, day: 'Thứ 2', period: 3, className: '10A2', subjectName: 'Ngữ Văn' }, { id: 4, teacherId: 3, day: 'Thứ 3', period: 1, className: '10A1', subjectName: 'Vật lý' }, ];
const initialUsers = [ { id: 1, username: 'admin', password: 'admin123', role: 'admin' }, { id: 2, username: 'phuhuynh_an', password: 'password', role: 'parent', studentId: 1 }, { id: 3, username: 'gv_a', password: 'password', role: 'teacher', teacherId: 1 }, { id: 4, username: 'gv_b', password: 'password', role: 'teacher', teacherId: 2 }, ];
const initialStudents = [ { id: 1, name: 'Nguyễn Văn An', gender: 'Nam', dob: '2008-05-15', classId: 1, address: '123 Đường ABC, Quận 1', parentName: 'Nguyễn Văn Ba', parentPhone: '0901234567' }, { id: 2, name: 'Trần Thị Bình', gender: 'Nữ', dob: '2008-09-22', classId: 1, address: '456 Đường XYZ, Quận 3', parentName: 'Trần Văn Cảnh', parentPhone: '0912345678' }, { id: 3, name: 'Lê Hoàng Cường', gender: 'Nam', dob: '2009-02-10', classId: 2, address: '789 Đường LMN, Quận 10', parentName: 'Lê Thị Diệu', parentPhone: '0987654321' }, ];
const initialGrades = [ { id: 1, studentId: 1, subjectId: 1, heso1: [8, 9], heso2: [8.5], final: 9.5 }, { id: 2, studentId: 1, subjectId: 3, heso1: [7, 7.5], heso2: [8], final: 8 }, ];
const initialFees = [ { id: 1, studentId: 1, feeName: 'Học phí Tháng 9/2024', amount: 2000000, status: 'Chưa thanh toán' } ];

const teacherRoles = {
  principal: 'Hiệu trưởng',
  vice_principal: 'Hiệu phó',
  general_in_charge: 'Tổng phụ trách',
  department_head: 'Tổ trưởng',
  deputy_department_head: 'Tổ phó',
  teacher: 'Giáo viên',
};

// === Main App Component ===
export default function App() {
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
    const allClasses = JSON.parse(localStorage.getItem('classes')) || initialClasses;

    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
      let userData = { ...user };
      if(user.role === 'teacher' && user.teacherId) {
          const teacherInfo = allTeachers.find(t => t.id === user.teacherId);
          const homeroomClass = allClasses.find(c => c.homeroomTeacherId === user.teacherId);
          userData = { ...userData, ...teacherInfo, isHomeroom: !!homeroomClass, homeroomClassId: homeroomClass?.id };
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

  if (loading) return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  
  const roleComponent = {
      admin: <AdminApplication currentUser={currentUser} onLogout={handleLogout} />,
      parent: <ParentApplication currentUser={currentUser} onLogout={handleLogout} />,
      teacher: <TeacherApplication currentUser={currentUser} onLogout={handleLogout} />,
  };
  return roleComponent[currentUser.role] || <LoginScreen onLogin={handleLogin}/>;
}

// === Login Screen ===
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); const success = await onLogin(username, password); if (!success) setError('Tên đăng nhập hoặc mật khẩu không đúng.'); };
  return ( <div className="flex items-center justify-center h-screen bg-gray-100"><div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"><h2 className="text-3xl font-bold text-center text-gray-800">Cổng Thông Tin Trường Học</h2><form onSubmit={handleSubmit} className="space-y-6"><div><label className="text-sm font-bold text-gray-600 block">Tên đăng nhập</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mt-2 text-gray-700 bg-gray-50 rounded-lg" required /></div><div><label className="text-sm font-bold text-gray-600 block">Mật khẩu</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mt-2 text-gray-700 bg-gray-50 rounded-lg" required /></div>{error && <p className="text-red-500 text-sm text-center">{error}</p>}<div><button type="submit" className="w-full py-3 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Đăng nhập</button></div><div className="text-center text-sm text-gray-500 pt-4 border-t"><p className="font-semibold mb-2">Tài khoản mẫu:</p><p><span className="font-medium">Admin:</span> admin / admin123</p><p><span className="font-medium">GVCN:</span> gv_b / password</p><p><span className="font-medium">GV/Tổ trưởng:</span> gv_a / password</p></div></form></div></div> );
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
  const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem('assignments')) || initialAssignments);

  const [modal, setModal] = useState({ type: null, data: null });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const data = { students, grades, fees, teachers, classes, subjects, departments, users, assignments };
    for (const key in data) localStorage.setItem(key, JSON.stringify(data[key]));
  }, [students, grades, fees, teachers, classes, subjects, departments, users, assignments]);

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });
  const handleDelete = (action) => { setConfirmAction(() => action); setIsConfirmModalOpen(true); };
  const handleCloseConfirmModal = () => { setIsConfirmModalOpen(false); setConfirmAction(null); };

  const handleSave = (type, data) => {
    const saveData = (state, setState) => {
      if (data.id) setState(state.map(item => item.id === data.id ? data : item));
      else { const newId = state.length > 0 ? Math.max(...state.map(i => i.id)) + 1 : 1; setState([...state, { ...data, id: newId }]); }
    };
    const map = { student: [students, setStudents], teacher: [teachers, setTeachers], class: [classes, setClasses], user: [users, setUsers], assignment: [assignments, setAssignments]};
    if (map[type]) saveData(...map[type]);
    closeModal();
  };

  const handleSaveDepartment = (deptData, newSubjects) => {
      let savedDept = deptData;
      if(deptData.id) { // Update existing
          setDepartments(departments.map(d => d.id === deptData.id ? deptData : d));
      } else { // Create new
          const newId = departments.length > 0 ? Math.max(...departments.map(i => i.id)) + 1 : 1;
          savedDept = { ...deptData, id: newId };
          setDepartments([...departments, savedDept]);
      }

      const otherSubjects = subjects.filter(s => s.departmentId !== savedDept.id);
      const updatedSubjects = newSubjects.map((sub, index) => {
          if(typeof sub.id === 'number') return {...sub, departmentId: savedDept.id }; // existing subject
          const newSubId = (subjects.length > 0 ? Math.max(...subjects.map(s => s.id).filter(id => typeof id === 'number')) : 0) + Date.now() + index; // ensure unique id
          return { ...sub, id: newSubId, departmentId: savedDept.id };
      });
      setSubjects([...otherSubjects, ...updatedSubjects]);
      closeModal();
  }

  const renderView = () => {
    const views = {
        dashboard: <DashboardView studentCount={students.length} teacherCount={teachers.length} classCount={classes.length} />,
        profiles: <StudentProfileView allStudents={students} classes={classes} onAdd={(data) => openModal('student', data)} onEdit={(s) => openModal('student', s)} onDelete={(id) => handleDelete(() => { setStudents(students.filter(s => s.id !== id)); handleCloseConfirmModal(); })} />,
        grades: <GradeManagementView students={students} grades={grades} setGrades={setGrades} classes={classes} subjects={subjects} />,
        fees: <FeeManagementView allStudents={students} fees={fees} setFees={setFees} />,
        users: <UserManagementView users={users} onAdd={() => openModal('user')} onEdit={(user) => openModal('user', user)} onDelete={(id) => handleDelete(() => { if (id === 1) return alert("Không thể xóa Admin gốc."); setUsers(users.filter(u => u.id !== id)); handleCloseConfirmModal(); })} />,
        teachers: <TeacherManagementView allTeachers={teachers} departments={departments} onAdd={() => openModal('teacher')} onEdit={(t) => openModal('teacher', t)} onDelete={(id) => handleDelete(() => { setTeachers(teachers.filter(t => t.id !== id)); handleCloseConfirmModal(); })} />,
        classes: <ClassManagementView classes={classes} teachers={teachers} onAdd={() => openModal('class')} onEdit={(c) => openModal('class', c)} onDelete={(id) => handleDelete(() => { setClasses(classes.filter(c => c.id !== id)); handleCloseConfirmModal(); })} />,
        departments: <DepartmentManagementView departments={departments} subjects={subjects} teachers={teachers} onAddDept={() => openModal('department')} onEditDept={(d) => openModal('department', d)} onDeleteDept={(id) => handleDelete(() => { setDepartments(departments.filter(d => d.id !== id)); handleCloseConfirmModal(); })} />,
        assignments: <AssignmentView assignments={assignments} setAssignments={setAssignments} teachers={teachers} classes={classes} subjects={subjects} />
    };
    return views[currentView] || views.dashboard;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SidebarAdmin currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto"><HeaderAdmin currentUser={currentUser} onLogout={onLogout} />{renderView()}</main>
      {modal.type === 'student' && <StudentFormModal student={modal.data} onSave={(d) => handleSave('student', d)} onClose={closeModal} />}
      {modal.type === 'teacher' && <TeacherFormModal teacher={modal.data} departments={departments} onSave={(d) => handleSave('teacher', d)} onClose={closeModal} />}
      {modal.type === 'class' && <ClassFormModal classData={modal.data} teachers={teachers} onSave={(d) => handleSave('class', d)} onClose={closeModal} />}
      {modal.type === 'department' && <DepartmentFormModal department={modal.data} allSubjects={subjects} onSave={handleSaveDepartment} onClose={closeModal} />}
      {modal.type === 'user' && <UserFormModal user={modal.data} students={students} teachers={teachers} users={users} onSave={(d) => handleSave('user', d)} onClose={closeModal} />}
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal} onConfirm={confirmAction} title="Xác nhận Xóa" message="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác." />
    </div>
  );
};

const ParentApplication = ({ currentUser, onLogout }) => {
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
  const handleConfirmPayment = () => {
    setFees(prevFees => prevFees.map(fee => fee.id === payingFee.id ? { ...fee, status: 'Đã thanh toán' } : fee));
    handleClosePaymentModal();
    alert(`Đã xác nhận thanh toán cho khoản "${payingFee.feeName}".`);
  };

  const renderView = () => {
    if (!myStudent) { return <div className="text-center p-8 bg-white rounded-lg shadow">Không tìm thấy thông tin học sinh.</div> }
    switch (currentView) {
      case 'grades': return <StudentGradeView grades={myGrades} subjects={allSubjects} />;
      case 'fees': return <StudentFeeView fees={myFees} onPay={handleOpenPaymentModal} />;
      default: return <StudentGradeView grades={myGrades} subjects={allSubjects} />;
    }
  };

  return (<div className="flex h-screen bg-gray-100 font-sans"><SidebarParent currentView={currentView} setCurrentView={setCurrentView} /><main className="flex-1 p-4 md:p-8 overflow-y-auto"><HeaderParent currentUser={currentUser} studentName={myStudent?.name} onLogout={onLogout} />{renderView()}</main>{isPaymentModalOpen && <PaymentModal fee={payingFee} onClose={handleClosePaymentModal} onConfirm={handleConfirmPayment} />}</div>);
};

const TeacherApplication = ({ currentUser, onLogout }) => {
    const [currentView, setCurrentView] = useState('grades');
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];
    const [allGrades, setAllGrades] = useState(() => JSON.parse(localStorage.getItem('grades')) || initialGrades);
    const allClasses = JSON.parse(localStorage.getItem('classes')) || [];
    const allSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const allAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const allSchedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const allTeachers = JSON.parse(localStorage.getItem('teachers')) || [];

    const myAssignments = useMemo(() => allAssignments.filter(a => a.teacherId === currentUser.id), [allAssignments, currentUser.id]);
    const myClassIds = useMemo(() => [...new Set(myAssignments.map(a => a.classId))], [myAssignments]);
    const myClasses = useMemo(() => allClasses.filter(c => myClassIds.includes(c.id)), [allClasses, myClassIds]);
    const mySchedule = useMemo(() => allSchedules.filter(s => s.teacherId === currentUser.id), [allSchedules, currentUser.id]);
    const myDepartmentMembers = useMemo(() => {
        if (currentUser.role !== 'department_head') return [];
        return allTeachers.filter(t => t.departmentId === currentUser.departmentId);
    }, [allTeachers, currentUser]);

    useEffect(() => {
        localStorage.setItem('grades', JSON.stringify(allGrades));
    }, [allGrades]);
    
    const renderView = () => {
        const homeroomStudents = currentUser.isHomeroom ? allStudents.filter(s => s.classId === currentUser.homeroomClassId) : [];
        const homeroomGrades = currentUser.isHomeroom ? allGrades.filter(g => homeroomStudents.some(s => s.id === g.studentId)) : [];

        const views = {
            grades: <GradeManagementView students={allStudents} grades={allGrades} setGrades={setAllGrades} classes={myClasses} subjects={allSubjects} assignments={myAssignments} teacherId={currentUser.id} />,
            homeroom: currentUser.isHomeroom ? <HomeroomView students={homeroomStudents} grades={homeroomGrades} subjects={allSubjects} /> : null,
            schedule: <ScheduleView schedule={mySchedule} title="Thời khóa biểu cá nhân" />,
            department: currentUser.role === 'department_head' ? <DepartmentScheduleView teachers={myDepartmentMembers} schedules={allSchedules} /> : null
        };
        return views[currentView] || views.grades;
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <SidebarTeacher currentUser={currentUser} currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <HeaderAdmin currentUser={currentUser} onLogout={onLogout} />
                {renderView()}
            </main>
        </div>
    );
};


// === Reusable & General Components ===
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"><div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 text-center"><div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"><AlertCircle className="h-6 w-6 text-red-600" /></div><h3 className="text-lg font-medium text-gray-900 mt-4">{title}</h3><div className="mt-2"><p className="text-sm text-gray-500">{message}</p></div><div className="mt-5 flex justify-center gap-4"><button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50">Hủy</button><button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 font-medium text-white hover:bg-red-700">Xác nhận</button></div></div></div> ); };
const DashboardView = ({ studentCount, teacherCount, classCount }) => ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-blue-500"><div className="bg-blue-100 p-4 rounded-full"><Users className="text-blue-500" size={32} /></div><div><h3 className="text-gray-500 text-lg">Tổng số Học sinh</h3><p className="text-3xl font-bold">{studentCount}</p></div></div> <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-green-500"><div className="bg-green-100 p-4 rounded-full"><UserCheck className="text-green-500" size={32} /></div><div><h3 className="text-gray-500 text-lg">Tổng số Giáo viên</h3><p className="text-3xl font-bold">{teacherCount}</p></div></div> <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6 border-l-4 border-yellow-500"><div className="bg-yellow-100 p-4 rounded-full"><Home className="text-yellow-500" size={32} /></div><div><h3 className="text-gray-500 text-lg">Tổng số Lớp học</h3><p className="text-3xl font-bold">{classCount}</p></div></div> </div> );
const FormModal = ({ title, onClose, onSubmit, children }) => ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800">{title}</h3><button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={24} /></button></div><form onSubmit={onSubmit} className="space-y-4">{children}<div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Hủy</button><button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow">Lưu</button></div></form></div></div> );
const FormInput = ({ label, name, value, onChange, required = false, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input name={name} value={value} onChange={onChange} className="w-full border rounded-lg p-2" required={required} {...props} /></div>);
const FormSelect = ({ label, name, value, onChange, children, required = false }) => (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><select name={name} value={value} onChange={onChange} className="w-full border rounded-lg p-2" required={required}>{children}</select></div>);
const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => ( <div className="relative"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /> <input type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50" /> </div> );

// === Admin Components ===
const SidebarAdmin = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard }, { id: 'departments', label: 'Tổ Bộ môn', icon: Library }, { id: 'teachers', label: 'Quản lý Giáo viên', icon: UserCheck }, { id: 'classes', label: 'Quản lý Lớp học', icon: Home }, { id: 'assignments', label: 'Phân công GD', icon: Briefcase }, { id: 'profiles', label: 'Quản lý Hồ sơ HS', icon: Users }, { id: 'grades', label: 'Quản lý Điểm số', icon: BookUser }, { id: 'fees', label: 'Quản lý Học phí', icon: Banknote }, { id: 'users', label: 'Quản lý Tài khoản', icon: ShieldCheck }, ]; return ( <nav className="w-20 lg:w-64 bg-white shadow-lg"><div className="p-4 lg:p-6 border-b"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">QLHS</span><span className="hidden lg:inline">Quản Lý Học Sinh</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderAdmin = ({ currentUser, onLogout }) => ( <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center"> <h2 className="text-2xl font-bold text-gray-800">Hệ thống Quản lý Trường học</h2> <div className="flex items-center gap-3"><span className="text-gray-600 hidden md:inline">Chào, <span className="font-bold">{currentUser.name || 'Admin'}</span></span><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full"><LogOut size={22} /></button></div></div>);

const DepartmentManagementView = ({ departments, subjects, teachers, onAddDept, onEditDept, onDeleteDept }) => {
    const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || null);
    const departmentTeachers = useMemo(() => teachers.filter(t => t.departmentId === selectedDeptId), [teachers, selectedDeptId]);
    const getTitle = (gender) => gender === 'Nữ' ? 'Cô' : 'Thầy';
    const departmentSubjects = useMemo(() => subjects.filter(s => s.departmentId === selectedDeptId), [subjects, selectedDeptId]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-700">Tổ Bộ môn</h3>
                        <button onClick={onAddDept} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">Thêm Tổ</button>
                    </div>
                    <ul className="space-y-2">{departments.map(dept => (<li key={dept.id} onClick={() => setSelectedDeptId(dept.id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${selectedDeptId === dept.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}><span className="font-medium">{dept.name}</span><div className="space-x-2"><button onClick={(e) => { e.stopPropagation(); onEditDept(dept); }} className="p-1 text-blue-600"><Edit size={16}/></button><button onClick={(e) => { e.stopPropagation(); onDeleteDept(dept.id);}} className="p-1 text-red-600"><Trash2 size={16}/></button></div></li>))}</ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Thông tin Tổ: {departments.find(d=>d.id === selectedDeptId)?.name}</h3>
                    {selectedDeptId ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Các môn học</h4>
                                <ul className="space-y-1 list-disc list-inside">{departmentSubjects.map(sub => <li key={sub.id}>{sub.name}</li>)}</ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-600 mb-2">Giáo viên trong Tổ</h4>
                                <ul className="space-y-2">{departmentTeachers.map(teacher => {
                                    return (
                                    <li key={teacher.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{`${getTitle(teacher.gender)} ${teacher.name}`}</p>
                                        </div>
                                    </li>
                                )})}</ul>
                            </div>
                        </div>
                    ) : <p className="text-gray-500">Chọn một tổ để xem chi tiết.</p>}
                </div>
            </div>
        </div>
    );
};
const DepartmentFormModal = ({ department, allSubjects, onSave, onClose }) => { 
    const [name, setName] = useState(department?.name || '');
    const [subjects, setSubjects] = useState(() => allSubjects.filter(s => s.departmentId === department?.id));
    const [newSubject, setNewSubject] = useState('');

    const handleAddSubject = () => {
        if(newSubject.trim() === '') return;
        setSubjects([...subjects, { id: `new-${Date.now()}`, name: newSubject.trim() }]);
        setNewSubject('');
    }
    const handleRemoveSubject = (subjectId) => {
        setSubjects(subjects.filter(s => s.id !== subjectId));
    }

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        onSave({ ...department, name }, subjects); 
    }; 
    return ( 
        <FormModal title={department ? 'Sửa Tổ Bộ môn' : 'Thêm Tổ Bộ môn'} onClose={onClose} onSubmit={handleSubmit}>
            <FormInput label="Tên Tổ Bộ môn" name="name" value={name} onChange={e => setName(e.target.value)} required />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Các môn học</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subjects.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span>{sub.name}</span>
                            <button type="button" onClick={() => handleRemoveSubject(sub.id)} className="p-1 text-red-500 hover:text-red-700">
                                <X size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
                 <div className="flex gap-2 mt-2">
                    <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Tên môn học mới" className="flex-grow border rounded-lg p-2"/>
                    <button type="button" onClick={handleAddSubject} className="bg-green-500 text-white px-4 rounded-lg">Thêm</button>
                </div>
            </div>
        </FormModal> 
    );
};
const TeacherManagementView = ({ allTeachers, departments, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredTeachers = useMemo(() => allTeachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())), [allTeachers, searchTerm]);
    const getTitle = (gender) => gender === 'Nữ' ? 'Cô' : 'Thầy';
    return (<div className="bg-white p-6 rounded-xl shadow-sm"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><h3 className="text-xl font-bold text-gray-700">Quản lý Giáo viên</h3><div className="flex items-center gap-2 flex-grow sm:flex-grow-0"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm giáo viên..." /><button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm</button></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">Giới tính</th><th className="p-4 font-semibold">Vai trò</th><th className="p-4 font-semibold">Tổ Bộ môn</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredTeachers.map(t => { const dept = departments.find(d => d.id === t.departmentId); return (<tr key={t.id} className="border-b hover:bg-gray-50"><td className="p-4">{`${getTitle(t.gender)} ${t.name}`}</td><td className="p-4">{t.gender}</td><td className="p-4">{teacherRoles[t.role] || t.role}</td><td className="p-4">{dept?.name || 'Chưa có'}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(t)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(t.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>)})}</tbody></table></div></div>);
};
const TeacherFormModal = ({ 
    teacher, departments, onSave, onClose 
}) => { 
    const [formData, setFormData] = useState({ 
        name: teacher?.name || '', 
        gender: teacher?.gender || 'Nam', 
        dob: teacher?.dob || '', 
        phone: teacher?.phone || '', 
        departmentId: teacher?.departmentId || '', 
        role: teacher?.role || 'teacher' 
    }); 
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); 
    const handleSubmit = e => { 
        e.preventDefault(); 
        onSave({ ...teacher, ...formData, departmentId: parseInt(formData.departmentId) }); 
    }; 
    return (
    <FormModal title={
        teacher ? 'Sửa thông tin Giáo viên' : 'Thêm Giáo viên'
    } 
    onClose={onClose} 
    onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Họ tên" name="name" value={formData.name} 
            onChange={handleChange} required />
            <FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
            <FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </FormSelect>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect label="Tổ bộ môn" name="departmentId" value={formData.departmentId} 
            onChange={handleChange}>
                <option value="">Chọn tổ</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </FormSelect>
            <FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}>
                {Object.entries(teacherRoles).map(([roleKey, roleName]) => (
                    <option key={roleKey} value={roleKey}>{roleName}</option>
                ))}
            </FormSelect>
        </div>
    </FormModal>); };
const ClassManagementView = ({ 
    classes, teachers, onAdd, onEdit, onDelete 
}) => ( 
<div className="bg-white p-6 rounded-xl shadow-sm"> 
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-700">Danh sách Lớp học</h3>
        <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm Lớp</button>
    </div> 
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="bg-gray-50">
                    <th className="p-4 font-semibold">Tên lớp</th>
                    <th className="p-4 font-semibold">Giáo viên Chủ nhiệm</th>
                    <th className="p-4 font-semibold text-center">Hành động</th>
                </tr>
            </thead>
            <tbody>{classes.map(c => { 
                const teacher = teachers.find(t => t.id === c.homeroomTeacherId); 
                return (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{c.name}</td>
                    <td className="p-4">{teacher ? `${teacher.gender === 'Nữ' ? 'Cô' : 'Thầy'} ${teacher.name}` : 'Chưa phân công'}</td>
                    <td className="p-4 text-center space-x-2">
                        <button onClick={() => onEdit(c)} className="p-2 text-blue-600"><Edit size={18}/></button>
                        <button onClick={() => onDelete(c.id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                    </td>
                </tr>);
            })}
            </tbody>
        </table>
    </div> 
</div> );
const ClassFormModal = ({ 
    classData, teachers, onSave, onClose 
}) => { 
    const [formData, setFormData] = useState({ 
        name: classData?.name || '', 
        homeroomTeacherId: classData?.homeroomTeacherId || '' 
    }); 
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); 
    const handleSubmit = e => { e.preventDefault(); 
        onSave({ ...classData, ...formData, homeroomTeacherId: parseInt(formData.homeroomTeacherId) }); 
    }; 
    return (
    <FormModal title={classData ? 'Sửa thông tin Lớp' : 'Thêm Lớp mới'} 
    onClose={onClose} onSubmit={handleSubmit}>
        <FormInput label="Tên lớp" name="name" value={formData.name} onChange={handleChange} required />
        <FormSelect label="GVCN" name="homeroomTeacherId" value={formData.homeroomTeacherId} onChange={handleChange}>
            <option value="">Chọn giáo viên</option>{teachers.map(t => <option key={t.id} value={t.id}>{`${t.gender === 'Nữ' ? 'Cô' : 'Thầy'} ${t.name}`}</option>)}
        </FormSelect>
    </FormModal>); 
    };
const StudentProfileView = ({ allStudents, classes, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || null);

    const filteredStudents = useMemo(() => {
        return allStudents
            .filter(student => selectedClassId ? student.classId === selectedClassId : true)
            .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allStudents, selectedClassId, searchTerm]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h3 className="text-xl font-bold text-gray-700">Hồ sơ Học sinh</h3>
                <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                     <FormSelect name="classId" value={selectedClassId || ''} onChange={(e) => setSelectedClassId(Number(e.target.value))}>
                        <option value="">Tất cả các lớp</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </FormSelect>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm trong lớp..." />
                    <button onClick={() => onAdd({classId: selectedClassId})} className="bg-blue-500 text-white px-4 py-2 rounded-lg shrink-0">Thêm</button>
                </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Họ tên</th><th className="p-4 font-semibold">Ngày sinh</th><th className="p-4 font-semibold">Giới tính</th><th className="p-4 font-semibold">Địa chỉ</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{filteredStudents.map(s => (<tr key={s.id} className="border-b hover:bg-gray-50"><td className="p-4">{s.name}</td><td className="p-4">{s.dob}</td><td className="p-4">{s.gender}</td><td className="p-4">{s.address}</td><td className="p-4 text-center space-x-2"><button onClick={() => onEdit(s)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => onDelete(s.id)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div>
        </div>
    );
};
const StudentFormModal = ({ student, onSave, onClose }) => { const [formData, setFormData] = useState({ name: student?.name || '', dob: student?.dob || '', gender: student?.gender || 'Nam', address: student?.address || '', classId: student?.classId || '', parentName: student?.parentName || '', parentPhone: student?.parentPhone || '' }); const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value })); const handleSubmit = (e) => { e.preventDefault(); onSave({ ...student, ...formData }); }; return ( <FormModal title={student?.id ? 'Sửa Hồ sơ' : 'Thêm Học sinh mới'} onClose={onClose} onSubmit={handleSubmit}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} required /><FormSelect label="Giới tính" name="gender" value={formData.gender} onChange={handleChange}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></FormSelect></div><FormInput label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required /><FormInput label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Tên phụ huynh" name="parentName" value={formData.parentName} onChange={handleChange} /><FormInput label="SĐT phụ huynh" name="parentPhone" value={formData.parentPhone} onChange={handleChange} /></div></FormModal> ); };
const GradeManagementView = ({ students, grades, setGrades, classes, subjects, assignments, teacherId }) => { const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || null); const [editingCell, setEditingCell] = useState(null); const [cellValue, setCellValue] = useState(''); const classStudents = useMemo(() => students.filter(s => s.classId === selectedClassId), [students, selectedClassId]); const classSubjects = useMemo(() => { if (!teacherId) return subjects; const assignedSubjectIds = assignments.filter(a => a.teacherId === teacherId && a.classId === selectedClassId).map(a => a.subjectId); return subjects.filter(s => assignedSubjectIds.includes(s.id)); }, [subjects, assignments, teacherId, selectedClassId]); const handleCellClick = (studentId, subjectId, type, score, index = -1) => { setEditingCell({ studentId, subjectId, type, index }); setCellValue(score); }; const handleCellValueChange = (e) => setCellValue(e.target.value); const handleUpdateGrade = () => { if (!editingCell) return; const { studentId, subjectId, type, index } = editingCell; const newScore = parseFloat(cellValue); if (isNaN(newScore) && cellValue !== '') { setEditingCell(null); return; } const scoreToSave = cellValue === '' ? null : newScore; setGrades(prevGrades => { const gradeRecord = prevGrades.find(g => g.studentId === studentId && g.subjectId === subjectId); if (gradeRecord) { return prevGrades.map(g => { if (g.studentId === studentId && g.subjectId === subjectId) { const updatedGrade = { ...g }; if (type === 'final') { updatedGrade.final = scoreToSave; } else { const newScores = [...(updatedGrade[type] || [])]; if (index > -1) { if (scoreToSave === null) { newScores.splice(index, 1); } else { newScores[index] = scoreToSave; } } else if (scoreToSave !== null) { newScores.push(scoreToSave); } updatedGrade[type] = newScores; } return updatedGrade; } return g; }); } else { if (scoreToSave === null) return prevGrades; const newGrade = { id: Date.now(), studentId, subjectId, heso1: [], hs2: [], final: null }; if (type === 'final') { newGrade.final = scoreToSave; } else { newGrade[type].push(scoreToSave); } return [...prevGrades, newGrade]; } }); setEditingCell(null); }; const calculateTBM = (studentId, subjectId) => { const grade = grades.find(g => g.studentId === studentId && g.subjectId === subjectId); if (!grade) return '-'; const heso1 = grade.heso1 || []; const hs2 = grade.hs2 || []; const final = grade.final; const sumHeso1 = heso1.reduce((a, b) => a + b, 0); const sumHeso2 = hs2.reduce((a, b) => a + b, 0); const totalPoints = sumHeso1 + (sumHeso2 * 2) + (final !== null ? final * 3 : 0); const totalFactors = heso1.length + (hs2.length * 2) + (final !== null ? 3 : 0); if (totalFactors === 0) return '-'; return (totalPoints / totalFactors).toFixed(2); }; return ( <div className="bg-white p-6 rounded-xl shadow-sm space-y-6"> <div className="flex items-center gap-4"> <label className="font-medium">Chọn lớp:</label> <select value={selectedClassId || ''} onChange={(e) => setSelectedClassId(Number(e.target.value))} className="border rounded-lg p-2"> {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </select> </div> <div className="overflow-x-auto"> <table className="w-full border-collapse text-center"> <thead> <tr className="bg-gray-100"> <th className="p-2 border" rowSpan="2">Học sinh</th> {classSubjects.map(sub => ( <th key={sub.id} className="p-2 border" colSpan="4">{sub.name}</th> ))} </tr> <tr className="bg-gray-50"> {classSubjects.map(sub => ( <React.Fragment key={sub.id}> <th className="p-2 border text-xs font-medium">HS1</th> <th className="p-2 border text-xs font-medium">HS2</th> <th className="p-2 border text-xs font-medium">Cuối kỳ</th> <th className="p-2 border text-xs font-semibold">TBM</th> </React.Fragment> ))} </tr> </thead> <tbody> {classStudents.map(student => ( <tr key={student.id} className="hover:bg-gray-50"> <td className="p-2 border font-medium text-left">{student.name}</td> {classSubjects.flatMap(subject => { const grade = grades.find(g => g.studentId === student.id && g.subjectId === subject.id) || { heso1: [], hs2: [], final: null }; const isEditing = (type, index = -1) => editingCell?.studentId === student.id && editingCell?.subjectId === subject.id && editingCell?.type === type && editingCell?.index === index; const renderCell = (type, score, index = -1) => (isEditing(type, index) ? <input type="number" value={cellValue} onChange={handleCellValueChange} onBlur={handleUpdateGrade} onKeyDown={e => e.key === 'Enter' && handleUpdateGrade()} autoFocus className="w-12 text-center bg-yellow-100 border-blue-500 border-2 rounded"/> : <span onClick={() => handleCellClick(student.id, subject.id, type, score ?? '', index)} className="cursor-pointer hover:bg-yellow-100 rounded px-1">{score ?? '-'}</span> ); const renderScoreList = (type, scoreArray) => (<> {scoreArray && scoreArray.length > 0 ? scoreArray.map((s, i) => ( <React.Fragment key={`${type}-${s}-${i}`}> {renderCell(type, s, i)} {i < scoreArray.length - 1 && ', '} </React.Fragment> )) : (isEditing(type, -1) ? null : renderCell(type, null, -1) )} {isEditing(type, -1) && ( <input type="number" value={cellValue} onChange={handleCellValueChange} onBlur={handleUpdateGrade} onKeyDown={e => e.key === 'Enter' && handleUpdateGrade()} autoFocus className="w-12 text-center bg-yellow-100 border-blue-500 border-2 rounded"/> )} </>); return [ <td key={`${subject.id}-hs1`} className="p-2 border text-sm" onClick={(e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN') handleCellClick(student.id, subject.id, 'heso1', '', -1) }}> {renderScoreList('heso1', grade.heso1)} </td>, <td key={`${subject.id}-hs2`} className="p-2 border text-sm" onClick={(e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN') handleCellClick(student.id, subject.id, 'hs2', '', -1) }}> {renderScoreList('hs2', grade.hs2)} </td>, <td key={`${subject.id}-final`} className="p-2 border text-sm"> {renderCell('final', grade.final, -1)} </td>, <td key={`${subject.id}-tbm`} className="p-2 border text-sm font-semibold bg-gray-50"> {calculateTBM(student.id, subject.id)} </td> ]; })} </tr> ))} </tbody> </table> </div> </div> ); };
const FeeManagementView = ({ allStudents, fees, setFees }) => { const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = useMemo(() => allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase())), [allStudents, searchTerm]); const [selectedStudentId, setSelectedStudentId] = useState(filteredStudents[0]?.id || null); useEffect(() => { if (!filteredStudents.find(s => s.id === selectedStudentId)) { setSelectedStudentId(filteredStudents[0]?.id || null); } }, [filteredStudents, selectedStudentId]); const [newFee, setNewFee] = useState({ feeName: '', amount: '', dueDate: '' }); const studentFees = useMemo(() => fees.filter(f => f.studentId === selectedStudentId), [fees, selectedStudentId]); const handleFeeChange = (e) => setNewFee({ ...newFee, [e.target.name]: e.target.value }); const handleAddFeeSubmit = (e) => { e.preventDefault(); const amount = parseFloat(newFee.amount); if (!newFee.feeName || isNaN(amount) || !newFee.dueDate) return alert("Vui lòng nhập đầy đủ thông tin."); const newId = fees.length > 0 ? Math.max(...fees.map(i => i.id)) + 1 : 1; setFees([...fees, { id: newId, studentId: selectedStudentId, feeName: newFee.feeName, amount, dueDate: newFee.dueDate, status: 'Chưa thanh toán' }]); setNewFee({ feeName: '', amount: '', dueDate: '' }); }; const toggleStatus = (feeId) => setFees(fees.map(f => f.id === feeId ? { ...f, status: f.status === 'Đã thanh toán' ? 'Chưa thanh toán' : 'Đã thanh toán' } : f)); return (<div className="bg-white p-6 rounded-xl shadow-sm space-y-6"><div className="flex items-center gap-4 flex-wrap"><label className="font-medium shrink-0">Quản lý học phí cho:</label><div className="flex-grow min-w-[200px]"><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Tìm học sinh..."/></div><div className="flex-grow min-w-[200px]"><FormSelect name="studentId" value={selectedStudentId || ''} onChange={(e) => setSelectedStudentId(Number(e.target.value))}>{filteredStudents.length > 0 ? filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option>Không tìm thấy học sinh</option>}</FormSelect></div></div>{selectedStudentId ? <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{studentFees.map(f => (<tr key={f.id} className="border-b hover:bg-gray-50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{f.status}</span></td><td className="p-4 text-center"><button onClick={() => toggleStatus(f.id)} className="text-sm bg-indigo-500 text-white px-3 py-1 rounded">Đổi</button></td></tr>))}</tbody><tfoot><tr className="bg-gray-50"><td className="p-2"><input type="text" name="feeName" value={newFee.feeName} onChange={handleFeeChange} placeholder="Tên khoản thu" className="w-full border rounded p-2"/></td><td className="p-2"><input type="number" name="amount" value={newFee.amount} onChange={handleFeeChange} placeholder="Số tiền" className="w-full border rounded p-2"/></td><td className="p-2"><input type="date" name="dueDate" value={newFee.dueDate} onChange={handleFeeChange} className="w-full border rounded p-2"/></td><td className="p-2 text-center" colSpan="2"><button onClick={handleAddFeeSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">Thêm</button></td></tr></tfoot></table></div> : <p>Vui lòng chọn một học sinh.</p>}</div>);};
const UserManagementView = ({ users, onAdd, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-700">Danh sách Tài khoản</h3>
                <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thêm Tài khoản</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Tên hiển thị</th><th className="p-4 font-semibold">Tên đăng nhập</th><th className="p-4 font-semibold">Vai trò</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead>
                    <tbody>{users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.username}</td>
                            <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></td>
                            <td className="p-4 text-center space-x-2">
                                <button onClick={() => onEdit(user)} className="p-2 text-blue-600 disabled:opacity-50" disabled={user.role === 'admin'}><Edit size={18} /></button>
                                <button onClick={() => onDelete(user.id)} className="p-2 text-red-600 disabled:opacity-50" disabled={user.role === 'admin'}><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};
const UserFormModal = ({ user, students, teachers, users, onSave, onClose }) => {
    const isEditing = !!user?.id;
    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: user?.password || '',
        role: user?.role || 'parent',
        linkedId: user?.studentId || user?.teacherId || '',
  });
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || (isEditing ? false : !formData.password) || (!isEditing && !formData.linkedId)) {
            return alert('Vui lòng điền đầy đủ thông tin. Mật khẩu là bắt buộc khi tạo mới.');
        }
        if (!isEditing && users.some(u => u.username === formData.username)) {
            return alert('Tên đăng nhập đã tồn tại.');
        }

        let finalData = { ...user, ...formData };
        if(!formData.password && isEditing) { // If password field is empty during edit, don't change it
            finalData.password = user.password;
        }

        if (!isEditing) {
            let name = '';
            if (formData.role === 'parent') {
                const student = students.find(s => s.id === parseInt(formData.linkedId));
                name = `PH: ${student?.parentName || student?.name}`;
                finalData.studentId = parseInt(formData.linkedId);
                delete finalData.teacherId;
            } else {
                const teacher = teachers.find(t => t.id === parseInt(formData.linkedId));
                name = `${teacher.gender === 'Nữ' ? 'Cô' : 'Thầy'} ${teacher?.name}`;
                finalData.teacherId = parseInt(formData.linkedId);
                delete finalData.studentId;
            }
            finalData.name = name;
        }
        onSave('user', finalData);
    };

    return (
        <FormModal title={isEditing ? 'Sửa Tài khoản' : 'Thêm Tài khoản mới'} onClose={onClose} onSubmit={handleSubmit}>
            <FormInput label="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} required />
            <FormInput label="Mật khẩu" name="password" type="password" placeholder={isEditing ? "Để trống nếu không đổi" : ""} value={formData.password} onChange={handleChange} required={!isEditing} />
            {!isEditing && (
                <>
                    <FormSelect label="Vai trò" name="role" value={formData.role} onChange={handleChange}>
                        <option value="parent">Phụ huynh</option>
                        <option value="teacher">Giáo viên</option>
                    </FormSelect>
                    <FormSelect label={formData.role === 'parent' ? 'Liên kết với HS' : 'Liên kết với GV'} name="linkedId" value={formData.linkedId} onChange={handleChange} required>
                        <option value="">-- Chọn --</option>
                        {formData.role === 'parent' 
                            ? students.map(s => <option key={s.id} value={s.id}>{s.name}</option>) 
                            : teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </FormSelect>
                </>
            )}
        </FormModal>
    );
};
const SidebarParent = ({ currentView, setCurrentView }) => { const navItems = [ { id: 'grades', label: 'Kết quả học tập', icon: BookUser }, { id: 'fees', label: 'Thông tin Học phí', icon: Banknote }, ]; return ( <nav className="w-20 lg:w-64 bg-white shadow-lg"><div className="p-4 lg:p-6 border-b"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">HS</span><span className="hidden lg:inline">Góc Học Sinh</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> ); };
const HeaderParent = ({ currentUser, studentName, onLogout }) => ( <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center"><div><h2 className="text-2xl font-bold text-gray-800">Học sinh: {studentName}</h2><p className="text-gray-500">Chào mừng, {currentUser.name}</p></div><button onClick={onLogout} title="Đăng xuất" className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full"><LogOut size={22} /></button></div>);
const StudentGradeView = ({ grades, subjects }) => { const calculateTBM = (grade) => { if (!grade) return 0; const hs1 = grade.heso1 || []; const hs2 = grade.hs2 || []; const final = grade.final; const sum1 = hs1.reduce((a, b) => a + b, 0); const sum2 = hs2.reduce((a, b) => a + b, 0); const total = sum1 + (sum2 * 2) + (final !== null ? final * 3 : 0); const factors = hs1.length + (hs2.length * 2) + (final !== null ? 3 : 0); return factors === 0 ? 0 : total / factors; }; return ( <div className="bg-white p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700">Bảng điểm năm học</h3><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Môn học</th><th className="p-4 font-semibold">Điểm HS1</th><th className="p-4 font-semibold">Điểm HS2</th><th className="p-4 font-semibold">Điểm Cuối kỳ</th><th className="p-4 font-semibold">TBM</th></tr></thead><tbody>{subjects.map(sub => { const grade = grades.find(g => g.subjectId === sub.id); return (<tr key={sub.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{sub.name}</td><td className="p-4">{grade?.heso1?.join(', ') || '-'}</td><td className="p-4">{grade?.hs2?.join(', ') || '-'}</td><td className="p-4">{grade?.final?.toFixed(1) || '-'}</td><td className="p-4 font-bold text-blue-600">{calculateTBM(grade).toFixed(2)}</td></tr>);})}</tbody></table></div></div> ); };
const StudentFeeView = ({ fees, onPay }) => ( <div className="bg-white p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold mb-4 text-gray-700">Các khoản phí</h3><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th className="p-4 font-semibold">Tên khoản thu</th><th className="p-4 font-semibold">Số tiền</th><th className="p-4 font-semibold">Hạn nộp</th><th className="p-4 font-semibold text-center">Trạng thái</th><th className="p-4 font-semibold text-center">Hành động</th></tr></thead><tbody>{fees.length > 0 ? fees.map(f => (<tr key={f.id} className="border-b hover:bg-gray-50"><td className="p-4">{f.feeName}</td><td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(f.amount)}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{f.status}</span></td><td className="p-4 text-center">{f.status === 'Chưa thanh toán' ? <button onClick={() => onPay(f)} className="py-1 px-4 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Thanh toán</button> : <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />}</td></tr>)) : <tr><td colSpan="5" className="text-center p-8 text-gray-500">Không có khoản phí nào.</td></tr>}</tbody></table></div></div> );
const PaymentModal = ({ fee, onClose, onConfirm }) => { const [paymentMethod, setPaymentMethod] = useState('bank'); return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4"><div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-800">Thanh toán Học phí</h3><button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={24} /></button></div><div className="space-y-4"><p><span className="font-semibold">Khoản phí:</span> {fee.feeName}</p><p className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.amount)}</p><div className="pt-4 border-t"><p className="font-semibold mb-2">Chọn phương thức:</p><div className="space-y-2"><label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" /><span className="ml-3 flex items-center gap-2"><Landmark size={20}/> Chuyển khoản</span></label><label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" /><span className="ml-3 flex items-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-5 h-5"/> Ví MoMo</span></label><label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" /><span className="ml-3 flex items-center gap-2"><CreditCard size={20}/> Thẻ tín dụng</span></label></div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Hủy</button><button type="button" onClick={onConfirm} className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow">Xác nhận</button></div></div></div></div> ); };
const SidebarTeacher = ({ currentUser, currentView, setCurrentView }) => {
    const navItems = [
        { id: 'grades', label: 'Nhập điểm', icon: BookUser },
        { id: 'schedule', label: 'TKB Cá nhân', icon: Calendar },
    ];
    if(currentUser.isHomeroom) {
        navItems.push({ id: 'homeroom', label: 'Lớp Chủ nhiệm', icon: Home });
    }
    if(currentUser.role === 'department_head') {
        navItems.push({ id: 'department', label: 'Tổ Bộ môn', icon: Users2 });
    }
    return ( <nav className="w-20 lg:w-64 bg-white shadow-lg"><div className="p-4 lg:p-6 border-b"><h1 className="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left"><span className="lg:hidden">GV</span><span className="hidden lg:inline">Giáo viên</span></h1></div><ul className="mt-6">{navItems.map(item => (<li key={item.id} className="px-2 lg:px-4 mb-2"><button onClick={() => setCurrentView(item.id)} className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg ${currentView === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}><item.icon className="h-6 w-6 lg:mr-4" /> <span className="hidden lg:inline font-medium">{item.label}</span></button></li>))}</ul></nav> );
}
const ScheduleView = ({ schedule, title }) => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Tiết</th>
                            {days.map(day => <th key={day} className="p-2 border">{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period}>
                                <td className="p-2 border font-bold bg-gray-50">{period}</td>
                                {days.map(day => {
                                    const s = schedule.find(item => item.day === day && item.period === period);
                                    return (
                                        <td key={day} className="p-2 border text-center">
                                            {s ? <div><p className="font-semibold">{s.subjectName}</p><p className="text-sm text-gray-500">{s.className}</p></div> : ''}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const HomeroomView = ({ students, grades, subjects }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
             <h3 className="text-xl font-bold text-gray-700 mb-4">Tổng quan Lớp chủ nhiệm</h3>
             <StudentGradeView grades={grades} subjects={subjects} />
        </div>
    )
};

const DepartmentScheduleView = ({ teachers, schedules }) => {
    const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || null);
    const selectedSchedule = useMemo(() => schedules.filter(s => s.teacherId === selectedTeacherId), [schedules, selectedTeacherId]);
    const getTitle = (gender) => gender === 'Nữ' ? 'Cô' : 'Thầy';
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-gray-700">Thời khóa biểu Tổ bộ môn</h3>
            <div className="flex items-center gap-4">
                 <label className="font-medium">Chọn giáo viên:</label>
                 <FormSelect value={selectedTeacherId || ''} onChange={(e) => setSelectedTeacherId(Number(e.target.value))}>
                     {teachers.map(t => <option key={t.id} value={t.id}>{`${getTitle(t.gender)} ${t.name}`}</option>)}
                 </FormSelect>
            </div>
            {selectedTeacherId && <ScheduleView schedule={selectedSchedule} title={`TKB của ${teachers.find(t=>t.id === selectedTeacherId)?.name}`} />}
        </div>
    )
}
const AssignmentView = ({ assignments, setAssignments, teachers, classes, subjects }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ teacherId: '', classId: '', subjectId: '' });

  const handleEdit = (assignment) => {
    setEditing(assignment);
    setForm({ teacherId: assignment.teacherId, classId: assignment.classId, subjectId: assignment.subjectId });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phân công này?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.teacherId || !form.classId || !form.subjectId) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (editing) {
      setAssignments(assignments.map(a =>
        a.id === editing.id ? { ...a, ...form } : a
      ));
      setEditing(null);
    } else {
      const newId = assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1;
      setAssignments([...assignments, { id: newId, ...form }]);
    }

    setForm({ teacherId: '', classId: '', subjectId: '' });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ teacherId: '', classId: '', subjectId: '' });
  };
  const getTitle = (gender) => gender === 'Nữ' ? 'Cô' : 'Thầy';
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-gray-700">Phân công giảng dạy</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <FormSelect label="Giáo viên" name="teacherId" value={form.teacherId || ''} onChange={handleChange} required>
          <option value="">-- Chọn GV --</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{`${getTitle(t.gender)} ${t.name}`}</option>)}
        </FormSelect>
        <FormSelect label="Lớp" name="classId" value={form.classId || ''} onChange={handleChange} required>
          <option value="">-- Chọn lớp --</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FormSelect>
        <FormSelect label="Môn học" name="subjectId" value={form.subjectId || ''} onChange={handleChange} required>
          <option value="">-- Chọn môn --</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </FormSelect>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">{editing ? "Cập nhật" : "Thêm"}</button>
          {editing && (
            <button type="button" onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Hủy</button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left mt-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 font-semibold">Giáo viên</th>
              <th className="p-4 font-semibold">Lớp</th>
              <th className="p-4 font-semibold">Môn học</th>
              <th className="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => {
              const teacher = teachers.find(t => t.id === a.teacherId);
              const cls = classes.find(c => c.id === a.classId);
              const subject = subjects.find(s => s.id === a.subjectId);
              return (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{teacher ? `${getTitle(teacher.gender)} ${teacher.name}` : '---'}</td>
                  <td className="p-4">{cls?.name || '---'}</td>
                  <td className="p-4">{subject?.name || '---'}</td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleEdit(a)} className="text-blue-600"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-600"><Trash2 size={18} /></button>
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