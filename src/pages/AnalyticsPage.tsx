
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Note, getNotes } from '@/utils/storage-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = getNotes();
    setNotes(savedNotes);
  }, []);

  // Generate statistics
  const totalNotes = notes.length;
  const totalWords = notes.reduce((sum, note) => 
    sum + note.content.split(/\s+/).filter(word => word.length > 0).length, 0);
  const totalCharacters = notes.reduce((sum, note) => sum + note.content.length, 0);
  const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
  
  // Calculate note length distribution for bar chart
  const calculateNoteLengthDistribution = () => {
    const categories = [
      { name: '< 10 words', count: 0 },
      { name: '10-50 words', count: 0 },
      { name: '51-100 words', count: 0 },
      { name: '101-200 words', count: 0 },
      { name: '> 200 words', count: 0 }
    ];
    
    notes.forEach(note => {
      const wordCount = note.content.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 10) categories[0].count++;
      else if (wordCount <= 50) categories[1].count++;
      else if (wordCount <= 100) categories[2].count++;
      else if (wordCount <= 200) categories[3].count++;
      else categories[4].count++;
    });
    
    return categories;
  };

  // Calculate activity by day of week
  const calculateActivityByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const activityByDay = days.map(day => ({ name: day, count: 0 }));
    
    notes.forEach(note => {
      const dayOfWeek = new Date(note.createdAt).getDay();
      activityByDay[dayOfWeek].count++;
    });
    
    return activityByDay;
  };

  const noteLengthData = calculateNoteLengthDistribution();
  const activityByDayData = calculateActivityByDay();

  // For pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Notes Analytics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-electric-blue">{totalNotes}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Words</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-electric-blue">{totalWords}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-electric-blue">{totalCharacters}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg Words/Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-electric-blue">{avgWordsPerNote}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Note Length</TabsTrigger>
              <TabsTrigger value="activity">Activity by Day</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Note Length Distribution</CardTitle>
                  <CardDescription>Number of notes by word count range</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    {notes.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={noteLengthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0077FF" name="Notes" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No data available. Create some notes first.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Activity by Day</CardTitle>
                  <CardDescription>Number of notes created by day of week</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    {notes.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityByDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0077FF" name="Notes" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No data available. Create some notes first.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
