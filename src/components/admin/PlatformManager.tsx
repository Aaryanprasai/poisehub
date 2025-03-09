
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui-extensions/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, Package } from 'lucide-react';
import { useAdminContext } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PlatformFormData {
  id: string;
  name: string;
  logo: string;
}

export function PlatformManager() {
  const { distributionPlatforms, addPlatform, removePlatform } = useAdminContext();
  const [platforms, setPlatforms] = useState(distributionPlatforms);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlatform, setNewPlatform] = useState<PlatformFormData>({
    id: '',
    name: '',
    logo: ''
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    setPlatforms(distributionPlatforms);
  }, [distributionPlatforms]);

  const handleAddPlatform = () => {
    // Simple validation
    if (!newPlatform.id.trim() || !newPlatform.name.trim() || !newPlatform.logo.trim()) {
      toast.error('All fields are required');
      return;
    }

    if (platforms.some(p => p.id === newPlatform.id)) {
      toast.error('Platform ID already exists');
      return;
    }

    addPlatform(newPlatform);
    setShowAddDialog(false);
    resetForm();
    toast.success('Distribution platform added successfully');
  };

  const handleRemovePlatform = (id: string) => {
    removePlatform(id);
    toast.success('Platform removed successfully');
  };

  const resetForm = () => {
    setNewPlatform({
      id: '',
      name: '',
      logo: ''
    });
    setLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const logo = e.target.value;
    setNewPlatform({...newPlatform, logo});
    
    // Update logo preview
    if (logo.trim()) {
      setLogoPreview(logo);
    } else {
      setLogoPreview(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Distribution Platforms</h3>
        <Button onClick={() => setShowAddDialog(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Platform
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {platforms.map((platform) => (
            <TableRow key={platform.id}>
              <TableCell>
                <div className="h-10 w-20 flex items-center">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="h-8 max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x50?text=Error';
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{platform.name}</TableCell>
              <TableCell>{platform.id}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemovePlatform(platform.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {platforms.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No platforms configured
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add Distribution Platform
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform-id">Platform ID</Label>
                <Input 
                  id="platform-id" 
                  placeholder="e.g., spotify"
                  value={newPlatform.id}
                  onChange={(e) => setNewPlatform({...newPlatform, id: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier, lowercase with underscores
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input 
                  id="platform-name" 
                  placeholder="e.g., Spotify"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform-logo">Logo URL</Label>
              <Input 
                id="platform-logo" 
                placeholder="https://example.com/logo.png"
                value={newPlatform.logo}
                onChange={handleLogoChange}
              />
              <p className="text-xs text-muted-foreground">
                Direct link to platform logo image (SVG or PNG recommended)
              </p>
            </div>

            {logoPreview && (
              <div className="border rounded-md p-4 bg-muted/20">
                <p className="text-sm mb-2">Logo Preview:</p>
                <div className="h-16 flex items-center justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Invalid+URL';
                      toast.error('Unable to load image from the provided URL');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                setShowAddDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPlatform}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
