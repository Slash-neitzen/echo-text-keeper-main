
import { Note } from './storage-utils';

export const exportNoteAsPdf = async (note: Note): Promise<void> => {
  try {
    // Dynamically import jspdf only when needed
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(note.title, 20, 20);
    
    // Add content
    doc.setFontSize(12);
    
    // Split text into lines to handle word wrap
    const splitText = doc.splitTextToSize(note.content, 170);
    doc.text(splitText, 20, 30);
    
    // Save the PDF
    doc.save(`${note.title.replace(/\s+/g, '_')}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
