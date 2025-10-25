import { useMutation } from "@tanstack/react-query";
import {
  resetPasswordService,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../_services/reset-password-service";

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordService.resetPassword,
  });
};
