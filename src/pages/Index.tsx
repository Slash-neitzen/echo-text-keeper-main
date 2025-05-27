
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoiceRecorder from '@/components/VoiceRecorder';
import { Note, getNotes, saveNotes, createNote, updateNote } from '@/utils/storage-utils';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  const { noteId } = useParams();
  const navigate = useNavigate();

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = getNotes();
    setNotes(savedNotes);
    
    // If editing an existing note, find it by ID
    if (noteId) {
      const noteToEdit = savedNotes.find(note => note.id === noteId);
      if (noteToEdit) {
        setEditingNote(noteToEdit);
      } else {
        // Note not found, navigate back to notes list
        toast({
          title: "Note not found",
          description: "The note you're trying to edit could not be found.",
          variant: "destructive"
        });
        navigate('/notes');
      }
    }
  }, [noteId, navigate, toast]);

  const handleSaveNote = (title: string, content: string) => {
    if (editingNote) {
      // Update existing note
      const updatedNotes = updateNote(notes, editingNote.id, { title, content });
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setEditingNote(null);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
      navigate('/notes');
    } else {
      // Create new note
      const newNote = createNote(title, content);
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      toast({
        title: "Note created",
        description: "Your new note has been created successfully.",
      });
      navigate('/notes');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    navigate('/notes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {editingNote ? 'Edit Note' : 'Create Note'}
          </h1>
          <VoiceRecorder 
            onSaveNote={handleSaveNote}
            isEditing={!!editingNote}
            initialTitle={editingNote?.title || ''}
            initialContent={editingNote?.content || ''}
            onCancel={editingNote ? handleCancelEdit : undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
