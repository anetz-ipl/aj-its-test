import { useState, useRef } from 'react'

export default function NumberLine({ dividend, divisor }) {
  const [marker, setMarker] = useState(0)
  const lineRef = useRef(null)

  const handleLineClick = (e) => {
    const rect = lineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    setMarker(Math.round(ratio * dividend))
  }

  const step = (delta) => {
    setMarker(prev => Math.max(0, Math.min(dividend, prev + delta)))
  }

  const jumps = divisor > 0 ? Math.floor(marker / divisor) : 0
  const jumpSize = divisor

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        Click the line to place a marker, or use the arrow buttons to step.
      </div>

      {/* Number line */}
      <div
        ref={lineRef}
        onClick={handleLineClick}
        style={{
          position: 'relative',
          height: 48,
          cursor: 'crosshair',
          marginBottom: 12,
        }}
      >
        {/* Track */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--bg-card-border)',
          borderRadius: 2,
          transform: 'translateY(-50%)',
        }} />

        {/* Tick marks */}
        {Array.from({ length: dividend + 1 }, (_, i) => {
          const isMajor = i % 10 === 0
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i / dividend) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMajor ? 2 : 1,
              height: isMajor ? 16 : 8,
              background: isMajor ? 'var(--text-muted)' : 'var(--bg-card-border)',
            }} />
          )
        })}

        {/* Labels — 0 and dividend only */}
        <div style={{ position: 'absolute', left: 0, top: '100%', fontSize: 11, color: 'var(--text-muted)', transform: 'translateX(-50%)', paddingTop: 2 }}>0</div>
        <div style={{ position: 'absolute', left: '100%', top: '100%', fontSize: 11, color: 'var(--text-muted)', transform: 'translateX(-50%)', paddingTop: 2 }}>{dividend}</div>

        {/* Marker */}
        <div
          style={{
            position: 'absolute',
            left: `${(marker / dividend) * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18,
            height: 18,
            background: 'var(--purple)',
            borderRadius: '50%',
            border: '2.5px solid #fff',
            boxShadow: '0 0 0 2px var(--purple)',
            pointerEvents: 'none',
          }}
        />

        {/* Current position label */}
        <div style={{
          position: 'absolute',
          left: `${(marker / dividend) * 100}%`,
          top: -4,
          transform: 'translateX(-50%)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--purple)',
          pointerEvents: 'none',
        }}>
          {marker}
        </div>
      </div>

      {/* Step buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
        <button onClick={() => step(-divisor)} style={stepBtnStyle}>−{divisor}</button>
        <button onClick={() => step(-1)} style={stepBtnStyle}>−1</button>
        <button onClick={() => step(1)} style={stepBtnStyle}>+1</button>
        <button onClick={() => step(divisor)} style={stepBtnStyle}>+{divisor}</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setMarker(0)} style={{ ...stepBtnStyle, color: 'var(--text-muted)', background: 'var(--bg-card-border)' }}>Reset</button>
      </div>

      {/* Info strip */}
      <div style={{
        marginTop: 12,
        background: 'var(--blue-soft)',
        borderRadius: 8,
        padding: '8px 12px',
        display: 'flex',
        gap: 20,
      }}>
        <Stat label="Position" value={marker} />
        <Stat label={`Jumps of ${divisor}`} value={jumps} />
        <Stat label="Remainder" value={marker - jumps * divisor} />
      </div>
    </div>
  )
}

const stepBtnStyle = {
  background: 'var(--amber)',
  color: 'var(--amber-dark)',
  fontWeight: 700,
  fontSize: 13,
  borderRadius: 8,
  padding: '6px 12px',
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--blue-dark)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-dark)' }}>{value}</div>
    </div>
  )
}
