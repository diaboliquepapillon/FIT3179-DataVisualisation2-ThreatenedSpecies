import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

interface ThreatData {
  threats: Array<{
    name: string;
    description: string;
    color: string;
    flows: Array<{ target: string; value: number; percentage: number }>;
  }>;
}

// Simplified fallback version without d3-sankey
export const ThreatFlowChartSimple = () => {
  const [data, setData] = useState<ThreatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}threat_causes.json`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Failed to load threat data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="skeleton w-full h-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load threat data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          How Threats Impact Wildlife
        </h3>
        <p className="text-muted-foreground">
          Understanding the connections between threats and affected species groups
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.threats.map((threat, index) => (
          <motion.div
            key={threat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-2 hover:shadow-lg transition-all" style={{ borderColor: threat.color }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full mt-1"
                    style={{ backgroundColor: threat.color }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-foreground mb-1">
                      {threat.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {threat.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Impact by Species Group:
                  </p>
                  {threat.flows.map((flow) => (
                    <div key={flow.target} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{flow.target}</span>
                        <span className="font-semibold text-primary">
                          {flow.value} species ({flow.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${flow.percentage * 2}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: threat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-6">
        <p>
          💡 Each threat affects multiple species groups differently. Habitat loss impacts the most species across all groups.
        </p>
      </div>
    </div>
  );
};

