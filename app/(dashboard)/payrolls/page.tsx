'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Payroll, PaginatedResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
} from 'lucide-react';

const DUMMY_PAYROLLS: Payroll[] = [
  {
    id: 1,
    employee_id: 1,
    period: 'Desember 2024',
    basic_salary: 5000000,
    allowances: 1500000,
    deductions: 500000,
    net_salary: 6000000,
    status: 'paid',
    paid_at: '2024-12-25T10:00:00Z',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T10:00:00Z',
    employee: { id: 1, name: 'Ahmad Fauzi', nip: '198501012010011001', position: 'Guru' },
  },
  {
    id: 2,
    employee_id: 2,
    period: 'Desember 2024',
    basic_salary: 4500000,
    allowances: 1200000,
    deductions: 450000,
    net_salary: 5250000,
    status: 'paid',
    paid_at: '2024-12-25T10:00:00Z',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T10:00:00Z',
    employee: { id: 2, name: 'Siti Aminah', nip: '199001152015022001', position: 'Guru' },
  },
  {
    id: 3,
    employee_id: 3,
    period: 'Desember 2024',
    basic_salary: 4800000,
    allowances: 1300000,
    deductions: 480000,
    net_salary: 5620000,
    status: 'pending',
    paid_at: null,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    employee: { id: 3, name: 'Budi Santoso', nip: '198712202012011002', position: 'Staff' },
  },
  {
    id: 4,
    employee_id: 4,
    period: 'Desember 2024',
    basic_salary: 4200000,
    allowances: 1000000,
    deductions: 420000,
    net_salary: 4780000,
    status: 'pending',
    paid_at: null,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    employee: { id: 4, name: 'Dewi Lestari', nip: '199205102018032001', position: 'Guru' },
  },
  {
    id: 5,
    employee_id: 5,
    period: 'Desember 2024',
    basic_salary: 3500000,
    allowances: 800000,
    deductions: 350000,
    net_salary: 3950000,
    status: 'paid',
    paid_at: '2024-12-25T10:00:00Z',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-25T10:00:00Z',
    employee: { id: 5, name: 'Rudi Hermawan', nip: '198808082011011003', position: 'Staff' },
  },
];

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayrolls = useCallback(async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Payroll> = await api.getPayrolls(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_PAYROLLS;
      setPayrolls(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch (error) {
      console.error('Failed to fetch payrolls:', error);
      setPayrolls(DUMMY_PAYROLLS);
      setTotalPages(1);
      setTotal(DUMMY_PAYROLLS.length);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Penggajian</h1>
          <p className="text-muted-foreground">
            Kelola data penggajian pegawai
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Slip Gaji
        </Button>
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
                Periode: Semua
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
                <TableHead>Periode</TableHead>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead className="text-right">Gaji Pokok</TableHead>
                <TableHead className="text-right">Tunjangan</TableHead>
                <TableHead className="text-right">Potongan</TableHead>
                <TableHead className="text-right">Gaji Bersih</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data penggajian
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((payroll) => (
                  <TableRow key={payroll.id} className="group">
                    <TableCell className="font-medium">
                      {payroll.period}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {payroll.employee?.name || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(payroll.basic_salary)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-green-600">
                      +{formatCurrency(payroll.allowances)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-red-600">
                      -{formatCurrency(payroll.deductions)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-bold">
                      {formatCurrency(payroll.net_salary)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          payroll.status === 'paid'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {payroll.status === 'paid' ? 'Dibayar' : 'Pending'}
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
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Slip
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
              Menampilkan{' '}
              <span className="font-medium">{Math.min((currentPage - 1) * 10 + 1, total)}</span> sampai{' '}
              <span className="font-medium">
                {Math.min(currentPage * 10, total)}
              </span>{' '}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
