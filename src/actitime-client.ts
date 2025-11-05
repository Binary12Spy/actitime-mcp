import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ActiTimeConfig,
  TimeTrackRecord,
  TimeTrackListResponse,
  LeaveTimeRecord,
  Task,
  Project,
  Customer,
  User,
  LeaveType,
} from './types.js';

export class ActiTimeClient {
  private client: AxiosInstance;
  private config: ActiTimeConfig;

  constructor(config: ActiTimeConfig) {
    this.config = config;
    
    const auth = Buffer.from(
      `${config.username}:${config.password}`
    ).toString('base64');

    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.data) {
          throw new Error(JSON.stringify(error.response.data));
        }
        throw error;
      }
    );
  }

  // ============ Time Track Methods ============

  async getTimeTrack(params: {
    userIds?: string;
    taskIds?: string;
    projectIds?: string;
    customerIds?: string;
    dateFrom: string;
    dateTo?: string;
    stopAfter?: number;
    approved?: boolean;
  }): Promise<TimeTrackListResponse> {
    const response = await this.client.get('/timetrack', { params });
    return response.data;
  }

  async getTimeTrackRecord(
    userId: string | number,
    date: string,
    taskId: number
  ): Promise<TimeTrackRecord> {
    const response = await this.client.get(
      `/timetrack/${userId}/${date}/${taskId}`
    );
    return response.data;
  }

  async setTimeTrack(
    userId: string | number,
    date: string,
    taskId: number,
    data: { time: number; comment?: string }
  ): Promise<TimeTrackRecord> {
    const response = await this.client.patch(
      `/timetrack/${userId}/${date}/${taskId}`,
      data
    );
    return response.data;
  }

  async adjustTimeTrack(
    userId: string | number,
    date: string,
    taskId: number,
    delta: number
  ): Promise<TimeTrackRecord> {
    const response = await this.client.patch(
      `/timetrack/${userId}/${date}/${taskId}/time`,
      { delta }
    );
    return response.data;
  }

  // ============ Leave Time Methods ============

  async getLeaveTime(params: {
    userIds?: string;
    leaveTypeIds?: string;
    dateFrom: string;
    dateTo?: string;
    stopAfter?: number;
  }) {
    const response = await this.client.get('/leavetime', { params });
    return response.data;
  }

  async setLeaveTime(
    userId: string | number,
    date: string,
    leaveTypeId: number,
    leaveTime: number
  ): Promise<LeaveTimeRecord> {
    const response = await this.client.patch(
      `/leavetime/${userId}/${date}/${leaveTypeId}`,
      { leaveTime }
    );
    return response.data;
  }

  async adjustLeaveTime(
    userId: string | number,
    date: string,
    leaveTypeId: number,
    delta: number
  ): Promise<LeaveTimeRecord> {
    const response = await this.client.patch(
      `/leavetime/${userId}/${date}/${leaveTypeId}/time`,
      { delta }
    );
    return response.data;
  }

  // ============ Task Methods ============

  async getTasks(params?: {
    offset?: number;
    limit?: number;
    ids?: string;
    customerIds?: string;
    projectIds?: string;
    status?: 'open' | 'completed';
    name?: string;
  }) {
    const response = await this.client.get('/tasks', { params });
    return response.data;
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await this.client.post('/tasks', task);
    return response.data;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await this.client.patch(`/tasks/${id}`, updates);
    return response.data;
  }

  // ============ Project Methods ============

  async getProjects(params?: {
    offset?: number;
    limit?: number;
    customerIds?: string;
    archived?: boolean;
    name?: string;
  }) {
    const response = await this.client.get('/projects', { params });
    return response.data;
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  // ============ Customer Methods ============

  async getCustomers(params?: {
    offset?: number;
    limit?: number;
    archived?: boolean;
    name?: string;
  }) {
    const response = await this.client.get('/customers', { params });
    return response.data;
  }

  async getCustomer(id: number): Promise<Customer> {
    const response = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  // ============ User Methods ============

  async getUsers(params?: {
    offset?: number;
    limit?: number;
    active?: boolean;
    username?: string;
    email?: string;
  }) {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async getUser(uid: string | number): Promise<User> {
    const response = await this.client.get(`/users/${uid}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  // ============ Leave Type Methods ============

  async getLeaveTypes(params?: {
    offset?: number;
    limit?: number;
    archived?: boolean;
    balance?: 'None' | 'Sick' | 'PTO';
  }) {
    const response = await this.client.get('/leaveTypes', { params });
    return response.data;
  }

  async getLeaveType(id: number): Promise<LeaveType> {
    const response = await this.client.get(`/leaveTypes/${id}`);
    return response.data;
  }

  // ============ Lock/Unlock Timetrack ============

  async lockTimetrack(params: {
    userIds?: number[];
    dateFrom: string;
    dateTo: string;
  }) {
    const response = await this.client.post('/timetrack/lock', params);
    return response.data;
  }

  async unlockTimetrack(params: {
    userIds?: number[];
    dateFrom: string;
    dateTo: string;
  }) {
    const response = await this.client.post('/timetrack/unlock', params);
    return response.data;
  }
}
