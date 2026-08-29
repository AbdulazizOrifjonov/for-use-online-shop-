import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { localizedField } from '@/lib/localize';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';

function CategoryNode({ category, depth, onNavigate }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const hasChildren = category.children?.length > 0;
  const name = localizedField(category, 'name', i18n.language);

  return (
    <div className={cn(depth === 0 ? 'border-b border-border/50 last:border-0' : '')}>
      <div className="flex items-center justify-between transition-colors hover:bg-accent/50">
        <Link
          to={`/catalog?category=${category.slug}`}
          onClick={onNavigate}
          className={cn(
            "flex-1 py-4",
            depth === 0 ? "px-4 text-[15px] font-bold text-foreground" : "py-3 pl-8 text-sm font-medium text-foreground/80"
          )}
        >
          {name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-label="toggle"
            className={cn("p-4 text-muted-foreground transition-colors hover:text-primary", depth > 0 && "py-3")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-muted/20"
          >
            <div className={cn(depth === 0 && "pb-2")}>
              {category.children.map((child) => (
                <CategoryNode key={child.id} category={child} depth={depth + 1} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { categories, isLoading } = useCategoryTree();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-svh w-[85vw] max-w-[340px] flex-col bg-background shadow-2xl transition-transform duration-300 lg:hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3.5">
          <Logo size={36} />
          <button 
            onClick={onClose} 
            aria-label="close sidebar" 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex h-[56px] items-center border-b border-border/50 px-4">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && categories.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">{t('common.no_results')}</div>
          )}
          {!isLoading && categories.length > 0 && (
            <div className="flex flex-col pb-6">
              {categories.map((cat) => (
                <CategoryNode key={cat.id} category={cat} depth={0} onNavigate={onClose} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
