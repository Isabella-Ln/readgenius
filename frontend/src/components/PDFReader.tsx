import { useState, useEffect } from 'react'
import type { Book } from '../App'

interface PDFReaderProps {
  book: Book
  onBack: () => void
  onWordClick: (word: string, event: React.MouseEvent) => void
  onTextSelect: (text: string) => void
}

export default function PDFReader({ book, onBack, onWordClick, onTextSelect }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [rotation, setRotation] = useState<number>(0)
  const [pdfData, setPdfData] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load PDF data from IndexedDB on mount
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const db = await openDB()
        const tx = db.transaction('books', 'readonly')
        const store = tx.objectStore('books')
        const request = store.get(book.id)
        
        const data = await new Promise<any>((resolve, reject) => {
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
        
        if (data && data.data) {
          // Convert to base64 for iframe
          const uint8Array = data.data instanceof Uint8Array 
            ? data.data 
            : new Uint8Array(data.data)
          
          // Create blob URL
          const blob = new Blob([uint8Array], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          setPdfData(url)
        } else {
          setError('PDF data not found')
        }
      } catch (err) {
        console.error('Failed to load PDF:', err)
        setError('Failed to load PDF: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    
    loadPdf()
    
    // Cleanup
    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData)
      }
    }
  }, [book.id])

  // Navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page)
    }
  }

  // Rotate
  const rotateClockwise = () => {
    setRotation(r => (r + 90) % 360)
  }

  // Handle AI explain
  const handleAIExplain = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 5) {
      onTextSelect(selection.toString().trim())
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Library</span>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="font-medium text-slate-900 truncate max-w-xs sm:max-w-md">{book.name}</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* AI Explain Button */}
          <button
            onClick={handleAIExplain}
            className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">问AI</span>
          </button>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs text-slate-600 min-w-[2.5rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(2, s + 0.2))}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* PDF Content - Use iframe for simplicity */}
      <div className="flex-1 overflow-hidden bg-slate-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading PDF...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </div>
        ) : pdfData ? (
          <iframe
            src={pdfData}
            className="w-full h-full border-0"
            title={book.name}
            style={{ 
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600">No PDF data</p>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="fixed bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg z-50">
        选中文字后点"问AI"按钮 | 使用缩放调整大小
      </div>
    </div>
  )
}

// IndexedDB helpers
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ReadGenius', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' })
      }
    }
  })
}
