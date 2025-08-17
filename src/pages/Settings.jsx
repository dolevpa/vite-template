import React, { useState } from "react";
import { User } from "@/api/entities";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    theme: "light",
    searchPreferences: {
      useWeb: true,
      includeNews: true,
      includeAcademic: false
    },
    displayPreferences: {
      showSourcesInline: false,
      compactResults: false
    }
  });

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Load user settings if they exist
      if (userData.settings) {
        setSettings(userData.settings);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ settings });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchChange = (category, setting) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };

  const resetSettings = () => {
    setSettings({
      theme: "light",
      searchPreferences: {
        useWeb: true,
        includeNews: true,
        includeAcademic: false
      },
      displayPreferences: {
        showSourcesInline: false,
        compactResults: false
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          Settings
        </h1>
        <p className="text-gray-500">Customize your search experience</p>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
          <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
          <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Preferences</CardTitle>
              <CardDescription>Configure how search results are generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="use-web" className="font-medium">Web Results</Label>
                  <p className="text-sm text-gray-500">Include information from the web</p>
                </div>
                <Switch 
                  id="use-web" 
                  checked={settings.searchPreferences.useWeb}
                  onCheckedChange={() => handleSwitchChange("searchPreferences", "useWeb")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-news" className="font-medium">News Sources</Label>
                  <p className="text-sm text-gray-500">Include recent news in search results</p>
                </div>
                <Switch 
                  id="include-news" 
                  checked={settings.searchPreferences.includeNews}
                  onCheckedChange={() => handleSwitchChange("searchPreferences", "includeNews")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-academic" className="font-medium">Academic Content</Label>
                  <p className="text-sm text-gray-500">Include scholarly articles and research papers</p>
                </div>
                <Switch 
                  id="include-academic" 
                  checked={settings.searchPreferences.includeAcademic}
                  onCheckedChange={() => handleSwitchChange("searchPreferences", "includeAcademic")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how search results are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="font-medium">Theme</Label>
                <RadioGroup 
                  value={settings.theme} 
                  onValueChange={(value) => setSettings({...settings, theme: value})}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-sources" className="font-medium">Show Sources Inline</Label>
                  <p className="text-sm text-gray-500">Display source references alongside the content</p>
                </div>
                <Switch 
                  id="show-sources" 
                  checked={settings.displayPreferences.showSourcesInline}
                  onCheckedChange={() => handleSwitchChange("displayPreferences", "showSourcesInline")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-results" className="font-medium">Compact Results</Label>
                  <p className="text-sm text-gray-500">Use a more compact layout for search results</p>
                </div>
                <Switch 
                  id="compact-results" 
                  checked={settings.displayPreferences.compactResults}
                  onCheckedChange={() => handleSwitchChange("displayPreferences", "compactResults")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View and manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Name</Label>
                <p className="font-medium">{user?.full_name || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Account Type</Label>
                <p className="font-medium capitalize">{user?.role || "Standard"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={resetSettings}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        
        <Button 
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}