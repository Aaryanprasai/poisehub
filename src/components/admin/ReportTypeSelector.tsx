
import React from 'react';
import { Button } from '@/components/ui-extensions/Button';
import { FileSpreadsheet } from 'lucide-react';

export type ReportType = 'royalties' | 'sales' | 'streams';

interface ReportTypeSelectorProps {
  selectedReportType: ReportType;
  onChange: (type: ReportType) => void;
}

export function ReportTypeSelector({ selectedReportType, onChange }: ReportTypeSelectorProps) {
  const reportTypeOptions: {id: ReportType, label: string}[] = [
    { id: 'royalties', label: 'Royalty Reports' },
    { id: 'sales', label: 'Sales Reports' },
    { id: 'streams', label: 'Streaming Data' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {reportTypeOptions.map((option) => (
        <Button
          key={option.id}
          variant={selectedReportType === option.id ? "default" : "outline"}
          className="justify-start h-auto py-4"
          onClick={() => onChange(option.id)}
        >
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          {option.label}
        </Button>
      ))}
    </div>
  );
}
