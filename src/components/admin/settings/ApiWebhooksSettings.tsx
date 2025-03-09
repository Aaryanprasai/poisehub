
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Plus, Trash } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const webhookFormSchema = z.object({
  webhooks: z.array(
    z.object({
      name: z.string().min(1, { message: "Webhook name is required" }),
      url: z.string().url({ message: "Please enter a valid URL" }),
      events: z.array(z.string()).min(1, { message: "Select at least one event" }),
      active: z.boolean(),
      secretKey: z.string().optional(),
    })
  ),
});

type WebhookFormValues = z.infer<typeof webhookFormSchema>;

const eventOptions = [
  { label: "User Registration", value: "user.created" },
  { label: "Track Upload", value: "track.uploaded" },
  { label: "Track Approved", value: "track.approved" },
  { label: "Track Rejected", value: "track.rejected" },
  { label: "Royalty Payment", value: "royalty.paid" },
  { label: "Verification Status Change", value: "verification.updated" },
];

export function ApiWebhooksSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  // In a real app, these would come from an API
  const defaultValues: WebhookFormValues = {
    webhooks: [
      {
        name: "User Notifications",
        url: "https://example.com/webhooks/users",
        events: ["user.created", "verification.updated"],
        active: true,
        secretKey: "whsec_abcdefg123456",
      },
      {
        name: "Track Processing",
        url: "https://example.com/webhooks/tracks",
        events: ["track.uploaded", "track.approved", "track.rejected"],
        active: true,
        secretKey: "whsec_hijklmn789012",
      },
    ],
  };
  
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = form.useFieldArray({
    name: "webhooks",
  });

  const onSubmit = async (values: WebhookFormValues) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // In a real app, this would be an API call
      console.log("Webhooks updated:", values);
      toast.success("Webhooks updated successfully");
    } catch (error) {
      toast.error("Failed to update webhooks");
    } finally {
      setIsSaving(false);
    }
  };

  const addWebhook = () => {
    append({
      name: "",
      url: "",
      events: [],
      active: true,
      secretKey: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Webhook #{index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`webhooks.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter webhook name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`webhooks.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name={`webhooks.${index}.events`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Events</FormLabel>
                    <FormDescription>
                      Select the events that trigger this webhook
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {eventOptions.map((event) => (
                        <FormItem
                          key={event.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(event.value)}
                              onCheckedChange={(checked) => {
                                const updatedEvents = checked
                                  ? [...field.value, event.value]
                                  : field.value?.filter((val) => val !== event.value);
                                field.onChange(updatedEvents);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {event.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`webhooks.${index}.secretKey`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key (Optional)</FormLabel>
                      <FormDescription>
                        Used to verify webhook signatures
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Webhook secret key" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`webhooks.${index}.active`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable or disable this webhook
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addWebhook}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        <Button 
          type="submit" 
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Webhook Settings
        </Button>
      </form>
    </Form>
  );
}
