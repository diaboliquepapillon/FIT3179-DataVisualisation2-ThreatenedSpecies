import { LucideIcon } from 'lucide-react';

interface ChapterHeaderProps {
  chapterNumber: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  emoji?: string;
}

export const ChapterHeader = ({ 
  chapterNumber, 
  icon: Icon, 
  title, 
  subtitle,
  emoji 
}: ChapterHeaderProps) => {
  return (
    <div className="text-center mb-12 animate-slide-up">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold text-primary">
          Chapter {chapterNumber}
        </span>
      </div>
      
      <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
        {title} {emoji && <span className="inline-block animate-pulse-slow">{emoji}</span>}
      </h2>
      
      <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};
