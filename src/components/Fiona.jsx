// Fiona placeholder — state prop wired for future SVG swap
// States: neutral | neutral-2 | gesturing | happy
export default function Fiona({ state = 'neutral', size = 110 }) {
  return (
    <div
      style={{
        width: size,
        height: Math.round(size * 1.25),
        background: 'var(--purple)',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      data-fiona-state={state}
      aria-label="Fiona"
    >
      <span style={{ color: '#fff', fontSize: size * 0.45, fontWeight: 700 }}>F</span>
    </div>
  )
}
