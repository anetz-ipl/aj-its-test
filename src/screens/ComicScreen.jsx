import Fiona from '../components/Fiona.jsx'

export default function ComicScreen({ onNext }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', paddingTop: 27 }}>
      {/* Left — Fiona panel */}
      <div style={{
        flex: '0 0 33.333%',
        background: 'var(--bg-fiona-panel)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 20px 28px',
        gap: 16,
      }}>
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
          Story · Division
        </div>

        {/* Speech bubble */}
        <div style={{
          background: 'var(--purple-light)',
          color: 'var(--purple)',
          borderRadius: '12px 12px 12px 4px',
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.5,
          width: '100%',
          border: '1px solid var(--purple-border)',
        }}>
          We'll walk through this together.
        </div>

        {/* Fiona — bottom-anchored */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Fiona state="neutral" size={110} />
        </div>
      </div>

      {/* Right — content */}
      <div style={{
        flex: '0 0 66.667%',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 40,
      }}>
        <div style={{
          color: 'var(--text-muted)',
          fontSize: 18,
          fontWeight: 500,
          textAlign: 'center',
        }}>
          Interactive comic coming soon.
        </div>

        <button
          onClick={onNext}
          style={{
            background: 'var(--navy)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: 12,
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Start problems →
        </button>
      </div>
    </div>
  )
}
