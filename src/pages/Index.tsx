
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Music, Upload, Download } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import ReleaseInfo from '@/components/ReleaseInfo';
import TrackDetails from '@/components/TrackDetails';
import ExportStep from '@/components/ExportStep';

export interface ReleaseData {
  title: string;
  mixVersion?: string;
  artists: string[];
  featuredArtists: string[];
  remixers: string[];
  releaseDate: string;
  isReRelease: boolean;
  originalReleaseDate?: string;
  artwork?: File;
  labelName: string;
  albumGenre: string;
  catalogNumber?: string;
  upc?: string;
  albumCLine: string;
  albumPLine: string;
  isWorldwide: boolean;
  territoryMode?: 'include' | 'exclude';
  territories: string[];
}

export interface TrackData {
  title: string;
  mixVersion?: string;
  audioFile?: File;
  artists: string[];
  featuredArtists: string[];
  remixers: string[];
  performers: Array<{ name: string; roles: string[] }>;
  composition: Array<{ name: string; roles: string[] }>;
  production: Array<{ name: string; roles: string[] }>;
  publishers: string[];
  trackGenre: string;
  isrcCode?: string;
  dolbyAtmos: boolean;
  secondaryIsrc?: string;
  language: string;
  explicitContent: 'no' | 'yes' | 'cleaned';
  lyrics?: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [releaseData, setReleaseData] = useState<ReleaseData>({
    title: '',
    artists: [''],
    featuredArtists: [],
    remixers: [],
    releaseDate: '',
    isReRelease: false,
    labelName: '',
    albumGenre: '',
    albumCLine: '',
    albumPLine: '',
    isWorldwide: true,
    territories: []
  });
  
  const [tracks, setTracks] = useState<TrackData[]>([{
    title: '',
    artists: [''],
    featuredArtists: [],
    remixers: [],
    performers: [{ name: '', roles: [] }],
    composition: [{ name: '', roles: [] }],
    production: [{ name: '', roles: [] }],
    publishers: [],
    trackGenre: '',
    dolbyAtmos: false,
    language: 'English',
    explicitContent: 'no'
  }]);

  const steps = [
    { number: 1, title: 'Release Info', icon: Music },
    { number: 2, title: 'Track Details', icon: Upload },
    { number: 3, title: 'Export', icon: Download }
  ];

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        releaseData.title &&
        releaseData.artists[0] &&
        releaseData.releaseDate &&
        releaseData.labelName &&
        releaseData.albumGenre &&
        releaseData.albumCLine &&
        releaseData.albumPLine &&
        (!releaseData.isReRelease || releaseData.originalReleaseDate)
      );
    }
    
    if (step === 2) {
      return tracks.every(track => 
        track.title &&
        track.artists[0] &&
        track.trackGenre &&
        track.performers.some(p => p.name && p.roles.length > 0) &&
        track.composition.some(c => c.name && c.roles.length > 0) &&
        track.production.some(p => p.name && p.roles.length > 0)
      );
    }
    
    return true;
  };

  const canProceed = (step: number): boolean => {
    return validateStep(step);
  };

  const handleNext = () => {
    if (canProceed(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepColor = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'bg-green-500 text-white';
    if (stepNumber === currentStep) return 'bg-blue-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background py-8 theme-transition">
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Dark Mode Toggle */}
        <div className="absolute top-0 right-4 z-10">
          <DarkModeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Xelon Release Builder
          </h1>
          <p className="text-muted-foreground">
            Submit your music release with complete metadata
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${getStepColor(step.number)}`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium text-foreground">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 mb-6">
          {currentStep === 1 && (
            <ReleaseInfo 
              data={releaseData} 
              onChange={setReleaseData} 
            />
          )}
          
          {currentStep === 2 && (
            <TrackDetails 
              tracks={tracks}
              onChange={setTracks}
              releaseData={releaseData}
            />
          )}
          
          {currentStep === 3 && (
            <ExportStep 
              releaseData={releaseData}
              tracks={tracks}
            />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed(currentStep)}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
