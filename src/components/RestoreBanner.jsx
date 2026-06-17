import copy from '../lib/copy.js'

export default function RestoreBanner({ onReset, onDismiss }) {
  return (
    <div className="restore" role="status">
      <span aria-hidden>↩︎</span>
      {copy.restore.text}
      <button className="x" onClick={onReset}>{copy.restore.reset}</button>
      <button className="x" onClick={onDismiss} style={{ marginInlineStart: 8 }} aria-label="סגור">✕</button>
    </div>
  )
}
