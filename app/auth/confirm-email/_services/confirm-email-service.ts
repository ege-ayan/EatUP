import axios from "axios";

export interface ConfirmEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function confirmEmail(
  token: string
): Promise<ConfirmEmailResponse> {
  const { data } = await axios.post<ConfirmEmailResponse>(
    "/api/auth/confirm-email",
    { token }
  );
  return data;
}

export async function resendConfirmationEmail(
  email: string
): Promise<ConfirmEmailResponse> {
  const { data } = await axios.post<ConfirmEmailResponse>(
    "/api/auth/resend-confirmation",
    { email }
  );
  return data;
}
