"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfirmEmail } from "../_hooks/use-confirm-email";

export function ConfirmEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [autoConfirmAttempted, setAutoConfirmAttempted] = useState(false);

  const { mutate: confirmEmail, isPending, error } = useConfirmEmail();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Auto-confirm when token is present
    if (!autoConfirmAttempted) {
      setAutoConfirmAttempted(true);
      confirmEmail(token, {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        },
      });
    }
  }, [token, router, confirmEmail, autoConfirmAttempted]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-orange-500 p-3 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              E-posta Onayı
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {isPending && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
                <p className="text-center text-gray-600">
                  E-posta adresiniz onaylanıyor...
                </p>
              </div>
            )}

            {isSuccess && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      E-posta başarıyla onaylandı!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Giriş sayfasına yönlendiriliyorsunuz...
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700"
                >
                  Giriş Sayfasına Git
                </Button>
              </div>
            )}

            {error && !isSuccess && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 mb-1">
                      E-posta Onaylanamadı
                    </p>
                    <p className="text-xs text-red-700">
                      {error instanceof Error
                        ? error.message
                        : "Token geçersiz veya süresi dolmuş. Lütfen yeni bir onay e-postası talep edin."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => router.push("/auth/login")}
                    variant="outline"
                    className="w-full"
                  >
                    Giriş Sayfasına Dön
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-green-600 hover:text-green-700 hover:underline"
                >
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
