'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Classroom, PaginatedResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Users,
} from 'lucide-react';

const DUMMY_CLASSROOMS: Classroom[] = [
  {
    id: 1,
    name: 'VII-A',
    grade_level: 'VII',
    capacity: 30,
    homeroom_teacher_id: 1,
  },
  {
    id: 2,
    name: 'VII-B',
    grade_level: 'VII',
    capacity: 30,
    homeroom_teacher_id: 2,
  },
  {
    id: 3,
    name: 'VIII-A',
    grade_level: 'VIII',
    capacity: 32,
    homeroom_teacher_id: 3,
  },
  {
    id: 4,
    name: 'VIII-B',
    grade_level: 'VIII',
    capacity: 32,
    homeroom_teacher_id: null,
  },
  {
    id: 5,
    name: 'IX-A',
    grade_level: 'IX',
    capacity: 28,
    homeroom_teacher_id: 4,
  },
  {
    id: 6,
    name: 'IX-B',
    grade_level: 'IX',
    capacity: 28,
    homeroom_teacher_id: 5,
  },
];

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, [currentPage]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Classroom> = await api.getClassrooms(currentPage);
      const data = response.data.length > 0 ? response.data : DUMMY_CLASSROOMS;
      setClassrooms(data);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || data.length);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
      setClassrooms(DUMMY_CLASSROOMS);
      setTotalPages(1);
      setTotal(DUMMY_CLASSROOMS.length);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground">
            Kelola data kelas dan ruangan
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kelas
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
                  placeholder="Cari nama kelas..."
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
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Tingkat</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredClassrooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada data kelas
                  </TableCell>
                </TableRow>
              ) : (
                filteredClassrooms.map((classroom) => (
                  <TableRow key={classroom.id} className="group">
                    <TableCell>
                      <span className="font-medium">{classroom.name}</span>
                    </TableCell>
                    <TableCell>{classroom.grade_level}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {classroom.capacity} siswa
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {classroom.homeroom_teacher_id ? 'Assigned' : '-'}
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
