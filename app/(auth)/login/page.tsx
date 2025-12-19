'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Mail, School } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side: Hero / Brand Image */}
      <div
        className="hidden lg:flex relative w-1/2 flex-col justify-end p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <School className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold leading-tight text-foreground mb-3">
            Sistem HRIS Terpadu
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kelola data kepegawaian, absensi, dan administrasi sekolah dengan
            mudah, aman, dan efisien dalam satu platform.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center bg-background px-4 sm:px-12 md:px-24 py-10 overflow-y-auto">
        <div className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
          {/* Branding & Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 lg:hidden mb-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <School className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">HRIS Sekolah</span>
            </div>
            <h1 className="tracking-tight text-[32px] font-bold leading-tight">
              Selamat Datang
            </h1>
            <p className="text-muted-foreground text-base font-normal leading-normal">
              Silakan masuk menggunakan akun sekolah Anda.
            </p>
          </div>

          {/* Form Container */}
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@sekolah.sch.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pr-12"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-14 px-4 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Options Row: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Ingat saya
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Lupa Password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 mt-4 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer / Help */}
          <div className="flex flex-col items-center gap-4 border-t border-border pt-6 mt-2">
            <p className="text-muted-foreground text-sm font-normal text-center">
              Mengalami kendala saat login?
              <br className="sm:hidden" />
              <a
                href="#"
                className="text-foreground font-medium underline underline-offset-4 hover:text-primary ml-1"
              >
                Hubungi IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
