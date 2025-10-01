import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/user-store";
import {
  loginService,
  LoginRequest,
  LoginResponse,
} from "../_services/login-service";

export const useLogin = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginService.login,
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          surname: data.user.surname,
          email: data.user.email,
          role: "STUDENT",
        });
      }
      router.push("/home");
    },
  });
};
