// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'staff' | 'parent';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Employee (HRIS)
export interface Employee {
  id: number;
  user_id: number;
  nip: string;
  position: string;
  base_salary: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Attendance
export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: 'present' | 'absent' | 'late' | 'sick' | 'leave';
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

// Payroll
export interface Payroll {
  id: number;
  employee_id: number;
  period: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'paid';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

// Classroom (Academic)
export interface Classroom {
  id: number;
  name: string;
  grade_level: string;
  capacity: number;
  homeroom_teacher_id: number | null;
  created_at: string;
  updated_at: string;
}

// Student
export interface Student {
  id: number;
  nis: string;
  name: string;
  classroom_id: number;
  parent_id: number | null;
  gender: 'male' | 'female';
  birth_date: string;
  address: string;
  phone: string | null;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
  classroom?: Classroom;
}

// Subject
export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Teacher Subject
export interface TeacherSubject {
  id: number;
  employee_id: number;
  subject_id: number;
  classroom_id: number;
  created_at: string;
  employee?: Employee;
  subject?: Subject;
  classroom?: Classroom;
}

// Grade
export interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_subject_id: number;
  semester: string;
  score: number;
  grade_letter: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  subject?: Subject;
}

// Wallet Transaction (Finance)
export interface WalletTransaction {
  id: number;
  student_id: number;
  type: 'topup' | 'payment' | 'refund';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
  student?: Student;
}

// Billing
export interface Billing {
  id: number;
  student_id: number;
  type: 'spp' | 'registration' | 'other';
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

// Behavior Record (Boarding)
export interface BehaviorRecord {
  id: number;
  student_id: number;
  recorded_by: number;
  type: 'positive' | 'negative';
  category: string;
  description: string;
  points: number;
  date: string;
  created_at: string;
  student?: Student;
}

// Tahfidz Record
export interface TahfidzRecord {
  id: number;
  student_id: number;
  teacher_id: number;
  surah: string;
  start_ayah: number;
  end_ayah: number;
  type: 'memorization' | 'murajaah';
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string | null;
  date: string;
  created_at: string;
  student?: Student;
}

// Schedule
export interface Schedule {
  id: number;
  classroom_id: number;
  subject_id: number;
  teacher_id: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  classroom?: Classroom;
  subject?: Subject;
  teacher?: Employee;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
