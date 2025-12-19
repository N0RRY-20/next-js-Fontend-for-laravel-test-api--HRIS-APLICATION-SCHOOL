import type {
  User,
  LoginCredentials,
  AuthResponse,
  Employee,
  Attendance,
  Payroll,
  Classroom,
  Student,
  Subject,
  TeacherSubject,
  Grade,
  WalletTransaction,
  Billing,
  BehaviorRecord,
  TahfidzRecord,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request("/logout", { method: "POST" });
    this.setToken(null);
  }

  async getUser(): Promise<User> {
    return this.request<User>("/user");
  }

  // Employees
  async getEmployees(page = 1): Promise<PaginatedResponse<Employee>> {
    return this.request<PaginatedResponse<Employee>>(`/employees?page=${page}`);
  }

  async getEmployee(id: number): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`);
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    return this.request<void>(`/employees/${id}`, { method: "DELETE" });
  }

  // Attendances
  async getAttendances(
    page = 1,
    date?: string
  ): Promise<PaginatedResponse<Attendance>> {
    const params = new URLSearchParams({ page: String(page) });
    if (date) params.append("date", date);
    return this.request<PaginatedResponse<Attendance>>(
      `/attendances?${params}`
    );
  }

  async getAttendance(id: number): Promise<Attendance> {
    return this.request<Attendance>(`/attendances/${id}`);
  }

  async createAttendance(data: Partial<Attendance>): Promise<Attendance> {
    return this.request<Attendance>("/attendances", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async clockIn(): Promise<Attendance> {
    return this.request<Attendance>("/attendances/clock-in", {
      method: "POST",
    });
  }

  async clockOut(): Promise<Attendance> {
    return this.request<Attendance>("/attendances/clock-out", {
      method: "POST",
    });
  }

  // Payrolls
  async getPayrolls(page = 1): Promise<PaginatedResponse<Payroll>> {
    return this.request<PaginatedResponse<Payroll>>(`/payrolls?page=${page}`);
  }

  async getPayroll(id: number): Promise<Payroll> {
    return this.request<Payroll>(`/payrolls/${id}`);
  }

  async createPayroll(data: Partial<Payroll>): Promise<Payroll> {
    return this.request<Payroll>("/payrolls", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePayroll(id: number, data: Partial<Payroll>): Promise<Payroll> {
    return this.request<Payroll>(`/payrolls/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePayroll(id: number): Promise<void> {
    return this.request<void>(`/payrolls/${id}`, { method: "DELETE" });
  }

  // Classrooms
  async getClassrooms(page = 1): Promise<PaginatedResponse<Classroom>> {
    return this.request<PaginatedResponse<Classroom>>(
      `/classrooms?page=${page}`
    );
  }

  async getClassroom(id: number): Promise<Classroom> {
    return this.request<Classroom>(`/classrooms/${id}`);
  }

  async createClassroom(data: Partial<Classroom>): Promise<Classroom> {
    return this.request<Classroom>("/classrooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateClassroom(
    id: number,
    data: Partial<Classroom>
  ): Promise<Classroom> {
    return this.request<Classroom>(`/classrooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteClassroom(id: number): Promise<void> {
    return this.request<void>(`/classrooms/${id}`, { method: "DELETE" });
  }

  // Students
  async getStudents(page = 1): Promise<PaginatedResponse<Student>> {
    return this.request<PaginatedResponse<Student>>(`/students?page=${page}`);
  }

  async getStudent(id: number): Promise<Student> {
    return this.request<Student>(`/students/${id}`);
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return this.request<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
    return this.request<Student>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: number): Promise<void> {
    return this.request<void>(`/students/${id}`, { method: "DELETE" });
  }

  // Subjects
  async getSubjects(page = 1): Promise<PaginatedResponse<Subject>> {
    return this.request<PaginatedResponse<Subject>>(`/subjects?page=${page}`);
  }

  async getSubject(id: number): Promise<Subject> {
    return this.request<Subject>(`/subjects/${id}`);
  }

  async createSubject(data: Partial<Subject>): Promise<Subject> {
    return this.request<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id: number, data: Partial<Subject>): Promise<Subject> {
    return this.request<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id: number): Promise<void> {
    return this.request<void>(`/subjects/${id}`, { method: "DELETE" });
  }

  // Teacher Subjects
  async getTeacherSubjects(
    page = 1
  ): Promise<PaginatedResponse<TeacherSubject>> {
    return this.request<PaginatedResponse<TeacherSubject>>(
      `/teacher-subjects?page=${page}`
    );
  }

  async createTeacherSubject(
    data: Partial<TeacherSubject>
  ): Promise<TeacherSubject> {
    return this.request<TeacherSubject>("/teacher-subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteTeacherSubject(id: number): Promise<void> {
    return this.request<void>(`/teacher-subjects/${id}`, { method: "DELETE" });
  }

  // Grades
  async getGrades(page = 1): Promise<PaginatedResponse<Grade>> {
    return this.request<PaginatedResponse<Grade>>(`/grades?page=${page}`);
  }

  async getGrade(id: number): Promise<Grade> {
    return this.request<Grade>(`/grades/${id}`);
  }

  async createGrade(data: Partial<Grade>): Promise<Grade> {
    return this.request<Grade>("/grades", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Wallet Transactions
  async getWalletTransactions(
    page = 1
  ): Promise<PaginatedResponse<WalletTransaction>> {
    return this.request<PaginatedResponse<WalletTransaction>>(
      `/wallet-transactions?page=${page}`
    );
  }

  async getWalletTransaction(id: number): Promise<WalletTransaction> {
    return this.request<WalletTransaction>(`/wallet-transactions/${id}`);
  }

  async createWalletTransaction(
    data: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {
    return this.request<WalletTransaction>("/wallet-transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Billings
  async getBillings(page = 1): Promise<PaginatedResponse<Billing>> {
    return this.request<PaginatedResponse<Billing>>(`/billings?page=${page}`);
  }

  async getBilling(id: number): Promise<Billing> {
    return this.request<Billing>(`/billings/${id}`);
  }

  async createBilling(data: Partial<Billing>): Promise<Billing> {
    return this.request<Billing>("/billings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBilling(id: number, data: Partial<Billing>): Promise<Billing> {
    return this.request<Billing>(`/billings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBilling(id: number): Promise<void> {
    return this.request<void>(`/billings/${id}`, { method: "DELETE" });
  }

  async payBilling(id: number): Promise<Billing> {
    return this.request<Billing>(`/billings/${id}/pay`, { method: "POST" });
  }

  // Behavior Records
  async getBehaviorRecords(
    page = 1
  ): Promise<PaginatedResponse<BehaviorRecord>> {
    return this.request<PaginatedResponse<BehaviorRecord>>(
      `/behavior-records?page=${page}`
    );
  }

  async getBehaviorRecord(id: number): Promise<BehaviorRecord> {
    return this.request<BehaviorRecord>(`/behavior-records/${id}`);
  }

  async createBehaviorRecord(
    data: Partial<BehaviorRecord>
  ): Promise<BehaviorRecord> {
    return this.request<BehaviorRecord>("/behavior-records", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Tahfidz Records
  async getTahfidzRecords(page = 1): Promise<PaginatedResponse<TahfidzRecord>> {
    return this.request<PaginatedResponse<TahfidzRecord>>(
      `/tahfidz-records?page=${page}`
    );
  }

  async getTahfidzRecord(id: number): Promise<TahfidzRecord> {
    return this.request<TahfidzRecord>(`/tahfidz-records/${id}`);
  }

  async createTahfidzRecord(
    data: Partial<TahfidzRecord>
  ): Promise<TahfidzRecord> {
    return this.request<TahfidzRecord>("/tahfidz-records", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
