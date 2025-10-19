import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

interface WildlifeWindowsProps {
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
}

const animalGroups = [
  {
    id: 'Mammals',
    name: 'Mammals',
    icon: '🐨',
    color: 'from-red-50 to-red-100',
    count: 655,
    trend: [45, 52, 58, 61, 65],
  },
  {
    id: 'Birds',
    name: 'Birds',
    icon: '🦜',
    color: 'from-orange-50 to-orange-100',
    count: 520,
    trend: [38, 42, 46, 50, 52],
  },
  {
    id: 'Reptiles',
    name: 'Reptiles',
    icon: '🐍',
    color: 'from-yellow-50 to-yellow-100',
    count: 420,
    trend: [28, 32, 36, 40, 42],
  },
  {
    id: 'Amphibians',
    name: 'Amphibians',
    icon: '🐸',
    color: 'from-green-50 to-green-100',
    count: 355,
    trend: [22, 26, 30, 33, 35.5],
  },
  {
    id: 'Fish',
    name: 'Fish',
    icon: '🐠',
    color: 'from-blue-50 to-blue-100',
    count: 180,
    trend: [12, 14, 16, 17.5, 18],
  },
];

export const WildlifeWindows = ({ selectedGroup, onSelectGroup }: WildlifeWindowsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {animalGroups.map((group, index) => {
        const isSelected = selectedGroup === group.id;
        const isAll = selectedGroup === 'All';

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-primary shadow-lg'
                  : isAll
                  ? 'hover:shadow-md'
                  : 'opacity-50 hover:opacity-75'
              }`}
              onClick={() => onSelectGroup(group.id)}
            >
              <CardContent className="p-4">
                <div className={`bg-gradient-to-br ${group.color} rounded-lg p-3 mb-3`}>
                  <div className="text-4xl text-center">{group.icon}</div>
                </div>
                
                <h3 className="font-semibold text-center text-sm mb-2">{group.name}</h3>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{group.count}</p>
                  <p className="text-xs text-muted-foreground">threatened</p>
                </div>

                {/* Sparkline */}
                <div className="mt-3 flex items-end justify-between h-8 gap-1">
                  {group.trend.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / Math.max(...group.trend)) * 100}%` }}
                      transition={{ delay: index * 0.1 + i * 0.05, duration: 0.3 }}
                      className="flex-1 bg-primary/30 rounded-t"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

