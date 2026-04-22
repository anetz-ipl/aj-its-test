import { useState, useRef } from 'react'

// Base-10 blocks tool
// dividend: number to represent (e.g. 48)
// divisor: number of groups (e.g. 3)
// onSolved: called when groups are all equal and correct

export default function Base10Blocks({ dividend, divisor, onSolved }) {
  const tens = Math.floor(dividend / 10)
  const ones = dividend % 10

  // Each item: { id, type: 'rod'|'unit', groupIndex: null|0|1|2 }
  const makeItems = () => {
    const items = []
    let id = 0
    for (let i = 0; i < tens; i++) items.push({ id: id++, type: 'rod', groupIndex: null })
    for (let i = 0; i < ones; i++) items.push({ id: id++, type: 'unit', groupIndex: null })
    return items
  }

  const [items, setItems] = useState(makeItems)
  const [splitTarget, setSplitTarget] = useState(null) // id of rod being split
  const [dragId, setDragId] = useState(null)
  const [solved, setSolved] = useState(false)

  const groupCounts = Array.from({ length: divisor }, (_, g) =>
    items.filter(it => it.groupIndex === g).reduce((sum, it) => sum + (it.type === 'rod' ? 10 : 1), 0)
  )

  const checkSolved = (nextItems) => {
    const counts = Array.from({ length: divisor }, (_, g) =>
      nextItems.filter(it => it.groupIndex === g).reduce((sum, it) => sum + (it.type === 'rod' ? 10 : 1), 0)
    )
    const allAssigned = nextItems.every(it => it.groupIndex !== null)
    const correctAnswer = dividend / divisor
    const allEqual = counts.every(c => c === correctAnswer)
    return allAssigned && allEqual
  }

  const handleDrop = (groupIndex, e) => {
    e.preventDefault()
    if (dragId === null) return
    setItems(prev => {
      const next = prev.map(it => it.id === dragId ? { ...it, groupIndex } : it)
      if (checkSolved(next)) setSolved(true)
      return next
    })
    setDragId(null)
  }

  const handleSplitRod = (id) => {
    setItems(prev => {
      const rod = prev.find(it => it.id === id)
      if (!rod) return prev
      const others = prev.filter(it => it.id !== id)
      let nextId = Math.max(...prev.map(it => it.id)) + 1
      const newUnits = Array.from({ length: 10 }, (_, i) => ({
        id: nextId + i,
        type: 'unit',
        groupIndex: rod.groupIndex,
      }))
      return [...others, ...newUnits]
    })
    setSplitTarget(null)
  }

  const unassigned = items.filter(it => it.groupIndex === null)
  const unassignedRods = unassigned.filter(it => it.type === 'rod')
  const unassignedUnits = unassigned.filter(it => it.type === 'unit')

  return (
    <div style={{ padding: '4px 0', userSelect: 'none' }}>
      {/* Source pool */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>
          {dividend} = {Math.floor(dividend/10)} tens + {dividend % 10} ones
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 36, padding: 6, background: '#f0ece0', borderRadius: 8 }}>
          {unassignedRods.map(rod => (
            <Rod
              key={rod.id}
              id={rod.id}
              onDragStart={() => setDragId(rod.id)}
              onClick={() => setSplitTarget(rod.id)}
            />
          ))}
          {unassignedUnits.map(unit => (
            <Unit
              key={unit.id}
              id={unit.id}
              onDragStart={() => setDragId(unit.id)}
            />
          ))}
        </div>
      </div>

      {/* Split popover */}
      {splitTarget !== null && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--bg-card-border)',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 10,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>Split into 10 ones?</span>
          <button
            onClick={() => handleSplitRod(splitTarget)}
            style={{ background: 'var(--purple)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px' }}
          >
            Split
          </button>
          <button
            onClick={() => setSplitTarget(null)}
            style={{ background: 'var(--bg-card-border)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Group zones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: divisor }, (_, g) => {
          const groupItems = items.filter(it => it.groupIndex === g)
          return (
            <DropZone
              key={g}
              label={`Group ${g + 1}`}
              count={groupCounts[g]}
              items={groupItems}
              onDrop={(e) => handleDrop(g, e)}
              onItemClick={(id) => {
                // return to pool
                setItems(prev => prev.map(it => it.id === id ? { ...it, groupIndex: null } : it))
                setSolved(false)
              }}
              onDragStart={(id) => setDragId(id)}
            />
          )
        })}
      </div>

      {/* Solved state */}
      {solved && (
        <div style={{
          marginTop: 12,
          background: 'var(--green-soft)',
          border: '1.5px solid #8bc46a',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', flex: 1 }}>
            Each group has {dividend / divisor}.
          </span>
          <button
            onClick={onSolved}
            style={{
              background: 'var(--navy)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              padding: '6px 12px',
            }}
          >
            I've got it
          </button>
        </div>
      )}
    </div>
  )
}

function Rod({ id, onDragStart, onClick }) {
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart() }}
      onClick={onClick}
      title="Click to split into 10 ones"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        cursor: 'grab',
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          width: 16,
          height: 16,
          background: '#7f77dd',
          border: '1px solid #afa9ec',
          borderRadius: 2,
        }} />
      ))}
    </div>
  )
}

function Unit({ id, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart() }}
      style={{
        width: 16,
        height: 16,
        background: '#f0997b',
        borderRadius: 2,
        cursor: 'grab',
      }}
    />
  )
}

function DropZone({ label, count, items, onDrop, onItemClick, onDragStart }) {
  const [over, setOver] = useState(false)
  const rods = items.filter(it => it.type === 'rod')
  const units = items.filter(it => it.type === 'unit')
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { setOver(false); onDrop(e) }}
      style={{
        border: `2px dashed ${over ? 'var(--purple)' : 'var(--bg-card-border)'}`,
        borderRadius: 10,
        padding: '8px 10px',
        minHeight: 56,
        background: over ? 'var(--purple-light)' : '#f8f4ea',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          {count > 0 ? count : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {rods.map(it => (
          <div
            key={it.id}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart(it.id) }}
            onClick={() => onItemClick(it.id)}
            title="Click to return to pool"
            style={{ display: 'flex', flexDirection: 'column', gap: 1, cursor: 'grab' }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ width: 16, height: 16, background: '#7f77dd', border: '1px solid #afa9ec', borderRadius: 2 }} />
            ))}
          </div>
        ))}
        {units.map(it => (
          <div
            key={it.id}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart(it.id) }}
            onClick={() => onItemClick(it.id)}
            title="Click to return to pool"
            style={{ width: 16, height: 16, background: '#f0997b', borderRadius: 2, cursor: 'grab' }}
          />
        ))}
      </div>
    </div>
  )
}
