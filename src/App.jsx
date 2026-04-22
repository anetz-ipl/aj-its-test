import { useState, useEffect } from 'react'
import EntryScreen from './screens/EntryScreen.jsx'
import ComicScreen from './screens/ComicScreen.jsx'
import PracticeScreen from './screens/PracticeScreen.jsx'
import ExitScreen from './screens/ExitScreen.jsx'

const SESSION_CEILING = 12
const MASTERY_THRESHOLD = 4
const PROBLEMS_PER_SESSION = 5

const initialSession = () => ({
  currentProblem: 0,
  results: [],        // per-problem slot: 'correct' | 'wrong' | undefined
  totalAttempted: 0,
  outcome: null,      // null | 'mastery' | 'needs-help'
})

export default function App() {
  const [content, setContent] = useState(null)
  const [route, setRoute] = useState('entry')
  const [session, setSession] = useState(initialSession())

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content.json`)
      .then(r => r.json())
      .then(setContent)
      .catch(err => console.error('Failed to load content.json', err))
  }, [])

  // Navigate to exit whenever outcome is set
  useEffect(() => {
    if (session.outcome) setRoute('exit')
  }, [session.outcome])

  // Navigate to next problem after correct — done inside PracticeScreen delay
  const handleCorrect = () => {
    setSession(prev => {
      const nextResults = [...prev.results]
      nextResults[prev.currentProblem] = 'correct'
      const correctCount = nextResults.filter(r => r === 'correct').length
      const sessionComplete = prev.currentProblem + 1 >= PROBLEMS_PER_SESSION
      const masteryReached = correctCount >= MASTERY_THRESHOLD

      if (sessionComplete || masteryReached) {
        return { ...prev, results: nextResults, outcome: masteryReached ? 'mastery' : 'needs-help' }
      }
      return { ...prev, results: nextResults, currentProblem: prev.currentProblem + 1 }
    })
  }

  const handleWrong = () => {
    setSession(prev => {
      const nextResults = [...prev.results]
      // Only mark first wrong attempt per problem slot
      if (nextResults[prev.currentProblem] !== 'correct') {
        nextResults[prev.currentProblem] = 'wrong'
      }
      const total = prev.totalAttempted + 1
      if (total >= SESSION_CEILING) {
        return { ...prev, results: nextResults, totalAttempted: total, outcome: 'needs-help' }
      }
      return { ...prev, results: nextResults, totalAttempted: total }
    })
  }

  const handleRestart = () => {
    setSession(initialSession())
    setRoute('entry')
  }

  if (!content) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 18,
        background: 'var(--bg-outer)',
      }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <DevNav route={route} setRoute={setRoute} setSession={setSession} />

      {route === 'entry'    && <EntryScreen content={content} onStart={() => setRoute('comic')} />}
      {route === 'comic'    && <ComicScreen onNext={() => setRoute('practice')} />}
      {route === 'practice' && (
        <PracticeScreen
          content={content}
          session={session}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}
      {route === 'exit'     && <ExitScreen session={session} onRestart={handleRestart} />}
    </div>
  )
}

function DevNav({ route, setRoute, setSession }) {
  const jump = (key) => {
    if (key === 'entry') {
      setSession(initialSession())
      setRoute('entry')
    } else if (key === 'exit-mastery') {
      setSession({
        ...initialSession(),
        results: ['correct', 'correct', 'correct', 'correct', 'wrong'],
        outcome: 'mastery',
      })
      setRoute('exit')
    } else if (key === 'exit-help') {
      setSession({
        ...initialSession(),
        results: ['correct', 'wrong', 'wrong', 'wrong', 'wrong'],
        outcome: 'needs-help',
      })
      setRoute('exit')
    } else {
      setRoute(key)
    }
  }

  const links = [
    { key: 'entry',        label: 'Entry' },
    { key: 'comic',        label: 'Comic' },
    { key: 'practice',     label: 'Practice' },
    { key: 'exit-mastery', label: 'Exit (mastery)' },
    { key: 'exit-help',    label: 'Exit (needs-help)' },
  ]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      gap: 6,
      padding: '4px 10px',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginRight: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dev</span>
      {links.map(({ key, label }) => {
        const active = route === key || (route === 'exit' && key.startsWith('exit'))
        return (
          <button
            key={key}
            onClick={() => jump(key)}
            style={{
              background: active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)',
              color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 6,
              border: 'none',
              letterSpacing: '0.02em',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
