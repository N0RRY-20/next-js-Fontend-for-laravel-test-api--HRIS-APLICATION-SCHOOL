'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Subject, PaginatedResponse } from '@/types';
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
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

const DUMMY_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Matematika',
    code: 'MTK',
    description: 'Pelajaran matematika dasar dan lanjutan',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    name: 'Bahasa Indonesia',
    code: 'BIN',
    description: 'Pelajaran bahasa dan sastra Indonesia',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 3,
    name: 'Bahasa Inggris',
    code: 'BIG',
    description: 'Pelajaran bahasa Inggris',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 4,
    name: 'Ilmu Pengetahuan Alam',
    code: 'IPA',
    description: 'Pelajaran sains dan ilmu alam',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 5,
    name: 'Ilmu Pengetahuan Sosial',
    code: 'IPS',
    description: 'Pelajaran ilmu sosial dan kemasyarakatan',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 6,
    name: 'Pendidikan Agama Islam',
    code: 'PAI',
    description: 'Pelajaran agama Islam',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 7,
    name: 'Pendidikan Kewarganegaraan',
    code: 'PKN',
    description: 'Pelajaran kewarganegaraan dan budi pekerti',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 8,
    name: 'Seni Budaya',
    code: 'SBD',
    description: 'Pelajaran seni dan kebudayaan',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, [currentPage]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Subject> = await api.getSubjects(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_SUBJECTS;
      setSubjects(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch {
      // API belum tersedia, gunakan dummy data
      setSubjects(DUMMY_SUBJECTS);
      setTotalPages(1);
      setTotal(DUMMY_SUBJECTS.length);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mata Pelajaran</h1>
          <p className="text-muted-foreground">
            Kelola data mata pelajaran sekolah
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Mata Pelajaran
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
                  placeholder="Cari nama atau kode mata pelajaran..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
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
                <TableHead className="w-24">Kode</TableHead>
                <TableHead>Nama Mata Pelajaran</TableHead>
                <TableHead className="min-w-[300px]">Deskripsi</TableHead>
                <TableHead className="text-right w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Tidak ada data mata pelajaran
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id} className="group">
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {subject.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{subject.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {subject.description || '-'}
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
