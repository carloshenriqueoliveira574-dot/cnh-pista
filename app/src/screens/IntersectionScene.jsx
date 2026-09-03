export default function IntersectionScene({ danger = false }) {
  return (
    <svg viewBox="0 0 340 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="340" height="200" fill="#2c2f35" />
      <rect x="128" y="0" width="84" height="200" fill="#1a1c20" />
      <rect x="0" y="66" width="340" height="84" fill="#1a1c20" />
      {danger && <rect x="212" y="66" width="128" height="84" fill="rgba(255,107,87,0.18)" />}
      {!danger && (
        <line x1="170" y1="4" x2="170" y2="60" stroke="#4a4d54" strokeWidth="3" strokeDasharray="10 8" />
      )}
      <line x1="170" y1="156" x2="170" y2="196" stroke="#4a4d54" strokeWidth="3" strokeDasharray="10 8" />
      {!danger && (
        <line x1="4" y1="108" x2="122" y2="108" stroke="#4a4d54" strokeWidth="3" strokeDasharray="10 8" />
      )}
      <line x1="218" y1="108" x2="336" y2="108" stroke="#4a4d54" strokeWidth="3" strokeDasharray="10 8" />
      <rect x="148" y="158" width="26" height="40" fill="#f2a93c" />
      <text x="112" y="184" fontFamily="Archivo" fontSize="11" fontWeight="800" fill="#c7c9ce" textAnchor="end">
        VOCÊ
      </text>
      {danger ? (
        <>
          <rect x="252" y="76" width="40" height="26" fill="#ff6b57" />
          <g style={{ animation: 'arrowIn .3s ease-out both' }}>
            <path d="M246 89 L200 89" stroke="#ff6b57" strokeWidth="4" />
            <path d="M208 81 L196 89 L208 97 Z" fill="#ff6b57" />
          </g>
          <text x="256" y="126" fontFamily="Archivo" fontSize="11" fontWeight="800" fill="#ffb3a6">
            SUA DIREITA
          </text>
        </>
      ) : (
        <>
          <rect x="252" y="76" width="40" height="26" fill="#6b6e76" />
          <path d="M246 89 L226 89" stroke="#9a9da3" strokeWidth="3" />
          <path d="M232 83 L222 89 L232 95 Z" fill="#9a9da3" />
        </>
      )}
    </svg>
  )
}
