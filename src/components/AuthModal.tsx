'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Eye, EyeOff, Gift, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Введите имя').min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Минимум 8 символов')
    .regex(/[A-ZА-Я]/, 'Нужна минимум 1 заглавная буква')
    .regex(/[0-9]/, 'Нужна минимум 1 цифра'),
  terms: z.boolean().refine((val) => val === true, { message: 'Необходимо согласие' }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onLogin?: () => void;
}

function getPasswordStrength(password: string): { level: number; label: string } {
  if (!password) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-ZА-Я]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Слабый пароль' };
  if (score <= 2) return { level: 2, label: 'Средний' };
  if (score <= 3) return { level: 3, label: 'Хороший' };
  return { level: 4, label: 'Надёжный' };
}

export function AuthModal({ open, onClose, defaultTab = 'login', onLogin }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', terms: false },
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    setServerError(null);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      onLogin?.();
    } catch {
      setServerError('Ошибка входа. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (data) => {
    setServerError(null);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      onLogin?.();
    } catch {
      setServerError('Ошибка регистрации. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  });

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin?.();
    }, 500);
  };

  const watchedPassword = registerForm.watch('password');
  const strength = getPasswordStrength(watchedPassword || '');

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="bg-[#151b23] border-gray-700/50 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white text-sm">
                ФП
              </div>
            </div>
            <span className="text-lg font-bold text-white">Добро пожаловать</span>
          </DialogTitle>
        </DialogHeader>

        {serverError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{serverError}</span>
          </div>
        )}

        <Tabs defaultValue={defaultTab}>
          <TabsList className="bg-gray-800/50 border-gray-700/50 w-full mb-4">
            <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...loginForm.register('email')}
                    className={`bg-gray-900 border-gray-700 text-white pl-10 focus:border-emerald-500/50 ${
                      loginForm.formState.errors.email ? 'border-red-500/50 focus:border-red-500/50' : ''
                    }`}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-[10px] text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...loginForm.register('password')}
                    className={`bg-gray-900 border-gray-700 text-white pl-10 pr-10 focus:border-emerald-500/50 ${
                      loginForm.formState.errors.password ? 'border-red-500/50 focus:border-red-500/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-[10px] text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-emerald-500 w-3.5 h-3.5" />
                  <span className="text-xs text-gray-400">Запомнить</span>
                </label>
                <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300">
                  Забыли пароль?
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Вход...
                  </div>
                ) : (
                  <>
                    Войти
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Quick login */}
              <div className="relative my-3">
                <Separator className="bg-gray-700/50" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#151b23] px-2 text-[10px] text-gray-600">
                  или быстро
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-xs"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Демо-вход (без регистрации)
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Bonus banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-300">5 фрибетов по 1000 рублей новым пользователям!</span>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    {...registerForm.register('name')}
                    className={`bg-gray-900 border-gray-700 text-white pl-10 focus:border-emerald-500/50 ${
                      registerForm.formState.errors.name ? 'border-red-500/50 focus:border-red-500/50' : ''
                    }`}
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-[10px] text-red-400 mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...registerForm.register('email')}
                    className={`bg-gray-900 border-gray-700 text-white pl-10 focus:border-emerald-500/50 ${
                      registerForm.formState.errors.email ? 'border-red-500/50 focus:border-red-500/50' : ''
                    }`}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-[10px] text-red-400 mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Минимум 8 символов"
                    {...registerForm.register('password')}
                    className={`bg-gray-900 border-gray-700 text-white pl-10 pr-10 focus:border-emerald-500/50 ${
                      registerForm.formState.errors.password ? 'border-red-500/50 focus:border-red-500/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-[10px] text-red-400 mt-1">{registerForm.formState.errors.password.message}</p>
                )}
                {/* Password strength indicator */}
                {watchedPassword && watchedPassword.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength.level >= level
                              ? level <= 1 ? 'bg-red-500' : level <= 2 ? 'bg-orange-500' : level <= 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">{strength.label}</span>
                    {/* Password requirements */}
                    <div className="mt-1.5 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${watchedPassword.length >= 8 ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        <span className={`text-[9px] ${watchedPassword.length >= 8 ? 'text-emerald-400' : 'text-gray-600'}`}>8+ символов</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-ZА-Я]/.test(watchedPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        <span className={`text-[9px] ${/[A-ZА-Я]/.test(watchedPassword) ? 'text-emerald-400' : 'text-gray-600'}`}>Заглавная буква</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(watchedPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        <span className={`text-[9px] ${/[0-9]/.test(watchedPassword) ? 'text-emerald-400' : 'text-gray-600'}`}>Цифра</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-emerald-500 w-3.5 h-3.5 mt-0.5"
                  {...registerForm.register('terms')}
                />
                <div>
                  <span className="text-xs text-gray-400">
                    Мне исполнилось 18 лет. Я соглашаюсь с{' '}
                    <a href="#" className="text-emerald-400 hover:text-emerald-300">правилами</a> и{' '}
                    <a href="#" className="text-emerald-400 hover:text-emerald-300">политикой конфиденциальности</a>
                  </span>
                  {registerForm.formState.errors.terms && (
                    <p className="text-[10px] text-red-400 mt-0.5">{registerForm.formState.errors.terms.message}</p>
                  )}
                </div>
              </label>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Регистрация...
                  </div>
                ) : (
                  <>
                    Зарегистрироваться
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Separator className="bg-gray-700/50 my-2" />

        <p className="text-[10px] text-gray-600 text-center">
          18+ Ответственная игра. Играйте осознанно.
        </p>
      </DialogContent>
    </Dialog>
  );
}
