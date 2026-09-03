function RoadIcon({ danger }) {
  return danger ? (
    <>
      <rect x="230" y="128" width="80" height="52" fill="rgba(255,107,87,0.18)" />
      <rect x="256" y="140" width="30" height="24" fill="#ff6b57" />
    </>
  ) : (
    <rect x="256" y="140" width="30" height="24" fill="#6b6e76" />
  )
}

function PedestrianIcon({ danger }) {
  const color = danger ? '#ff6b57' : '#9a9da3'
  return (
    <>
      {danger && <rect x="230" y="118" width="80" height="62" fill="rgba(255,107,87,0.18)" />}
      <circle cx="268" cy="140" r="7" fill={color} />
      <rect x="261" y="149" width="14" height="24" fill={color} />
    </>
  )
}

function SignIcon({ danger }) {
  const color = danger ? '#ff6b57' : '#9a9da3'
  return (
    <>
      {danger && <rect x="230" y="110" width="70" height="70" fill="rgba(255,107,87,0.18)" />}
      <rect x="263" y="112" width="4" height="46" fill="#6b6e76" />
      <rect x="248" y="98" width="34" height="26" fill={color} />
    </>
  )
}

function SignalIcon({ danger }) {
  return (
    <>
      <rect x="260" y="96" width="16" height="46" fill="#4a4d54" />
      <circle cx="268" cy="106" r="5" fill="#ff6b57" opacity={danger ? 1 : 0.3} />
      <circle cx="268" cy="119" r="5" fill="#f2a93c" opacity={danger ? 0.3 : 1} />
      <circle cx="268" cy="132" r="5" fill="#35d68b" opacity="0.3" />
    </>
  )
}

function WeatherIcon({ danger }) {
  return (
    <>
      <rect x="256" y="140" width="30" height="24" fill={danger ? '#ff6b57' : '#6b6e76'} />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={40 + i * 80}
          y1="0"
          x2={20 + i * 80}
          y2="40"
          stroke="#5c6067"
          strokeWidth="2"
          opacity="0.6"
        />
      ))}
    </>
  )
}

const ICONS = {
  road: RoadIcon,
  pedestrian: PedestrianIcon,
  sign: SignIcon,
  signal: SignalIcon,
  weather: WeatherIcon,
}

export default function GenericScene({ danger = false, variant = 'road' }) {
  const Icon = ICONS[variant] || RoadIcon
  return (
    <svg viewBox="0 0 340 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="340" height="200" fill="#2c2f35" />
      <rect x="0" y="120" width="340" height="80" fill="#1a1c20" />
      <line x1="0" y1="160" x2="340" y2="160" stroke="#4a4d54" strokeWidth="3" strokeDasharray="12 10" />
      <rect x="40" y="132" width="30" height="44" fill="#f2a93c" />
      <text x="76" y="160" fontFamily="Archivo" fontSize="11" fontWeight="800" fill="#c7c9ce">
        VOCÊ
      </text>
      <Icon danger={danger} />
      {danger && (
        <g style={{ animation: 'arrowIn .3s ease-out both' }}>
          <path d="M240 152 L204 152" stroke="#ff6b57" strokeWidth="4" />
          <path d="M212 144 L200 152 L212 160 Z" fill="#ff6b57" />
        </g>
      )}
    </svg>
  )
}
