// AquaEstate API Client
// TODO: Replace mock implementation with actual HTTP client for FastAPI

import { CONFIG } from '../config/config';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// TODO: Replace with actual fetch/axios calls to FastAPI backend
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // TODO: Replace with actual GET request to FastAPI
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`[Mock API] GET ${this.baseUrl}${endpoint}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: {} as T, success: true };
  }

  // TODO: Replace with actual POST request to FastAPI
  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    console.log(`[Mock API] POST ${this.baseUrl}${endpoint}`, body);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: {} as T, success: true };
  }

  // TODO: Replace with actual PUT request to FastAPI
  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    console.log(`[Mock API] PUT ${this.baseUrl}${endpoint}`, body);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: {} as T, success: true };
  }

  // TODO: Replace with actual DELETE request to FastAPI
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`[Mock API] DELETE ${this.baseUrl}${endpoint}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: {} as T, success: true };
  }

  // TODO: Replace with actual multipart/form-data upload to FastAPI
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    console.log(`[Mock API] UPLOAD ${this.baseUrl}${endpoint}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: {} as T, success: true };
  }
}

export const apiClient = new ApiClient();
export default apiClient;
