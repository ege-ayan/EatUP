"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas/auth-schemas";
import {
  registerService,
  type RegisterData,
  type RegisterResponse,
} from "../_services/register-service";

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
      };

      const response: RegisterResponse = await registerService.register(
        registerData
      );

      if (response.success) {
        setSuccess(true);
        form.reset();
      } else {
        if (response.errors) {
          response.errors.forEach((err) => {
            form.setError(err.field as keyof RegisterFormData, {
              message: err.message,
            });
          });
        } else if (response.error) {
          setError(response.error);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    form.reset();
  };

  return {
    form,
    register,
    isLoading,
    error,
    success,
    reset,
  };
}
