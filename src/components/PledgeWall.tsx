import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Heart, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Pledge {
  id: string;
  name: string;
  timestamp: number;
}

const PLEDGES_KEY = 'australia-wildlife-pledges';
const PLEDGE_COUNT_KEY = 'australia-wildlife-pledge-count';
const MAX_VISIBLE_PLEDGES = 50;
const INITIAL_COUNT = 2847; // Starting seed number

export const PledgeWall = () => {
  const [name, setName] = useState('');
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [totalCount, setTotalCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    // Load existing pledges
    const saved = localStorage.getItem(PLEDGES_KEY);
    const savedCount = localStorage.getItem(PLEDGE_COUNT_KEY);
    
    if (saved) {
      try {
        setPledges(JSON.parse(saved));
      } catch {
        setPledges([]);
      }
    }

    if (savedCount) {
      setTotalCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Please enter your name or choose an emoji');
      return;
    }

    if (trimmedName.length > 30) {
      toast.error('Name is too long (max 30 characters)');
      return;
    }

    // Create new pledge
    const newPledge: Pledge = {
      id: Date.now().toString(),
      name: trimmedName,
      timestamp: Date.now(),
    };

    // Update pledges (FIFO - remove oldest if exceeding limit)
    const updated = [newPledge, ...pledges].slice(0, MAX_VISIBLE_PLEDGES);
    setPledges(updated);
    localStorage.setItem(PLEDGES_KEY, JSON.stringify(updated));

    // Increment total count
    const newCount = totalCount + 1;
    setTotalCount(newCount);
    localStorage.setItem(PLEDGE_COUNT_KEY, newCount.toString());

    // Clear input
    setName('');

    // Show success
    toast.success('Thank you for taking the pledge!', {
      description: 'Together we can protect Australia\'s wildlife',
      icon: '💚',
    });
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span>Take the Conservation Pledge</span>
          </div>
          <p className="text-sm font-normal text-muted-foreground">
            Join {totalCount.toLocaleString()}+ people committed to protecting Australian wildlife
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pledge Form */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold text-lg mb-3 text-foreground text-center">
            I pledge to take action for wildlife
          </h4>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or emoji (e.g., 🐨 Koala Lover)"
              maxLength={30}
              className="flex-1"
            />
            <Button type="submit" className="whitespace-nowrap">
              Sign Pledge
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your signature is stored locally and helps inspire others
          </p>
        </div>

        {/* Total Counter */}
        <motion.div
          key={totalCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-center py-4 bg-primary/10 rounded-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-4xl font-bold text-primary">
              {totalCount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">conservation advocates</p>
        </motion.div>

        {/* Recent Pledges Wall */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-center text-muted-foreground">
            Recent Pledges
          </h4>
          <div className="bg-card rounded-lg p-4 border border-border max-h-64 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {pledges.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Be the first to take the pledge!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pledges.map((pledge) => (
                    <motion.div
                      key={pledge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      <Heart className="h-3 w-3 text-primary fill-primary" />
                      <span>{pledge.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            💡 Taking the pledge means you're committed to learning, sharing, and acting 
            to protect Australia's unique wildlife
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

