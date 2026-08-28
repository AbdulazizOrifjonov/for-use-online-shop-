import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export function PostPurchaseFeedbackModal() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [pendingItems, setPendingItems] = useState([]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowBanner(false);
      return;
    }

    // Check if user already saw the banner TODAY
    const todayStr = new Date().toISOString().split('T')[0];
    const lastShownDate = localStorage.getItem('protools_feedback_last_shown_date');

    if (lastShownDate === todayStr) {
      setShowBanner(false);
      return;
    }

    // Check for pending delivered feedback from backend
    api
      .get('/reviews/pending-feedback')
      .then(({ data }) => {
        if (data.pendingItems && data.pendingItems.length > 0) {
          setPendingItems(data.pendingItems);
          setShowBanner(true);
          // Mark as shown for today
          localStorage.setItem('protools_feedback_last_shown_date', todayStr);
        } else {
          setShowBanner(false);
        }
      })
      .catch(() => {});
  }, [user]);

  function handleDismiss(e) {
    if (e) e.stopPropagation();
    setShowBanner(false);
  }

  function handleGoToAccountReviews(e) {
    if (e) e.stopPropagation();
    setShowBanner(false);
    navigate('/account/reviews');
  }

  return (
    <AnimatePresence>
      {showBanner && pendingItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: [0, -6, 0], x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
            x: { duration: 0 }
          }}
          onClick={handleGoToAccountReviews}
          className="fixed bottom-[80px] lg:bottom-10 left-1/2 z-50 w-[90%] max-w-xl cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-primary/40 bg-card/95 p-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-primary/20 sm:p-4 flex"
        >
          {/* Top-Right Corner Close 'X' Button */}
          <button
            onClick={handleDismiss}
            className="absolute -right-3 -top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-all hover:scale-110 hover:bg-destructive/90 active:scale-95 sm:h-8 sm:w-8"
            title="Yopish (Bugunga yopish)"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>

          {/* Left Product Image */}
          <div className="relative shrink-0">
            <img
              src={pendingItems[0].productImage}
              alt={pendingItems[0].productName}
              className="h-16 w-16 rounded-xl border border-border object-cover shadow-sm sm:h-20 sm:w-20 md:h-24 md:w-24"
            />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow sm:h-5 sm:w-5">
              ✓
            </span>
          </div>

          {/* Center Info */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Yetkazildi — Baho bering!</span>
            </div>
            <h4 className="mt-0.5 truncate font-heading text-xs font-extrabold text-foreground sm:text-sm md:text-base">
              {pendingItems[0].productName}
            </h4>
            <div className="mt-1 flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-amber-400 sm:h-4 sm:w-4" />
              ))}
              <span className="ml-1 text-[11px] font-semibold text-muted-foreground">
                ({pendingItems.length} ta mahsulot)
              </span>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex shrink-0 flex-col items-end gap-1 pr-1">
            <Button
              size="sm"
              onClick={handleGoToAccountReviews}
              className="gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold shadow-md hover:bg-primary/90 sm:px-4 sm:text-sm"
            >
              <span>Baho berish</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
