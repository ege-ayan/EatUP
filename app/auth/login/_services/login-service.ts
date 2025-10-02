import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: "CUSTOMER" | "ORGANIZATION";
    createdAt: string;
  };
  error?: string;
}

export const loginService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
    return response.data;
  },
};

export const organizationLoginService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      "/api/auth/organization/login",
      credentials
    );
    return response.data;
  },
};
