import { useState, useEffect } from 'react'
import Base10Blocks from './tools/Base10Blocks.jsx'
import NumberLine from './tools/NumberLine.jsx'

const TOOL_META = {
  base10_blocks: { label: 'Base-10 Blocks', icon: '🔲' },
  number_line:   { label: 'Number Line',    icon: '📏' },
}

export default function Toolbox({ open, onClose, tools, problem, onToolSolved }) {
  const [activeTool, setActiveTool] = useState(null)

  // Reset active tool when problem changes
  useEffect(() => { setActiveTool(null) }, [problem?.id])

  if (!open) return null

  const toggleTool = (key) => setActiveTool(prev => prev === key ? null : key)

  return (
    <>
      {/* Backdrop (transparent — drawer just overlays) */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 320,
        background: 'var(--bg-card)',
        borderLeft: '2px solid var(--bg-card-border)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
        animation: 'slideIn 0.22s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: '1.5px solid var(--bg-card-border)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Tool Box</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              fontSize: 20,
              color: 'var(--text-muted)',
              lineHeight: 1,
              padding: '2px 6px',
              borderRadius: 6,
            }}
          >
            ×
          </button>
        </div>

        {/* Tool list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(tools || []).map(key => {
            const meta = TOOL_META[key]
            if (!meta) return null
            const isActive = activeTool === key

            return (
              <div key={key} style={{
                border: `1.5px solid ${isActive ? 'var(--purple-border)' : 'var(--bg-card-border)'}`,
                borderRadius: 12,
                overflow: 'hidden',
                background: isActive ? 'var(--purple-light)' : '#fff',
                transition: 'background 0.15s, border-color 0.15s',
              }}>
                {/* Tool header */}
                <button
                  onClick={() => toggleTool(key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    background: 'none',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{meta.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{meta.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{isActive ? '▲' : '▼'}</span>
                </button>

                {/* Tool body */}
                {isActive && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--bg-card-border)' }}>
                    <div style={{ height: 10 }} />
                    {key === 'base10_blocks' && (
                      <Base10Blocks
                        dividend={problem.dividend}
                        divisor={problem.divisor}
                        onSolved={onToolSolved}
                      />
                    )}
                    {key === 'number_line' && (
                      <NumberLine
                        dividend={problem.dividend}
                        divisor={problem.divisor}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
