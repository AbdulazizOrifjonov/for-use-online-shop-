import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Sliders() {
  const { t } = useTranslation();
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    setIsLoading(true);
    api
      .get('/sliders/admin/all')
      .then(({ data }) => setSliders(data.sliders))
      .finally(() => setIsLoading(false));
  }
  useEffect(load, []);

  async function handleDelete(slider) {
    if (!confirm(`${slider.title}ni o'chirishni tasdiqlaysizmi?`)) return;
    await api.delete(`/sliders/${slider.id}`);
    toast.success(t('common.delete'));
    load();
  }

  async function toggleActive(slider) {
    await api.patch(`/sliders/${slider.id}`, { isActive: !slider.isActive });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('admin.sliders')}</h1>
        <Button size="sm" asChild>
          <Link to="/admin/sliders/new">
            <Plus className="h-4 w-4" /> {t('common.add')}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {sliders.map((s) => (
            <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground hidden sm:block" />
                <img src={s.imageUrl} alt="" className="h-12 w-20 sm:h-14 sm:w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] sm:text-sm font-semibold truncate">{s.title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{s.subtitle}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-1 sm:gap-2 border-t border-border/50 sm:border-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
                <Button variant={s.isActive ? 'default' : 'secondary'} size="sm" onClick={() => toggleActive(s)} className="h-7 sm:h-9 text-[11px] sm:text-sm px-3 mr-auto sm:mr-0">
                  {s.isActive ? 'Faol' : 'Nofaol'}
                </Button>
                <Button variant="ghost" size="icon" asChild className="h-7 w-7 sm:h-9 sm:w-9">
                  <Link to={`/admin/sliders/${s.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 sm:h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s)} className="h-7 w-7 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
