'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { BehaviorRecord, PaginatedResponse } from '@/types';
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
  Search,
  Plus,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

const DUMMY_BEHAVIOR_RECORDS: BehaviorRecord[] = [
  {
    id: 1,
    student_id: 1,
    recorded_by: 1,
    date: '2024-12-18',
    type: 'negative',
    category: 'Kedisiplinan',
    description: 'Terlambat masuk kelas',
    points: 5,
    created_at: '2024-12-18T08:00:00Z',
    student: { id: 1, name: 'Muhammad Rizki', nis: '2024001' },
  },
  {
    id: 2,
    student_id: 2,
    recorded_by: 1,
    date: '2024-12-18',
    type: 'positive',
    category: 'Prestasi',
    description: 'Juara 1 lomba hafalan Al-Quran',
    points: 20,
    created_at: '2024-12-18T09:00:00Z',
    student: { id: 2, name: 'Fatimah Azzahra', nis: '2024002' },
  },
  {
    id: 3,
    student_id: 3,
    recorded_by: 2,
    date: '2024-12-17',
    type: 'negative',
    category: 'Kebersihan',
    description: 'Tidak menjaga kebersihan asrama',
    points: 3,
    created_at: '2024-12-17T10:00:00Z',
    student: { id: 3, name: 'Ahmad Zainul', nis: '2024003' },
  },
  {
    id: 4,
    student_id: 4,
    recorded_by: 2,
    date: '2024-12-17',
    type: 'positive',
    category: 'Akhlak',
    description: 'Membantu teman yang kesulitan belajar',
    points: 10,
    created_at: '2024-12-17T11:00:00Z',
    student: { id: 4, name: 'Aisyah Putri', nis: '2024004' },
  },
  {
    id: 5,
    student_id: 5,
    recorded_by: 1,
    date: '2024-12-16',
    type: 'negative',
    category: 'Kedisiplinan',
    description: 'Tidak mengikuti sholat berjamaah',
    points: 10,
    created_at: '2024-12-16T07:00:00Z',
    student: { id: 5, name: 'Umar Faruq', nis: '2024005' },
  },
];

export default function BehaviorRecordsPage() {
  const [records, setRecords] = useState<BehaviorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<BehaviorRecord> = await api.getBehaviorRecords(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_BEHAVIOR_RECORDS;
      setRecords(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch (error) {
      console.error('Failed to fetch behavior records:', error);
      setRecords(DUMMY_BEHAVIOR_RECORDS);
      setTotalPages(1);
      setTotal(DUMMY_BEHAVIOR_RECORDS.length);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
          <h1 className="text-3xl font-bold tracking-tight">Input Pelanggaran</h1>
          <p className="text-muted-foreground">
            Catatan perilaku dan pelanggaran santri
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Catatan
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
                  placeholder="Cari Nama Santri..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Tipe: Semua
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Santri</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Poin</TableHead>
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
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Tidak ada data catatan perilaku
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {record.student?.name || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          record.type === 'positive'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {record.type === 'positive' ? (
                          <ThumbsUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ThumbsDown className="h-3 w-3 mr-1" />
                        )}
                        {record.type === 'positive' ? 'Positif' : 'Negatif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {record.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-bold ${
                          record.type === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {record.type === 'positive' ? '+' : '-'}
                        {record.points}
                      </span>
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
