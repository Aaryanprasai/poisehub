
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { RoyaltyChart } from '@/components/RoyaltyChart';
import { RoyaltyData } from '@/lib/types';

interface EarningsChartProps {
  royaltyData: RoyaltyData[];
}

export function EarningsChart({ royaltyData }: EarningsChartProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Your royalty earnings across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <RoyaltyChart data={royaltyData} />
        </CardContent>
      </Card>
    </div>
  );
}
