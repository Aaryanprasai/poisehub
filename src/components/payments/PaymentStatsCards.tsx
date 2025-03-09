
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';

interface PaymentStatsCardsProps {
  totalEarnings: number;
}

export function PaymentStatsCards({ totalEarnings }: PaymentStatsCardsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalEarnings * 0.2).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Will be transferred on the 15th
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            All time earnings
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Dec 15, 2023</div>
          <p className="text-xs text-muted-foreground">
            Estimated amount: ${(totalEarnings * 0.2).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
