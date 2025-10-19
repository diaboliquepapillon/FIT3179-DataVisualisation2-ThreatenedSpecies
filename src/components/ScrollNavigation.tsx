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

  const sections = [
    { id: 'chapter-discover', label: 'Discover', icon: Compass },
    { id: 'chapter-understand', label: 'Understand', icon: Target },
    { id: 'chapter-act', label: 'Take Action', icon: Rocket },
  ];

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

      {/* Chapter Navigation Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-primary/20 shadow-xl p-3">
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary hover:scale-105'
                  }`}
                  aria-label={`Navigate to ${section.label}`}
                >
                  <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-semibold whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    {section.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-white rounded-r"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
            
            {/* Filter Quick Access */}
            <div className="border-t-2 border-border/30 my-2 pt-2">
              <button
                onClick={() => {
                  scrollToTop();
                  onFilterClick?.();
                }}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/10 text-muted-foreground hover:text-secondary hover:scale-105 transition-all duration-300 w-full"
                aria-label="Jump to filters"
              >
                <FilterIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Filters
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <Button
              onClick={scrollToTop}
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110"
              size="icon"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Quick Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-md rounded-full border-2 border-primary/20 shadow-xl px-4 py-2"
        >
          <div className="flex items-center gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`p-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-primary text-white scale-110'
                      : 'hover:bg-primary/10 text-muted-foreground'
                  }`}
                  aria-label={`Navigate to ${section.label}`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={() => {
                scrollToTop();
                onFilterClick?.();
              }}
              className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-secondary transition-all"
              aria-label="Jump to filters"
            >
              <FilterIcon className="h-5 w-5" />
            </button>
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full bg-primary/10 text-primary transition-all"
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

