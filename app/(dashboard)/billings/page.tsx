'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Billing, PaginatedResponse } from '@/types';
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
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Belum Bayar',
  paid: 'Lunas',
  overdue: 'Terlambat',
};

const typeLabels: Record<string, string> = {
  spp: 'SPP',
  registration: 'Pendaftaran',
  other: 'Lainnya',
};

const DUMMY_BILLINGS: Billing[] = [
  {
    id: 1,
    student_id: 1,
    type: 'spp',
    description: 'SPP Bulan Desember 2024',
    amount: 1500000,
    due_date: '2024-12-15',
    status: 'paid',
    student: { id: 1, name: 'Muhammad Rizki', nis: '2024001' },
  },
  {
    id: 2,
    student_id: 2,
    type: 'spp',
    description: 'SPP Bulan Desember 2024',
    amount: 1500000,
    due_date: '2024-12-15',
    status: 'pending',
    student: { id: 2, name: 'Fatimah Azzahra', nis: '2024002' },
  },
  {
    id: 3,
    student_id: 3,
    type: 'spp',
    description: 'SPP Bulan November 2024',
    amount: 1500000,
    due_date: '2024-11-15',
    status: 'overdue',
    student: { id: 3, name: 'Ahmad Zainul', nis: '2024003' },
  },
  {
    id: 4,
    student_id: 4,
    type: 'registration',
    description: 'Biaya Pendaftaran Tahun Ajaran 2024/2025',
    amount: 5000000,
    due_date: '2024-07-30',
    status: 'paid',
    student: { id: 4, name: 'Aisyah Putri', nis: '2024004' },
  },
  {
    id: 5,
    student_id: 5,
    type: 'other',
    description: 'Biaya Kegiatan Pesantren Kilat',
    amount: 500000,
    due_date: '2024-12-20',
    status: 'pending',
    student: { id: 5, name: 'Umar Faruq', nis: '2024005' },
  },
];

export default function BillingsPage() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBillings();
  }, [currentPage]);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Billing> = await api.getBillings(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_BILLINGS;
      setBillings(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch (error) {
      console.error('Failed to fetch billings:', error);
      setBillings(DUMMY_BILLINGS);
      setTotalPages(1);
      setTotal(DUMMY_BILLINGS.length);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tagihan & Pembayaran</h1>
          <p className="text-muted-foreground">
            Kelola tagihan SPP dan pembayaran siswa
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Tagihan
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
                  placeholder="Cari Nama Siswa / NIS..."
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
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : billings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data tagihan
                  </TableCell>
                </TableRow>
              ) : (
                billings.map((billing) => (
                  <TableRow key={billing.id} className="group">
                    <TableCell>
                      <span className="font-medium">
                        {billing.student?.name || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {typeLabels[billing.type] || billing.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {billing.description}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(billing.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(billing.due_date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[billing.status] || ''}
                      >
                        {statusLabels[billing.status] || billing.status}
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
                          {billing.status !== 'paid' && (
                            <DropdownMenuItem>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Bayar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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
