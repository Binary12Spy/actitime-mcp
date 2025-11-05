// Core API types based on the Swagger spec

export interface TimeTrackRecord {
  taskId: number;
  time: number; // minutes
  comment?: string;
}

export interface LeaveTimeRecord {
  userId: number;
  date: string; // YYYY-MM-DD
  leaveTypeId: number;
  leaveTime: number; // minutes
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  status: 'open' | 'completed';
  projectId: number;
  customerId?: number;
  workflowStatusId?: number;
  typeOfWorkId?: number;
  deadline?: string;
  estimatedTime?: number;
}

export interface Project {
  id: number;
  name: string;
  customerId: number;
  archived: boolean;
  description?: string;
}

export interface Customer {
  id: number;
  name: string;
  archived: boolean;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  departmentId?: number;
  hired?: string;
}

export interface LeaveType {
  id: number;
  name: string;
  balance: 'None' | 'Sick' | 'PTO';
  archived: boolean;
}

export interface TimeTrackListResponse {
  dateFrom: string;
  dateTo: string;
  nextDateFrom?: string;
  data: UserDayTimeTrack[];
  tasks?: Record<number, Task>;
  projects?: Record<number, Project>;
  customers?: Record<number, Customer>;
  users?: Record<number, User>;
}

export interface UserDayTimeTrack {
  userId: number;
  date: string;
  dayOffset: number;
  records: TimeTrackRecord[];
  approved: boolean;
}

export interface ActiTimeConfig {
  baseUrl: string;
  username: string;
  password: string;
}
