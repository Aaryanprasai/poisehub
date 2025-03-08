
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { RoyaltyData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';

interface RoyaltyChartProps {
  data: RoyaltyData[];
  title?: string;
  className?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div 
            key={`tooltip-${index}`} 
            className="flex items-center gap-2"
            style={{ color: entry.fill }}
          >
            <span className="font-medium">{entry.name}:</span>
            <span>${entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function RoyaltyChart({ data, title = "Royalties", className }: RoyaltyChartProps) {
  const chartData = useMemo(() => {
    // Group by month and service
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.month]) {
        acc[item.month] = {};
      }
      
      if (!acc[item.month][item.service]) {
        acc[item.month][item.service] = 0;
      }
      
      acc[item.month][item.service] += item.amount;
      
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Convert to chart format
    return Object.entries(groupedData).map(([month, services]) => {
      return {
        month,
        ...services,
        total: Object.values(services).reduce((sum, amount) => sum + amount, 0),
      };
    });
  }, [data]);

  // Get unique services for creating bars
  const services = useMemo(() => {
    return Array.from(new Set(data.map(item => item.service)));
  }, [data]);

  // Colors for each service
  const colors = ["#38bdf8", "#fb7185", "#facc15", "#4ade80", "#a78bfa"];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {services.map((service, index) => (
                <Bar
                  key={service}
                  dataKey={service}
                  name={service}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  animationDuration={1000}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
