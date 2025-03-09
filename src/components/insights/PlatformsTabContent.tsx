
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import PlatformDistributionChart from './PlatformDistributionChart';

// Mock data for platform distribution
const platformData = [
  { name: 'Spotify', value: 45 },
  { name: 'Apple Music', value: 25 },
  { name: 'YouTube Music', value: 15 },
  { name: 'Amazon Music', value: 10 },
  { name: 'Other', value: 5 },
];

interface PlatformsTabContentProps {
  data?: any;
  timeRange?: string;
}

const PlatformsTabContent = ({ data, timeRange }: PlatformsTabContentProps = {}) => {
  return (
    <div className="grid gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PlatformDistributionChart 
            data={platformData} 
            height={400} 
            showLabel={true} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformsTabContent;
