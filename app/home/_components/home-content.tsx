"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
}

export default function HomeContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("User fetch error:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Hoş Geldiniz!
          </CardTitle>
          <CardDescription className="text-gray-600">
            EatUP uygulamasına başarıyla giriş yaptınız
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Kullanıcı Bilgileri
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Ad Soyad:</span> {user.name}{" "}
                  {user.surname}
                </p>
                <p>
                  <span className="font-medium">E-posta:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Üyelik Tarihi:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
