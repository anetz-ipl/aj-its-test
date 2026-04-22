import Fiona from '../components/Fiona.jsx'

export default function ExitScreen({ session, onRestart }) {
  const correctCount = session.results.filter(r => r === 'correct').length
  const total = session.results.length
  const mastery = session.outcome === 'mastery'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-outer)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '51px 24px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 500,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1.5px solid var(--bg-card-border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}>
        {/* Card top */}
        <div style={{
          background: mastery ? '#2a4a30' : 'var(--bg-fiona-panel)',
          padding: '24px 24px 0 24px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 16,
          minHeight: 160,
        }}>
          <Fiona state={mastery ? 'happy' : 'neutral'} size={110} />
          <div style={{ paddingBottom: 20, flex: 1 }}>
            <div style={{
              background: mastery ? 'var(--green-soft)' : '#fff',
              color: mastery ? 'var(--green-dark)' : 'var(--text-primary)',
              borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: 240,
            }}>
              {mastery
                ? 'That chunking strategy is yours now.'
                : 'This one needs a bit more time. That\'s fine.'}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ background: 'var(--bg-card)', padding: '24px 24px 28px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>
            {mastery ? 'You got it.' : 'Good work today, mathematician.'}
          </h2>

          <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>
            {mastery
              ? 'Working through division like that takes real thinking. The strategy of breaking numbers into chunks — that\'s one you\'ll keep using.'
              : 'Division with bigger numbers is genuinely hard. You worked through some tricky problems — that counts. Come back to this one and it\'ll start to click.'}
          </p>

          {/* Score strip */}
          <div style={{
            background: mastery ? 'var(--green-soft)' : 'var(--amber)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mastery ? 'var(--green-dark)' : 'var(--amber-dark)' }}>
              Today's Session
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {session.results.map((r, i) => (
                <div key={i} style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: r === 'correct' ? 'var(--green-dark)' : (mastery ? '#8bc46a' : '#d4a84b'),
                  border: r === 'correct' ? 'none' : '2px solid rgba(0,0,0,0.15)',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: mastery ? 'var(--green-dark)' : 'var(--amber-dark)' }}>
              {mastery
                ? `${correctCount} out of ${total} — you've got this standard.`
                : `${correctCount} out of ${total}. Keep practising — you're building the foundations.`}
            </div>
          </div>

          <button
            onClick={onRestart}
            style={{
              width: '100%',
              background: 'var(--navy)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              padding: '14px 0',
              borderRadius: 12,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {mastery ? 'Done for now' : 'Back to the start'}
          </button>
        </div>
      </div>
    </div>
  )
}
