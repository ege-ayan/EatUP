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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User as UserIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  organization?: { id: string; name: string };
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationName: string;
  availableUsers: User[];
  selectedUserId: string;
  onUserIdChange: (userId: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export default function AddUserDialog({
  open,
  onOpenChange,
  organizationName,
  availableUsers,
  selectedUserId,
  onUserIdChange,
  onSubmit,
  isPending,
}: AddUserDialogProps) {
  const unassignedUsers = availableUsers.filter(
    (user) => user.role === "ORGANIZATION" && !user.organization
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kullanıcı Ekle</DialogTitle>
          <DialogDescription>
            {organizationName} organizasyonuna kullanıcı atayın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="user-select" className="mb-2 block">
              Kullanıcı Seç <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedUserId} onValueChange={onUserIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Kullanıcı seçin..." />
              </SelectTrigger>
              <SelectContent>
                {unassignedUsers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Atanmamış organizasyon kullanıcısı yok
                  </div>
                ) : (
                  unassignedUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">
                            {user.name} {user.surname}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Sadece organizasyon rolüne sahip ve henüz atanmamış kullanıcılar görüntülenir
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || !selectedUserId || unassignedUsers.length === 0}
          >
            {isPending ? "Atanıyor..." : "Kullanıcı Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
