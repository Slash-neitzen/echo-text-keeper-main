
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Save, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/storage-utils';
import WordCounter from '@/components/WordCounter';

interface VoiceRecorderProps {
  onSaveNote: (title: string, content: string) => void;
  isEditing: boolean;
  initialTitle?: string;
  initialContent?: string;
  onCancel?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSaveNote,
  isEditing,
  initialTitle = '',
  initialContent = '',
  onCancel
}) => {
  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [noteContent, setNoteContent] = useState(initialContent);
  const { toast } = useToast();
  
  const { 
    text, 
    isListening, 
    startListening, 
    stopListening, 
    hasRecognitionSupport, 
    error,
    resetText
  } = useSpeechRecognition();

  useEffect(() => {
    if (text) {
      setNoteContent(prev => prev + text);
      resetText(); // Clear the text in the hook after adding it to noteContent
    }
  }, [text, resetText]);

  const handleStartRecording = () => {
    if (!hasRecognitionSupport) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note.",
        variant: "destructive"
      });
      return;
    }
    
    onSaveNote(noteTitle.trim(), noteContent.trim());
    
    if (!isEditing) {
      setNoteTitle('');
      setNoteContent('');
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(noteContent);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Note content copied to clipboard successfully.",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setNoteContent(content);
        // Set the title to the filename without extension
        if (!noteTitle) {
          const filename = file.name.replace(/\.[^/.]+$/, "");
          setNoteTitle(filename);
        }
        
        toast({
          title: "File imported",
          description: `Successfully imported content from ${file.name}`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import file content.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 md:p-6">
      <div className="mb-4">
        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">
          Note Title
        </label>
        <Input
          id="note-title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="note-content" className="block text-sm font-medium text-gray-700">
            Note Content
          </label>
          <WordCounter content={noteContent} />
        </div>
        <Textarea
          id="note-content"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Start speaking or type your note here..."
          className="min-h-[150px] w-full resize-none"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {isListening ? (
          <Button 
            onClick={handleStopRecording}
            variant="destructive"
            className="rounded-2xl"
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          <Button 
            onClick={handleStartRecording}
            variant="default"
            className={`rounded-2xl bg-electric-blue hover:bg-electric-blue/90`}
            disabled={isListening}
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        )}
        
        <Button 
          onClick={handleSaveNote}
          variant="outline" 
          className="rounded-2xl border-electric-blue text-electric-blue hover:bg-electric-blue/10"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Note
        </Button>
        
        <Button 
          onClick={handleCopyToClipboard}
          variant="outline" 
          className="rounded-2xl"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        
        <Button 
          variant="outline" 
          className="rounded-2xl"
          asChild
        >
          <label htmlFor="import-file" className="cursor-pointer">
            Import .txt
            <input
              type="file"
              id="import-file"
              accept=".txt"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </Button>
        
        {onCancel && (
          <Button 
            onClick={onCancel}
            variant="ghost" 
            className="rounded-2xl"
          >
            Cancel
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-500">
          {error}
        </div>
      )}
      
      {!hasRecognitionSupport && (
        <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-2 rounded">
          Speech recognition is not supported in your browser. Please try using Chrome or Edge.
        </div>
      )}
      
      {isListening && (
        <div className="mt-4 flex items-center gap-2 text-sm text-electric-blue">
          <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
          Listening... Speak now
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
