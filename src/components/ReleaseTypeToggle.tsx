import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Disc, Album, Music } from 'lucide-react';

interface ReleaseTypeToggleProps {
  value: 'single' | 'ep' | 'album';
  onChange: (value: 'single' | 'ep' | 'album') => void;
}

const ReleaseTypeToggle = ({ value, onChange }: ReleaseTypeToggleProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && onChange(val as 'single' | 'ep' | 'album')}
        className="bg-muted p-1 rounded-lg"
      >
        <ToggleGroupItem
          value="single"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md transition-all"
        >
          <Music className="w-4 h-4 mr-2" />
          Single
        </ToggleGroupItem>
        <ToggleGroupItem
          value="ep"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md transition-all"
        >
          <Disc className="w-4 h-4 mr-2" />
          EP
        </ToggleGroupItem>
        <ToggleGroupItem
          value="album"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md transition-all"
        >
          <Album className="w-4 h-4 mr-2" />
          Album
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ReleaseTypeToggle;
