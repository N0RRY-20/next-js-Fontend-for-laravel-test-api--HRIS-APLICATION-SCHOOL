'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  TrendingUp,
  Check,
  X,
  Megaphone,
  Cake,
} from 'lucide-react';

// Dummy data untuk fallback ketika tidak ada data dari API
const DUMMY_STATS = [
  {
    title: 'Total Pegawai',
    value: '124',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    badge: 'Total',
  },
  {
    title: 'Hadir Hari Ini',
    value: '118',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    badge: '95%',
    badgeColor: 'bg-green-100 text-green-700',
    trend: true,
  },
  {
    title: 'Izin / Sakit',
    value: '4',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Menunggu Persetujuan',
    value: '3',
    subtitle: 'Permintaan',
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    badge: 'Action Needed',
    badgeColor: 'bg-red-100 text-red-600',
    highlight: true,
  },
];

const DUMMY_LEAVE_REQUESTS = [
  {
    id: 1,
    name: 'Siti Aminah',
    type: 'Cuti Sakit',
    date: '24 - 26 Okt',
    status: 'Menunggu',
    avatar: 'SA',
  },
  {
    id: 2,
    name: 'Ahmad Fauzi',
    type: 'Izin Pribadi',
    date: '25 Okt',
    status: 'Menunggu',
    avatar: 'AF',
  },
  {
    id: 3,
    name: 'Rudi Hermawan',
    type: 'Cuti Tahunan',
    date: '1 - 3 Nov',
    status: 'Menunggu',
    avatar: 'RH',
  },
];

const DUMMY_WEEKLY_ATTENDANCE = [
  { day: 'Sen', percentage: 98 },
  { day: 'Sel', percentage: 96 },
  { day: 'Rab', percentage: 94 },
  { day: 'Kam', percentage: 95 },
  { day: 'Jum', percentage: 88 },
  { day: 'Sab', percentage: 0, isHoliday: true },
];

const DUMMY_EMPLOYEE_COMPOSITION = {
  total: 124,
  guru: 86,
  tenagaKependidikan: 38,
};

const DUMMY_ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'important',
    icon: Megaphone,
    label: 'Penting',
    title: 'Rapat Evaluasi Bulanan',
    subtitle: 'Jumat, 28 Okt - Ruang Guru Lt.2',
  },
  {
    id: 2,
    type: 'birthday',
    icon: Cake,
    label: 'Ulang Tahun',
    title: 'Bu Sri Wahyuni (Matematika)',
    subtitle: 'Hari ini',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  // Data dari API (ganti dengan fetch dari API nantinya)
  // Contoh: const { data: apiStats } = useSWR('/api/stats', fetcher);
  const apiStats = null as typeof DUMMY_STATS | null;
  const apiLeaveRequests = null as typeof DUMMY_LEAVE_REQUESTS | null;
  const apiWeeklyAttendance = null as typeof DUMMY_WEEKLY_ATTENDANCE | null;
  const apiEmployeeComposition = null as typeof DUMMY_EMPLOYEE_COMPOSITION | null;
  const apiAnnouncements = null as typeof DUMMY_ANNOUNCEMENTS | null;

  // Gunakan dummy data jika tidak ada data dari API
  const stats = apiStats ?? DUMMY_STATS;
  const leaveRequests = apiLeaveRequests ?? DUMMY_LEAVE_REQUESTS;
  const weeklyAttendance = apiWeeklyAttendance ?? DUMMY_WEEKLY_ATTENDANCE;
  const employeeComposition = apiEmployeeComposition ?? DUMMY_EMPLOYEE_COMPOSITION;
  const announcements = apiAnnouncements ?? DUMMY_ANNOUNCEMENTS;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}
          </h2>
          <p className="text-muted-foreground mt-1">
            Berikut ringkasan data SDM hari ini, {today}.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Tahun Ajaran: 2024/2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={stat.highlight ? 'border-red-200 relative overflow-hidden' : ''}
          >
            {stat.highlight && (
              <div className="absolute right-0 top-0 h-full w-1 bg-red-500" />
            )}
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {stat.badge && (
                  <Badge
                    variant="secondary"
                    className={stat.badgeColor || 'bg-muted text-muted-foreground'}
                  >
                    {stat.trend && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {stat.value}
                  {stat.subtitle && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.subtitle}
                    </span>
                  )}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tren Kehadiran Mingguan</CardTitle>
                <CardDescription>
                  Statistik kehadiran 7 hari terakhir
                </CardDescription>
              </div>
              <Button variant="link" className="text-primary">
                Lihat Detail
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {weeklyAttendance.map((item) => {
                  const barHeight = Math.max(item.percentage, 10);
                  return (
                    <div
                      key={item.day}
                      className="flex flex-col items-center gap-2 flex-1 h-full group cursor-pointer"
                    >
                      <div className="flex-1 w-full flex items-end justify-center">
                        <div
                          className="w-full max-w-[40px] bg-muted rounded-t relative group-hover:bg-primary/10 transition-all"
                          style={{ height: `${barHeight}%` }}
                        >
                          <div
                            className={`absolute bottom-0 left-0 w-full h-full rounded-t transition-all duration-500 ${
                              item.isHoliday ? 'bg-muted-foreground/30' : 'bg-primary'
                            }`}
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {item.isHoliday ? 'Libur' : `${item.percentage}%`}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle>Persetujuan Cuti</CardTitle>
                <CardDescription>Menunggu konfirmasi admin</CardDescription>
              </div>
              <Button variant="link" className="text-primary">
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nama Pegawai</TableHead>
                    <TableHead>Jenis Cuti</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{request.avatar}</AvatarFallback>
                          </Avatar>
                          {request.name}
                        </div>
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Employee Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Komposisi Pegawai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="70, 100"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-orange-400"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-70"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{employeeComposition.total}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Guru</span>
                  </div>
                  <span className="text-sm font-semibold">{employeeComposition.guru}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-orange-400" />
                    <span className="text-sm text-muted-foreground">
                      Tenaga Kependidikan
                    </span>
                  </div>
                  <span className="text-sm font-semibold">{employeeComposition.tenagaKependidikan}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Pengumuman Internal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-3 rounded-lg ${
                    announcement.type === 'important'
                      ? 'bg-primary/5 border border-primary/10'
                      : 'bg-muted/50 border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <announcement.icon
                      className={`h-4 w-4 ${
                        announcement.type === 'important'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase ${
                        announcement.type === 'important'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {announcement.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {announcement.subtitle}
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                + Tambah Pengumuman
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
