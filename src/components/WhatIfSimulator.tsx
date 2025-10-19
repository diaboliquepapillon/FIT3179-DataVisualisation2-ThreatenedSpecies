import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

export const WhatIfSimulator = () => {
  const [habitatReduction, setHabitatReduction] = useState(0);
  const [predatorControl, setPredatorControl] = useState(0);
  const [climateAction, setClimateAction] = useState(0);

  const baselineSpecies = 2130;
  
  // Calculate potential recovery based on reductions
  const calculateRecovery = () => {
    // Weighted impact: habitat loss has biggest impact
    const habitatImpact = habitatReduction * 0.5;
    const predatorImpact = predatorControl * 0.3;
    const climateImpact = climateAction * 0.2;
    
    const totalImpact = habitatImpact + predatorImpact + climateImpact;
    const recoveredSpecies = Math.round(baselineSpecies * (totalImpact / 100));
    const remainingThreatened = baselineSpecies - recoveredSpecies;
    
    return { recoveredSpecies, remainingThreatened, recoveryPercent: (recoveredSpecies / baselineSpecies) * 100 };
  };

  const { recoveredSpecies, remainingThreatened, recoveryPercent } = calculateRecovery();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          What If We Act Now?
        </h3>
        <p className="text-muted-foreground">
          Adjust the sliders to simulate the impact of conservation efforts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Habitat Loss Slider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🌳 Reduce Habitat Loss
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={[habitatReduction]}
              onValueChange={(value) => setHabitatReduction(value[0])}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{habitatReduction}%</p>
              <p className="text-xs text-muted-foreground">reduction</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Protecting remaining forests, grasslands, and wetlands
            </p>
          </CardContent>
        </Card>

        {/* Predator Control Slider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🐱 Control Invasive Predators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={[predatorControl]}
              onValueChange={(value) => setPredatorControl(value[0])}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{predatorControl}%</p>
              <p className="text-xs text-muted-foreground">reduction</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Feral cat and fox control programs
            </p>
          </CardContent>
        </Card>

        {/* Climate Action Slider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🌡️ Mitigate Climate Change
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={[climateAction]}
              onValueChange={(value) => setClimateAction(value[0])}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{climateAction}%</p>
              <p className="text-xs text-muted-foreground">impact reduction</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Reducing emissions and habitat adaptation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      <motion.div
        key={`${habitatReduction}-${predatorControl}-${climateAction}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Potential Impact</p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-4xl font-bold text-green-600">{recoveredSpecies}</p>
                    <p className="text-sm text-muted-foreground">species could recover</p>
                  </div>
                  <div className="text-3xl">→</div>
                  <div>
                    <p className="text-4xl font-bold text-orange-600">{remainingThreatened}</p>
                    <p className="text-sm text-muted-foreground">still threatened</p>
                  </div>
                </div>
              </div>

              <Progress value={recoveryPercent} className="h-4" />

              <div className="bg-card rounded-lg p-4">
                {recoveredSpecies === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    💭 <em>Adjust the sliders above to see the potential impact of conservation efforts...</em>
                  </p>
                ) : recoveryPercent < 10 ? (
                  <p className="text-sm text-foreground">
                    Every action counts! Even small efforts can save dozens of species from extinction.
                  </p>
                ) : recoveryPercent < 25 ? (
                  <p className="text-sm text-foreground">
                    💚 Good start! With sustained effort, hundreds of species could be saved.
                  </p>
                ) : (
                  <p className="text-sm text-foreground">
                    🌟 <strong>Amazing!</strong> This level of action could transform Australia's biodiversity future. 
                    Over {recoveredSpecies} species could move from threatened to stable populations!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
        <p>
          <strong>Note:</strong> This simulation is simplified for illustration. Actual recovery depends on 
          coordinated long-term efforts across government, organizations, and communities.
        </p>
      </div>
    </div>
  );
};

