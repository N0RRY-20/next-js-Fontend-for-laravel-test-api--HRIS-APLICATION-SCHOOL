'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Schedule, PaginatedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Download, Filter } from 'lucide-react';

const DAYS = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
];

const TIME_SLOTS = [
  { start: '07:00', end: '07:45', label: '07:00 - 07:45' },
  { start: '07:45', end: '08:30', label: '07:45 - 08:30' },
  { start: '08:30', end: '09:15', label: '08:30 - 09:15' },
  { start: '09:15', end: '09:30', label: '09:15 - 09:30', isBreak: true, breakLabel: 'Istirahat' },
  { start: '09:30', end: '10:15', label: '09:30 - 10:15' },
  { start: '10:15', end: '11:00', label: '10:15 - 11:00' },
  { start: '11:00', end: '11:45', label: '11:00 - 11:45' },
  { start: '11:45', end: '12:30', label: '11:45 - 12:30', isBreak: true, breakLabel: 'Ishoma' },
  { start: '12:30', end: '13:15', label: '12:30 - 13:15' },
  { start: '13:15', end: '14:00', label: '13:15 - 14:00' },
];

const DUMMY_SCHEDULES: Schedule[] = [
  { id: 1, classroom_id: 1, subject_id: 1, teacher_id: 1, day: 'monday', start_time: '07:00', end_time: '07:45', created_at: '', updated_at: '', subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' }, teacher: { id: 1, user_id: 1, nip: '001', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 1, name: 'Pak Ahmad', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 2, classroom_id: 1, subject_id: 1, teacher_id: 1, day: 'monday', start_time: '07:45', end_time: '08:30', created_at: '', updated_at: '', subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' }, teacher: { id: 1, user_id: 1, nip: '001', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 1, name: 'Pak Ahmad', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 3, classroom_id: 1, subject_id: 2, teacher_id: 2, day: 'monday', start_time: '08:30', end_time: '09:15', created_at: '', updated_at: '', subject: { id: 2, name: 'Bahasa Indonesia', code: 'BIN', description: null, created_at: '', updated_at: '' }, teacher: { id: 2, user_id: 2, nip: '002', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 2, name: 'Bu Siti', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 4, classroom_id: 1, subject_id: 2, teacher_id: 2, day: 'monday', start_time: '09:30', end_time: '10:15', created_at: '', updated_at: '', subject: { id: 2, name: 'Bahasa Indonesia', code: 'BIN', description: null, created_at: '', updated_at: '' }, teacher: { id: 2, user_id: 2, nip: '002', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 2, name: 'Bu Siti', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 5, classroom_id: 1, subject_id: 3, teacher_id: 3, day: 'monday', start_time: '10:15', end_time: '11:00', created_at: '', updated_at: '', subject: { id: 3, name: 'Bahasa Inggris', code: 'BIG', description: null, created_at: '', updated_at: '' }, teacher: { id: 3, user_id: 3, nip: '003', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 3, name: 'Mr. John', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 6, classroom_id: 1, subject_id: 4, teacher_id: 4, day: 'tuesday', start_time: '07:00', end_time: '07:45', created_at: '', updated_at: '', subject: { id: 4, name: 'IPA', code: 'IPA', description: null, created_at: '', updated_at: '' }, teacher: { id: 4, user_id: 4, nip: '004', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 4, name: 'Bu Dewi', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 7, classroom_id: 1, subject_id: 4, teacher_id: 4, day: 'tuesday', start_time: '07:45', end_time: '08:30', created_at: '', updated_at: '', subject: { id: 4, name: 'IPA', code: 'IPA', description: null, created_at: '', updated_at: '' }, teacher: { id: 4, user_id: 4, nip: '004', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 4, name: 'Bu Dewi', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 8, classroom_id: 1, subject_id: 5, teacher_id: 5, day: 'tuesday', start_time: '08:30', end_time: '09:15', created_at: '', updated_at: '', subject: { id: 5, name: 'IPS', code: 'IPS', description: null, created_at: '', updated_at: '' }, teacher: { id: 5, user_id: 5, nip: '005', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 5, name: 'Pak Budi', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 9, classroom_id: 1, subject_id: 6, teacher_id: 6, day: 'wednesday', start_time: '07:00', end_time: '07:45', created_at: '', updated_at: '', subject: { id: 6, name: 'PAI', code: 'PAI', description: null, created_at: '', updated_at: '' }, teacher: { id: 6, user_id: 6, nip: '006', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 6, name: 'Ustadz Hasan', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 10, classroom_id: 1, subject_id: 6, teacher_id: 6, day: 'wednesday', start_time: '07:45', end_time: '08:30', created_at: '', updated_at: '', subject: { id: 6, name: 'PAI', code: 'PAI', description: null, created_at: '', updated_at: '' }, teacher: { id: 6, user_id: 6, nip: '006', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 6, name: 'Ustadz Hasan', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 11, classroom_id: 1, subject_id: 1, teacher_id: 1, day: 'thursday', start_time: '07:00', end_time: '07:45', created_at: '', updated_at: '', subject: { id: 1, name: 'Matematika', code: 'MTK', description: null, created_at: '', updated_at: '' }, teacher: { id: 1, user_id: 1, nip: '001', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 1, name: 'Pak Ahmad', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
  { id: 12, classroom_id: 1, subject_id: 3, teacher_id: 3, day: 'friday', start_time: '07:00', end_time: '07:45', created_at: '', updated_at: '', subject: { id: 3, name: 'Bahasa Inggris', code: 'BIG', description: null, created_at: '', updated_at: '' }, teacher: { id: 3, user_id: 3, nip: '003', position: 'Guru', base_salary: '0', status: 'active', created_at: '', updated_at: '', user: { id: 3, name: 'Mr. John', email: '', role: 'teacher', created_at: '', updated_at: '' } } },
];

const CLASSROOMS = [
  { id: 1, name: 'VII-A' },
  { id: 2, name: 'VII-B' },
  { id: 3, name: 'VIII-A' },
  { id: 4, name: 'VIII-B' },
  { id: 5, name: 'IX-A' },
  { id: 6, name: 'IX-B' },
];

const subjectColors: Record<string, string> = {
  MTK: 'bg-blue-100 border-blue-300 text-blue-800',
  BIN: 'bg-green-100 border-green-300 text-green-800',
  BIG: 'bg-purple-100 border-purple-300 text-purple-800',
  IPA: 'bg-orange-100 border-orange-300 text-orange-800',
  IPS: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  PAI: 'bg-teal-100 border-teal-300 text-teal-800',
  PKN: 'bg-pink-100 border-pink-300 text-pink-800',
  SBD: 'bg-indigo-100 border-indigo-300 text-indigo-800',
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState('1');

  useEffect(() => {
    fetchSchedules();
  }, [selectedClassroom]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Schedule> = await api.getSchedules(parseInt(selectedClassroom));
      const data = response.data.length > 0 ? response.data : DUMMY_SCHEDULES;
      setSchedules(data);
    } catch {
      // API belum tersedia, gunakan dummy data
      setSchedules(DUMMY_SCHEDULES);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForSlot = (day: string, startTime: string) => {
    return schedules.find(
      (s) => s.day === day && s.start_time === startTime
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Pelajaran</h1>
          <p className="text-muted-foreground">
            Kelola jadwal mata pelajaran per kelas
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Jadwal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Pilih Kelas:</span>
              <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSROOMS.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Guru
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Kelas {CLASSROOMS.find(c => c.id.toString() === selectedClassroom)?.name}</CardTitle>
          <CardDescription>Tahun Ajaran 2024/2025 - Semester Ganjil</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border p-3 text-left text-sm font-semibold w-28">Jam</th>
                    {DAYS.map((day) => (
                      <th key={day.key} className="border p-3 text-center text-sm font-semibold min-w-[140px]">
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot) => (
                    <tr key={slot.start}>
                      <td className="border p-2 text-xs text-muted-foreground font-medium bg-muted/30">
                        {slot.label}
                      </td>
                      {slot.isBreak ? (
                        <td colSpan={6} className="border p-2 text-center bg-muted/20">
                          <span className="text-xs text-muted-foreground font-medium">
                            {slot.breakLabel}
                          </span>
                        </td>
                      ) : (
                        DAYS.map((day) => {
                          const schedule = getScheduleForSlot(day.key, slot.start);
                          return (
                            <td key={`${day.key}-${slot.start}`} className="border p-1">
                              {schedule ? (
                                <div
                                  className={`p-2 rounded-md border text-center cursor-pointer hover:opacity-80 transition-opacity ${
                                    subjectColors[schedule.subject?.code || ''] || 'bg-gray-100 border-gray-300'
                                  }`}
                                >
                                  <p className="font-semibold text-sm">{schedule.subject?.code}</p>
                                  <p className="text-xs truncate">{schedule.teacher?.user?.name}</p>
                                </div>
                              ) : (
                                <div className="p-2 text-center">
                                  <span className="text-xs text-muted-foreground">-</span>
                                </div>
                              )}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Keterangan Warna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(subjectColors).map(([code, colorClass]) => (
              <Badge
                key={code}
                variant="outline"
                className={`${colorClass} font-medium`}
              >
                {code}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
