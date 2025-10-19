import { Lightbulb } from 'lucide-react';

interface DidYouKnowProps {
  fact: string;
  state?: string;
}

export const DidYouKnow = ({ fact, state }: DidYouKnowProps) => {
  return (
    <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg p-4 border-l-4 border-accent animate-scale-in">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          {state && (
            <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
              {state}
            </p>
          )}
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Did you know?</strong> {fact}
          </p>
        </div>
      </div>
    </div>
  );
};
