
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

const SearchPage = () => {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load all notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = getNotes();
    setAllNotes(savedNotes);
  }, []);

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allNotes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
    
    setFilteredNotes(results);
  }, [searchQuery, allNotes]);

  const handleEditNote = (note: Note) => {
    navigate(`/notes/edit/${note.id}`);
  };

  const handleDeleteNote = (id: string) => {
    setDeleteNoteId(id);
  };

  const confirmDeleteNote = () => {
    if (deleteNoteId) {
      const updatedNotes = deleteNote(allNotes, deleteNoteId);
      setAllNotes(updatedNotes);
      
      // Also update filtered notes
      setFilteredNotes(prevFiltered => 
        prevFiltered.filter(note => note.id !== deleteNoteId)
      );
      
      setDeleteNoteId(null);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Search Notes</h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="note-container overflow-y-auto">
            {searchQuery.trim() === '' ? (
              <div className="text-center p-8 bg-white rounded-2xl shadow-soft">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Start searching</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a search term to find notes by title or content.
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl shadow-soft">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No notes matching "{searchQuery}" were found.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
                <NotesList 
                  notes={filteredNotes} 
                  onEditNote={handleEditNote} 
                  onDeleteNote={handleDeleteNote} 
                />
              </>
            )}
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

export default SearchPage;
