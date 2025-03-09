
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Colors for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFA', '#FB7185'];

interface PlatformDistributionChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  showLabel?: boolean;
}

const PlatformDistributionChart = ({ 
  data, 
  height = 300,
  showLabel = true 
}: PlatformDistributionChartProps) => {
  return (
    <div className={`h-[${height}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabel}
            outerRadius={showLabel ? 150 : 80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformDistributionChart;
