import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OtpInput } from '@/components/ui/otp-input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCountdown } from '@/hooks/useCountdown';

const STEPS = { PHONE: 'PHONE', WAITING: 'WAITING', OTP: 'OTP', CREATE_ACCOUNT: 'CREATE_ACCOUNT', SUCCESS: 'SUCCESS' };
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'MarketProVerifyBot';

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

export default function PhoneVerify() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [telegramOpened, setTelegramOpened] = useState(false);

  const form3 = useForm({ resolver: zodResolver(step3Schema) });

  const waitingTimer = useCountdown(step === STEPS.WAITING ? 600 : 0);
  const resendTimer = useCountdown(step === STEPS.OTP || step === STEPS.WAITING ? 60 : 0);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => stopPolling();
  }, []);

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  async function handleRequestVerification() {
    const p = (phone || '').replace(/\D/g, '');
    if (p.length !== 12) {
      setError("To'liq raqamni kiriting");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/request-verification', { phone: `+${p}` });
      setSessionId(data.sessionId);
      setStep(STEPS.WAITING);
      waitingTimer.reset(600);
      resendTimer.reset(60);
      setTelegramOpened(false);
      startPolling(data.sessionId);
    } catch (err) {
      setError(err.friendlyMessage || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }

  function startPolling(id) {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/auth/session-status/${id}`);
        if (data.status === 'OTP_SENT') {
          stopPolling();
          setStep(STEPS.OTP);
          toast.success("Tasdiqlash kodi yuborildi");
        } else if (data.status === 'EXPIRED') {
          stopPolling();
          toast.error("Vaqt tugadi. Qaytadan urinib ko'ring.");
          setStep(STEPS.PHONE);
        }
      } catch (e) {
        if (e.response?.status === 404) {
          stopPolling();
          setStep(STEPS.PHONE);
        }
      }
    }, 3000);
  }

  function openTelegram() {
    setTelegramOpened(true);
    const text = sessionId ? `?start=${sessionId}` : '';
    window.open(`https://t.me/${BOT_USERNAME}${text}`, '_blank');
  }

  async function handleVerifyOtp(otpValue) {
    const val = otpValue ?? otp;
    if (val.length !== 6) return;
    setOtpError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { sessionId, otp: val });
      toast.success(data.message);
      setStep(STEPS.CREATE_ACCOUNT);
    } catch (err) {
      setOtpError(err.friendlyMessage || "Kod noto'g'ri");
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (otp.length === 6 && step === STEPS.OTP) {
      handleVerifyOtp(otp);
    }
  }, [otp]); 

  async function handleResend() {
    stopPolling();
    setOtp('');
    setOtpError('');
    await handleRequestVerification();
  }

  async function onCreateAccount(values) {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/complete-registration', {
        sessionId,
        username: values.username,
        password: values.password,
      });
      setSession(data.token, data.user, true);
      setStep(STEPS.SUCCESS);
      toast.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
      setTimeout(() => {
        navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
      }, 1500);
    } catch (err) {
      setError(err.friendlyMessage || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Muvaffaqiyatli!</h2>
        <p className="mt-2 text-muted-foreground">Saytga yo'naltirilmoqdasiz...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          {step === STEPS.PHONE && 'Telegram orqali kirish'}
          {step === STEPS.WAITING && 'Tasdiqlash kutilmoqda'}
          {step === STEPS.OTP && 'Kodni tasdiqlash'}
          {step === STEPS.CREATE_ACCOUNT && 'Login va Parol yaratish'}
        </h1>
        {step === STEPS.PHONE && (
          <p className="mt-2 text-sm text-muted-foreground">
            Telefon raqamingizni kiriting.
          </p>
        )}
        {step === STEPS.CREATE_ACCOUNT && (
          <p className="mt-2 text-sm text-muted-foreground">
            Kelajakda saytga kirish uchun login va parol yarating.
          </p>
        )}
      </div>

      {step === STEPS.PHONE && (
        <div className="space-y-5">
          <div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d+]/g, '');
                  if (!val.startsWith('+')) val = '+' + val;
                  if (val === '+') val = '+998';
                  setPhone(val);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestVerification()}
                className="h-12 pl-11 text-lg tracking-wider"
                autoFocus
              />
            </div>
            {error && <p className="mt-1.5 px-1 text-sm text-destructive">{error}</p>}
          </div>

          <Button
            className="w-full h-12 gap-2 text-base font-bold bg-primary hover:bg-primary/90"
            onClick={handleRequestVerification}
            disabled={isLoading || phone.replace(/\D/g, '').length !== 12}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Tasdiqlash'}
            <ArrowRight className="h-5 w-5" />
          </Button>

          <div className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground/80">Qanday ishlaydi?</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Raqamingizni kiritasiz</li>
              <li>Telegram botni ochasiz</li>
              <li>Kontaktni ulashish tugmasini bosasiz</li>
              <li>6 xonali kodni saytga kiritasiz</li>
            </ol>
          </div>
        </div>
      )}

      {step === STEPS.WAITING && (
        <div className="space-y-5">
          <button
            onClick={openTelegram}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-[#0088cc]/30 bg-[#0088cc]/5 p-4 text-left transition-all hover:border-[#0088cc]/60 hover:bg-[#0088cc]/10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0088cc] shadow-lg">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.044 9.626c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.907.595z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                {telegramOpened ? 'Telegram ochildi' : 'Telegramni oching'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                @{BOT_USERNAME} boti
              </p>
            </div>
            <div className="shrink-0 text-xs font-medium text-[#0088cc]">
              {telegramOpened ? '✓ Ochildi' : 'Ochish →'}
            </div>
          </button>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Telegram tasdiqlash kutilmoqda...
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full gap-2 font-bold bg-primary hover:bg-primary/90" onClick={() => setStep(STEPS.OTP)}>
              Kodni kiritish →
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => { stopPolling(); setStep(STEPS.PHONE); }}>
                <ArrowLeft className="h-3.5 w-3.5" /> Orqaga
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleResend} disabled={!resendTimer.isDone || isLoading}>
                <RefreshCw className="h-3.5 w-3.5" />
                {resendTimer.isDone ? 'Qayta yuborish' : `Qayta yuborish (${resendTimer.seconds}s)`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === STEPS.OTP && (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 p-4 text-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <p className="text-sm">Kod <b>Telegram</b> botdan yuborildi.</p>
          </div>
          <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
          {otpError && <p className="text-center text-sm text-destructive">{otpError}</p>}
          <Button className="w-full gap-2" onClick={() => handleVerifyOtp(otp)} disabled={otp.length !== 6 || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Tasdiqlash
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => { stopPolling(); setStep(STEPS.PHONE); }}>
              <ArrowLeft className="h-3.5 w-3.5" /> Orqaga
            </Button>
          </div>
        </div>
      )}

      {step === STEPS.CREATE_ACCOUNT && (
        <form onSubmit={form3.handleSubmit(onCreateAccount)} className="space-y-4">
          <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Telefon raqam tasdiqlandi!
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Shaxsiy Login (Username)</label>
            <Input {...form3.register('username')} placeholder="masalan: alisher_99" />
            <p className="mt-1 text-[11px] text-muted-foreground">Saytga kirish uchun shu logindan foydalanasiz.</p>
            {form3.formState.errors.username && <p className="mt-1 text-xs text-destructive">{form3.formState.errors.username.message}</p>}
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
            {form3.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form3.formState.errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Parolni takrorlang</label>
            <Input type="password" {...form3.register('confirmPassword')} placeholder="********" />
            {form3.formState.errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{form3.formState.errors.confirmPassword.message}</p>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Saqlash va Kirish
          </Button>
        </form>
      )}

      {step === STEPS.PHONE && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Parol orqali kirish?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-primary hover:underline">
            Kirish
          </button>
        </p>
      )}
    </div>
  );
}
