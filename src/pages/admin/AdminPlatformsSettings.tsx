
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformManager } from '@/components/admin/PlatformManager';
import { CodeGenerationSettings } from '@/components/admin/CodeGenerationSettings';
import { Package, Barcode } from 'lucide-react';

export default function AdminPlatformsSettings() {
  return (
    <AdminLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform & Code Settings</h1>
            <p className="text-muted-foreground">
              Manage distribution platforms and code generation systems
            </p>
          </div>
        </div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="platforms" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Distribution Platforms
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              ISRC/UPC Generation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Platform Management</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <CardTitle>Code Generation Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeGenerationSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
