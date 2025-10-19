import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { InsightCard } from '@/components/InsightCard';
import { VegaLiteChart } from '@/components/VegaLiteChart';
import { StackedBarChart } from '@/components/StackedBarChart';
import { GroupedBarChart } from '@/components/GroupedBarChart';
import { TreemapChart } from '@/components/TreemapChart';
import { SectionNarrative } from '@/components/SectionNarrative';
import { ChapterHeader } from '@/components/ChapterHeader';
import { ProgressTracker } from '@/components/ProgressTracker';
import { DidYouKnow } from '@/components/DidYouKnow';
import { CallToAction } from '@/components/CallToAction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingDown, AlertTriangle, ShieldAlert, Waves, Map, BarChart3, Layers, Compass, Target, Rocket } from 'lucide-react';

// New enhanced components
import { AnimatedIntro } from '@/components/AnimatedIntro';
import { AnimalOfTheDay } from '@/components/AnimalOfTheDay';
import { WildlifeWindows } from '@/components/WildlifeWindows';
import { BiodiversityClock } from '@/components/BiodiversityClock';
import { ThreatFlowChartSimple } from '@/components/ThreatFlowChartSimple';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { LocalActionHub } from '@/components/LocalActionHub';
import { AchievementTracker } from '@/components/AchievementTracker';

// Hooks
import { useAchievements } from '@/hooks/useAchievements';

