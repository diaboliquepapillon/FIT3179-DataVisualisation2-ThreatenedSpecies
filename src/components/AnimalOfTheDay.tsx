import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface Species {
  id: number;
  name: string;
  scientificName: string;
  status: string;
  group: string;
  funFact: string;
  emoji: string;
  state: string;
}

export const AnimalOfTheDay = () => {
  const [animal, setAnimal] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}iconic_species.json`);
        const data = await response.json();

        // Use date as seed for consistent daily selection
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
        );
        const index = dayOfYear % data.species.length;

        setAnimal(data.species[index]);
      } catch (error) {
        console.error('Failed to load animal of the day:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, []);

  if (loading || !animal) return null;

  const statusColors: Record<string, string> = {
    'Critically Endangered': 'bg-red-100 text-red-800 border-red-300',
    'Endangered': 'bg-orange-100 text-orange-800 border-orange-300',
    'Vulnerable': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="fixed top-20 right-6 z-40 max-w-sm hidden lg:block"
        >
          <Card className="shadow-xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Creature of the Day</span>
                  <span className="text-2xl">{animal.emoji}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">{animal.name}</h3>
            <p className="text-sm text-muted-foreground italic">{animal.scientificName}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge className={statusColors[animal.status] || 'bg-gray-100 text-gray-800'}>
              {animal.status}
            </Badge>
            <Badge variant="outline">{animal.group}</Badge>
            <Badge variant="outline">{animal.state}</Badge>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {animal.funFact}
          </p>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            💡 Changes daily - come back tomorrow for a new species!
          </div>
        </CardContent>
      </Card>
    </motion.div>
      )}
    </AnimatePresence>
  );
};

