


// 前端类型定义
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 前端类型定义（types/request.d.ts）
interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  email: string
  phone: string
  secret_key: string
}


interface LoginRequest {
  username: string
  password: string
}

interface DepartmentSalaryData {
  dep_id: number;
  depart: string;
  avg_salary: number;
}


interface DepartmentHeadcountData {
  dep_id: number;
  depart: string;
  headcount: number;
  percentage: number;
}