const Index = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [exploredStates, setExploredStates] = useState<Set<string>>(new Set());
  const [viewedGroups, setViewedGroups] = useState<Set<string>>(new Set());
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  // Hooks
  const { unlockAchievement, unlockedCount, totalCount } = useAchievements();

  // Track exploration progress
  useEffect(() => {
    if (selectedState) {
      setExploredStates(prev => new Set(prev).add(selectedState));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedGroup !== 'All') {
      setViewedGroups(prev => new Set(prev).add(selectedGroup));
    }
  }, [selectedGroup]);
  
  // Base path for data files (handles both dev and production)
  const baseUrl = import.meta.env.BASE_URL;

  // State name mapping
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

  // Derived state full name for filtering
  const selectedStateFull = selectedState ? stateNameMap[selectedState] : null;

  // Map with hardcoded species data - more reliable approach
  const speciesData = {
    'New South Wales': 747,
    'Queensland': 602,
    'Western Australia': 610,
    'Victoria': 351,
    'South Australia': 314,
    'Tasmania': 229,
    'Northern Territory': 151,
    'Australian Capital Territory': 69
  };

  const mapSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    title: {
      text: 'Threatened Species Distribution Across Australia',
      fontSize: 20,
      font: 'Playfair Display',
      fontWeight: 700,
      color: '#4a3422',
      anchor: 'middle',
      subtitle: 'Click any state to explore its unique conservation challenges',
      subtitleFontSize: 13,
      subtitleFont: 'Open Sans',
      subtitleColor: '#6b5d4f'
    },
    width: 'container',
    height: 500,
    projection: { 
      type: 'mercator',
      center: [133, -28],
      scale: 600
    },
    data: {
      url: `${baseUrl}australia_topo.json`,
      format: { type: 'topojson', feature: 'STE_2021_AUST_GDA2020' }
    },
    transform: [
      {
        calculate: `datum.properties.STE_NAME21 === 'New South Wales' ? 747 : 
                   datum.properties.STE_NAME21 === 'Queensland' ? 602 :
                   datum.properties.STE_NAME21 === 'Western Australia' ? 610 :
                   datum.properties.STE_NAME21 === 'Victoria' ? 351 :
                   datum.properties.STE_NAME21 === 'South Australia' ? 314 :
                   datum.properties.STE_NAME21 === 'Tasmania' ? 229 :
                   datum.properties.STE_NAME21 === 'Northern Territory' ? 151 :
                   datum.properties.STE_NAME21 === 'Australian Capital Territory' ? 69 : 0`,
        as: 'species_count'
      },
      {
        calculate: `datum.properties.STE_NAME21 === '${selectedStateFull || ''}'`,
        as: 'is_selected'
      }
    ],
    params: [
      {
        name: 'hover',
        select: { type: 'point', on: 'mouseover', clear: 'mouseout' }
      }
    ],
    mark: { 
      type: 'geoshape', 
      stroke: 'white', 
      strokeWidth: 0.5,
      cursor: 'pointer'
    },
    encoding: {
      color: {
        field: 'species_count',
        type: 'quantitative',
        scale: { scheme: 'reds' },
        legend: { 
          title: 'Threatened Species', 
          orient: 'bottom', 
          direction: 'horizontal', 
          gradientLength: 300 
        }
      },
      strokeWidth: {
        condition: [
          { test: 'datum.is_selected', value: 4 },
          { param: 'hover', value: 2 }
        ],
        value: 0.5
      },
      stroke: {
        condition: [
          { test: 'datum.is_selected', value: '#059669' },
          { param: 'hover', value: '#f97316' }
        ],
        value: 'white'
      },
      opacity: {
        condition: { param: 'hover', value: 1 },
        value: 0.9
      },
      tooltip: [
        { field: 'properties.STE_NAME21', type: 'nominal', title: 'State' },
        { field: 'species_count', type: 'quantitative', title: 'Threatened Species', format: ',.0f' }
      ]
    }
  };
  // Handle map click to update selected state
  const handleMapClick = (stateName: string | null) => {
    if (stateName) {
      // Convert full state name to abbreviation
      const stateAbbrev = Object.keys(stateNameMap).find(
        key => stateNameMap[key] === stateName
      );
      // Toggle: if already selected, deselect
      setSelectedState(prev => prev === stateAbbrev ? null : stateAbbrev || null);
    }
  };

  // Handle intro completion
  const handleIntroComplete = () => {
    setIntroComplete(true);
    setTimeout(() => setShowIntro(false), 500);
  };


  // Bar Chart Specification
  const barSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    width: 'container',
    height: 320,
    title: {
      text: selectedState
        ? `Threat Categories in ${stateNameMap[selectedState] || selectedState}`
        : 'Threat Categories Across All States',
      fontSize: 18,
      font: 'Playfair Display',
      fontWeight: 600,
      color: '#4a3422',
      subtitle: selectedState ? 'Filtered by selected state' : 'National overview',
      subtitleFont: 'Open Sans',
      subtitleFontSize: 12,
      subtitleColor: '#6b5d4f'
    },
    data: {
      url: `${baseUrl}threatened_species.csv`,
    },
    transform: [
      ...(selectedGroup !== 'All' ? [{ filter: `datum.group == '${selectedGroup}'` }] : []),
      ...(selectedState ? [{ filter: `datum.state == '${stateNameMap[selectedState]}'` }] : []),
      {
        aggregate: [{ op: 'sum', field: 'count', as: 'total_count' }],
        groupby: ['status'],
      },
    ],
    mark: {
      type: 'bar',
      cornerRadiusEnd: 4,
      cursor: 'pointer',
    },
    encoding: {
      x: {
        field: 'status',
        type: 'nominal',
        title: 'Conservation Status',
        axis: {
          labelAngle: -45,
          labelFont: 'Open Sans',
          titleFont: 'Open Sans',
          titleFontWeight: 600,
        },
        sort: ['Critically Endangered', 'Endangered', 'Vulnerable'],
      },
      y: {
        field: 'total_count',
        type: 'quantitative',
        title: 'Number of Species',
        axis: {
          labelFont: 'Open Sans',
          titleFont: 'Open Sans',
          titleFontWeight: 600,
        },
      },
      color: {
        field: 'status',
        type: 'nominal',
        scale: {
          domain: ['Critically Endangered', 'Endangered', 'Vulnerable'],
          range: ['#d62828', '#f77f00', '#fcbf49'],
        },
        legend: null,
      },
      tooltip: [
        { field: 'status', type: 'nominal', title: 'Status' },
        { field: 'total_count', type: 'quantitative', title: 'Count' },
      ],
    },
    config: {
      background: 'transparent',
      axis: {
        grid: true,
        gridColor: '#e5e5e5',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Intro */}
      {showIntro && <AnimatedIntro onComplete={handleIntroComplete} />}
      
      {/* Animal of the Day - Floating Card */}
      {introComplete && <AnimalOfTheDay />}
      
      <Navigation 
        achievementsUnlocked={unlockedCount}
        totalAchievements={totalCount}
      />

      {/* Hero Section */}
      <header className="relative overflow-hidden gradient-hero">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28 max-w-7xl">
          <div className="text-center animate-fade-in">
            <div className="mb-4 sm:mb-6">
              <span className="badge-modern badge-primary px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm">
                🎓 FIT3179 Data Visualisation Project
              </span>
            </div>
            <h1 className="heading-display mb-6 sm:mb-8 px-2">
              Where Do Australia's Threatened Animals Live?
            </h1>
            <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 text-3xl sm:text-4xl lg:text-5xl animate-pulse-slow">
              <span>🐨</span>
              <span>🦜</span>
              <span>🐍</span>
              <span>🐠</span>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4">
              Australia is home to wildlife found nowhere else on Earth, but many species are fighting for survival. 
              Join us on an interactive journey through threatened species data to discover 
              <strong className="text-primary font-semibold"> what's happening in your state</strong> and 
              <strong className="text-primary font-semibold"> what you can do about it</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
              <div className="badge-modern badge-primary text-xs sm:text-sm">
                📊 Interactive Data Story
              </div>
              <div className="badge-modern badge-secondary text-xs sm:text-sm">
                🗺️ Explore All States
              </div>
              <div className="badge-modern bg-accent/10 text-accent border border-accent/20 text-xs sm:text-sm">
                🌏 Real Conservation Data
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Unified Filter Controls */}
      <section id="visualisation" className="container mx-auto section-tight max-w-7xl">
        <div className="filter-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-xl">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h3 className="heading-section mb-1 sm:mb-0">
                Explore & Filter Visualisations
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select a species group and state to personalise your exploration
              </p>
            </div>
          </div>
          
          {/* Species Group Filter */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap w-full">
              <label htmlFor="group-filter" className="text-sm sm:text-base font-semibold text-foreground">
                Species Group:
              </label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full sm:w-64 bg-white shadow-sm border-2 border-border hover:border-primary/50 transition-colors rounded-xl" aria-label="Select species group">
                  <SelectValue placeholder="Select species group" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 rounded-xl border-2">
                  <SelectItem value="All">All Groups</SelectItem>
                  <SelectItem value="Mammals">🐨 Mammals</SelectItem>
                  <SelectItem value="Birds">🦜 Birds</SelectItem>
                  <SelectItem value="Reptiles">🐍 Reptiles</SelectItem>
                  <SelectItem value="Amphibians">🐸 Amphibians</SelectItem>
                  <SelectItem value="Fish">🐠 Fish</SelectItem>
                </SelectContent>
              </Select>
            </div>
              {(selectedState || selectedGroup !== 'All') && (
                <Button
                  onClick={() => {
                    setSelectedState(null);
                    setSelectedGroup('All');
                  }}
                  className="bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto mt-2 sm:mt-0"
                  size="sm"
                >
                  Reset Filters ✕
                </Button>
              )}
          </div>
          
          {/* State Selector */}
          <div className="border-t-2 border-border/30 pt-6 sm:pt-8">
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
              <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              State or Territory:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
              {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'].map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state === selectedState ? null : state)}
                  className={`state-button ${
                    selectedState === state
                      ? 'state-button-active'
                      : 'state-button-inactive'
                  }`}
                  aria-label={`Filter by ${state}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 1: DISCOVER */}
      <section id="chapter-discover" className="container mx-auto section-container max-w-7xl gradient-section">
        <ChapterHeader
          chapterNumber={1}
          icon={Compass}
          title="Discover"
          subtitle="What's happening in your backyard? Let's explore where Australia's threatened species actually live."
          emoji="🗺️"
        />

        {/* Progress Tracker */}
        <div className="mb-8">
          <ProgressTracker 
            statesExplored={exploredStates.size} 
            totalStates={8}
            groupsViewed={viewedGroups}
            onAchievementUnlock={unlockAchievement}
          />
        </div>

        {/* State-Specific Facts (shown when state is selected) */}
        {selectedState && (
          <div className="mb-12 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl p-8 lg:p-12 border-l-4 border-primary shadow-lg animate-scale-in">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-4">
              Your State's Story: {stateNameMap[selectedState]}
            </h2>
            <div className="prose prose-lg max-w-none">
              {selectedState === 'QLD' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">Queensland is Australia's threatened species capital.</strong> With 602 at-risk animals, the state faces a biodiversity crisis driven by land clearing (still the highest rate in Australia), coastal development pressures, and climate warming impacts on the Great Barrier Reef and tropical rainforests.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Support Queensland's Land Restoration Fund, volunteer for reef monitoring programs, or advocate for stronger land-clearing laws.
                  </p>
                </>
              )}
              {selectedState === 'NSW' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">New South Wales carries the heaviest threatened species burden.</strong> 747 species face threats from Australia's most densely populated state. Over 75% of original vegetation is gone, replaced by cities, farms, and infrastructure fragmenting critical wildlife corridors.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Join local Landcare groups, plant native gardens to create urban wildlife corridors, or support rewilding initiatives like the Great Eastern Ranges.
                  </p>
                </>
              )}
              {selectedState === 'WA' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">Western Australia is an endemism hotspot and a conservation flashpoint.</strong> 610 threatened species include animals found nowhere else on Earth. Mining expansion, feral cats and foxes, and changing rainfall threaten unique desert and southwest forest ecosystems.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Support wildlife recovery programs like Western Shield, advocate for feral predator control, or donate to conservation groups protecting critical habitats.
                  </p>
                </>
              )}
              {selectedState === 'VIC' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">Victoria's agricultural intensity creates early-warning species risks.</strong> With high proportions of 'Vulnerable' species, the state has a critical window for intervention before populations crash. Grasslands and wetlands, once covering vast areas, are now fragmented remnants.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Protect remaining grasslands by supporting conservation trusts, create frog-friendly gardens for amphibians, or volunteer for wetland restoration projects.
                  </p>
                </>
              )}
              {selectedState === 'TAS' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">Tasmania's island ecosystems are uniquely vulnerable.</strong> 229 threatened species face compounding pressures: climate change warming habitats faster than species can adapt, invasive species disrupting food webs, and diseases like Devil facial tumour threatening iconic animals.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Support Tasmanian Devil recovery programs, participate in citizen science to monitor invasive species, or donate to island conservation initiatives.
                  </p>
                </>
              )}
              {selectedState === 'SA' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">South Australia's arid-adapted species face escalating climate threats.</strong> 314 species evolved for harsh conditions now face even harsher realities: prolonged droughts, extreme temperatures, and habitat degradation from overgrazing making survival increasingly difficult.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Support arid zone recovery projects, advocate for sustainable pastoral practices, or volunteer for wildlife rescue during extreme weather events.
                  </p>
                </>
              )}
              {selectedState === 'NT' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">The Northern Territory's remote ecosystems face silent threats.</strong> 151 species struggle with altered fire regimes, feral herbivores destroying habitats, and predatory mammals. Indigenous land management practices offer hope, as traditional burning techniques protect biodiversity far better than European methods.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Support Indigenous Protected Areas, advocate for traditional fire management expansion, or donate to NT wildlife recovery programs.
                  </p>
                </>
              )}
              {selectedState === 'ACT' && (
                <>
                  <p className="text-foreground leading-relaxed mb-4">
                    <strong className="text-primary">The ACT proves small territories face big conservation challenges.</strong> Despite covering just 2,358 km², 69 threatened species persist in habitat remnants squeezed between urban development. Grassland birds and woodland mammals need careful urban planning to survive.
                  </p>
                  <p className="text-muted-foreground text-base">
                    💚 <em>What you can do:</em> Participate in ACT ParkCare activities, create wildlife-friendly gardens in Canberra suburbs, or advocate for green corridors in urban planning.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Wildlife Windows - Small Multiple Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-display font-bold text-foreground mb-4 text-center">
            Explore by Animal Group
          </h3>
          <WildlifeWindows 
            selectedGroup={selectedGroup}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setViewedGroups(prev => new Set(prev).add(group));
            }}
          />
        </div>
        
        <SectionNarrative
          icon={Map}
          title="The Geographic Story"
          description="This interactive map shows where threatened animals are concentrated. Notice the 'hotspots': NSW, QLD, and WA carry the heaviest conservation burden. Click any state to dive deeper into its unique challenges."
          highlight="Your state matters! Each region faces different threats, from urban sprawl to climate shifts."
        />
        
        <div className="chart-container animate-scale-in">
          <VegaLiteChart spec={mapSpec} onStateClick={handleMapClick} />
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm text-center text-foreground font-medium">
              💡 <strong>Interactive:</strong> Click different states to explore regional data!
          </p>
          </div>
        </div>

        {/* Did You Know Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <DidYouKnow 
            state="Queensland"
            fact="Queensland's 602 threatened species include unique rainforest frogs and reef fish found nowhere else on Earth."
          />
          <DidYouKnow 
            state="New South Wales"
            fact="NSW has lost over 75% of its original vegetation, making it the most cleared state, directly impacting 747 threatened species."
          />
          <DidYouKnow 
            state="Western Australia"
            fact="WA's southwest corner is one of only 35 global biodiversity hotspots, with 80% of plant species found nowhere else!"
          />
          <DidYouKnow 
            state="Tasmania"
            fact="The Tasmanian Devil is the world's largest surviving carnivorous marsupial, but its population has declined by 80% since 1996."
          />
        </div>
      </section>

      {/* CHAPTER 2: UNDERSTAND */}
      <section id="chapter-understand" className="container mx-auto section-container max-w-7xl">
        <ChapterHeader
          chapterNumber={2}
          icon={Target}
          title="Understand"
          subtitle="Not all threats are equal. Let's decode the conservation status categories and see which animals need help most urgently."
          emoji="📊"
        />
        
        <SectionNarrative
          icon={BarChart3}
          title="The Severity Spectrum"
          description="Conservation status isn't just bureaucratic jargon, it's a warning system. 'Critically Endangered' means extinction is imminent. 'Vulnerable' means we still have time to act. These charts reveal which states face the most dire situations."
          highlight="Victoria has more 'Vulnerable' species. Early intervention now could prevent future crises!"
        />

        {/* Biodiversity Clock & Species Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="chart-container">
            <h3 className="heading-card mb-6 text-center flex items-center justify-center gap-2">
              <span className="text-2xl">🕐</span>
              The Biodiversity Clock
            </h3>
            <BiodiversityClock onAchievement={() => unlockAchievement('timeline_traveler')} />
          </div>
          
          <div className="chart-container">
            <VegaLiteChart spec={{
              $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
              width: 'container',
              height: 300,
              title: {
                text: 'Species Pulse Over Time',
                fontSize: 18,
                font: 'Playfair Display',
                fontWeight: 600,
                color: '#4a3422'
              },
              data: { url: `${baseUrl}timeline_data.json`, format: { property: 'data' } },
              mark: {
                type: 'line',
                point: { filled: true, size: 100 },
                strokeWidth: 3,
                color: '#f97316',
                tooltip: true
              },
              encoding: {
                x: {
                  field: 'year',
                  type: 'ordinal',
                  title: 'Year',
                  axis: { 
                    labelAngle: -45,
                    labelFont: 'Open Sans',
                    titleFont: 'Open Sans',
                    titleFontWeight: 600
                  }
                },
                y: {
                  field: 'totalSpecies',
                  type: 'quantitative',
                  title: 'Threatened Species Count',
                  scale: { zero: false },
                  axis: { 
                    labelFont: 'Open Sans',
                    titleFont: 'Open Sans',
                    titleFontWeight: 600
                  }
                },
                tooltip: [
                  { field: 'year', title: 'Year', type: 'ordinal' },
                  { field: 'totalSpecies', title: 'Total Species', type: 'quantitative', format: ',d' }
                ]
              },
              config: {
                background: 'transparent'
              }
            }} />
            <p className="text-sm text-center mt-6 text-muted-foreground font-medium">
              📈 The upward trend shows the growing number of species facing extinction threats
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stacked Bar Chart */}
          <div className="chart-container animate-fade-in">
            <StackedBarChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-sm text-center mt-6 text-muted-foreground font-medium">
              📈 Proportional breakdown by threat severity
            </p>
          </div>

          {/* Original Bar Chart */}
          <div className="chart-container animate-fade-in">
            <VegaLiteChart spec={barSpec} />
            <p className="text-sm text-center mt-6 text-muted-foreground font-medium">
              🔍 {selectedState ? `Zoomed into ${stateNameMap[selectedState]}` : 'National overview, select a state to filter'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <DidYouKnow 
            fact="Critically Endangered species like the Orange-bellied Parrot have fewer than 50 individuals left in the wild. Every single bird counts!"
          />
          <DidYouKnow 
            fact="Climate change is accelerating. Species that evolved over millions of years now have just decades to adapt or relocate."
          />
        </div>
      </section>

      {/* Animal Groups Deep Dive */}
      <section className="container mx-auto section-container max-w-7xl gradient-section">
        <SectionNarrative
          icon={Layers}
          title="Who's Most at Risk?"
          description="Mammals steal the headlines, but birds, reptiles, and amphibians face equally dire situations. Filter by animal group above to see patterns. You might be surprised which species dominate your state's threatened list."
          highlight="Use the dropdown filter to explore each animal group and find which protects the most mammals!"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Grouped Bar Chart */}
          <div className="chart-container animate-fade-in">
            <GroupedBarChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-sm text-center mt-6 text-muted-foreground font-medium">
              🐾 Compare how different animal types are affected
            </p>
          </div>

          {/* Treemap/Heatmap */}
          <div className="chart-container animate-fade-in">
            <TreemapChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-sm text-center mt-6 text-muted-foreground font-medium">
              🌡️ Heatmap revealing hidden patterns in species and status combinations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <DidYouKnow 
            fact="Australia has more threatened mammal species than any other developed nation, a legacy of introduced predators like foxes and cats."
          />
          <DidYouKnow 
            fact="Reptiles often go unnoticed, but NSW alone has 87 threatened reptile species, including unique skinks and geckos."
          />
          <DidYouKnow 
            fact="Birds act as 'ecosystem engineers'. Losing them disrupts seed dispersal, pollination, and pest control."
          />
        </div>

        {/* Threat Flow Visualization */}
        <div className="mt-12">
          <SectionNarrative
            icon={Layers}
            title="The Chain of Threat"
            description="Threats don't impact species equally. This visualization shows how habitat loss, invasive species, climate change, and disease each affect different animal groups."
            highlight="Understanding these connections helps us target conservation efforts where they'll have the most impact!"
          />
          <div className="mt-6">
            <ThreatFlowChartSimple />
          </div>
        </div>

        {/* What If Simulator */}
        <div className="mt-12">
          <SectionNarrative
            icon={Target}
            title="The Power of Action"
            description="What if we acted now? This simulator shows the potential impact of conservation efforts. Adjust the sliders to see how reducing threats could save hundreds of species."
            highlight="Even small actions create ripples. Every percentage point of improvement matters!"
          />
          <div className="mt-6">
            <WhatIfSimulator />
          </div>
        </div>
      </section>

      {/* CHAPTER 3: TAKE ACTION */}
      <section id="chapter-act" className="container mx-auto px-6 lg:px-8 py-16 max-w-7xl">
        <ChapterHeader
          chapterNumber={3}
          icon={Rocket}
          title="Take Action"
          subtitle="Research shows individual actions drive conservation success. Here's how students can contribute to species protection."
          emoji="🌱"
        />

        {/* Local Action Hub */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-foreground mb-4 text-center">
            Take Action in Your State
          </h3>
          <LocalActionHub selectedState={selectedState} />
        </div>

      </section>

      {/* Call to Action - New Component */}
      <CallToAction />

      {/* Regional Insights - Overview Cards */}
      {!selectedState && (
      <section id="insights" className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
              Why This Matters to You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
              These aren't just numbers. Every species plays a role in Australia's ecological tapestry.
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <InsightCard
              icon={<TrendingDown className="h-6 w-6" />}
              state="Queensland"
              abbrev="QLD"
              description="602 threatened species call QLD home, from rainforest frogs to reef fish. The state's tropical ecosystems are biodiversity hotspots facing habitat loss and climate impacts."
              color="bg-secondary/10 text-secondary border-secondary/20"
            />
            <InsightCard
              icon={<AlertTriangle className="h-6 w-6" />}
              state="New South Wales"
              abbrev="NSW"
              description="With 747 species at risk, NSW's urban sprawl and agricultural clearing have fragmented critical habitats. Coastal and woodland species are hit hardest."
              color="bg-primary/10 text-primary border-primary/20"
            />
            <InsightCard
              icon={<ShieldAlert className="h-6 w-6" />}
              state="Western Australia"
              abbrev="WA"
              description="610 endemic species found nowhere else face threats from mining and feral predators. WA's vast deserts hide irreplaceable biodiversity under pressure."
              color="bg-accent/10 text-accent border-accent/20"
            />
            <InsightCard
              icon={<Waves className="h-6 w-6" />}
              state="Tasmania"
              abbrev="TAS"
              description="Island isolation creates vulnerability. 229 unique species face climate change, invasive species, and diseases like Devil facial tumour threatening ecosystems."
              color="bg-primary/10 text-primary border-primary/20"
            />
          </div>
      </section>
      )}


      {/* Achievements Section */}
      <section id="achievements" className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            🏆 Your Conservation Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your progress as you explore Australia's threatened species. Unlock achievements and become a conservation champion!
          </p>
        </div>
        <AchievementTracker />
      </section>

      {/* Why Students Should Care */}
      <section className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-10 border-2 border-primary/30 shadow-xl animate-fade-in">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-4 text-center">
            Why This Matters to You 🎓
          </h2>
          <p className="text-base lg:text-lg text-foreground leading-relaxed max-w-3xl mx-auto text-center">
            As Australian students, we inherit both the privilege and responsibility of protecting species found nowhere else on Earth. 
            This isn't just environmental science. It's about identity, legacy, and the future we're building. 
            Every koala, frog, and parrot lost diminishes what makes Australia uniquely ours. 
            Data literacy empowers you to see beyond headlines, question policies, and advocate for evidence-based conservation. 
            Your generation will determine whether these animals survive or become museum exhibits. 
            <strong className="text-primary"> The question isn't whether you can make a difference, it's whether you will.</strong>
          </p>
        </div>
      </section>

      {/* Data Source Section */}
      <section id="data" className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">About This Visualisation</h2>
          <div className="space-y-4 text-foreground/80">
            <p className="leading-relaxed">
              This interactive data storytelling experience was created for <strong>FIT3179 Data Visualisation 2</strong>. 
              It transforms EPBC Act threatened species data into an emotionally engaging narrative designed to connect Australian students 
              with conservation challenges in their home states.
            </p>
            <div className="border-l-4 border-primary pl-6 py-2">
              <p className="text-sm font-semibold text-foreground mb-1">📊 Data Source</p>
              <p className="text-sm">
                Australian Government – Department of Climate Change, Energy, the Environment and Water (DCCEEW)
                <br />
                EPBC Act Threatened Species Lists (2025)
              </p>
            </div>
            <div className="border-l-4 border-accent pl-6 py-2">
              <p className="text-sm font-semibold text-foreground mb-1">🎨 Design Approach</p>
              <p className="text-sm">
                Built with Vega-Lite, React, and Tailwind CSS. Features narrative chapters, gamified exploration tracking, 
                interactive cross-filtering, eco-inspired color palette, and responsive typography (Playfair Display + Open Sans).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-6 lg:px-8 py-10 max-w-7xl">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-display text-base">FIT3179 Data Visualisation 2</strong> • Monash University • 2025
            </p>
            <p className="text-sm text-muted-foreground">
              Created by <strong className="text-foreground">Aylin Vahabova</strong> with 💚 for Australian wildlife
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Vega-Lite, React, Tailwind CSS • Fonts: Playfair Display & Open Sans
            </p>
            <div className="pt-4 flex justify-center gap-6 text-xs text-muted-foreground">
              <a href="#visualisation" className="hover:text-primary transition-colors">Explore Map</a>
              <a href="#insights" className="hover:text-primary transition-colors">Insights</a>
              <a href="#data" className="hover:text-primary transition-colors">Data Source</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
