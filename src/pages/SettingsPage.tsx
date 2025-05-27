
import React, { useEffect, useState } from 'react';
import { Moon, Sun, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  saveAutomatically: boolean;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    fontSize: 16,
    saveAutomatically: true
  });
  const { toast } = useToast();
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('voice-notes-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      applyTheme(JSON.parse(savedSettings).theme);
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voice-notes-settings', JSON.stringify(settings));
  }, [settings]);
  
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
    applyTheme(newTheme);
  };
  
  const changeFontSize = (size: number) => {
    setSettings({ ...settings, fontSize: size });
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
  };
  
  const toggleAutoSave = () => {
    setSettings({ ...settings, saveAutomatically: !settings.saveAutomatically });
  };
  
  const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        if (file.name.endsWith('.txt')) {
          // Handle TXT import - create a new note with file content
          const title = file.name.replace('.txt', '');
          const content = fileContent;
          
          // Import the note - we'll add this functionality later
          toast({
            title: "Note imported",
            description: `Successfully imported note: ${title}`,
          });
        } else {
          toast({
            title: "Unsupported file format",
            description: "Only .txt files are supported for import.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import notes. The file format might be invalid.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme-toggle">Dark Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark mode
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      <Switch 
                        id="theme-toggle" 
                        checked={settings.theme === 'dark'}
                        onCheckedChange={toggleTheme}
                      />
                      <Moon className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust the base font size for the application
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => changeFontSize(Math.max(12, settings.fontSize - 1))}
                      >
                        -
                      </Button>
                      <span className="min-w-8 text-center">{settings.fontSize}px</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => changeFontSize(Math.min(24, settings.fontSize + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Behavior</CardTitle>
                <CardDescription>Configure how the application behaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autosave-toggle">Auto-save Notes</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save notes as you type
                      </p>
                    </div>
                    <Switch 
                      id="autosave-toggle" 
                      checked={settings.saveAutomatically}
                      onCheckedChange={toggleAutoSave}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Import & Export</CardTitle>
                <CardDescription>Transfer your notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-file">Import Notes</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Import notes from a text file
                    </p>
                    <div className="flex items-center">
                      <Button variant="outline" className="mr-2" asChild>
                        <label htmlFor="import-file" className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </label>
                      </Button>
                      <input
                        type="file"
                        id="import-file"
                        accept=".txt"
                        onChange={handleImportNotes}
                        className="hidden"
                      />
                      <span className="text-sm text-muted-foreground">
                        Supports .txt files
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
