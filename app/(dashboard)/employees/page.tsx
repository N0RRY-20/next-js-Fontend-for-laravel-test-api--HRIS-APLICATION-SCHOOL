"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Employee, PaginatedResponse } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Employee> = await api.getEmployees(
        currentPage
      );
      setEmployees(response.data);
      setTotalPages(response.last_page);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nip?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Pegawai
          </h1>
          <p className="text-muted-foreground">
            Kelola data pegawai guru dan staf sekolah
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pegawai
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Pegawai Baru</DialogTitle>
              <DialogDescription>
                Isi data pegawai baru di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" placeholder="Masukkan NIP" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama lengkap" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <Input id="position" placeholder="Jabatan" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guru">Guru</SelectItem>
                      <SelectItem value="tu">Tata Usaha</SelectItem>
                      <SelectItem value="security">Keamanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input id="phone" placeholder="08xxxxxxxxxx" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-1 flex-col md:flex-row gap-3 w-full lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Nama / NIP..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: Semua
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>NIP</TableHead>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Gaji Pokok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada data pegawai
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="group">
                    <TableCell className="font-mono text-sm">
                      {employee.nip}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {employee.user?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {employee.user?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(employee.base_salary))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Permanent"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          employee.status === "Permanent"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : ""
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>{" "}
              sampai{" "}
              <span className="font-medium">
                {Math.min(currentPage * 10, total)}
              </span>{" "}
              dari <span className="font-medium">{total}</span> data
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
