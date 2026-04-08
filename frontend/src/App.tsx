import { useState, useRef, useCallback, useEffect } from 'react'
import PDFReader from './components/PDFReader'
import WordCard from './components/WordCard'
import AIChat from './components/AIChat'
import Library from './components/Library'
import { useLocalStorage } from './hooks/useLocalStorage'

export interface SelectedText {
  text: string
  x: number
  y: number
}

export interface WordDefinition {
  word: string
  phonetic?: string
  definition: string
  examples: string[]
  etymology?: string
}

export interface Book {
  id: string
  name: string
  addedAt: number
  lastRead?: number
  progress?: number
}

function App() {
  const [view, setView] = useState<'library' | 'reader'>('library')
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [selectedText, setSelectedText] = useState<SelectedText | null>(null)
  const [showWordCard, setShowWordCard] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useLocalStorage<Book[]>('rg_books', [])
  const [wordHistory, setWordHistory] = useLocalStorage<string[]>('rg_word_history', [])
  const selectionRef = useRef<Selection | null>(null)

  // Handle text selection - show AI chat
  const handleTextSelect = useCallback((text: string) => {
    setSelectedText({
      text,
      x: window.innerWidth / 2,
      y: 100
    })
    setShowWordCard(false)
    setShowChat(true)
  }, [])

  // Handle word click (single word lookup)
  const handleWordClick = useCallback(async (word: string, event: React.MouseEvent | MouseEvent) => {
    if (event) {
      event.preventDefault()
    }
    
    setSelectedText({
      text: word,
      x: 'clientX' in event ? event.clientX : 0,
      y: 'clientY' in event ? event.clientY : 0
    })
    setIsLoading(true)
    setShowWordCard(true)
    setShowChat(false)
    
    try {
      const response = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      })
      
      if (response.ok) {
        const data = await response.json()
        setWordHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 100))
      }
    } catch (error) {
      console.error('Dictionary lookup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setWordHistory])

  // Handle text explanation (AI)
  const handleExplainText = useCallback(async (text: string) => {
    setShowWordCard(false)
    setShowChat(true)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Handle response
      }
    } catch (error) {
      console.error('Explanation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Open book
  const handleOpenBook = useCallback((book: Book) => {
    setCurrentBook(book)
    setView('reader')
  }, [])

  // Back to library
  const handleBack = useCallback(() => {
    setView('library')
    setCurrentBook(null)
  }, [])

  // Close popups
  const handleClosePopups = useCallback(() => {
    setShowWordCard(false)
    setShowChat(false)
    setSelectedText(null)
    if (selectionRef.current) {
      selectionRef.current.removeAllRanges()
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'library' ? (
        <Library 
          books={books} 
          onOpenBook={handleOpenBook}
          onImportBook={() => {
            // File input handled in Library component
          }}
          setBooks={setBooks}
        />
      ) : (
        <PDFReader
          book={currentBook!}
          onBack={handleBack}
          onTextSelect={handleTextSelect}
          onWordClick={handleWordClick}
        />
      )}

      {/* Word Card Popup */}
      {showWordCard && selectedText && (
        <WordCard
          word={selectedText.text}
          position={{ x: selectedText.x, y: selectedText.y }}
          onClose={handleClosePopups}
          isLoading={isLoading}
        />
      )}

      {/* AI Chat Panel */}
      {showChat && selectedText && (
        <AIChat
          context={selectedText.text}
          position={{ x: selectedText.x, y: selectedText.y }}
          onClose={handleClosePopups}
        />
      )}

      {/* Click outside to close */}
      {(showWordCard || showChat) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClosePopups}
        />
      )}
    </div>
  )
}

export default App
