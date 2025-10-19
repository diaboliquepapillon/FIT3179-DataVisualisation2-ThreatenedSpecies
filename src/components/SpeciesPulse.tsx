import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineData {
  year: number;
  totalSpecies: number;
}

export const SpeciesPulse = () => {
  const [data, setData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}timeline_data.json`);
        const jsonData = await response.json();
        
        const chartData = jsonData.data.map((item: any) => ({
          year: item.year,
          totalSpecies: item.totalSpecies,
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Failed to load timeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="skeleton w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Heartbeat indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 animate-heartbeat">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="text-sm font-semibold text-muted-foreground">Live Pulse</span>
      </div>

      <div ref={pulseRef} className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 15% 85%)" />
            <XAxis
              dataKey="year"
              stroke="hsl(30 10% 40%)"
              style={{ fontSize: '0.875rem' }}
              label={{ value: 'Year', position: 'insideBottom', offset: -10 }}
            />
            <YAxis
              stroke="hsl(30 10% 40%)"
              style={{ fontSize: '0.875rem' }}
              label={{ value: 'Total Species', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0 0% 100%)',
                border: '1px solid hsl(35 15% 85%)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
              formatter={(value: number) => [`${value} species`, 'Threatened']}
            />
            <Line
              type="monotone"
              dataKey="totalSpecies"
              stroke="hsl(15 75% 60%)"
              strokeWidth={3}
              dot={{
                fill: 'hsl(15 75% 60%)',
                r: 5,
                strokeWidth: 2,
                stroke: 'hsl(0 0% 100%)',
              }}
              activeDot={{
                r: 8,
                fill: 'hsl(140 25% 45%)',
              }}
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center space-y-2">
        <p className="text-sm font-semibold text-foreground">
          The Species Pulse: Tracking Australia's Biodiversity Crisis
        </p>
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          Each beat represents years of data. The upward trend shows the growing number of species 
          facing extinction threats—a warning signal we must heed.
        </p>
      </div>
    </div>
  );
};

