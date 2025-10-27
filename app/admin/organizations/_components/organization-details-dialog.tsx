import { Organization } from "../_services/organizations-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  Package,
  Plus,
  Trash2,
} from "lucide-react";

interface OrganizationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  onAddUser: () => void;
  onRemoveUser: (user: { id: string; name: string; surname: string }) => void;
}

export default function OrganizationDetailsDialog({
  open,
  onOpenChange,
  organization,
  onAddUser,
  onRemoveUser,
}: OrganizationDetailsDialogProps) {
  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{organization.name}</DialogTitle>
          <DialogDescription>
            Organizasyon detayları ve kullanıcılar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              Organizasyon Bilgileri
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Konum</p>
                  <p className="text-sm font-medium text-gray-900">
                    {organization.location}
                  </p>
                </div>
              </div>

              {organization.phone && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Telefon</p>
                    <p className="text-sm font-medium text-gray-900">
                      {organization.phone}
                    </p>
                  </div>
                </div>
              )}

              {organization.email && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">E-posta</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {organization.email}
                    </p>
                  </div>
                </div>
              )}

              {organization.website && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm font-medium text-gray-900">
                      {organization.website}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {organization.description && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Açıklama</p>
                <p className="text-sm text-gray-900">
                  {organization.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Package className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Kullanıcı Sayısı</p>
                <p className="text-sm font-medium text-gray-900">
                  {organization.users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Kullanıcılar
              </h4>
              <Button size="sm" onClick={onAddUser}>
                <Plus className="h-4 w-4 mr-1" />
                Kullanıcı Ekle
              </Button>
            </div>

            {organization.users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                Bu organizasyona henüz kullanıcı atanmamış
              </div>
            ) : (
              <div className="space-y-2">
                {organization.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name} {user.surname}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveUser(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
