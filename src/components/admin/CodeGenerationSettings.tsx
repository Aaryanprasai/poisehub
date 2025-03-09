
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
import { 
  Save, 
  RefreshCw, 
  FileText, 
  Download, 
  Play, 
  Check, 
  X 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CodeGenerationSettings() {
  const { 
    codeGenerationSettings, 
    updateCodeGenerationSettings, 
    bulkGenerateISRC, 
    bulkGenerateUPC,
    validateISRC,
    validateUPC 
  } = useAdminContext();
  
  const [settings, setSettings] = useState(codeGenerationSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkResults, setBulkResults] = useState<string[]>([]);
  const [testInput, setTestInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const [codeType, setCodeType] = useState<'isrc' | 'upc'>('isrc');

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
    const year = isrcSettings.yearDigits || new Date().getFullYear().toString().substring(2);
    const serial = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    
    return `${prefix}${year}${serial}`;
  };

  const generateExampleUPC = (upcSettings: any) => {
    if (!upcSettings.autoGenerate) return 'Auto-generation disabled';
    
    const prefix = upcSettings.prefix;
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const digit = Math.floor(Math.random() * 10).toString();
    
    // Simple check digit calculation
    const digits = (prefix + random + digit).split('').map(Number);
    let oddSum = 0;
    let evenSum = 0;
    
    for (let i = 0; i < digits.length; i++) {
      if (i % 2 === 0) {
        oddSum += digits[i] * 3;
      } else {
        evenSum += digits[i];
      }
    }
    
    const totalSum = oddSum + evenSum;
    const checkDigit = (10 - (totalSum % 10)) % 10;
    
    return `${prefix}${random}${digit}${checkDigit}`;
  };

  const handleBulkGenerate = () => {
    if (bulkCount < 1 || bulkCount > 1000) {
      toast.error('Please enter a value between 1 and 1000');
      return;
    }
    
    const results = codeType === 'isrc' 
      ? bulkGenerateISRC(bulkCount)
      : bulkGenerateUPC(bulkCount);
    
    setBulkResults(results);
    toast.success(`Generated ${results.length} ${codeType.toUpperCase()} codes`);
  };

  const handleDownloadCodes = () => {
    if (bulkResults.length === 0) {
      toast.error('No codes to download');
      return;
    }
    
    const content = bulkResults.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeType}_codes_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleValidateCode = () => {
    if (!testInput) {
      toast.error('Please enter a code to validate');
      return;
    }
    
    const isValid = codeType === 'isrc' 
      ? validateISRC(testInput)
      : validateUPC(testInput);
    
    setValidationResult(isValid);
    
    if (isValid) {
      toast.success(`Valid ${codeType.toUpperCase()} code`);
    } else {
      toast.error(`Invalid ${codeType.toUpperCase()} code`);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          <TabsTrigger value="validate">Validation</TabsTrigger>
        </TabsList>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 mt-4">
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
                            // Limit to 3 uppercase letters/numbers
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="year-digits">Year Digits</Label>
                      <Input
                        id="year-digits"
                        placeholder="e.g., 23"
                        value={settings.isrc.yearDigits}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Limit to 2 digits
                          if (/^\d{0,2}$/.test(value)) {
                            setSettings({
                              ...settings, 
                              isrc: {...settings.isrc, yearDigits: value}
                            });
                          }
                        }}
                        maxLength={2}
                        disabled={!settings.isrc.autoGenerate}
                      />
                      <p className="text-xs text-muted-foreground">
                        2-digit year representation (default: current year)
                      </p>
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
        </TabsContent>
        
        {/* Bulk Generation Tab */}
        <TabsContent value="bulk" className="space-y-4 mt-4">
          <div className="p-4 border rounded-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Bulk Code Generation</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeType('isrc')}
                  className={codeType === 'isrc' ? 'bg-primary text-primary-foreground' : ''}
                >
                  ISRC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeType('upc')}
                  className={codeType === 'upc' ? 'bg-primary text-primary-foreground' : ''}
                >
                  UPC
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bulk-count">Number of Codes to Generate</Label>
                <Input
                  id="bulk-count"
                  type="number"
                  placeholder="Enter a number (1-1000)"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value) || 0)}
                  min="1"
                  max="1000"
                />
              </div>
              <Button
                onClick={handleBulkGenerate}
                leftIcon={<Play className="h-4 w-4" />}
              >
                Generate
              </Button>
            </div>
            
            {bulkResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Generated Codes ({bulkResults.length})</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCodes}
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
                
                <div className="h-60 overflow-y-auto border rounded-md p-2 bg-muted/20">
                  <pre className="text-xs">
                    {bulkResults.join('\n')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Validation Tab */}
        <TabsContent value="validate" className="space-y-4 mt-4">
          <div className="p-4 border rounded-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Code Validation</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCodeType('isrc');
                    setValidationResult(null);
                    setTestInput('');
                  }}
                  className={codeType === 'isrc' ? 'bg-primary text-primary-foreground' : ''}
                >
                  ISRC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCodeType('upc');
                    setValidationResult(null);
                    setTestInput('');
                  }}
                  className={codeType === 'upc' ? 'bg-primary text-primary-foreground' : ''}
                >
                  UPC
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code-input">Enter {codeType.toUpperCase()} Code to Validate</Label>
                <div className="flex gap-2">
                  <Input
                    id="code-input"
                    placeholder={codeType === 'isrc' ? 'e.g., USABC1234567' : 'e.g., 123456789012'}
                    value={testInput}
                    onChange={(e) => {
                      const value = codeType === 'isrc' 
                        ? e.target.value.toUpperCase() 
                        : e.target.value;
                      setTestInput(value);
                      setValidationResult(null);
                    }}
                  />
                  <Button
                    onClick={handleValidateCode}
                    leftIcon={<FileText className="h-4 w-4" />}
                  >
                    Validate
                  </Button>
                </div>
              </div>
              
              {validationResult !== null && (
                <div className={`p-4 border rounded-md ${validationResult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center">
                    {validationResult ? (
                      <>
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">Valid {codeType.toUpperCase()} code</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700 font-medium">Invalid {codeType.toUpperCase()} code</span>
                      </>
                    )}
                  </div>
                  
                  {codeType === 'isrc' && testInput && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Format: CC-XXX-YY-NNNNN</p>
                      {testInput.length >= 2 && <p>Country Code: {testInput.substring(0, 2)}</p>}
                      {testInput.length >= 5 && <p>Registrant: {testInput.substring(2, 5)}</p>}
                      {testInput.length >= 7 && <p>Year: {testInput.substring(5, 7)}</p>}
                      {testInput.length >= 12 && <p>Serial: {testInput.substring(7, 12)}</p>}
                    </div>
                  )}
                  
                  {codeType === 'upc' && testInput && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>12-digit UPC format</p>
                      {testInput.length >= 6 && <p>Prefix: {testInput.substring(0, 6)}</p>}
                      {testInput.length >= 11 && <p>Product Code: {testInput.substring(6, 11)}</p>}
                      {testInput.length >= 12 && <p>Check Digit: {testInput.substring(11, 12)}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
