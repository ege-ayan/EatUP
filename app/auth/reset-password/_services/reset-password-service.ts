import axios from "axios";

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const resetPasswordService = {
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await axios.post<ResetPasswordResponse>(
      "/api/auth/reset-password",
      data
    );
    return response.data;
  },
};
