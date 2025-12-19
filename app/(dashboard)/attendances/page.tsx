'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Attendance, PaginatedResponse } from '@/types';
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
  Calendar,
  Download,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  present: 'bg-green-50 text-green-700 border-green-200',
  absent: 'bg-red-50 text-red-700 border-red-200',
  late: 'bg-red-50 text-red-700 border-red-200',
  sick: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  leave: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusLabels: Record<string, string> = {
  present: 'Hadir',
  absent: 'Tidak Hadir',
  late: 'Terlambat',
  sick: 'Sakit',
  leave: 'Izin',
};

const DUMMY_ATTENDANCES: Attendance[] = [
  {
    id: 1,
    employee_id: 1,
    date: new Date().toISOString().split('T')[0],
    clock_in: '07:30:00',
    clock_out: '16:00:00',
    status: 'present',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: { id: 1, name: 'Ahmad Fauzi', nip: '198501012010011001', position: 'Guru Matematika' },
  },
  {
    id: 2,
    employee_id: 2,
    date: new Date().toISOString().split('T')[0],
    clock_in: '07:45:00',
    clock_out: '16:00:00',
    status: 'late',
    notes: 'Terlambat 15 menit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: { id: 2, name: 'Siti Aminah', nip: '199001152015022001', position: 'Guru Bahasa Indonesia' },
  },
  {
    id: 3,
    employee_id: 3,
    date: new Date().toISOString().split('T')[0],
    clock_in: '07:25:00',
    clock_out: '16:05:00',
    status: 'present',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: { id: 3, name: 'Budi Santoso', nip: '198712202012011002', position: 'Guru IPA' },
  },
  {
    id: 4,
    employee_id: 4,
    date: new Date().toISOString().split('T')[0],
    clock_in: null,
    clock_out: null,
    status: 'sick',
    notes: 'Sakit demam',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: { id: 4, name: 'Dewi Lestari', nip: '199205102018032001', position: 'Guru Bahasa Inggris' },
  },
  {
    id: 5,
    employee_id: 5,
    date: new Date().toISOString().split('T')[0],
    clock_in: null,
    clock_out: null,
    status: 'leave',
    notes: 'Cuti tahunan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee: { id: 5, name: 'Rudi Hermawan', nip: '198808082011011003', position: 'Staff TU' },
  },
];

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Attendance> = await api.getAttendances(
        currentPage,
        selectedDate
      );
      const data = response.data.length > 0 ? response.data : DUMMY_ATTENDANCES;
      setAttendances(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
      setAttendances(DUMMY_ATTENDANCES);
      setTotalPages(1);
      setTotal(DUMMY_ATTENDANCES.length);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedDate]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time.substring(0, 5);
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
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Absensi</h1>
          <p className="text-muted-foreground">
            Kelola data kehadiran guru dan staf sekolah
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Absensi Manual
        </Button>
      </div>

      {/* Filters & Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-1 flex-col md:flex-row gap-3 w-full lg:max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Nama / NIP..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-56">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-32">Tanggal</TableHead>
                  <TableHead className="min-w-[200px]">Nama Pegawai</TableHead>
                  <TableHead className="w-24">Jam Masuk</TableHead>
                  <TableHead className="w-24">Jam Keluar</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="min-w-[150px]">Keterangan</TableHead>
                  <TableHead className="w-20 text-right">Aksi</TableHead>
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
                ) : attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada data absensi
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((attendance) => (
                    <TableRow key={attendance.id} className="group">
                      <TableCell className="text-muted-foreground">
                        {formatDate(attendance.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {attendance.employee?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {attendance.employee?.position || ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-medium tabular-nums ${
                          attendance.status === 'late'
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {formatTime(attendance.clock_in)}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {formatTime(attendance.clock_out)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[attendance.status] || ''}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                          {statusLabels[attendance.status] || attendance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-[200px]">
                        {attendance.notes || '-'}
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
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> sampai{' '}
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
                Sebelumnya
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
