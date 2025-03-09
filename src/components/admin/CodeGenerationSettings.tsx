
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui-extensions/Button";
import { useAdminContext } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Save, RefreshCw } from 'lucide-react';

export function CodeGenerationSettings() {
  const { codeGenerationSettings, updateCodeGenerationSettings } = useAdminContext();
  const [settings, setSettings] = useState(codeGenerationSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSettings(codeGenerationSettings);
  }, [codeGenerationSettings]);

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Simulate saving delay
    setTimeout(() => {
      updateCodeGenerationSettings(settings);
      setIsSubmitting(false);
      toast.success('Code generation settings updated successfully');
    }, 800);
  };

  const handleGenerateExample = (type: 'isrc' | 'upc') => {
    const examples: {[key: string]: string} = {
      isrc: generateExampleISRC(settings.isrc),
      upc: generateExampleUPC(settings.upc)
    };
    
    toast.success(`Example ${type.toUpperCase()}: ${examples[type]}`);
  };

  const generateExampleISRC = (isrcSettings: any) => {
    if (!isrcSettings.autoGenerate) return 'Auto-generation disabled';
    
    const prefix = isrcSettings.countryCode + isrcSettings.registrantCode;
    const year = new Date().getFullYear().toString().substring(2); // Get last 2 digits of year
    const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    
    return `${prefix}${year}${random}`;
  };

  const generateExampleUPC = (upcSettings: any) => {
    if (!upcSettings.autoGenerate) return 'Auto-generation disabled';
    
    const prefix = upcSettings.prefix;
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Simple check digit calculation
    const digits = (prefix + random).split('').map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += i % 2 === 0 ? digits[i] * 3 : digits[i];
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return `${prefix}${random}${checkDigit}`;
  };

  return (
    <div className="space-y-8">
      <Accordion type="single" collapsible defaultValue="isrc">
        <AccordionItem value="isrc">
          <AccordionTrigger>ISRC Code Generation Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isrc-enabled">Auto-generate ISRC codes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign ISRC codes to tracks that don't have one
                  </p>
                </div>
                <Switch
                  id="isrc-enabled"
                  checked={settings.isrc.autoGenerate}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, isrc: {...settings.isrc, autoGenerate: checked}})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="grid gap-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country-code">Country Code</Label>
                    <Input
                      id="country-code"
                      placeholder="e.g., US"
                      value={settings.isrc.countryCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        // Limit to 2 uppercase letters
                        if (/^[A-Z]{0,2}$/.test(value)) {
                          setSettings({
                            ...settings, 
                            isrc: {...settings.isrc, countryCode: value}
                          });
                        }
                      }}
                      maxLength={2}
                      disabled={!settings.isrc.autoGenerate}
                    />
                    <p className="text-xs text-muted-foreground">
                      2-letter country code (ISO 3166-1)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registrant-code">Registrant Code</Label>
                    <Input
                      id="registrant-code"
                      placeholder="e.g., ABC"
                      value={settings.isrc.registrantCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        // Limit to 3 uppercase letters
                        if (/^[A-Z0-9]{0,3}$/.test(value)) {
                          setSettings({
                            ...settings, 
                            isrc: {...settings.isrc, registrantCode: value}
                          });
                        }
                      }}
                      maxLength={3}
                      disabled={!settings.isrc.autoGenerate}
                    />
                    <p className="text-xs text-muted-foreground">
                      3-character registrant code assigned by local agency
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => handleGenerateExample('isrc')}
                  disabled={!settings.isrc.autoGenerate}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Generate Example ISRC
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="upc">
          <AccordionTrigger>UPC Code Generation Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="upc-enabled">Auto-generate UPC codes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign UPC codes to releases without one
                  </p>
                </div>
                <Switch
                  id="upc-enabled"
                  checked={settings.upc.autoGenerate}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, upc: {...settings.upc, autoGenerate: checked}})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="grid gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="upc-prefix">Company Prefix</Label>
                  <Input
                    id="upc-prefix"
                    placeholder="e.g., 12345"
                    value={settings.upc.prefix}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits
                      if (/^\d{0,5}$/.test(value)) {
                        setSettings({
                          ...settings, 
                          upc: {...settings.upc, prefix: value}
                        });
                      }
                    }}
                    maxLength={5}
                    disabled={!settings.upc.autoGenerate}
                  />
                  <p className="text-xs text-muted-foreground">
                    Company prefix (usually 5-6 digits) assigned by GS1
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => handleGenerateExample('upc')}
                  disabled={!settings.upc.autoGenerate}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Generate Example UPC
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          isLoading={isSubmitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
