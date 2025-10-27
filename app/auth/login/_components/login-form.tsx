"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Mail, Lock, RefreshCw } from "lucide-react";

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

import { useLogin } from "../_hooks/use-login";

import Link from "next/link";
import { loginSchema } from "@/schemas/auth-schemas";
import axios from "axios";

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setResendSuccess(false);
    login({ email: values.email, password: values.password });
  };

  const handleResendEmail = async () => {
    const email = form.getValues("email");
    if (!email) return;

    setIsResendingEmail(true);
    setResendSuccess(false);

    try {
      await axios.post("/api/auth/resend-confirmation", { email });
      setResendSuccess(true);
    } catch (err) {
      console.error("Resend email error:", err);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const isEmailNotConfirmedError =
    error &&
    (error.message?.includes("henüz onaylanmamış") ||
      (error as AxiosError<{ error?: string }>)?.response?.data?.error?.includes(
        "henüz onaylanmamış"
      ));

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
                Giriş Yap
              </CardTitle>
              <p className="text-sm text-gray-600">
                Müşteri veya organizasyon hesabınızla giriş yapın
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

                  <div className="flex justify-end">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Şifremi unuttum
                    </Link>
                  </div>

                  {error && (
                    <div className="space-y-3">
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                        {(error as AxiosError<{ error?: string }>)?.response?.data
                          ?.error ||
                          error.message ||
                          "Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz."}
                      </div>
                      
                      {isEmailNotConfirmedError && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResendEmail}
                          disabled={isResendingEmail}
                          className="w-full"
                        >
                          {isResendingEmail ? (
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Gönderiliyor...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Onay E-postasını Tekrar Gönder
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  )}

                  {resendSuccess && (
                    <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                      ✓ Onay e-postası tekrar gönderildi! Lütfen e-postanızı kontrol edin.
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
                  Hesabınız yok mu?{" "}
                  <Link
                    href="/auth/register"
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Kayıt olun
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

export { LoginForm };
