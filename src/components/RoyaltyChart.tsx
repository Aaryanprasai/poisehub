
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { RoyaltyData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface RoyaltyChartProps {
  data: RoyaltyData[];
  title?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  isrcFilter?: string | null; // Add ISRC filter option
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border dark:bg-gray-800 dark:border-gray-700">
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

export function RoyaltyChart({ 
  data, 
  title = "Royalties", 
  className,
  height = 300,
  showLegend = true,
  isrcFilter = null
}: RoyaltyChartProps) {
  const chartData = useMemo(() => {
    // Filter by ISRC if provided (use normalized ISRC without hyphens)
    const filteredData = isrcFilter 
      ? data.filter(item => {
          const normalizedItemIsrc = item.isrc?.replace(/-/g, '');
          const normalizedFilter = isrcFilter.replace(/-/g, '');
          return normalizedItemIsrc === normalizedFilter;
        })
      : data;
      
    // Group by month and service
    const groupedData = filteredData.reduce((acc, item) => {
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
  }, [data, isrcFilter]);

  // Get unique services for creating bars
  const services = useMemo(() => {
    return Array.from(new Set(data.map(item => item.service)));
  }, [data]);

  // Colors for each service
  const colors = ["#38bdf8", "#fb7185", "#facc15", "#4ade80", "#a78bfa", "#f472b6", "#fb923c"];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className={`h-[${height}px] w-full`} style={{ height: `${height}px` }}>
          {chartData.length > 0 ? (
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
                {showLegend && <Legend />}
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
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No royalty data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
