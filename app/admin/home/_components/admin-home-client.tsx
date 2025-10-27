"use client";

import { Users, Building2 } from "lucide-react";
import ManagementCard from "./management-card";

export default function AdminHomeClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yönetici Paneli
          </h1>
          <p className="text-gray-600">
            Kullanıcıları ve organizasyonları yönetin
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ManagementCard
            title="Kullanıcı Yönetimi"
            description="Sistemdeki kullanıcıları görüntüleyin, düzenleyin ve yönetin."
            icon={Users}
            iconColor="text-red-600"
            href="/admin/users"
            buttonText="Kullanıcıları Yönet"
          />

          <ManagementCard
            title="Organizasyon Yönetimi"
            description="Organizasyonları görüntüleyin, düzenleyin ve yönetin."
            icon={Building2}
            iconColor="text-orange-600"
            href="/admin/organizations"
            buttonText="Organizasyonları Yönet"
          />
        </div>
      </main>
    </div>
  );
}
