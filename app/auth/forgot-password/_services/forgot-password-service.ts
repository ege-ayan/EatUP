import axios from "axios";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const forgotPasswordService = {
  async sendResetLink(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await axios.post<ForgotPasswordResponse>(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  },
};

