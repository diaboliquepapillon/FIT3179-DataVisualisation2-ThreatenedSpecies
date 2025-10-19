import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const ACHIEVEMENTS_KEY = 'australia-wildlife-achievements';

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'koala_keeper',
    name: 'Koala Keeper',
    description: 'Explored 3 different states',
    icon: '🐨',
  },
  {
    id: 'data_guardian',
    name: 'Data Guardian',
    description: 'Filtered by all animal groups',
    icon: '📊',
  },
  {
    id: 'timeline_traveler',
    name: 'Timeline Traveler',
    description: 'Watched the biodiversity clock',
    icon: '⏳',
  },
  {
    id: 'master_conservationist',
    name: 'Master Conservationist',
    description: 'Unlocked all achievements',
    icon: '🏆',
  },
];

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return achievementDefinitions.map((def) => {
          const savedAch = parsed.find((a: Achievement) => a.id === def.id);
          return {
            ...def,
            unlocked: savedAch?.unlocked || false,
            unlockedAt: savedAch?.unlockedAt ? new Date(savedAch.unlockedAt) : undefined,
          };
        });
      } catch {
        // If parsing fails, return default
      }
    }
    return achievementDefinitions.map((def) => ({ ...def, unlocked: false }));
  });

  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements((prev) => {
      const achievement = prev.find((a) => a.id === achievementId);
      if (!achievement || achievement.unlocked) return prev;

      const updated = prev.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date() }
          : a
      );

      // Show toast notification
      toast.success(`Achievement Unlocked: ${achievement.name}!`, {
        description: achievement.description,
        icon: achievement.icon,
        duration: 4000,
      });

      // Check if all other achievements are unlocked (excluding master_conservationist)
      const otherAchievements = updated.filter((a) => a.id !== 'master_conservationist');
      const allOthersUnlocked = otherAchievements.every((a) => a.unlocked);
      
      if (allOthersUnlocked && achievementId !== 'master_conservationist') {
        // Unlock master achievement after a short delay
        setTimeout(() => {
          setAchievements((current) =>
            current.map((a) =>
              a.id === 'master_conservationist'
                ? { ...a, unlocked: true, unlockedAt: new Date() }
                : a
            )
          );
          toast.success('🎉 Achievement Unlocked: Master Conservationist!', {
            description: 'You\'ve unlocked all achievements!',
            icon: '🏆',
            duration: 6000,
          });
        }, 1000);
      }

      return updated;
    });
  }, []);

  const resetAchievements = useCallback(() => {
    setAchievements((prev) =>
      prev.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined }))
    );
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return {
    achievements,
    unlockAchievement,
    resetAchievements,
    unlockedCount,
    totalCount,
    progress,
  };
};

