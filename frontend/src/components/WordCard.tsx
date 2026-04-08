import { useState, useEffect } from 'react'
import type { WordDefinition } from '../App'

interface WordCardProps {
  word: string
  position: { x: number; y: number }
  onClose: () => void
  isLoading?: boolean
}

export default function WordCard({ word, position, onClose, isLoading }: WordCardProps) {
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPhonetic, setShowPhonetic] = useState(false)

  // Fetch definition
  useEffect(() => {
    const fetchDefinition = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try API first
        const response = await fetch('/api/dictionary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: word.toLowerCase() })
        })
        
        if (response.ok) {
          const data = await response.json()
          setDefinition(data)
        } else {
          // Fallback to free dictionary API
          const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
          if (dictResponse.ok) {
            const data = await dictResponse.json()
            if (data[0]) {
              const entry = data[0]
              setDefinition({
                word: entry.word,
                phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
                definition: entry.meanings?.[0]?.definitions?.[0]?.definition || '',
                examples: entry.meanings?.[0]?.definitions?.[0]?.example ? 
                  [entry.meanings[0].definitions[0].example] : [],
                etymology: entry.origin
              })
            }
          } else {
            setError('Word not found')
          }
        }
      } catch (err) {
        // Try fallback API
        try {
          const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
          if (dictResponse.ok) {
            const data = await dictResponse.json()
            if (data[0]) {
              const entry = data[0]
              setDefinition({
                word: entry.word,
                phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
                definition: entry.meanings?.[0]?.definitions?.[0]?.definition || '',
                examples: entry.meanings?.[0]?.definitions?.[0]?.example ? 
                  [entry.meanings[0].definitions[0].example] : [],
                etymology: entry.origin
              })
            }
          } else {
            setError('Word not found')
          }
        } catch {
          setError('Failed to load definition')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchDefinition()
  }, [word])

  // Play pronunciation
  const playPronunciation = () => {
    const audio = new Audio()
    // Try to get audio from API or use fallback
    audio.src = `https://api.dictionaryapi.dev/media/pronunciations/en/${word.toLowerCase()}-1.mp3`
    audio.play().catch(() => {
      // Try Google TTS as fallback
      audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=tw-ob`
      audio.play().catch(() => {})
    })
  }

  // Calculate position
  const cardStyle = {
    position: 'fixed' as const,
    left: Math.min(position.x, window.innerWidth - 380),
    top: Math.max(20, position.y - 20),
    transform: 'translateX(-50%)',
    zIndex: 1000
  }

  return (
    <div 
      className="w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={cardStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {loading ? (
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-32 mb-4" />
            <div className="h-4 bg-slate-100 rounded w-48 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">{error}</p>
          <p className="text-slate-400 text-sm mt-1">Try searching online</p>
        </div>
      ) : definition ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-indigo-500 px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{definition.word}</h2>
                {definition.phonetic && (
                  <p className="text-indigo-200 text-sm mt-1">{definition.phonetic}</p>
                )}
              </div>
              <button
                onClick={playPronunciation}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Definition */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Definition</span>
              <p className="text-slate-800 mt-1 leading-relaxed">{definition.definition}</p>
            </div>

            {/* Examples */}
            {definition.examples.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Example</span>
                <p className="text-slate-600 italic mt-1 bg-slate-50 p-3 rounded-lg text-sm leading-relaxed">
                  "{definition.examples[0]}"
                </p>
              </div>
            )}

            {/* Etymology */}
            {definition.etymology && (
              <div className="border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Origin</span>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  {definition.etymology.length > 100 
                    ? definition.etymology.slice(0, 100) + '...' 
                    : definition.etymology}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  // Add to word list
                  const words = JSON.parse(localStorage.getItem('rg_word_list') || '[]')
                  if (!words.includes(definition.word)) {
                    words.push(definition.word)
                    localStorage.setItem('rg_word_list', JSON.stringify(words))
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                + Add to List
              </button>
              <button
                onClick={() => {
                  // Look up with AI
                  // This will trigger AI explanation
                }}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Ask AI
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
