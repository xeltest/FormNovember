import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { importFromZip, validateImportedData } from '@/lib/importUtils';
import { ReleaseData, TrackData } from '@/pages/Index';

interface ImportFromZipProps {
  onImport: (data: { release: ReleaseData; tracks: TrackData[] }) => void;
}

const ImportFromZip: React.FC<ImportFromZipProps> = ({ onImport }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importMessage, setImportMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setImportError(null);
    setValidationWarnings([]);
    setImportSuccess(false);
    setIsImporting(true);
    setShowDialog(true);
    setImportProgress(0);
    setImportMessage('Starting import...');

    try {
      // Import from ZIP
      const result = await importFromZip(
        file,
        (progress, message) => {
          setImportProgress(progress);
          setImportMessage(message);
        }
      );

      // Validate imported data
      const validationErrors = validateImportedData(result.release, result.tracks);
      if (validationErrors.length > 0) {
        setValidationWarnings(validationErrors);
        // Allow import with warnings, but show them to user
      }

      // Call onImport callback
      onImport(result);
      setImportSuccess(true);
      setImportMessage(`Successfully imported ${result.tracks.length} track(s)!`);

    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setImportError(null);
    setValidationWarnings([]);
    setImportSuccess(false);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        onClick={handleButtonClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Import from ZIP
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isImporting && 'Importing Release...'}
              {!isImporting && importSuccess && 'Import Successful!'}
              {!isImporting && importError && 'Import Failed'}
            </DialogTitle>
            <DialogDescription>
              {isImporting && 'Please wait while we process your release package.'}
              {!isImporting && importSuccess && 'Your release has been imported and the form has been populated.'}
              {!isImporting && importError && 'An error occurred while importing your release.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Progress */}
            {isImporting && (
              <>
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {importMessage}
                </p>
              </>
            )}

            {/* Success */}
            {!isImporting && importSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {importMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Validation Warnings */}
            {!isImporting && validationWarnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="font-medium mb-2">
                    Import completed with {validationWarnings.length} warning(s):
                  </div>
                  <ul className="space-y-1 text-sm">
                    {validationWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-sm">
                    Please review and complete the missing information.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Error */}
            {!isImporting && importError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {importError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Close Button */}
          {!isImporting && (
            <div className="flex justify-end">
              <Button onClick={handleCloseDialog}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportFromZip;
