
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { RoyaltyChart } from '@/components/RoyaltyChart';
import { royaltyData } from '@/lib/mock-data';
import PlatformDistributionChart from './PlatformDistributionChart';

// Mock data for platform distribution
const platformData = [
  { name: 'Spotify', value: 45 },
  { name: 'Apple Music', value: 25 },
  { name: 'YouTube Music', value: 15 },
  { name: 'Amazon Music', value: 10 },
  { name: 'Other', value: 5 },
];

interface OverviewTabContentProps {
  data?: any;
  timeRange?: string;
}

const OverviewTabContent = ({ data, timeRange }: OverviewTabContentProps = {}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <RoyaltyChart data={royaltyData} title="" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PlatformDistributionChart data={platformData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTabContent;
