import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareGeneratorProps {
  exploredStates: Set<string>;
  selectedState: string | null;
  totalSpeciesViewed: number;
}

const stateSpeciesCount: Record<string, number> = {
  'NSW': 747,
  'VIC': 351,
  'QLD': 602,
  'WA': 610,
  'SA': 314,
  'TAS': 229,
  'NT': 151,
  'ACT': 69,
};

export const ShareGenerator = ({ exploredStates, selectedState, totalSpeciesViewed }: ShareGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const statesExplored = exploredStates.size;
    const currentState = selectedState || (exploredStates.size > 0 ? Array.from(exploredStates)[0] : null);
    
    let text = `🐨 I explored Australia's Wild Future!\n\n`;
    
    if (currentState) {
      const count = stateSpeciesCount[currentState] || 0;
      text += `📍 ${currentState}: ${count} threatened species\n`;
    }
    
    text += `🗺️ States explored: ${statesExplored}/8\n`;
    text += `\nLearn about threatened Australian wildlife and how you can help at: https://[your-project-url]`;
    
    return text;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast.success('Copied to clipboard!', {
        description: 'Share your exploration with friends',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownloadStats = () => {
    const stats = {
      exploredStates: Array.from(exploredStates),
      totalStatesExplored: exploredStates.size,
      currentlyViewing: selectedState,
      totalSpeciesViewed,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-wildlife-exploration-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Stats downloaded!', {
      description: 'Your exploration data has been saved',
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div>
            <Share2 className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Share Your Exploration
            </h3>
            <p className="text-sm text-muted-foreground">
              Inspire others to learn about Australia's threatened species
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-2xl font-bold text-primary">{exploredStates.size}</p>
              <p className="text-xs text-muted-foreground">States Explored</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-2xl font-bold text-primary">{totalSpeciesViewed}</p>
              <p className="text-xs text-muted-foreground">Species Viewed</p>
            </div>
          </div>

          {/* Share Preview */}
          <div className="bg-card p-4 rounded-lg border border-border text-left">
            <pre className="text-xs whitespace-pre-wrap text-foreground font-mono">
              {generateShareText()}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopyToClipboard}
              className="flex-1"
              variant={copied ? 'default' : 'outline'}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
            <Button
              onClick={handleDownloadStats}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Stats
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Share on social media to spread awareness about wildlife conservation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

