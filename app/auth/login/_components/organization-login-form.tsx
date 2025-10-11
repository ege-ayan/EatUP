"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useOrganizationLogin } from "../_hooks/use-login";

import Link from "next/link";
import { loginSchema } from "@/lib/schemas/auth-schemas";

type LoginFormValues = z.infer<typeof loginSchema>;

export function OrganizationLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useOrganizationLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login({ email: values.email, password: values.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-4xl font-bold text-green-800">
                Eat<span className="text-orange-400">UP</span>
              </span>
            </Link>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in-up">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Organizasyon Girişi
              </CardTitle>
              <p className="text-sm text-gray-600">
                İşletme hesabınızla giriş yapın
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          E-posta Adresi
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="E-posta adresinizi giriniz"
                              className="pl-12 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Şifrenizi giriniz"
                              className="pl-12 pr-12 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                      {(error as AxiosError<{ error?: string }>)?.response?.data
                        ?.error ||
                        error.message ||
                        "Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz."}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Giriş yapılıyor...
                      </div>
                    ) : (
                      "Giriş Yap"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Müşteri girişi için{" "}
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    tıklayın
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
