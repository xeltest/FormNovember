
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Music, Upload, Download, Mail, AlertCircle } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import ReleaseInfo from '@/components/ReleaseInfo';
import TrackDetails from '@/components/TrackDetails';
import ExportStep from '@/components/ExportStep';
import { validateAllAssets, getAssetValidationMessage, getDetailedValidationMessage, areAssetsMandatory } from '@/lib/assetValidation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { serializeReleaseData, deserializeReleaseData, serializeTracks, deserializeTracks } from '@/lib/formPersistence';
import { useToast } from '@/hooks/use-toast';

export interface ReleaseData {
  title: string;
  mixVersion?: string;
  artists: string[];
  featuredArtists: Array<{ name: string; makeSpotifyPrimary?: boolean }>;
  remixers: Array<{ name: string; makeSpotifyPrimary?: boolean }>;
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
  releaseType: 'single' | 'ep' | 'album';
}

export interface TrackData {
  title: string;
  mixVersion?: string;
  audioFile?: File;
  artists: string[];
  featuredArtists: Array<{ name: string; makeSpotifyPrimary?: boolean }>;
  remixers: Array<{ name: string; makeSpotifyPrimary?: boolean }>;
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
  const { toast } = useToast();

  const [currentStep, setCurrentStep, clearStepStorage] = useFormPersistence(
    'xelon-form-step',
    1
  );
  const [attemptedProceed, setAttemptedProceed] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [releaseData, setReleaseData, clearReleaseStorage] = useFormPersistence<ReleaseData>(
    'xelon-form-release',
    {
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
    territories: [],
    releaseType: 'single'
  },
  {
    serialize: serializeReleaseData,
    deserialize: deserializeReleaseData,
  }
  );

  const [tracks, setTracks, clearTracksStorage] = useFormPersistence<TrackData[]>(
    'xelon-form-tracks',
    [{
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
  }],
  {
    serialize: serializeTracks,
    deserialize: deserializeTracks,
  }
  );

  const steps = [
    { number: 1, title: 'Release Info', icon: Music },
    { number: 2, title: 'Track Details', icon: Upload },
    { number: 3, title: 'Export', icon: Download },
    { number: 4, title: 'Send to Xelon', icon: Mail }
  ];

  // Clear storage when reaching Step 4 (Send to Xelon)
  useEffect(() => {
    if (currentStep === 4) {
      clearStepStorage();
      clearReleaseStorage();
      clearTracksStorage();
    }
  }, [currentStep, clearStepStorage, clearReleaseStorage, clearTracksStorage]);

  // Show notification when data is restored
  useEffect(() => {
    const hasRestoredData = sessionStorage.getItem('xelon-form-release');
    const notified = sessionStorage.getItem('xelon-form-notified');

    if (hasRestoredData && !notified) {
      toast({
        title: "Form data restored",
        description: "Your previous session was recovered. Please re-upload artwork and audio files.",
        duration: 5000,
      });
      sessionStorage.setItem('xelon-form-notified', 'true');
    }
  }, [toast]);

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const basicValidation = !!(
        releaseData.title &&
        releaseData.artists[0] &&
        releaseData.releaseDate &&
        releaseData.labelName &&
        releaseData.albumGenre &&
        releaseData.albumCLine &&
        releaseData.albumPLine &&
        (!releaseData.isReRelease || releaseData.originalReleaseDate)
      );

      // Check artwork validation for step 1
      const assetValidation = validateAllAssets(releaseData, tracks);
      return basicValidation && !assetValidation.missingArtwork;
    }

    if (step === 2) {
      const basicValidation = tracks.every(track =>
        track.title &&
        track.artists[0] &&
        track.trackGenre &&
        track.performers.some(p => p.name && p.roles.length > 0) &&
        track.composition.some(c => c.name && c.roles.length > 0) &&
        track.production.some(p => p.name && p.roles.length > 0)
      );

      // Check audio files validation for step 2
      const assetValidation = validateAllAssets(releaseData, tracks);
      return basicValidation && assetValidation.missingAudioTracks.length === 0;
    }

    if (step === 3) {
      return exportComplete;
    }

    return true;
  };

  const canProceed = (step: number): boolean => {
    return validateStep(step);
  };

  const handleNext = () => {
    if (canProceed(currentStep) && currentStep < 4) {
      // Auto-populate Track 1 for singles when leaving Release Info
      if (currentStep === 1 && releaseData.releaseType === 'single') {
        const updatedTrack = {
          ...tracks[0],
          title: releaseData.title,
          mixVersion: releaseData.mixVersion,
          artists: [...releaseData.artists],
          featuredArtists: releaseData.featuredArtists.map(a => ({ ...a })),
          remixers: releaseData.remixers.map(r => ({ ...r }))
        };
        const newTracks = [...tracks];
        newTracks[0] = updatedTrack;
        setTracks(newTracks);
      }
      setCurrentStep(currentStep + 1);
      setAttemptedProceed(false); // Reset validation attempt when successfully moving to next step
    } else {
      setAttemptedProceed(true); // Mark that user attempted to proceed
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAttemptedProceed(false); // Reset validation attempt when going back
    }
  };

  const handleImport = (importedData: { release: ReleaseData; tracks: TrackData[] }) => {
    setReleaseData(importedData.release);
    setTracks(importedData.tracks);
  };

  const getStepColor = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'bg-green-500 text-white';
    if (stepNumber === currentStep) return 'bg-blue-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getValidationMessage = (): string | null => {
    if (!areAssetsMandatory()) {
      return null; // No validation message in optional mode
    }

    const assetValidation = validateAllAssets(releaseData, tracks);

    if (currentStep === 1 && assetValidation.missingArtwork) {
      return 'Please upload release artwork to continue';
    }

    if (currentStep === 2) {
      // Use detailed validation message for track step
      const detailedMessage = getDetailedValidationMessage(tracks);
      return detailedMessage || null;
    }

    if (currentStep === 3 && !exportComplete) {
      return 'Please download the ZIP file to continue';
    }

    return null;
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
              onImport={handleImport}
              showValidation={attemptedProceed}
            />
          )}

          {currentStep === 2 && (
            <TrackDetails
              tracks={tracks}
              onChange={setTracks}
              releaseData={releaseData}
              showValidation={attemptedProceed}
            />
          )}
          
          {currentStep === 3 && (
            <ExportStep
              releaseData={releaseData}
              tracks={tracks}
              exportComplete={exportComplete}
              onExportComplete={setExportComplete}
            />
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Send to Xelon</h2>
              <p className="text-muted-foreground">
                Email your downloaded ZIP file to submissions@xelondigital.com
              </p>
            </div>
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

          {currentStep < 4 && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`inline-flex ${!canProceed(currentStep) ? 'cursor-not-allowed' : ''}`}>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed(currentStep)}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </TooltipTrigger>
                {getValidationMessage() && !canProceed(currentStep) && (
                  <TooltipContent className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 max-w-xs">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-orange-700 dark:text-orange-400">
                          {getValidationMessage()}
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
