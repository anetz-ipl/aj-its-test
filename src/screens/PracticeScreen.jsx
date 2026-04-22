import { useState, useRef, useEffect } from 'react'
import Fiona from '../components/Fiona.jsx'
import Toolbox from '../components/Toolbox.jsx'

export default function PracticeScreen({ content, session, onCorrect, onWrong }) {
  const problems = content?.problems || []
  const currentProblem = problems[session.currentProblem] || problems[0]
  const totalProblems = Math.min(problems.length, 5)

  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // null | { type: 'correct'|'wrong', text: string }
  const [fionaMsg, setFionaMsg] = useState(null) // null = default bubble text
  const [hintActive, setHintActive] = useState(false)
  const [toolboxOpen, setToolboxOpen] = useState(false)
  const [fionaState, setFionaState] = useState('neutral')
  const inputRef = useRef(null)

  // Reset per problem
  useEffect(() => {
    setAnswer('')
    setFeedback(null)
    setFionaMsg(null)
    setHintActive(false)
    setFionaState('neutral')
    setToolboxOpen(false)
    inputRef.current?.focus()
  }, [session.currentProblem])

  const defaultBubble = `Problem ${session.currentProblem + 1} of ${totalProblems}. Take your time — think about groups.`

  const handleCheck = () => {
    if (!answer.trim()) return
    const num = parseInt(answer.trim(), 10)
    if (isNaN(num)) return

    if (num === currentProblem.answer) {
      setFeedback({ type: 'correct', text: currentProblem.tutor_responses.correct })
      setFionaMsg(currentProblem.tutor_responses.correct)
      setFionaState('happy')
      setHintActive(false)
      // Advance after short delay
      setTimeout(() => {
        onCorrect()
      }, 1800)
    } else {
      const wrongKey = String(num)
      const specificMsg = currentProblem.tutor_responses.common_wrong?.[wrongKey]
      const msg = specificMsg || currentProblem.tutor_responses.generic_wrong
      setFeedback({ type: 'wrong', text: msg })
      setFionaMsg(msg)
      setFionaState('neutral-2')
      setHintActive(false)
      onWrong()
    }
  }

  const handleHint = () => {
    if (hintActive) {
      setHintActive(false)
      setFionaMsg(null)
      setFionaState('neutral')
    } else {
      setHintActive(true)
      setFionaMsg(currentProblem.hint)
      setFionaState('gesturing')
    }
    setFeedback(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCheck()
  }

  const handleToolSolved = () => {
    setToolboxOpen(false)
    inputRef.current?.focus()
  }

  const pips = Array.from({ length: totalProblems }, (_, i) => {
    const result = session.results[i]
    if (result === 'correct') return 'correct'
    if (i === session.currentProblem) return 'active'
    if (result === 'wrong') return 'wrong'
    return 'dim'
  })

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative', paddingTop: 27 }}>
      {/* ── Left panel ── */}
      <div style={{
        flex: '0 0 33.333%',
        background: 'var(--bg-fiona-panel)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 18px 20px',
        gap: 14,
        overflow: 'hidden',
      }}>
        {/* Badge */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.07em',
          borderRadius: 20,
          padding: '4px 12px',
          textTransform: 'uppercase',
        }}>
          Practice · Division
        </div>

        {/* Speech bubble */}
        <div style={{
          background: hintActive ? 'var(--amber)' : 'var(--purple-light)',
          color: hintActive ? 'var(--amber-dark)' : 'var(--purple)',
          border: `1px solid ${hintActive ? '#d4a84b' : 'var(--purple-border)'}`,
          borderRadius: '12px 12px 12px 4px',
          padding: '12px 14px',
          fontSize: 13.5,
          fontWeight: 500,
          lineHeight: 1.5,
          transition: 'background 0.2s, color 0.2s',
        }}>
          {fionaMsg || defaultBubble}
        </div>

        {/* Fiona — fills remaining, bottom-anchored */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Fiona state={fionaState} size={110} />
        </div>

        {/* Progress pips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {pips.map((state, i) => (
            <div key={i} style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background:
                state === 'correct' ? 'var(--green-soft)' :
                state === 'active'  ? 'var(--amber)' :
                state === 'wrong'   ? 'var(--coral-border)' :
                'rgba(255,255,255,0.2)',
              border: state === 'active' ? '2px solid var(--amber-dark)' : '2px solid transparent',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex: '0 0 66.667%',
        background: 'var(--bg-card)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
            Problem {session.currentProblem + 1} of {totalProblems}
          </span>
          <ScoreDots results={session.results} total={totalProblems} />
        </div>

        {/* Word problem (story box) */}
        <div style={{
          background: 'var(--blue-soft)',
          color: 'var(--blue-dark)',
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.6,
          border: '1px solid #b3d4ee',
        }}>
          {currentProblem.word_problem}
        </div>

        {/* Problem display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 0',
        }}>
          <span style={{ fontSize: 44, fontWeight: 500 }}>
            {currentProblem.dividend} ÷ {currentProblem.divisor} =
          </span>
          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={e => {
              setAnswer(e.target.value)
              setFeedback(null)
            }}
            onKeyDown={handleKeyDown}
            disabled={feedback?.type === 'correct'}
            placeholder="?"
            style={{
              width: 90,
              fontSize: 38,
              fontWeight: 700,
              textAlign: 'center',
              border: `2.5px solid ${feedback?.type === 'wrong' ? 'var(--coral-border)' : 'var(--bg-card-border)'}`,
              borderRadius: 12,
              padding: '6px 8px',
              background: '#fff',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s',
              MozAppearance: 'textfield',
            }}
          />
        </div>

        {/* Feedback box */}
        {feedback && (
          <div style={{
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
            background: feedback.type === 'correct' ? 'var(--green-soft)' : 'var(--coral-bg)',
            color: feedback.type === 'correct' ? 'var(--green-dark)' : 'var(--coral-dark)',
            border: `1.5px solid ${feedback.type === 'correct' ? '#8bc46a' : 'var(--coral-border)'}`,
          }}>
            {feedback.type === 'correct' ? '✓ ' : ''}
            {feedback.text}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={handleHint}
            style={{
              background: hintActive ? 'var(--amber)' : '#f0ece0',
              color: hintActive ? 'var(--amber-dark)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 10,
              padding: '11px 18px',
              border: hintActive ? '2px solid #d4a84b' : '2px solid var(--bg-card-border)',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Hint
          </button>

          <button
            onClick={() => setToolboxOpen(prev => !prev)}
            style={{
              background: toolboxOpen ? 'var(--purple-light)' : '#f0ece0',
              color: toolboxOpen ? 'var(--purple)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 10,
              padding: '11px 18px',
              border: toolboxOpen ? '2px solid var(--purple-border)' : '2px solid var(--bg-card-border)',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {toolboxOpen ? 'Close Toolbox' : 'Open Toolbox'}
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={handleCheck}
            disabled={!answer.trim() || feedback?.type === 'correct'}
            style={{
              background: 'var(--navy)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 10,
              padding: '11px 28px',
              opacity: (!answer.trim() || feedback?.type === 'correct') ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            Check answer
          </button>
        </div>
      </div>

      {/* Toolbox drawer */}
      <Toolbox
        open={toolboxOpen}
        onClose={() => setToolboxOpen(false)}
        tools={content?.tools_enabled}
        problem={currentProblem}
        onToolSolved={handleToolSolved}
      />
    </div>
  )
}

function ScoreDots({ results, total }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => {
        const r = results[i]
        return (
          <div key={i} style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background:
              r === 'correct' ? 'var(--green-dark)' :
              r === 'wrong'   ? 'var(--coral-border)' :
              'var(--bg-card-border)',
          }} />
        )
      })}
    </div>
  )
}
