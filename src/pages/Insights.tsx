
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
import { useAuth } from '@/contexts/AuthContext';

// Define the expected data structure
interface InsightsData {
  streams: any[];
  royalties: any[];
  tracks: any[];
}

const Insights = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to calculate date range based on selected time range
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  // Fetch insights data from Supabase
  useEffect(() => {
    const fetchInsightsData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const dateRange = getDateRange();
        
        // Get the user's tracks first
        const { data: userTracks, error: tracksError } = await supabase
          .from('tracks')
          .select('id, title, artist')
          .eq('user_id', user.id);
          
        if (tracksError) throw tracksError;
        
        if (!userTracks || userTracks.length === 0) {
          setInsightsData({
            streams: [],
            royalties: [],
            tracks: []
          });
          return;
        }
        
        const trackIds = userTracks.map(track => track.id);
        
        // Get stream data for the user's tracks
        const { data: streamData, error: streamError } = await supabase
          .from('track_streams')
          .select('*, tracks(title, artist)')
          .in('track_id', trackIds)
          .gte('stream_date', dateRange.start)
          .lte('stream_date', dateRange.end)
          .order('stream_date', { ascending: false });
          
        if (streamError) throw streamError;
        
        // Get royalty data for the user
        const { data: royaltyData, error: royaltyError } = await supabase
          .from('royalty_payments')
          .select('*, tracks(title, artist)')
          .eq('artist_id', user.id)
          .gte('payment_date', dateRange.start)
          .lte('payment_date', dateRange.end)
          .order('payment_date', { ascending: false });
          
        if (royaltyError) throw royaltyError;
        
        setInsightsData({
          streams: streamData || [],
          royalties: royaltyData || [],
          tracks: userTracks || []
        });
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
  }, [timeRange, user, toast]);

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
        ) : !insightsData || (insightsData.streams.length === 0 && insightsData.royalties.length === 0) ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No data available for the selected time period.</p>
              {insightsData?.tracks.length === 0 && (
                <p className="text-muted-foreground mt-2">Upload tracks to start tracking insights.</p>
              )}
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
              <OverviewTabContent data={insightsData} timeRange={timeRange} />
            </TabsContent>
            
            <TabsContent value="platforms">
              <PlatformsTabContent data={insightsData} timeRange={timeRange} />
            </TabsContent>
            
            <TabsContent value="demographics">
              <DemographicsTabContent data={insightsData} timeRange={timeRange} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default Insights;
