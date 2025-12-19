'use client';

import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Lock, Bell, Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan akun dan preferensi
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>
              Informasi dasar akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Ganti Foto
              </Button>
            </div>
            <Separator />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" defaultValue={user?.name || ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} />
              </div>
            </div>
            <Button>Simpan Perubahan</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Keamanan
            </CardTitle>
            <CardDescription>
              Ubah password dan pengaturan keamanan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button>Ubah Password</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi
            </CardTitle>
            <CardDescription>
              Atur preferensi notifikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifikasi Email</p>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi penting via email
                </p>
              </div>
              <Button variant="outline" size="sm">
                Aktif
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifikasi Browser</p>
                <p className="text-sm text-muted-foreground">
                  Tampilkan notifikasi di browser
                </p>
              </div>
              <Button variant="outline" size="sm">
                Nonaktif
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Tampilan
            </CardTitle>
            <CardDescription>
              Sesuaikan tampilan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  Pilih tema tampilan
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4 mr-1" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4 mr-1" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
