
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface FormTabsProps {
  currentTab: string;
  setCurrentTab: (value: string) => void;
  detailsContent: ReactNode;
  filesContent: ReactNode;
  distributionContent: ReactNode;
  rightsContent: ReactNode;
}

export function FormTabs({
  currentTab,
  setCurrentTab,
  detailsContent,
  filesContent,
  distributionContent,
  rightsContent
}: FormTabsProps) {
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="details">Track Details</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
        <TabsTrigger value="rights">Rights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-6">
        {detailsContent}
      </TabsContent>
      
      <TabsContent value="files" className="space-y-6">
        {filesContent}
      </TabsContent>
      
      <TabsContent value="distribution" className="space-y-6">
        {distributionContent}
      </TabsContent>
      
      <TabsContent value="rights" className="space-y-6">
        {rightsContent}
      </TabsContent>
    </Tabs>
  );
}
