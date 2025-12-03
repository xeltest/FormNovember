import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipContent, TooltipFieldKey } from '@/lib/tooltipContent';

interface FieldTooltipProps {
  label: string;
  fieldKey?: TooltipFieldKey;
  tooltipText?: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

/**
 * FieldTooltip Component
 *
 * A reusable component that displays a label with an info icon that triggers a tooltip on hover.
 *
 * Usage:
 * <FieldTooltip label="ISRC Code" fieldKey="isrc" htmlFor="isrcCode" />
 * OR
 * <FieldTooltip label="Custom Field" tooltipText="Custom tooltip text" htmlFor="customField" />
 *
 * @param label - The label text to display
 * @param fieldKey - The key to lookup tooltip content (optional if tooltipText is provided)
 * @param tooltipText - Custom tooltip text (optional if fieldKey is provided)
 * @param htmlFor - The id of the form field this label is for
 * @param required - Whether to show asterisk for required fields
 * @param className - Additional CSS classes for the label
 */
export const FieldTooltip: React.FC<FieldTooltipProps> = ({
  label,
  fieldKey,
  tooltipText,
  htmlFor,
  required = false,
  className = '',
}) => {
  const content = tooltipText || (fieldKey ? tooltipContent[fieldKey] : '');

  return (
    <div className="flex items-center gap-1.5 mb-3">
      <label
        htmlFor={htmlFor}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Information about {label}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
