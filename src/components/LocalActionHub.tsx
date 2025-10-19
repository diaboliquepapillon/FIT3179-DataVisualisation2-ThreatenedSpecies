import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users, Leaf } from 'lucide-react';

interface LocalActionsData {
  threatenedSpecies: Array<{ name: string; image: string; count: number }>;
  organizations: Array<{ name: string; description: string; focus: string }>;
  nativePlants: Array<{ name: string; scientificName: string; benefit: string }>;
}

interface LocalActionHubProps {
  selectedState: string | null;
}

export const LocalActionHub = ({ selectedState }: LocalActionHubProps) => {
  const [data, setData] = useState<LocalActionsData | null>(null);
  const [loading, setLoading] = useState(false);

  const stateNameMap: Record<string, string> = {
    'NSW': 'NSW',
    'VIC': 'VIC',
    'QLD': 'QLD',
    'WA': 'WA',
    'SA': 'SA',
    'TAS': 'TAS',
    'NT': 'NT',
    'ACT': 'ACT',
  };

  useEffect(() => {
    const loadData = async () => {
      if (!selectedState) {
        setData(null);
        return;
      }

      setLoading(true);
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}local_actions.json`);
        const allData = await response.json();
        
        const stateKey = stateNameMap[selectedState];
        if (stateKey && allData.states[stateKey]) {
          setData(allData.states[stateKey]);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error('Failed to load local actions:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedState]);

  if (!selectedState) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Select a state on the map to see local conservation actions you can take
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="skeleton w-full h-64" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No data available for this state</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Local Threatened Species */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🦘</span>
            Local Threatened Species
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.threatenedSpecies.map((species, index) => (
              <motion.div
                key={species.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-border"
              >
                <div className="text-5xl mb-2">{species.image}</div>
                <h4 className="font-semibold text-sm">{species.name}</h4>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Organizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Get Involved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.organizations.map((org, index) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{org.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{org.description}</p>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {org.focus}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Native Plants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Plant Native Species
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create wildlife habitat in your own backyard by planting these native species:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.nativePlants.map((plant, index) => (
              <motion.div
                key={plant.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-green-50 border border-green-200"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🌿</span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-foreground">{plant.name}</h5>
                    <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                    <p className="text-xs text-green-700 mt-1">
                      ✓ {plant.benefit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          💚 Every action counts! Local conservation efforts make a real difference.
        </p>
      </div>
    </motion.div>
  );
};

