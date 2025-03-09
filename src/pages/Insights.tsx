
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/components/AppLayout';
import OverviewTabContent from '@/components/insights/OverviewTabContent';
import PlatformsTabContent from '@/components/insights/PlatformsTabContent';
import DemographicsTabContent from '@/components/insights/DemographicsTabContent';

const Insights = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Track your music performance across platforms</p>
        </div>

        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTabContent />
          </TabsContent>
          
          <TabsContent value="platforms">
            <PlatformsTabContent />
          </TabsContent>
          
          <TabsContent value="demographics">
            <DemographicsTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Insights;
