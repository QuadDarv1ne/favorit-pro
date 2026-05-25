'use client';

import { useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { LiveTicker } from '@/components/LiveTicker';
import { HeroSection } from '@/components/HeroSection';
import { LiveMatches } from '@/components/LiveMatches';
import { TopPredictions } from '@/components/TopPredictions';
import { SportCategories } from '@/components/SportCategories';
import { ExpertsRating } from '@/components/ExpertsRating';
import { NewsSection } from '@/components/NewsSection';
import { ResultsSection } from '@/components/ResultsSection';
import { UpcomingMatches } from '@/components/UpcomingMatches';
import { PromotionsBanner } from '@/components/PromotionsBanner';
import { ExpressOfDay } from '@/components/ExpressOfDay';
import { BetCalculator } from '@/components/BetCalculator';
import { SportFilter } from '@/components/SportFilter';
import { BottomNav } from '@/components/BottomNav';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { SubscriptionTiers } from '@/components/SubscriptionTiers';
import { UserCabinet } from '@/components/UserCabinet';
import { StatsSkeleton } from '@/components/Skeletons';
import { HotStreaks } from '@/components/HotStreaks';
import { MatchComparison } from '@/components/MatchComparison';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DailyTips } from '@/components/DailyTips';
import { ValueBetScanner } from '@/components/ValueBetScanner';
import { RecentWinsFeed } from '@/components/RecentWinsFeed';
import { OnboardingModal } from '@/components/OnboardingModal';
import { FavoritesSection } from '@/components/FavoritesSection';
import { Leaderboard } from '@/components/Leaderboard';
import { ArticlesSection } from '@/components/ArticlesSection';
import { KeyboardShortcutsHelp, useKeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { SearchBar } from '@/components/SearchBar';
import { Match, Expert, Prediction } from '@/lib/data';
import { ActiveSection } from '@/types/navigation';
import { useAppStore, FavoriteMatch, FavoritePrediction } from '@/stores/app-store';
import { Toaster } from 'sonner';

// Lazy load heavy sections for performance
const LazyStatsSection = lazy(() =>
  import('@/components/StatsSection').then((mod) => ({ default: mod.StatsSection }))
);

const LazyMatchDetailModal = lazy(() =>
  import('@/components/MatchDetailModal').then((mod) => ({ default: mod.MatchDetailModal }))
);

const LazyExpertProfileModal = lazy(() =>
  import('@/components/ExpertProfileModal').then((mod) => ({ default: mod.ExpertProfileModal }))
);

const LazyPredictionDetailModal = lazy(() =>
  import('@/components/PredictionDetailModal').then((mod) => ({ default: mod.PredictionDetailModal }))
);

// ActiveSection type moved to @/types/navigation to avoid circular dependency

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [predictionModalOpen, setPredictionModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const { isLoggedIn, subscriptionModalOpen, setSubscriptionModalOpen } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('favoritpro-onboarding-seen');
    }
    return false;
  });

  const handleMatchClick = (match: Match | FavoriteMatch) => {
    setSelectedMatch(match as Match);
    setMatchModalOpen(true);
  };

  const handleExpertClick = (expert: Expert) => {
    setSelectedExpert(expert);
    setExpertModalOpen(true);
  };

  const handlePredictionClick = (prediction: Prediction | FavoritePrediction) => {
    setSelectedPrediction(prediction as Prediction);
    setPredictionModalOpen(true);
  };

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const handleLogin = () => {
    setAuthModalOpen(false);
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcuts (after handlers are defined)
  useKeyboardShortcuts({
    onSectionChange: handleSectionChange,
    onAuthClick: handleAuthClick,
    onSearchOpen: () => setSearchOpen((prev) => !prev),
  });

  const sectionContent = (section: ActiveSection) => {
    switch (section) {
      case 'main':
        return (
          <>
            <HeroSection />
            <HotStreaks />
            <RecentWinsFeed />
            <LiveMatches onMatchClick={handleMatchClick} />
            <ExpressOfDay />
            <DailyTips />
            <ValueBetScanner />
            <TopPredictions onPredictionClick={handlePredictionClick} />
            <PromotionsBanner />
            <SportCategories />
            <UpcomingMatches onMatchClick={handleMatchClick} />
          </>
        );
      case 'sports':
        return (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Все события</h2>
              </div>
              <SportFilter activeFilter={sportFilter} onFilterChange={setSportFilter} />
            </div>
            <SportCategories detailed />
            <LiveMatches onMatchClick={handleMatchClick} />
            <UpcomingMatches onMatchClick={handleMatchClick} />
          </>
        );
      case 'experts':
        return (
          <>
            <ExpertsRating detailed onExpertClick={handleExpertClick} />
            <TopPredictions onPredictionClick={handlePredictionClick} />
          </>
        );
      case 'stats':
        return (
          <>
            <MatchComparison />
            <Suspense fallback={<StatsSkeleton />}>
              <LazyStatsSection />
            </Suspense>
          </>
        );
      case 'news':
        return <NewsSection detailed />;
      case 'articles':
        return <ArticlesSection detailed />;
      case 'results':
        return <ResultsSection onMatchClick={handleMatchClick} />;
      case 'calculator':
        return <BetCalculator />;
      case 'favorites':
        return (
          <FavoritesSection
            onMatchClick={handleMatchClick}
            onExpertClick={handleExpertClick}
            onPredictionClick={handlePredictionClick}
          />
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return isLoggedIn ? (
          <UserCabinet />
        ) : (
          <div className="max-w-md mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Войдите в аккаунт</h2>
            <p className="text-sm text-gray-400 mb-6">Чтобы видеть свой профиль, подписки и избранное</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleAuthClick('login')}
                className="px-6 py-2.5 rounded-lg border border-emerald-500/50 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors"
              >
                Войти
              </button>
              <button
                onClick={() => handleAuthClick('register')}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Регистрация
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-gray-100">
      <ErrorBoundary>
        <Header
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onAuthClick={handleAuthClick}
        />
        <LiveTicker />
        <main className="flex-1 pb-16 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {sectionContent(activeSection)}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />

        {/* Fixed elements */}
        <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />
        <ScrollToTop />
        <CookieBanner />
        <KeyboardShortcutsHelp />

        {/* Search overlay */}
        {searchOpen && (
          <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
            <div className="max-w-2xl mx-auto pt-20 px-4" onClick={(e) => e.stopPropagation()}>
              <SearchBar autoFocus />
            </div>
          </div>
        )}

        {/* Modals - lazy loaded */}
        <Suspense fallback={null}>
          <LazyMatchDetailModal
            match={selectedMatch}
            open={matchModalOpen}
            onClose={() => setMatchModalOpen(false)}
          />
        </Suspense>
        <Suspense fallback={null}>
          <LazyExpertProfileModal
            expert={selectedExpert}
            open={expertModalOpen}
            onClose={() => setExpertModalOpen(false)}
          />
        </Suspense>
        <Suspense fallback={null}>
          <LazyPredictionDetailModal
            prediction={selectedPrediction}
            open={predictionModalOpen}
            onClose={() => setPredictionModalOpen(false)}
          />
        </Suspense>
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authTab}
          onLogin={handleLogin}
        />
        <SubscriptionTiers
          open={subscriptionModalOpen}
          onClose={() => setSubscriptionModalOpen(false)}
        />
        <OnboardingModal
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              border: '1px solid #374151',
              color: '#f3f4f6',
            },
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
