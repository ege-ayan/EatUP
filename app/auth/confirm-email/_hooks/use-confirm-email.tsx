import { useMutation } from "@tanstack/react-query";
import { confirmEmail } from "../_services/confirm-email-service";

export function useConfirmEmail() {
  return useMutation({
    mutationFn: confirmEmail,
  });
}
