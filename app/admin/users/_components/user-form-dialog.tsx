import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/generated/prisma";

interface UserFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  location: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: UserFormData;
  onFormDataChange: (data: UserFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitText: string;
  isEdit?: boolean;
  organizations: Organization[];
  userRole?: UserRole;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSubmit,
  isPending,
  submitText,
  isEdit = false,
  organizations,
  userRole,
}: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Ad
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="surname" className="mb-2 block">
              Soyad
            </Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) =>
                onFormDataChange({ ...formData, surname: e.target.value })
              }
              placeholder="Doe"
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 block">
              E-posta
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                onFormDataChange({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
            />
          </div>
          {!isEdit && (
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Şifre
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  onFormDataChange({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
          )}
          {!isEdit && (
            <div>
              <Label htmlFor="role" className="mb-2 block">
                Rol
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  onFormDataChange({
                    ...formData,
                    role: value,
                    organizationId: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Müşteri</SelectItem>
                  <SelectItem value="ORGANIZATION">Organizasyon</SelectItem>
                  <SelectItem value="ADMIN">Yönetici</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {((isEdit && userRole === "ORGANIZATION") ||
            (!isEdit && formData.role === "ORGANIZATION")) && (
            <div>
              <Label htmlFor="organization" className="mb-2 block">
                Organizasyon{" "}
                {!isEdit && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={formData.organizationId}
                onValueChange={(value) =>
                  onFormDataChange({ ...formData, organizationId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Organizasyon seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Bu kullanıcı seçilen organizasyona atanacak
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "İşleniyor..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
