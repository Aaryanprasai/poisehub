
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import DemographicsChart from './DemographicsChart';

// Mock data for demographics
const ageData = [
  { name: '18-24', value: 35 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 15 },
  { name: '45+', value: 10 },
];

const genderData = [
  { name: 'Male', value: 55 },
  { name: 'Female', value: 42 },
  { name: 'Non-binary', value: 3 },
];

interface DemographicsTabContentProps {
  data?: any;
  timeRange?: string;
}

const DemographicsTabContent = ({ data, timeRange }: DemographicsTabContentProps = {}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <DemographicsChart data={ageData} title="Age Distribution" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <DemographicsChart data={genderData} title="Gender Distribution" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DemographicsTabContent;
