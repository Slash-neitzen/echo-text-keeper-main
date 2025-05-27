import { useState, useEffect, useCallback, useRef } from 'react';

// Define types for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

// Define a global type for the window object with the Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionHook {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
  resetText: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [text, setText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState<boolean>(false);
  
  // Use a ref to store the recognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      try {
        // Test if we can actually create an instance
        const testInstance = new SpeechRecognitionAPI();
        setHasRecognitionSupport(true);
        testInstance.abort(); // Clean up test instance
      } catch (err) {
        console.error('Speech recognition initialization error:', err);
        setHasRecognitionSupport(false);
        setError('Failed to initialize speech recognition');
      }
    } else {
      setHasRecognitionSupport(false);
      setError('Your browser does not support speech recognition. Please try Chrome or Edge.');
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    
    // Stop any existing recognition instance
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    
    try {
      const recognition = new SpeechRecognitionAPI();
      
      // Configure recognition settings
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Get results as user speaks
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setText(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event);
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone was found or microphone is disabled.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission was denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
          default:
            errorMessage = `Error: ${event.error}${event.message ? ` - ${event.message}` : ''}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
        
        // Attempt to restart if it wasn't manually stopped
        if (event.error === 'network' || event.error === 'no-speech') {
          setTimeout(() => {
            if (recognitionRef.current === recognition) {
              startListening();
            }
          }, 1000);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        // Attempt to restart if it wasn't manually stopped
        if (recognitionRef.current === recognition) {
          recognition.start();
        }
      };
      
      recognition.start();
      setIsListening(true);
      recognitionRef.current = recognition;
      
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Error starting speech recognition. Please refresh the page and try again.');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetText = useCallback(() => {
    setText('');
  }, []);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
    resetText
  };
}
