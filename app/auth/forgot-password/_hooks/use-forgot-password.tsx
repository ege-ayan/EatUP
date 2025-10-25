import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordService,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../_services/forgot-password-service";

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordService.sendResetLink,
  });
};

