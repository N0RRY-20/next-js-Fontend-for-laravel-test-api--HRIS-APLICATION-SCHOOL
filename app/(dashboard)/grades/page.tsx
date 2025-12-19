'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Grade, PaginatedResponse } from '@/types';
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
  MoreHorizontal,
} from 'lucide-react';

const gradeColors: Record<string, string> = {
  A: 'bg-green-50 text-green-700 border-green-200',
  B: 'bg-blue-50 text-blue-700 border-blue-200',
  C: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  D: 'bg-orange-50 text-orange-700 border-orange-200',
  E: 'bg-red-50 text-red-700 border-red-200',
};

const DUMMY_GRADES: Grade[] = [
  {
    id: 1,
    student_id: 1,
    subject_id: 1,
    teacher_subject_id: 1,
    semester: 'Ganjil 2024/2025',
    score: 92,
    grade_letter: 'A',
    notes: 'Sangat baik',
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 1, name: 'Muhammad Rizki', nis: '2024001', classroom_id: 1, parent_id: null, gender: 'male', birth_date: '2010-01-01', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' },
  },
  {
    id: 2,
    student_id: 1,
    subject_id: 2,
    teacher_subject_id: 2,
    semester: 'Ganjil 2024/2025',
    score: 88,
    grade_letter: 'A',
    notes: null,
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 1, name: 'Muhammad Rizki', nis: '2024001', classroom_id: 1, parent_id: null, gender: 'male', birth_date: '2010-01-01', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 2, name: 'Bahasa Indonesia', code: 'BIN', description: null, created_at: '', updated_at: '' },
  },
  {
    id: 3,
    student_id: 2,
    subject_id: 1,
    teacher_subject_id: 1,
    semester: 'Ganjil 2024/2025',
    score: 85,
    grade_letter: 'B',
    notes: 'Perlu latihan soal lebih banyak',
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 2, name: 'Fatimah Azzahra', nis: '2024002', classroom_id: 1, parent_id: null, gender: 'female', birth_date: '2010-03-15', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' },
  },
  {
    id: 4,
    student_id: 2,
    subject_id: 3,
    teacher_subject_id: 3,
    semester: 'Ganjil 2024/2025',
    score: 90,
    grade_letter: 'A',
    notes: 'Speaking sangat baik',
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 2, name: 'Fatimah Azzahra', nis: '2024002', classroom_id: 1, parent_id: null, gender: 'female', birth_date: '2010-03-15', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 3, name: 'Bahasa Inggris', code: 'BIG', description: null, created_at: '', updated_at: '' },
  },
  {
    id: 5,
    student_id: 3,
    subject_id: 1,
    teacher_subject_id: 1,
    semester: 'Ganjil 2024/2025',
    score: 75,
    grade_letter: 'C',
    notes: 'Perlu bimbingan tambahan',
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 3, name: 'Ahmad Zainul', nis: '2024003', classroom_id: 1, parent_id: null, gender: 'male', birth_date: '2010-05-20', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' },
  },
  {
    id: 6,
    student_id: 3,
    subject_id: 4,
    teacher_subject_id: 4,
    semester: 'Ganjil 2024/2025',
    score: 82,
    grade_letter: 'B',
    notes: null,
    created_at: '2024-12-01',
    updated_at: '2024-12-01',
    student: { id: 3, name: 'Ahmad Zainul', nis: '2024003', classroom_id: 1, parent_id: null, gender: 'male', birth_date: '2010-05-20', address: 'Jakarta', phone: null, status: 'active', created_at: '', updated_at: '' },
    subject: { id: 4, name: 'Ilmu Pengetahuan Alam', code: 'IPA', description: null, created_at: '', updated_at: '' },
  },
];

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Grade> = await api.getGrades(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_GRADES;
      setGrades(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch {
      // API belum tersedia, gunakan dummy data
      setGrades(DUMMY_GRADES);
      setTotalPages(1);
      setTotal(DUMMY_GRADES.length);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const filteredGrades = grades.filter(
    (grade) =>
      grade.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.subject?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nilai Siswa</h1>
          <p className="text-muted-foreground">
            Kelola nilai siswa per mata pelajaran
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Input Nilai
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
                  placeholder="Cari nama siswa atau mata pelajaran..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Semester: Semua
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
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="text-center">Nilai</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-right w-20">Aksi</TableHead>
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
              ) : filteredGrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data nilai
                  </TableCell>
                </TableRow>
              ) : (
                filteredGrades.map((grade) => (
                  <TableRow key={grade.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{grade.student?.name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{grade.student?.nis}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {grade.subject?.code}
                        </Badge>
                        <span>{grade.subject?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {grade.semester}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-lg tabular-nums">{grade.score}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`font-bold ${gradeColors[grade.grade_letter] || ''}`}
                      >
                        {grade.grade_letter}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {grade.notes || '-'}
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
                            Edit Nilai
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
