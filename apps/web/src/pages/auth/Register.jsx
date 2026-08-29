import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// Step 1: Initial info
const step1Schema = z.object({
  name: z.string().min(2, 'Ism kamida 2ta harf'),
  email: z.string().email("Noto'g'ri email"),
});

// Step 2: OTP
const step2Schema = z.object({
  code: z.string().length(6, "Kod 6 ta raqam bo'lishi kerak"),
});

// Step 3: Username & Password
const step3Schema = z.object({
  username: z.string().min(3, "Login kamida 3 ta belgi").max(30),
  password: z.string()
    .min(8, "Parol kamida 8 ta belgi")
    .regex(/[A-Z]/, "Kamida 1 ta katta harf")
    .regex(/[a-z]/, "Kamida 1 ta kichik harf")
    .regex(/[0-9]/, "Kamida 1 ta raqam")
    .regex(/[^A-Za-z0-9]/, "Kamida 1 ta maxsus belgi (@, #, $...)"),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Parollar mos emas",
  path: ["confirmPassword"],
});

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [serverError, setServerError] = useState('');

  // Forms
  const form1 = useForm({ resolver: zodResolver(step1Schema) });
  const form2 = useForm({ resolver: zodResolver(step2Schema) });
  const form3 = useForm({ resolver: zodResolver(step3Schema) });

  async function onStep1(values) {
    setServerError('');
    try {
      const { data } = await api.post('/auth/email/send-code', values);
      setSessionId(data.sessionId);
      setUserData(values);
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      setServerError(err.friendlyMessage || t('common.error_occurred'));
    }
  }

  async function onStep2(values) {
    setServerError('');
    try {
      const { data } = await api.post('/auth/email/verify-code', {
        sessionId,
        code: values.code,
      });
      toast.success(data.message);
      setStep(3);
    } catch (err) {
      setServerError(err.friendlyMessage || t('common.error_occurred'));
    }
  }

  async function onStep3(values) {
    setServerError('');
    try {
      const { data } = await api.post('/auth/complete-registration', {
        sessionId,
        name: userData.name,
        username: values.username,
        password: values.password,
      });
      setSession(data.token, data.user);
      toast.success(t('auth.register_success'));
      navigate('/');
    } catch (err) {
      setServerError(err.friendlyMessage || t('common.error_occurred'));
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">
        {step === 1 && "Ro'yxatdan o'tish"}
        {step === 2 && "Kodni tasdiqlash"}
        {step === 3 && "Login va Parol yaratish"}
      </h1>

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(onStep1)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t('auth.name')}</label>
            <Input {...form1.register('name')} placeholder="Ismingiz" />
            {form1.formState.errors.name && (
              <p className="mt-1 text-xs text-destructive">{form1.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t('auth.email')}</label>
            <Input type="email" {...form1.register('email')} placeholder="email@gmail.com" />
            {form1.formState.errors.email && (
              <p className="mt-1 text-xs text-destructive">{form1.formState.errors.email.message}</p>
            )}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={form1.formState.isSubmitting}>
            {form1.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Kodni yuborish
          </Button>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">YOKI</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => navigate('/phone-verify')}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#0088cc]/40 bg-[#0088cc]/8 px-4 py-2.5 text-sm font-medium text-[#0088cc] transition-colors hover:bg-[#0088cc]/15"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#0088cc]">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.044 9.626c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.907.595z" />
              </svg>
              Telegram orqali ro'yxatdan o'tish
            </button>
            <GoogleLoginButton />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              {t('nav.login')}
            </Link>
          </p>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(onStep2)} className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            <b>{userData.email}</b> manziliga tasdiqlash kodi yuborildi.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tasdiqlash kodi (6 xonali)</label>
            <Input {...form2.register('code')} placeholder="123456" maxLength={6} className="text-center text-lg tracking-widest" />
            {form2.formState.errors.code && (
              <p className="mt-1 text-xs text-destructive">{form2.formState.errors.code.message}</p>
            )}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={form2.formState.isSubmitting}>
            {form2.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Tasdiqlash
          </Button>
          <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => setStep(1)}>
            Orqaga qaytish
          </Button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={form3.handleSubmit(onStep3)} className="mt-6 space-y-4">
          <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Email muvaffaqiyatli tasdiqlandi!
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Shaxsiy Login (Username)</label>
            <Input {...form3.register('username')} placeholder="masalan: john_doe" />
            <p className="mt-1 text-[11px] text-muted-foreground">Saytga kirish uchun shu logindan foydalanasiz.</p>
            {form3.formState.errors.username && (
              <p className="mt-1 text-xs text-destructive">{form3.formState.errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Yangi Parol</label>
            <Input type="password" {...form3.register('password')} placeholder="********" />
            <ul className="mt-2 space-y-1 text-[10px] text-muted-foreground list-disc pl-4">
              <li>Kamida 8 ta belgi</li>
              <li>Katta va kichik harflar</li>
              <li>Kamida bitta raqam</li>
              <li>Kamida bitta maxsus belgi (@, #, $...)</li>
            </ul>
            {form3.formState.errors.password && (
              <p className="mt-1 text-xs text-destructive">{form3.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Parolni takrorlang</label>
            <Input type="password" {...form3.register('confirmPassword')} placeholder="********" />
            {form3.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{form3.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          
          <Button type="submit" className="w-full mt-4" disabled={form3.formState.isSubmitting}>
            {form3.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Ro'yxatdan o'tishni yakunlash
          </Button>
        </form>
      )}
    </div>
  );
}
