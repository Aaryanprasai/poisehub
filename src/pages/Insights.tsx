
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from '@/components/AppLayout';
import OverviewTabContent from '@/components/insights/OverviewTabContent';
import PlatformsTabContent from '@/components/insights/PlatformsTabContent';
import DemographicsTabContent from '@/components/insights/DemographicsTabContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Insights = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState<any>(null);
  const { toast } = useToast();

  // Fetch insights data from Supabase
  useEffect(() => {
    const fetchInsightsData = async () => {
      setIsLoading(true);
      try {
        // Example: fetch from track_streams table
        // You can modify this to fetch from your actual tables
        const { data, error } = await supabase
          .from('track_streams')
          .select('*')
          .order('stream_date', { ascending: false });
          
        if (error) throw error;
        
        setInsightsData(data || []);
      } catch (error) {
        console.error('Error fetching insights data:', error);
        toast({
          title: "Error loading insights",
          description: "Failed to load your insights data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsightsData();
  }, [timeRange]);

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
            <p className="text-muted-foreground">Track your music performance across platforms</p>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 flex justify-center items-center">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading insights data...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </AppLayout>
  );
};

export default Insights;
