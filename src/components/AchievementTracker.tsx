import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../hooks/useAchievements';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Check } from 'lucide-react';

export const AchievementTracker = () => {
  const { achievements, unlockedCount, totalCount, progress } = useAchievements();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Conservation Journey</span>
          <span className="text-sm font-normal text-muted-foreground">
            {unlockedCount}/{totalCount} Unlocked
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {progress === 100 
              ? '🎉 All achievements unlocked!' 
              : `${Math.round(progress)}% complete - keep exploring!`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50 shadow-md'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-primary mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {progress < 100 && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              💡 Continue exploring to unlock more achievements!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

