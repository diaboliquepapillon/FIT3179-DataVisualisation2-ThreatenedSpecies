import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Compass, Target, Rocket, Filter as FilterIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ScrollNavigationProps {
  onFilterClick?: () => void;
}

export const ScrollNavigation = ({ onFilterClick }: ScrollNavigationProps) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const sections = [
    { id: 'chapter-discover', label: 'Discover', icon: Compass },
    { id: 'chapter-understand', label: 'Understand', icon: Target },
    { id: 'chapter-act', label: 'Take Action', icon: Rocket },
  ];

  // Auto-hide navigation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHovering) {
        setIsNavigationVisible(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isHovering]);

  useEffect(() => {
    const handleScroll = () => {
      // Back to top button
      setShowBackToTop(window.scrollY > 400);

      // Scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Active section detection
      const sections = ['chapter-discover', 'chapter-understand', 'chapter-act'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for sticky header
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Show/Hide Trigger Button (when navigation is hidden) */}
      <AnimatePresence>
        {!isNavigationVisible && (
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setIsNavigationVisible(true)}
            onMouseEnter={() => setIsNavigationVisible(true)}
            className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 items-center justify-center w-8 h-20 bg-primary/90 hover:bg-primary text-white rounded-r-xl shadow-lg hover:shadow-xl transition-all hover:w-10"
            aria-label="Show navigation menu"
          >
            <span className="text-lg">›</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chapter Navigation Sidebar */}
      <AnimatePresence>
        {isNavigationVisible && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40"
          >
            <div className="bg-white/98 backdrop-blur-lg rounded-2xl border-2 border-primary/20 shadow-2xl p-2 min-w-[180px]">
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg scale-105'
                      : 'hover:bg-primary/5 text-muted-foreground hover:text-primary hover:scale-102'
                  }`}
                  aria-label={`Navigate to ${section.label}`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-primary/10 group-hover:bg-primary/20'} transition-all`}>
                    <Icon className={`h-4 w-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all`}>
                    {section.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -left-2 w-1 h-10 bg-primary rounded-r-full shadow-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
            
            {/* Filter Quick Access */}
            <div className="border-t-2 border-border/30 mt-3 pt-2">
              <button
                onClick={() => {
                  scrollToTop();
                  onFilterClick?.();
                }}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary/10 hover:to-secondary/5 text-muted-foreground hover:text-secondary hover:scale-102 transition-all duration-300 w-full"
                aria-label="Jump to filters"
              >
                <div className="p-1.5 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-all">
                  <FilterIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  Filters
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <button
              onClick={scrollToTop}
              className="group relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white shadow-2xl hover:shadow-primary/30 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Quick Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/98 backdrop-blur-lg rounded-full border-2 border-primary/20 shadow-2xl px-3 py-2.5"
        >
          <div className="flex items-center gap-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative p-2.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white scale-110 shadow-lg'
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary active:scale-95'
                  }`}
                  aria-label={`Navigate to ${section.label}`}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
            <div className="w-px h-6 bg-border/50 mx-1" />
            <button
              onClick={() => {
                scrollToTop();
                onFilterClick?.();
              }}
              className="p-2.5 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-secondary active:scale-95 transition-all"
              aria-label="Jump to filters"
            >
              <FilterIcon className="h-5 w-5" />
            </button>
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 active:scale-95 transition-all"
                aria-label="Scroll to top"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

