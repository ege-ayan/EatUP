"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ImageIcon,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Offering } from "@/lib/offerings";
import { offeringsService } from "@/app/organization/home/services/offerings-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface OfferingsTableProps {
  offerings: Offering[];
  isLoading?: boolean;
}

export function OfferingsTable({ offerings, isLoading }: OfferingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const deleteOfferingMutation = useMutation({
    mutationFn: (id: string) => offeringsService.deleteOffering(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-offerings"] });
    },
  });

  const handleDeleteOffering = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Ürünü silmek istediğinize emin misiniz?",
      text: `"${name}" ürünü kalıcı olarak silinecektir.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      try {
        await deleteOfferingMutation.mutateAsync(id);
        toast.success("Ürün başarıyla silindi");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Ürün silinirken bir hata oluştu");
      }
    }
  };

  const columns: ColumnDef<Offering>[] = [
    {
      accessorKey: "image",
      header: "Görsel",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg border">
            {image ? (
              <Image
                src={image}
                alt={row.getValue("name") as string}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ürün Adı
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category.name}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Fiyat
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        const originalPrice = row.original.originalPrice;
        return (
          <>
            {originalPrice && originalPrice > price ? (
              <div className="flex pl-3 flex-col">
                <span className="font-semibold text-green-600">
                  ₺{price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₺{originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-semibold">₺{price.toFixed(2)}</span>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Stok
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <>
            <span
              className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                stock === 0
                  ? "bg-red-100 text-red-800"
                  : stock < 5
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {stock}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "isAvailable",
      header: "Durum",
      cell: ({ row }) => {
        const isAvailable = row.getValue("isAvailable") as boolean;
        return (
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Aktif" : "Pasif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Oluşturulma
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string);
        return (
          <div className="text-sm ml-3 text-gray-600">
            {date.toLocaleDateString("tr-TR")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const offering = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log("Edit offering:", offering.id);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteOffering(offering.id, offering.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: offerings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="h-16 bg-gray-100 border-b animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-50 border-b animate-pulse flex items-center space-x-4 px-4"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ürün ara..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          Toplam {offerings.length} ürün
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-16">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="align-middle text-left font-semibold text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-20 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500 align-middle"
                >
                  Henüz ürün eklenmemiş
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
