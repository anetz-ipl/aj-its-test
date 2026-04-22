import Fiona from '../components/Fiona.jsx'

export default function EntryScreen({ content, onStart }) {
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
        maxWidth: 460,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1.5px solid var(--bg-card-border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}>
        {/* Card top — dark panel */}
        <div style={{
          background: 'var(--bg-fiona-panel)',
          padding: '24px 24px 0 24px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 16,
          minHeight: 160,
        }}>
          <Fiona state="neutral" size={110} />
          <div style={{ paddingBottom: 20, flex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--purple)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              borderRadius: 20,
              padding: '3px 10px',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
              Extra practice
            </div>
            <div style={{
              background: '#fff',
              color: 'var(--text-primary)',
              borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px',
              fontSize: 14.5,
              fontWeight: 500,
              lineHeight: 1.4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              maxWidth: 220,
            }}>
              I've got something for us to work on.
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '20px 24px 24px',
        }}>
          {/* Topic row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
          }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'var(--amber)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--amber-dark)',
              flexShrink: 0,
            }}>
              ÷
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {content?.topic || 'Division Beyond Known Facts'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>
                Grade {content?.grade || 3}
              </div>
            </div>
          </div>

          {/* Three chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <Chip bg="var(--amber)" color="var(--amber-dark)">A short story to work through</Chip>
            <Chip bg="var(--blue-soft)" color="var(--blue-dark)">Some problems to solve</Chip>
            <Chip bg="var(--green-soft)" color="var(--green-dark)">Fiona to help if you get stuck</Chip>
          </div>

          <button
            onClick={onStart}
            style={{
              width: '100%',
              background: 'var(--navy)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              padding: '14px 0',
              borderRadius: 12,
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({ bg, color, children }) {
  return (
    <div style={{
      background: bg,
      color: color,
      borderRadius: 20,
      padding: '5px 12px',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.3,
    }}>
      {children}
    </div>
  )
}
