import axios from "axios";

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt: string;
  };
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const registerService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await axios.post("/api/auth/register", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },
};
