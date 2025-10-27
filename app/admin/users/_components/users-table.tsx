import { User } from "../_services/users-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  UserCircle,
  Building2,
  ShieldCheck,
} from "lucide-react";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({
  users,
  isLoading,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const getRoleBadge = (role: User["role"]) => {
    const variants: Record<User["role"], string> = {
      CUSTOMER: "bg-orange-100 text-orange-800 border-orange-200",
      ORGANIZATION: "bg-red-100 text-red-800 border-red-200",
      ADMIN: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const labels: Record<User["role"], string> = {
      CUSTOMER: "Müşteri",
      ORGANIZATION: "Org.",
      ADMIN: "Admin",
    };

    const getRoleIcon = (role: User["role"]) => {
      switch (role) {
        case "CUSTOMER":
          return <UserCircle className="h-3 w-3" />;
        case "ORGANIZATION":
          return <Building2 className="h-3 w-3" />;
        case "ADMIN":
          return <ShieldCheck className="h-3 w-3" />;
      }
    };

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1 w-fit ${variants[role]}`}
      >
        {getRoleIcon(role)}
        {labels[role]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kullanıcı bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold pr-4">Kullanıcı</TableHead>
            <TableHead className="font-semibold">E-posta</TableHead>
            <TableHead className="font-semibold">Rol</TableHead>
            <TableHead className="font-semibold">Organizasyon</TableHead>
            <TableHead className="font-semibold">Kayıt Tarihi</TableHead>
            <TableHead className="text-right font-semibold pl-2">
              İşlemler
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="pr-4">
                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                  {user.name} {user.surname}
                </div>
              </TableCell>
              <TableCell className="text-gray-600">
                <div className="truncate max-w-[200px]">{user.email}</div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {user.organization ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 truncate max-w-[150px]">
                      {user.organization.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell className="text-right pl-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
