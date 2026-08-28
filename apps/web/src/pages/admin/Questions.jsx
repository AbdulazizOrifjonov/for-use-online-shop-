import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Trash2, ChevronLeft, ChevronRight, Search, Send, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function loadQuestions(p = 1, f = filter) {
    setIsLoading(true);
    api
      .get('/questions/all', { params: { page: p, limit: 20, search, filter: f } })
      .then(({ data }) => {
        setQuestions(data.questions || []);
        setPages(data.pagination?.pages || 1);
        setPage(data.pagination?.page || 1);
        setTotal(data.total || 0);
        setAnsweredCount(data.answeredCount || 0);
        setUnansweredCount(data.unansweredCount || 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadQuestions(1, filter);
  }, [filter]);

  async function handleAnswer(id) {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      await api.patch(`/questions/${id}/answer`, { answer: answerText.trim() });
      toast.success('Javob saqlandi');
      setAnsweringId(null);
      setAnswerText('');
      loadQuestions(page, filter);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Xatolik');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Ushbu savolni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success("Savol o'chirildi");
      loadQuestions(page, filter);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Xatolik');
    }
  }

  const filterTabs = [
    { key: 'all', label: `Barchasi (${total})`, icon: HelpCircle },
    { key: 'unanswered', label: `Javobsiz (${unansweredCount})`, icon: AlertCircle },
    { key: 'answered', label: `Javob berilgan (${answeredCount})`, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Savollar
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Mijozlarning mahsulotlar bo'yicha savollari va admin javoblari
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-extrabold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Jami savollar</p>
        </div>
        <div className="rounded-2xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 p-4 text-center">
          <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{unansweredCount}</p>
          <p className="text-xs text-orange-600/70 dark:text-orange-400/70">Javobsiz</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{answeredCount}</p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Javob berilgan</p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div className="flex gap-1 bg-muted/60 p-1 rounded-xl">
          {filterTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadQuestions(1, filter);
            }}
            placeholder="Savol, mahsulot yoki foydalanuvchi qidirish..."
            className="pl-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-muted-foreground">Savollar mavjud emas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
              {/* Product + User Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {q.product?.images?.[0]?.url && (
                    <img
                      src={q.product.images[0].url}
                      alt={q.product.nameUz}
                      className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <Link
                      to={`/product/${q.product?.slug}`}
                      className="font-bold text-sm text-primary hover:underline truncate block"
                    >
                      {q.product?.nameUz || 'Noma\'lum mahsulot'}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {q.user?.name || 'Foydalanuvchi'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {q.answer ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Javob berilgan
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-lg">
                      <AlertCircle className="h-3.5 w-3.5" /> Javobsiz
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(q.id)}
                    className="text-destructive hover:bg-destructive/10 rounded-xl h-8 w-8"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Question Text */}
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-xl border border-border/50">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-foreground">{q.question}</p>
              </div>

              {/* Answer */}
              {q.answer && (
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl">
                  <p className="text-xs font-bold text-primary mb-1">Professional Tools javobi:</p>
                  <p className="text-sm text-foreground">{q.answer}</p>
                </div>
              )}

              {/* Answer Input */}
              {answeringId === q.id ? (
                <div className="flex gap-2">
                  <Input
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Javob yozing..."
                    className="rounded-xl text-sm flex-1 h-10"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAnswer(q.id)}
                  />
                  <Button
                    onClick={() => handleAnswer(q.id)}
                    disabled={submitting || !answerText.trim()}
                    className="rounded-xl h-10 w-10 p-0 flex items-center justify-center shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setAnsweringId(null); setAnswerText(''); }}
                    className="rounded-xl h-10 shrink-0"
                  >
                    Bekor
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setAnsweringId(q.id); setAnswerText(q.answer || ''); }}
                    className="rounded-xl text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    {q.answer ? 'Javobni tahrirlash' : 'Javob berish'}
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => loadQuestions(page - 1, filter)} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-semibold text-muted-foreground">
                {page} / {pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => loadQuestions(page + 1, filter)} className="rounded-xl">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
