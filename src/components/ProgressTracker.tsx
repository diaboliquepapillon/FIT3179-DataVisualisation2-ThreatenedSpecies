import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Star, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  statesExplored: number;
  totalStates: number;
  groupsViewed: Set<string>;
  onAchievementUnlock?: (achievementId: string) => void;
}

export const ProgressTracker = ({ statesExplored, totalStates, groupsViewed, onAchievementUnlock }: ProgressTrackerProps) => {
  const [previousProgress, setPreviousProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const progress = (statesExplored / totalStates) * 100;
  const achievements = [];

  if (statesExplored >= 3) achievements.push({ label: '🗺️ Explorer', milestone: 3 });
  if (statesExplored >= 5) achievements.push({ label: '🏆 Adventurer', milestone: 5 });
  if (statesExplored >= 8) achievements.push({ label: '⭐ Master Navigator', milestone: 8 });
  if (groupsViewed.size >= 3) achievements.push({ label: '🔬 Naturalist', milestone: 3 });
  if (groupsViewed.size >= 5) achievements.push({ label: '📚 Wildlife Expert', milestone: 5 });

  // Detect when progress increases
  useEffect(() => {
    if (progress > previousProgress && previousProgress > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    setPreviousProgress(progress);
  }, [progress]);

  // Trigger achievement unlocks
  useEffect(() => {
    if (statesExplored >= 3 && onAchievementUnlock) {
      onAchievementUnlock('koala_keeper');
    }
  }, [statesExplored, onAchievementUnlock]);

  useEffect(() => {
    if (groupsViewed.size >= 5 && onAchievementUnlock) {
      onAchievementUnlock('data_guardian');
    }
  }, [groupsViewed.size, onAchievementUnlock]);

  const getMilestoneMessage = () => {
    if (statesExplored === 0) return '🚀 Start exploring by clicking any state on the map!';
    if (statesExplored === 1) return '🎉 Great start! 7 more states to discover...';
    if (statesExplored === 3) return '🐨 Achievement unlocked: Koala Keeper!';
    if (statesExplored === 5) return '💪 Halfway there! Keep exploring...';
    if (statesExplored === 8) return '🏆 Amazing! You\'ve explored all of Australia!';
    return '📍 Keep exploring to unlock more achievements!';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/20 shadow-lg relative overflow-hidden"
    >
      {/* Celebration effect */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Star className="h-12 w-12 text-yellow-400 fill-yellow-400" />
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-display font-semibold text-foreground">
            Your Exploration Journey
          </h3>
        </div>
        {statesExplored === totalStates && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          >
            <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          </motion.div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            States explored: <strong className="text-foreground">{statesExplored} / {totalStates}</strong>
          </span>
          <motion.span
            key={progress}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-primary font-bold text-lg"
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-3" />
          {/* Milestone markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-1 -mt-1">
            {[0, 25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className={`w-1 h-5 ${
                  progress >= milestone ? 'bg-primary' : 'bg-muted'
                } rounded-full transition-colors`}
              />
            ))}
          </div>
        </div>
        
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {achievements.map((badge, index) => (
              <motion.span
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full animate-pulse-slow"
              >
                <CheckCircle2 className="h-3 w-3" />
                {badge.label}
              </motion.span>
            ))}
          </motion.div>
        )}
        
        <motion.p
          key={getMilestoneMessage()}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-foreground font-medium mt-3 p-2 bg-card rounded-lg border border-border text-center"
        >
          {getMilestoneMessage()}
        </motion.p>
      </div>
    </motion.div>
  );
};
