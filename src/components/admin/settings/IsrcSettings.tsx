
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";
import { AlertCircle, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-extensions/Card";

// Mock data - in a real app, this would come from an API
const mockIsrcSettings = {
  countryCode: "US",
  registrantCode: "ABC",
  year: new Date().getFullYear().toString().substring(2),
  lastSequence: 123,
};

const isrcSchema = z.object({
  countryCode: z.string().length(2, { message: "Country code must be exactly 2 characters" }),
  registrantCode: z.string().length(3, { message: "Registrant code must be exactly 3 characters" }),
  year: z.string().length(2, { message: "Year must be exactly 2 digits" })
    .regex(/^[0-9]{2}$/, { message: "Year must consist of 2 digits" }),
  lastSequence: z.coerce.number().int().min(0).max(99999),
});

type IsrcFormValues = z.infer<typeof isrcSchema>;

export function IsrcSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrefix, setCurrentPrefix] = useState(`${mockIsrcSettings.countryCode}-${mockIsrcSettings.registrantCode}-${mockIsrcSettings.year}`);
  const [lastAssigned, setLastAssigned] = useState(mockIsrcSettings.lastSequence);

  const form = useForm<IsrcFormValues>({
    resolver: zodResolver(isrcSchema),
    defaultValues: {
      countryCode: mockIsrcSettings.countryCode,
      registrantCode: mockIsrcSettings.registrantCode,
      year: mockIsrcSettings.year,
      lastSequence: mockIsrcSettings.lastSequence,
    },
  });

  const onSubmit = (values: IsrcFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, this would make an API call to update the ISRC settings
    console.log("Updating ISRC settings:", values);
    
    setTimeout(() => {
      setCurrentPrefix(`${values.countryCode}-${values.registrantCode}-${values.year}`);
      setLastAssigned(values.lastSequence);
      setIsSubmitting(false);
      toast.success("ISRC settings updated successfully");
    }, 1000);
  };

  // Generate an example ISRC code based on the current settings
  const exampleIsrc = `${form.watch("countryCode")}-${form.watch("registrantCode")}-${form.watch("year")}-${(form.watch("lastSequence") + 1).toString().padStart(5, "0")}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ISRC Configuration</CardTitle>
          <CardDescription>
            Configure the International Standard Recording Code (ISRC) format for automatic assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">Current ISRC Format</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Prefix: <span className="font-mono">{currentPrefix}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Last assigned sequence: <span className="font-mono">{lastAssigned.toString().padStart(5, "0")}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Next ISRC to be assigned: <span className="font-mono">{currentPrefix}-{(lastAssigned + 1).toString().padStart(5, "0")}</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code (CC)</FormLabel>
                      <FormControl>
                        <Input placeholder="US" {...field} maxLength={2} className="uppercase" />
                      </FormControl>
                      <FormDescription>
                        2-letter ISO country code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registrantCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registrant Code (XXX)</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC" {...field} maxLength={3} className="uppercase" />
                      </FormControl>
                      <FormDescription>
                        3-character registrant identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year (YY)</FormLabel>
                      <FormControl>
                        <Input placeholder="24" {...field} maxLength={2} />
                      </FormControl>
                      <FormDescription>
                        Last 2 digits of the year
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="lastSequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Assigned Sequence Number</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={99999} {...field} />
                    </FormControl>
                    <FormDescription>
                      The last used sequence number (0-99999)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-md">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    Preview: The next ISRC to be assigned will be <span className="font-mono font-bold">{exampleIsrc}</span>
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                isLoading={isSubmitting}
                leftIcon={<Save className="h-4 w-4" />}
                className="mt-2"
              >
                Save ISRC Configuration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
