import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface AnimatedIntroProps {
  onComplete: () => void;
}

export const AnimatedIntro = ({ onComplete }: AnimatedIntroProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    'Every dot you see...',
    'is a life under threat.',
    'Welcome to Australia\'s Wild Future.',
  ];

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      if (textIndex < texts.length - 1) {
        setTextIndex(textIndex + 1);
      } else {
        // Auto-close after showing all text
        setTimeout(() => {
          handleComplete();
        }, 2000);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [textIndex, showIntro]);

  const handleComplete = () => {
    setShowIntro(false);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary overflow-hidden"
        >
          {/* Skip Button */}
          <Button
            onClick={handleComplete}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            <X className="h-4 w-4 mr-2" />
            Skip
          </Button>

          {/* Animal Silhouettes Background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="absolute top-20 left-20 text-9xl"
            >
              🐨
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="absolute top-40 right-32 text-8xl"
            >
              🦜
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 1.1, duration: 1.5 }}
              className="absolute bottom-32 left-40 text-7xl"
            >
              🐸
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 1.4, duration: 1.5 }}
              className="absolute bottom-20 right-20 text-8xl"
            >
              🐍
            </motion.div>
          </div>

          {/* Main Text */}
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.h1
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-5xl lg:text-7xl font-display font-bold text-white leading-tight"
              >
                {texts[textIndex]}
              </motion.h1>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {texts.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === textIndex
                      ? 'bg-white w-8'
                      : index < textIndex
                      ? 'bg-white/60'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

