
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'voice-notes-app';

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

export const getNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error retrieving notes from localStorage:', error);
    return [];
  }
};

export const createNote = (title: string, content: string = ''): Note => {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

export const updateNote = (notes: Note[], id: string, updates: Partial<Note>): Note[] => {
  return notes.map(note => {
    if (note.id === id) {
      return {
        ...note,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return note;
  });
};

export const deleteNote = (notes: Note[], id: string): Note[] => {
  return notes.filter(note => note.id !== id);
};

export const getNoteById = (notes: Note[], id: string): Note | undefined => {
  return notes.find(note => note.id === id);
};

export const exportNoteAsTxt = (note: Note): void => {
  const element = document.createElement('a');
  const fileContent = `${note.title}\n\n${note.content}`;
  const file = new Blob([fileContent], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying text to clipboard:', error);
    return false;
  }
};

export const importTxtFile = (file: File): Promise<{ title: string, content: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const title = file.name.replace('.txt', '').replace(/_/g, ' ');
        resolve({ title, content });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
