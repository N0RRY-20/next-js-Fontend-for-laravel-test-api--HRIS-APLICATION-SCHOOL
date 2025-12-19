'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  GraduationCap,
  BookOpen,
  Receipt,
  AlertTriangle,
  BookMarked,
  Settings,
  LogOut,
  School,
  ClipboardList,
  CalendarDays,
  Library,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pegawai', href: '/employees', icon: Users },
  { name: 'Absensi', href: '/attendances', icon: Calendar },
  { name: 'Penggajian', href: '/payrolls', icon: Wallet },
  { name: 'Siswa', href: '/students', icon: GraduationCap },
  { name: 'Kelas', href: '/classrooms', icon: BookOpen },
  { name: 'Mata Pelajaran', href: '/subjects', icon: Library },
  { name: 'Nilai Siswa', href: '/grades', icon: ClipboardList },
  { name: 'Jadwal', href: '/schedules', icon: CalendarDays },
  { name: 'Tagihan', href: '/billings', icon: Receipt },
  { name: 'Pelanggaran', href: '/behavior-records', icon: AlertTriangle },
  { name: 'Tahfidz', href: '/tahfidz-records', icon: BookMarked },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <School className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-none">HRIS Sekolah</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin TU</p>
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'fill-current')} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}

        <Separator className="my-2" />

        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
            pathname === '/settings'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm font-medium">Pengaturan</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
