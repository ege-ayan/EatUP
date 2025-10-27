import { Organization } from "../_services/organizations-service";
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
import { Edit, Trash2, MoreHorizontal, Eye, MapPin, User } from "lucide-react";

interface OrganizationsTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  onViewDetails: (org: Organization) => void;
}

export default function OrganizationsTable({
  organizations,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}: OrganizationsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!organizations.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Organizasyon bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Organizasyon</TableHead>
            <TableHead className="font-semibold">Konum</TableHead>
            <TableHead className="font-semibold">Kullanıcılar</TableHead>
            <TableHead className="font-semibold">Kayıt Tarihi</TableHead>
            <TableHead className="text-right font-semibold">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                  {org.name}
                </div>
                {org.description && (
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {org.description}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-[150px]">{org.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <Badge variant="secondary">{org.users.length}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date(org.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(org)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detaylar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(org)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(org)}
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
