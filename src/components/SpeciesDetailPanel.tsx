import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Info } from 'lucide-react';

interface SpeciesDetail {
  scientificName: string;
  commonName: string;
  status: string;
  family: string;
  class: string;
}

interface SpeciesDetailPanelProps {
  selectedState: string | null;
  selectedGroup: string;
}

const stateNameMap: Record<string, string> = {
  'NSW': 'New South Wales',
  'VIC': 'Victoria',
  'QLD': 'Queensland',
  'WA': 'Western Australia',
  'SA': 'South Australia',
  'TAS': 'Tasmania',
  'NT': 'Northern Territory',
  'ACT': 'Australian Capital Territory',
};

const getStateColumn = (state: string): number => {
  const stateColMap: { [key: string]: number } = {
    'ACT': 4, 'NSW': 5, 'NT': 6, 'QLD': 7,
    'SA': 8, 'TAS': 9, 'VIC': 10, 'WA': 11
  };
  return stateColMap[state] || 5;
};

const matchesAnimalGroup = (className: string, group: string): boolean => {
  if (!className) return false;
  const groupMap: { [key: string]: string[] } = {
    'Mammals': ['Mammalia'],
    'Birds': ['Aves'],
    'Reptiles': ['Reptilia'],
    'Amphibians': ['Amphibia'],
    'Fish': ['Actinopterygii', 'Chondrichthyes', 'Petromyzontida'],
  };
  return groupMap[group]?.includes(className) || false;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const SpeciesDetailPanel = ({ selectedState, selectedGroup }: SpeciesDetailPanelProps) => {
  const [species, setSpecies] = useState<SpeciesDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedState || selectedGroup === 'All') {
      setSpecies([]);
      return;
    }

    const loadSpecies = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${baseUrl}threatened_species not clean.csv`);
        const text = await response.text();
        const rows = text.split('\n').slice(1); // Skip header
        
        const stateCol = getStateColumn(selectedState);
        const filtered: SpeciesDetail[] = [];
        
        console.log(`[SpeciesDetail] Loading: ${selectedState} (col ${stateCol}), ${selectedGroup}`);
        
        for (const row of rows) {
          if (!row.trim()) continue;
          
          const cols = parseCSVLine(row);
          const hasState = cols[stateCol] === 'Yes';
          const className = cols[24]?.trim(); // Class column (corrected from 23)
          const matchesGroup = matchesAnimalGroup(className, selectedGroup);
          
          if (hasState && matchesGroup && filtered.length < 15) {
            filtered.push({
              scientificName: cols[0] || 'Unknown',
              commonName: cols[1] || 'No common name',
              status: cols[3] || 'Not Listed',
              family: cols[28] || 'Unknown', // Family column (corrected from 27)
              class: className || 'Unknown',
            });
          }
        }
        
        console.log(`[SpeciesDetail] Found ${filtered.length} species`);
        if (filtered.length === 0 && rows.length > 0) {
          // Debug: show first few rows
          const sample = rows.slice(0, 3).map(row => {
            const cols = parseCSVLine(row);
            return { state: cols[stateCol], class: cols[24]?.trim() };
          });
          console.log('[SpeciesDetail] Sample rows:', sample);
        }
        
        setSpecies(filtered);
      } catch (error) {
        console.error('Failed to load species details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpecies();
  }, [selectedState, selectedGroup]);

  if (!selectedState || selectedGroup === 'All') {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-base">
            Select a <strong>state</strong> and <strong>animal group</strong> to see specific threatened species
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Loading species data...</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="skeleton w-full h-64 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (species.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>
            🔬 Threatened {selectedGroup} in {stateNameMap[selectedState]}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No species data available for this combination.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          🔬 Threatened {selectedGroup} in {stateNameMap[selectedState]}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Showing {species.length} species from the SPRAT database
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {species.map((sp, idx) => (
            <div key={idx} className="p-4 bg-white border-2 border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-base">
                    {sp.commonName !== 'No common name' ? sp.commonName : <em>{sp.scientificName}</em>}
                  </h4>
                  {sp.commonName !== 'No common name' && (
                    <p className="text-sm italic text-muted-foreground">{sp.scientificName}</p>
                  )}
                </div>
                <Badge 
                  variant={
                    sp.status === 'Critically Endangered' ? 'destructive' :
                    sp.status === 'Endangered' ? 'default' : 'secondary'
                  }
                  className="shrink-0 text-xs"
                >
                  {sp.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded">Family: {sp.family}</span>
                <span className="bg-muted px-2 py-1 rounded">Class: {sp.class}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground text-center">
            💡 Data source: Species Profile and Threats Database (SPRAT), Australian Government
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

