import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="container mx-auto px-6 lg:px-8 py-16 max-w-7xl">
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-8 lg:p-12 border-2 border-primary/20 shadow-xl animate-fade-in">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <Heart className="h-8 w-8 text-primary animate-pulse-slow" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            What Can You Do? 🌏
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            You don't need to be a conservationist to make a difference. As an Australian student, 
            you have the power to protect our unique wildlife—whether it's in your backyard or across the continent.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card/60 backdrop-blur rounded-lg p-6 border border-border">
              <span className="text-3xl mb-3 block">🌱</span>
              <h3 className="font-semibold text-foreground mb-2">Plant Native Species</h3>
              <p className="text-sm text-muted-foreground">
                Create habitat corridors by planting natives in your community garden or balcony
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur rounded-lg p-6 border border-border">
              <span className="text-3xl mb-3 block">📢</span>
              <h3 className="font-semibold text-foreground mb-2">Speak Up</h3>
              <p className="text-sm text-muted-foreground">
                Support local conservation groups or petition for stronger environmental protections
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur rounded-lg p-6 border border-border">
              <span className="text-3xl mb-3 block">🎓</span>
              <h3 className="font-semibold text-foreground mb-2">Share Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Educate friends and family about threatened species in your state
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
