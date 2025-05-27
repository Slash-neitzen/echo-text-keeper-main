
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, FileText, Settings, BarChart4, Search } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Voice-to-Text Notes App</h1>
            <p className="text-xl text-gray-600 mb-6">
              Capture your thoughts effortlessly with our voice-powered note-taking tool
            </p>
            <div className="w-20 h-20 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mic className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-md transition-shadow duration-200">
              <FileText className="h-12 w-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create Notes</h3>
              <p className="text-gray-600 mb-4">Speak or type to create beautiful notes instantly</p>
              <Link to="/notes/create">
                <Button className="w-full bg-electric-blue hover:bg-electric-blue/90">
                  Create Note
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-md transition-shadow duration-200">
              <Search className="h-12 w-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search Notes</h3>
              <p className="text-gray-600 mb-4">Find your notes quickly with powerful search</p>
              <Link to="/search">
                <Button className="w-full bg-electric-blue hover:bg-electric-blue/90">
                  Search
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-md transition-shadow duration-200">
              <BarChart4 className="h-12 w-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">View insights about your note-taking habits</p>
              <Link to="/analytics">
                <Button className="w-full bg-electric-blue hover:bg-electric-blue/90">
                  View Stats
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/notes">
              <Button variant="outline" size="lg" className="rounded-2xl border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                <FileText className="mr-2 h-5 w-5" />
                View All Notes
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" size="lg" className="rounded-2xl">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 p-6 bg-gray-100 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
            <p className="text-gray-700">
              This Voice-to-Text Notes App was developed as part of a Java-based Mini Project
              (Course Code: 22CSE48, Semester IV, March–June 2025).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
