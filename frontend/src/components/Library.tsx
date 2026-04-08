import { useState, useCallback, useRef } from 'react'
import type { Book } from '../App'

interface LibraryProps {
  books: Book[]
  onOpenBook: (book: Book) => void
  onImportBook: () => void
  setBooks: (books: Book[] | ((prev: Book[]) => Book[])) => void
}

export default function Library({ books, onOpenBook, onImportBook, setBooks }: LibraryProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    )
    
    if (files.length > 0) {
      await importFiles(files)
    }
  }, [])

  // Handle file input
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    )
    
    if (files.length > 0) {
      await importFiles(files)
    }
  }, [])

  // Import PDF files
  const importFiles = async (files: File[]) => {
    setImporting(true)
    
    try {
      for (const file of files) {
        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer()
        
        // Create book entry
        const book: Book = {
          id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.replace('.pdf', ''),
          addedAt: Date.now()
        }
        
        // Store in IndexedDB
        const db = await openDB()
        const tx = db.transaction('books', 'readwrite')
        
        // Convert ArrayBuffer to Uint8Array for better compatibility
        const uint8Array = new Uint8Array(arrayBuffer)
        
        await tx.objectStore('books').put({
          id: book.id,
          name: book.name,
          data: uint8Array,
          addedAt: book.addedAt
        })
        
        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
        
        // Update state directly instead of using onOpenBook
        // This prevents duplicate entries
        setBooks(prev => {
          // Check if book already exists
          if (prev.find(b => b.id === book.id)) {
            return prev
          }
          return [...prev, book]
        })
        
        // Save to local storage (book metadata only)
        const storedBooks = JSON.parse(localStorage.getItem('rg_books') || '[]')
        if (!storedBooks.find((b: Book) => b.id === book.id)) {
          storedBooks.push(book)
          localStorage.setItem('rg_books', JSON.stringify(storedBooks))
        }
      }
      
      // Don't auto-open, let user click to open
      alert(`成功导入 ${files.length} 本书！`)
    } catch (error) {
      console.error('Failed to import PDF:', error)
      alert('导入失败，请重试: ' + (error as Error).message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                ReadGenius
              </h1>
              <p className="text-slate-500 mt-1">AI 驱动的沉浸式阅读学习</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              导入 PDF
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {books.length === 0 ? (
          /* Empty State */
          <div
            className={`border-2 border-dashed rounded-3xl p-16 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              {isDragging ? '释放以上传' : '开始阅读'}
            </h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              拖拽 PDF 文件到这里，或点击下方按钮选择文件
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
            >
              选择 PDF 文件
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          /* Books Grid */
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              我的书架 ({books.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Add New */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] border-2 border-dashed border-slate-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-3 transition-colors group"
              >
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm text-slate-500 group-hover:text-primary transition-colors">
                  添加书籍
                </span>
              </button>
              
              {/* Existing Books */}
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => onOpenBook(book)}
                  className="aspect-[3/4] bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden transition-all group"
                >
                  <div className="h-3/4 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-4">
                    <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="p-3 text-left">
                    <h3 className="font-medium text-slate-800 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {book.name}
                    </h3>
                    {book.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Importing overlay */}
      {importing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">正在导入...</p>
          </div>
        </div>
      )}
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
