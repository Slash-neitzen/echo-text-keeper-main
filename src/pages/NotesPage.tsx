
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotesList from '@/components/NotesList';
import { Note, getNotes, deleteNote } from '@/utils/storage-utils';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<'date-new' | 'date-old' | 'title-asc' | 'title-desc'>('date-new');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = getNotes();
    setNotes(sortNotes(savedNotes, sortType));
  }, [sortType]);

  const handleEditNote = (note: Note) => {
    navigate(`/notes/edit/${note.id}`);
  };

  const handleDeleteNote = (id: string) => {
    setDeleteNoteId(id);
  };

  const confirmDeleteNote = () => {
    if (deleteNoteId) {
      const updatedNotes = deleteNote(notes, deleteNoteId);
      setNotes(sortNotes(updatedNotes, sortType));
      setDeleteNoteId(null);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    }
  };

  const handleNewNote = () => {
    navigate('/notes/create');
  };

  const sortNotes = (notesToSort: Note[], sortBy: string) => {
    const sortedNotes = [...notesToSort];
    switch (sortBy) {
      case 'date-new':
        return sortedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'date-old':
        return sortedNotes.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      case 'title-asc':
        return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedNotes;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Notes</h1>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortType('date-new')}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortType('date-old')}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortType('title-asc')}>
                    Title (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortType('title-desc')}>
                    Title (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                onClick={handleNewNote}
                className="rounded-2xl bg-electric-blue hover:bg-electric-blue/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>
          
          <div className="note-container overflow-y-auto">
            <NotesList 
              notes={notes} 
              onEditNote={handleEditNote} 
              onDeleteNote={handleDeleteNote} 
            />
          </div>
        </div>
      </main>

      <AlertDialog open={!!deleteNoteId} onOpenChange={(open) => !open && setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNote}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotesPage;
