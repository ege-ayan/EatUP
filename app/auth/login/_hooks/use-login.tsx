import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginService,
  LoginRequest,
  LoginResponse,
} from "../_services/login-service";

export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginService.login,
    onSuccess: () => {
      router.push("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
