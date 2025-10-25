"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

import { useResetPassword } from "../_hooks/use-reset-password";
import { resetPasswordSchema } from "@/schemas/auth-schemas";

import Link from "next/link";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;

    resetPassword(
      {
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Geçersiz Bağlantı
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Şifre sıfırlama bağlantısı geçersiz veya eksik.
                  </p>
                  <Link href="/auth/forgot-password">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Yeni Bağlantı Talep Et
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Şifre Başarıyla Güncellendi!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Şifreniz başarıyla değiştirildi. Şimdi yeni şifrenizle giriş
                    yapabilirsiniz.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Giriş sayfasına yönlendiriliyorsunuz...
                  </p>
                  <Link href="/auth/login">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Hemen Giriş Yap
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
                Yeni Şifre Belirleyin
              </CardTitle>
              <p className="text-sm text-gray-600">
                Hesabınız için yeni bir şifre oluşturun
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Yeni Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Yeni şifrenizi giriniz"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Yeni Şifre (Tekrar)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Şifrenizi tekrar giriniz"
                              className="pl-12 pr-12 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? (
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
                        "Bir hata oluştu. Lütfen tekrar deneyin."}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Şifre Gereksinimleri:</strong>
                      <br />• En az 6 karakter uzunluğunda olmalıdır
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Güncelleniyor...
                      </div>
                    ) : (
                      "Şifreyi Güncelle"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
