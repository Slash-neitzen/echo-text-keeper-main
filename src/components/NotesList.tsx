
import React, { useState } from 'react';
import { Edit, Trash2, Download, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, copyToClipboard, exportNoteAsTxt } from '@/utils/storage-utils';
import { exportNoteAsPdf } from '@/utils/pdf-utils';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEditNote, onDeleteNote }) => {
  const { toast } = useToast();
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const handleCopyToClipboard = async (note: Note) => {
    const success = await copyToClipboard(note.content);
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

  const handleExportAsTxt = (note: Note) => {
    exportNoteAsTxt(note);
    toast({
      title: "Note exported",
      description: "Note exported as text file successfully.",
    });
  };

  const handleExportAsPdf = async (note: Note) => {
    try {
      await exportNoteAsPdf(note);
      toast({
        title: "Note exported",
        description: "Note exported as PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export note as PDF.",
        variant: "destructive"
      });
    }
  };

  const toggleExpandNote = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  if (notes.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-soft">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No notes yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start by recording your first note or typing it directly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card key={note.id} className="shadow-soft hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-lg font-semibold truncate cursor-pointer hover:text-electric-blue"
              onClick={() => toggleExpandNote(note.id)}
            >
              {note.title}
            </CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={expandedNote === note.id ? "" : "line-clamp-3"}>
              {note.content || <span className="text-gray-400 italic">No content</span>}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditNote(note)}
              className="text-gray-600 hover:text-electric-blue"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCopyToClipboard(note)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportAsTxt(note)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as .txt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportAsPdf(note)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as .pdf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDeleteNote(note.id)}
              className="text-gray-600 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
