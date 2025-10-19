import { Menu, Volume2, VolumeX, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface NavigationProps {
  isMuted?: boolean;
  onToggleMute?: () => void;
  achievementsUnlocked?: number;
  totalAchievements?: number;
}

export const Navigation = ({ 
  isMuted = false, 
  onToggleMute, 
  achievementsUnlocked = 0, 
  totalAchievements = 5 
}: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">
              Australia's Wild Future
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('chapter-discover')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Discover
            </button>
            <button
              onClick={() => scrollToSection('chapter-understand')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Understand
            </button>
            <button
              onClick={() => scrollToSection('chapter-act')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Act
            </button>
            <button
              onClick={() => scrollToSection('data')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Data
            </button>

            {/* Achievement Badge */}
            {achievementsUnlocked > 0 && (
              <Badge 
                variant="outline" 
                className="achievement-badge"
                onClick={() => scrollToSection('achievements')}
              >
                <Trophy className="h-3 w-3" />
                <span>{achievementsUnlocked}/{totalAchievements}</span>
              </Badge>
            )}

            {/* Mute Toggle */}
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-5 w-5 text-primary" />
                )}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-primary" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('chapter-discover')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              🗺️ Discover
            </button>
            <button
              onClick={() => scrollToSection('chapter-understand')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              📊 Understand
            </button>
            <button
              onClick={() => scrollToSection('chapter-act')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              🚀 Act
            </button>
            <button
              onClick={() => scrollToSection('data')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              📄 Data
            </button>
            {achievementsUnlocked > 0 && (
              <button
                onClick={() => {
                  scrollToSection('achievements');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                🏆 Achievements ({achievementsUnlocked}/{totalAchievements})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
