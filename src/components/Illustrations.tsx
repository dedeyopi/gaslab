/**
 * Ilustrasi SVG orisinal bergaya "clean educational scientific illustration".
 * Tidak bergantung pada gambar eksternal. Lebih realistis dengan gradient,
 * bayangan, pantulan cahaya, dan detail teknis/anatomi.
 */

/* =========================================================================
 * BALON — karet dengan highlight, simpul, dan partikel gas
 * ========================================================================= */
export function BalloonIllustration({
  volume = 5,
  className = '',
}: {
  volume?: number;
  className?: string;
}) {
  const v = Math.max(2, Math.min(10, volume));
  const t = (v - 2) / 8; // 0..1

  // Ukuran balon: 0.5 (kempis) → 1.05 (mengembang)
  const scale = 0.5 + t * 0.55;

  // Kerutan muncul saat balon kempis
  const wrinkleOpacity = Math.max(0, 1 - t * 1.6);

  // Kilau bertambah saat balon mengembang
  const shine = 0.4 + t * 0.55;

  // Titik jangkar di simpul bawah balon
  const anchorX = 100;
  const anchorY = 160;

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={`Balon dengan volume ${v.toFixed(1)} liter`}
    >
      <defs>
        <radialGradient id="blnSkin" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="45%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="blnHighlight" cx="35%" cy="25%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={shine} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tali — di luar grup, tidak ikut mengecil */}
      <path
        d="M100 160 Q105 178 96 192 Q92 204 100 216"
        stroke="#64748b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
      />

      {/* Badan balon — discale dari titik simpul */}
      <g
        style={{
          transformOrigin: `${anchorX}px ${anchorY}px`,
          transform: `scale(${scale})`,
          transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <ellipse
          cx="100"
          cy="85"
          rx="62"
          ry="72"
          fill="url(#blnSkin)"
          stroke="#0e7490"
          strokeWidth="1.6"
        />

        <ellipse cx="80" cy="52" rx="30" ry="36" fill="url(#blnHighlight)" />
        <ellipse
          cx="70"
          cy="40"
          rx="6"
          ry="9"
          fill="#ffffff"
          opacity={shine}
          transform="rotate(-25 70 40)"
        />

        {/* Kerutan saat balon kempis */}
        {wrinkleOpacity > 0.05 && (
          <g
            opacity={wrinkleOpacity * 0.75}
            stroke="#0369a1"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M76 100 Q80 106 76 114" />
            <path d="M124 100 Q120 106 124 114" />
            <path d="M68 128 Q72 134 68 142" />
            <path d="M132 128 Q128 134 132 142" />
            <path d="M94 142 Q98 146 94 150" />
            <path d="M106 142 Q102 146 106 150" />
          </g>
        )}

        {/* Partikel gas di dalam balon */}
        {[
          [78, 66], [112, 58], [96, 92], [126, 88], [70, 100],
          [108, 118], [86, 132], [130, 62], [64, 76], [118, 140],
          [95, 75], [102, 105], [82, 88], [120, 110], [74, 118],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.1" fill="#0f172a" opacity="0.75">
            <animate
              attributeName="cy"
              values={`${y};${y - 5};${y}`}
              dur={`${1.8 + (i % 4) * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values={`${x};${x + 2};${x}`}
              dur={`${2 + (i % 3) * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Simpul balon */}
        <path
          d="M96 150 L91 160 L109 160 L104 150 Z"
          fill="#0e7490"
          stroke="#67e8f9"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* =========================================================================
 * KANTONG KERIPIK — foil metalik dengan lipatan, label, dan segel
 * ========================================================================= */
export function ChipsBagIllustration({
  altitude,
  className = '',
}: {
  altitude: 'low' | 'high';
  className?: string;
}) {
  const inflate = altitude === 'high';
  const scaleY = inflate ? 1.12 : 0.94;
  const scaleX = inflate ? 1.07 : 0.94;
  const translateY = inflate ? -6 : 6;

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label="Ilustrasi kantong keripik">
      <defs>
        <linearGradient id="bagFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="55%" stopColor="#d97706" />
          <stop offset="80%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="bagShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bagLabel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
      </defs>

      <g transform={`translate(100, 120) scale(${scaleX}, ${scaleY}) translate(-100, -120) translate(0, ${translateY})`}>
        {/* Segel atas */}
        <rect x="42" y="28" width="116" height="10" rx="1.5" fill="#78350f" stroke="#431407" strokeWidth="0.6" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`t${i}`} x1={44 + i * 5.6} y1="28" x2={44 + i * 5.6} y2="38"
                stroke="#431407" strokeWidth="0.4" opacity="0.7" />
        ))}

        {/* Badan kantong */}
        <path
          d="M42 38 Q40 42 38 48 L32 172 Q34 180 42 184 Q100 194 158 184 Q166 180 168 172 L162 48 Q160 42 158 38 Z"
          fill="url(#bagFoil)" stroke="#92400e" strokeWidth="1"
        />
        <path
          d="M42 38 Q40 42 38 48 L32 172 Q34 180 42 184 Q100 194 158 184 Q166 180 168 172 L162 48 Q160 42 158 38 Z"
          fill="url(#bagShine)"
        />

        {/* Kerutan */}
        <path d="M58 55 Q66 72 56 92" stroke="#78350f" strokeWidth="0.9" fill="none" opacity="0.5" />
        <path d="M142 58 Q150 80 140 102" stroke="#78350f" strokeWidth="0.9" fill="none" opacity="0.5" />
        <path d="M54 152 Q64 164 54 176" stroke="#78350f" strokeWidth="0.9" fill="none" opacity="0.5" />
        <path d="M146 148 Q136 162 146 176" stroke="#78350f" strokeWidth="0.9" fill="none" opacity="0.5" />

        {/* Label tengah */}
        <rect x="52" y="82" width="96" height="62" rx="6"
              fill="url(#bagLabel)" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Brand */}
        <text x="100" y="108" textAnchor="middle" fontSize="15" fontWeight="900"
              fill="#fde68a" letterSpacing="1">CHIPS</text>
        <text x="100" y="124" textAnchor="middle" fontSize="9" fontWeight="600"
              fill="#fbbf24" letterSpacing="2">ORIGINAL</text>

        {/* Ikon keripik dekoratif */}
        <ellipse cx="72" cy="134" rx="6" ry="4" fill="#fde68a" transform="rotate(-20 72 134)" />
        <ellipse cx="128" cy="134" rx="6" ry="4" fill="#fde68a" transform="rotate(20 128 134)" />

        {/* Hint label gizi */}
        <rect x="55" y="150" width="24" height="20" rx="2" fill="#fef3c7" opacity="0.9" />
        <line x1="58" y1="156" x2="76" y2="156" stroke="#78350f" strokeWidth="0.6" />
        <line x1="58" y1="160" x2="76" y2="160" stroke="#78350f" strokeWidth="0.6" />
        <line x1="58" y1="164" x2="72" y2="164" stroke="#78350f" strokeWidth="0.6" />

        {/* Segel bawah */}
        <rect x="42" y="182" width="116" height="10" rx="1.5" fill="#78350f" stroke="#431407" strokeWidth="0.6" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`b${i}`} x1={44 + i * 5.6} y1="182" x2={44 + i * 5.6} y2="192"
                stroke="#431407" strokeWidth="0.4" opacity="0.7" />
        ))}

        {/* Partikel gas (muncul saat mengembang) */}
        {inflate && (
          <>
            {[
              [55, 50], [145, 55], [50, 90], [150, 95],
              [48, 140], [152, 145], [70, 175], [130, 175],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.6" fill="#fef3c7" opacity="0.95">
                <animate attributeName="cy" values={`${y};${y - 5};${y}`}
                         dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </>
        )}
      </g>

      {/* Label ketinggian */}
      <g transform="translate(100, 228)">
        <rect x="-58" y="-12" width="116" height="20" rx="10"
              fill="rgba(2,6,23,0.85)"
              stroke={inflate ? '#34d399' : '#38bdf8'} strokeWidth="1" />
        <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="700"
              fill={inflate ? '#6ee7b7' : '#7dd3fc'}>
          {inflate ? 'PEGUNUNGAN' : 'DAERAH RENDAH'}
        </text>
      </g>
    </svg>
  );
}

/* =========================================================================
 * JARUM SUNTIK — kaca transparan, seal karet, skala ukur, jarum logam
 * ========================================================================= */
export function SyringeIllustration({
  volumeRatio,
  className = '',
}: {
  volumeRatio: number;
  className?: string;
}) {
  const ratio = Math.max(0.15, Math.min(1, volumeRatio));
  const barrelTop = 55;
  const barrelBottom = 195;
  const barrelH = barrelBottom - barrelTop;
  const pistonY = barrelBottom - barrelH * ratio;
  const liquidTop = pistonY + 14;

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label="Ilustrasi jarum suntik">
      <defs>
        <linearGradient id="syrGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.35" />
          <stop offset="12%" stopColor="#e0f2fe" stopOpacity="0.55" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="88%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="syrLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="syrMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="syrRod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="45%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Barrel kaca */}
      <rect x="65" y={barrelTop} width="70" height={barrelH} rx="6"
            fill="url(#syrGlass)" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Cairan / gas di dalam */}
      <rect x="67" y={liquidTop} width="66" height={barrelBottom - liquidTop - 2} rx="4"
            fill="url(#syrLiquid)" />

      {/* Partikel di dalam cairan */}
      {Array.from({ length: 15 }).map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const px = 80 + col * 20;
        const py = liquidTop + 18 + row * 22;
        if (py > barrelBottom - 10) return null;
        return (
          <circle key={i} cx={px} cy={py} r="2.8" fill="#a5f3fc" opacity="0.9">
            <animate attributeName="cy" values={`${py};${py - 4};${py}`}
                     dur={`${1.5 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Skala ukur */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const y = barrelTop + (barrelH * i) / 8 + 4;
        const major = i % 2 === 0;
        return (
          <g key={i}>
            <line x1="70" x2={major ? "82" : "76"} y1={y} y2={y} stroke="#475569" strokeWidth="0.8" />
            <line x1="118" x2={major ? "130" : "124"} y1={y} y2={y} stroke="#475569" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* Piston seal (karet hitam) */}
      <rect x="62" y={pistonY} width="76" height="15" rx="3"
            fill="#0f172a" stroke="#020617" strokeWidth="0.8" />
      <rect x="64" y={pistonY + 3} width="72" height="2" fill="#475569" opacity="0.7" />
      <rect x="64" y={pistonY + 10} width="72" height="2" fill="#475569" opacity="0.7" />

      {/* Batang piston */}
      <rect x="94" y={Math.max(24, pistonY - 32)} width="12"
            height={pistonY - Math.max(24, pistonY - 32)} fill="url(#syrRod)" />

      {/* Cross-arm */}
      <rect x="86" y={Math.max(24, pistonY - 34)} width="28" height="4" rx="1.5" fill="#94a3b8" />

      {/* Thumb rest (atas) */}
      <rect x="72" y="14" width="56" height="14" rx="4"
            fill="url(#syrMetal)" stroke="#334155" strokeWidth="1" />
      <rect x="74" y="17" width="52" height="2" fill="#e2e8f0" opacity="0.45" />

      {/* Needle hub */}
      <path d="M92 195 L108 195 L106 208 L94 208 Z"
            fill="url(#syrMetal)" stroke="#334155" strokeWidth="0.8" />

      {/* Needle */}
      <rect x="98" y="208" width="4" height="26" fill="url(#syrMetal)" />
      <path d="M98 234 L102 234 L102 238 L98 236 Z" fill="#e2e8f0" />

      {/* Label kiri atas */}
      <text x="14" y="30" fontSize="9" fontWeight="700" fill="#94a3b8">SYRINGE</text>
    </svg>
  );
}

/* =========================================================================
 * POMPA SEPEDA — tabung logam, pegangan karet, gauge, slang, ban
 * ========================================================================= */
export function BikePumpIllustration({
  pressRatio,
  className = '',
}: {
  pressRatio: number;
  className?: string;
}) {
  const p = Math.max(0, Math.min(1, pressRatio));
  const pistonY = 60 + p * 90;

  return (
    <svg viewBox="0 0 220 240" className={className} role="img" aria-label="Ilustrasi pompa sepeda">
      <defs>
        <linearGradient id="pmpBarrel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="18%" stopColor="#94a3b8" />
          <stop offset="45%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="pmpHandle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="pmpRod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <radialGradient id="pmpGauge">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Base / foot */}
      <path d="M42 214 L178 214 L172 228 L48 228 Z"
            fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <rect x="44" y="208" width="132" height="8" rx="3"
            fill="#334155" stroke="#475569" strokeWidth="0.8" />
      <rect x="46" y="210" width="128" height="2" fill="#64748b" opacity="0.5" />

      {/* Barrel */}
      <rect x="82" y="40" width="56" height="175" rx="8"
            fill="url(#pmpBarrel)" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="88" y="45" width="4" height="165" fill="#e2e8f0" opacity="0.2" />

      {/* Kolom udara terkompresi */}
      <rect x="84" y={pistonY + 16} width="52" height={208 - (pistonY + 16)} rx="4"
            fill="rgba(34,211,238,0.28)" />

      {/* Molekul udara di dalam barrel */}
      {Array.from({ length: 15 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const ax = 90 + col * 12;
        const ay = pistonY + 28 + row * 22;
        if (ay > 204) return null;
        return (
          <circle key={i} cx={ax} cy={ay} r="1.9" fill="#a5f3fc" opacity="0.85">
            <animate attributeName="cy" values={`${ay};${ay - 4};${ay}`}
                     dur={`${1.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Piston head */}
      <rect x="78" y={pistonY} width="64" height="15" rx="4"
            fill="#0f172a" stroke="#020617" strokeWidth="1" />
      <rect x="80" y={pistonY + 3} width="60" height="2" fill="#475569" />
      <rect x="80" y={pistonY + 10} width="60" height="2" fill="#475569" />
      <ellipse cx="110" cy={pistonY + 7} rx="30" ry="2"
               fill="none" stroke="#f97316" strokeWidth="1.2" opacity="0.7" />

      {/* Rod */}
      <rect x="104" y={Math.max(50, pistonY - 25)} width="12"
            height={pistonY - Math.max(50, pistonY - 25)} fill="url(#pmpRod)" />

      {/* Handle */}
      <rect x="62" y={Math.max(40, pistonY - 36)} width="96" height="16" rx="6"
            fill="url(#pmpHandle)" stroke="#0f172a" strokeWidth="1" />
      <rect x="66" y={Math.max(43, pistonY - 33)} width="88" height="2" fill="#64748b" />

      {/* Pressure gauge */}
      <g transform="translate(110, 32)">
        <circle cx="0" cy="0" r="11" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="9" fill="url(#pmpGauge)" />
        <circle cx="0" cy="0" r="9" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
        {/* Skala */}
        {[-120, -60, 0, 60, 120].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line key={a}
                  x1={Math.cos(rad) * 6.5} y1={Math.sin(rad) * 6.5}
                  x2={Math.cos(rad) * 8.5} y2={Math.sin(rad) * 8.5}
                  stroke="#64748b" strokeWidth="0.5" />
          );
        })}
        {/* Jarum */}
        <line x1="0" y1="0" x2={Math.cos((-120 + p * 240 - 90) * Math.PI / 180) * 7}
                              y2={Math.sin((-120 + p * 240 - 90) * Math.PI / 180) * 7}
              stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="0" cy="0" r="1.6" fill="#0f172a" />
      </g>

      {/* Slang */}
      <path d="M138 205 Q162 200 172 180 Q182 162 176 150 L168 150"
            stroke="#0f172a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M138 205 Q162 200 172 180 Q182 162 176 150 L168 150"
            stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Valve connector */}
      <rect x="160" y="144" width="14" height="9" rx="2"
            fill="#475569" stroke="#0f172a" strokeWidth="0.8" />
      <rect x="172" y="146" width="6" height="5" fill="#94a3b8" />

      {/* Roda sepeda (hint) */}
      <g transform="translate(150, 165)">
        <circle cx="22" cy="22" r="20" fill="none" stroke="#0f172a" strokeWidth="6" />
        <circle cx="22" cy="22" r="20" fill="none" stroke="#334155" strokeWidth="4" />
        <circle cx="22" cy="22" r="14" fill="none" stroke="#475569" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i} x1={22} y1={22}
                  x2={22 + 14 * Math.cos(rad)} y2={22 + 14 * Math.sin(rad)}
                  stroke="#94a3b8" strokeWidth="0.6" />
          );
        })}
        <circle cx="22" cy="22" r="3" fill="#475569" stroke="#0f172a" strokeWidth="0.8" />
      </g>

      {/* Label */}
      <text x="110" y="236" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">
        POMPA SEPEDA
      </text>
    </svg>
  );
}

/* =========================================================================
 * PARU-PARU — anatomi realistis: trakea, bronkus, 2 lobus kiri, 3 lobus kanan,
 *           diafragma dome, alveoli hint
 * ========================================================================= */
export function LungsIllustration({
  expanded,
  className = '',
}: {
  expanded: boolean;
  className?: string;
}) {
  const s = expanded ? 1.08 : 0.92;

  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Ilustrasi paru-paru dan diafragma">
      <defs>
        <linearGradient id="lgLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9f1239" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="lgRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9f1239" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="tracheaG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="50%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="diaG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Trakea dengan cincin kartilago */}
      <path d="M110 8 L110 65" stroke="url(#tracheaG)" strokeWidth="18"
            strokeLinecap="round" fill="none" />
      {[14, 24, 34, 44, 54].map((y) => (
        <line key={y} x1="101" x2="119" y1={y} y2={y}
              stroke="#0e7490" strokeWidth="1.5" opacity="0.75" />
      ))}

      {/* Percabangan bronkus */}
      <path d="M110 65 L82 88 M110 65 L138 88"
            stroke="#0891b2" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M82 88 L70 100 M82 88 L90 100"
            stroke="#0891b2" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M138 88 L130 100 M138 88 L150 100"
            stroke="#0891b2" strokeWidth="5" strokeLinecap="round" fill="none" />

      <g transform={`translate(110,125) scale(${s}) translate(-110,-125)`}>
        {/* Paru kiri — 2 lobus */}
        <path
          d="M100 90 Q75 92 62 115 Q50 145 55 175 Q60 195 82 196 Q95 190 98 170 L100 90 Z"
          fill="url(#lgLeft)" stroke="#fecdd3" strokeWidth="1.5"
        />
        {/* Fisure kiri */}
        <path d="M100 145 Q78 145 68 160"
              stroke="#831843" strokeWidth="1.5" fill="none" opacity="0.55" />

        {/* Paru kanan — 3 lobus */}
        <path
          d="M120 90 Q145 92 158 115 Q170 145 165 175 Q160 195 138 196 Q125 190 122 170 L120 90 Z"
          fill="url(#lgRight)" stroke="#fecdd3" strokeWidth="1.5"
        />
        {/* Fisure kanan (2 garis) */}
        <path d="M120 130 Q140 130 152 145"
              stroke="#831843" strokeWidth="1.5" fill="none" opacity="0.55" />
        <path d="M120 165 Q142 165 156 172"
              stroke="#831843" strokeWidth="1.5" fill="none" opacity="0.55" />

        {/* Alveoli hint */}
        <circle cx="75" cy="120" r="4" fill="#fbcfe8" opacity="0.75" />
        <circle cx="85" cy="130" r="3" fill="#fbcfe8" opacity="0.75" />
        <circle cx="70" cy="140" r="3.5" fill="#fbcfe8" opacity="0.75" />
        <circle cx="88" cy="155" r="3" fill="#fbcfe8" opacity="0.75" />
        <circle cx="145" cy="120" r="4" fill="#fbcfe8" opacity="0.75" />
        <circle cx="135" cy="135" r="3" fill="#fbcfe8" opacity="0.75" />
        <circle cx="150" cy="150" r="3.5" fill="#fbcfe8" opacity="0.75" />
        <circle cx="130" cy="155" r="3" fill="#fbcfe8" opacity="0.75" />
      </g>

      {/* Diafragma (dome muscle) */}
      <path
        d={expanded ? 'M38 195 Q110 172 182 195' : 'M38 202 Q110 220 182 202'}
        stroke="url(#diaG)" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d={expanded ? 'M38 195 Q110 172 182 195' : 'M38 202 Q110 220 182 202'}
        stroke="#d1fae5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55"
      />
      {/* Garis-garis otot */}
      {(expanded ? [
        [60, 190], [80, 185], [100, 183], [120, 183], [140, 185], [160, 190],
      ] : [
        [60, 205], [80, 210], [100, 213], [120, 213], [140, 210], [160, 205],
      ]).map(([x, y], i) => (
        <line key={i} x1={x} y1={y - 4} x2={x} y2={y + 4}
              stroke="#065f46" strokeWidth="1" opacity="0.5" />
      ))}

      {/* Label */}
      <text x="110" y="216" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6ee7b7">
        {expanded ? 'Diafragma berkontraksi (turun)' : 'Diafragma relaksasi (naik)'}
      </text>
    </svg>
  );
}

/* =========================================================================
 * PENYELAM — wetsuit, masker, tabung oksigen, regulator, sirip, gelembung,
 *           sinar matahari, dan gauge kedalaman
 * ========================================================================= */
export function DiverIllustration({
  depth,
  className = '',
}: {
  depth: number;
  className?: string;
}) {
  const d = Math.max(0, Math.min(1, depth));
  const diverY = 30 + d * 90;
  const scale = 1 - d * 0.12;

  return (
    <svg viewBox="0 0 220 220" className={className} role="img" aria-label="Ilustrasi penyelam dan tekanan air">
      <defs>
        <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#0369a1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="wetsuit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="tankG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="35%" stopColor="#ef4444" />
          <stop offset="65%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <radialGradient id="maskG">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {/* Air */}
      <rect x="0" y="0" width="220" height="220" fill="url(#waterG)" />

      {/* Sinar matahari */}
      <path d="M30 0 L70 220 L100 220 L70 0 Z" fill="#7dd3fc" opacity="0.07" />
      <path d="M120 0 L155 220 L175 220 L145 0 Z" fill="#7dd3fc" opacity="0.07" />

      {/* Gelombang permukaan */}
      <path d="M0 12 Q30 6 60 12 T120 12 T180 12 T220 12"
            stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.85" />
      <path d="M0 17 Q40 23 80 17 T160 17 T220 17"
            stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.45" />

      {/* Gelembung naik */}
      {[[92, 55, 3], [98, 72, 2.2], [104, 88, 2.6], [110, 106, 2], [116, 122, 3]].map(
        ([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r}
                  fill="none" stroke="#bae6fd" strokeWidth="1" opacity="0.65">
            <animate attributeName="cy" values={`${y};${y - 22};${y}`}
                     dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.15;0.7"
                     dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ),
      )}

      {/* Penyelam */}
      <g transform={`translate(0, ${diverY}) scale(${scale})`} style={{ transformOrigin: '110px 60px' }}>
        {/* Tabung oksigen di punggung */}
        <rect x="122" y="38" width="15" height="44" rx="5"
              fill="url(#tankG)" stroke="#450a0a" strokeWidth="0.8" />
        <rect x="126" y="33" width="7" height="5" rx="2" fill="#475569" />
        <ellipse cx="129.5" cy="54" rx="6.5" ry="2" fill="#7f1d1d" opacity="0.6" />
        <rect x="124" y="42" width="2" height="36" fill="#fca5a5" opacity="0.35" />

        {/* Sirip */}
        <path d="M96 118 Q84 128 88 140 Q98 132 104 120 Z"
              fill="#0891b2" stroke="#0e7490" strokeWidth="0.9" />
        <path d="M124 118 Q136 128 132 140 Q122 132 116 120 Z"
              fill="#0891b2" stroke="#0e7490" strokeWidth="0.9" />

        {/* Kaki (wetsuit) */}
        <path d="M105 96 L99 120 L106 120 L110 96 Z" fill="url(#wetsuit)" stroke="#0f172a" strokeWidth="0.6" />
        <path d="M115 96 L121 120 L114 120 L110 96 Z" fill="url(#wetsuit)" stroke="#0f172a" strokeWidth="0.6" />

        {/* Badan */}
        <rect x="100" y="60" width="20" height="40" rx="7"
              fill="url(#wetsuit)" stroke="#0f172a" strokeWidth="0.7" />
        {/* Garis wetsuit */}
        <line x1="102" y1="72" x2="118" y2="72" stroke="#475569" strokeWidth="0.6" opacity="0.7" />
        <line x1="102" y1="82" x2="118" y2="82" stroke="#475569" strokeWidth="0.6" opacity="0.7" />

        {/* Lengan */}
        <path d="M102 66 Q88 76 84 90 L92 92 Q96 78 106 72 Z" fill="url(#wetsuit)" stroke="#0f172a" strokeWidth="0.6" />
        <path d="M118 66 Q132 76 136 90 L128 92 Q124 78 114 72 Z" fill="url(#wetsuit)" stroke="#0f172a" strokeWidth="0.6" />

        {/* Sarung tangan */}
        <ellipse cx="88" cy="93" rx="4" ry="5" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
        <ellipse cx="132" cy="93" rx="4" ry="5" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />

        {/* Kepala */}
        <circle cx="110" cy="48" r="13" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />

        {/* Masker */}
        <path d="M96 46 Q110 36 124 46 Q122 58 110 58 Q98 58 96 46 Z"
              fill="url(#maskG)" stroke="#0f172a" strokeWidth="1.3" />
        {/* Strap */}
        <path d="M96 46 Q92 42 96 40" stroke="#0f172a" strokeWidth="1.3" fill="none" />
        <path d="M124 46 Q128 42 124 40" stroke="#0f172a" strokeWidth="1.3" fill="none" />
        {/* Refleksi masker */}
        <path d="M101 44 Q106 42 109 45" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.9" />
        {/* Bingkai masker */}
        <path d="M96 46 Q110 36 124 46" stroke="#1e293b" strokeWidth="1.5" fill="none" />

        {/* Regulator */}
        <circle cx="110" cy="55" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.9" />
        <rect x="110" y="53" width="18" height="4" rx="1" fill="#334155" />
        {/* Selang ke tabung */}
        <path d="M128 55 Q135 50 130 45" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Gauge kedalaman di sisi kiri */}
      <g transform="translate(16, 40)">
        <rect x="0" y="0" width="18" height="150" rx="4"
              fill="rgba(2,6,23,0.75)" stroke="#38bdf8" strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="0" x2={i % 2 === 0 ? "11" : "7"}
                y1={(i * 150) / 5} y2={(i * 150) / 5}
                stroke="#94a3b8" strokeWidth="0.6" />
        ))}
        <circle cx="9" cy={d * 150} r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="0.8">
          <animate attributeName="r" values="3.5;4.5;3.5" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text x="9" y="-5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#bae6fd">
          DEPTH
        </text>
      </g>

      {/* Label bawah */}
      <text x="110" y="212" textAnchor="middle" fontSize="10" fontWeight="700" fill="#bae6fd">
        Kedalaman: {(d * 30).toFixed(0)} m · Tekanan relatif: {(1 + d * 3).toFixed(2)} atm
      </text>
    </svg>
  );
}

/* =========================================================================
 * RUANG PARTIKEL — chamber transparan dengan partikel bercahaya
 * ========================================================================= */
export function ParticleChamberIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 180" className={className} role="img" aria-label="Ilustrasi ruang partikel gas">
      <defs>
        <linearGradient id="chBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id="pGlow">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="16" y="16" width="228" height="148" rx="14"
            fill="url(#chBg)" stroke="#67e8f9" strokeWidth="2" />

      <g opacity="0.15">
        {[40, 80, 120, 160, 200, 240].map((x) => (
          <line key={`v${x}`} x1={x} y1="16" x2={x} y2="164"
                stroke="#67e8f9" strokeWidth="0.5" />
        ))}
        {[40, 70, 100, 130].map((y) => (
          <line key={`h${y}`} x1="16" y1={y} x2="244" y2={y}
                stroke="#67e8f9" strokeWidth="0.5" />
        ))}
      </g>

      {[
        [52, 48, 3.2], [96, 40, 2.8], [150, 56, 3.5], [200, 44, 3],
        [66, 92, 3.2], [118, 86, 2.8], [176, 96, 3.4], [222, 82, 3],
        [42, 132, 3.2], [104, 138, 3], [160, 128, 3.4], [212, 136, 3],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r * 2.5} fill="url(#pGlow)" opacity="0.3" />
          <circle cx={x} cy={y} r={r} fill="#a5f3fc">
            <animate attributeName="cy"
                     values={`${y};${y - 8};${y + 3};${y}`}
                     dur={`${2.5 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="cx"
                     values={`${x};${x + 4};${x - 3};${x}`}
                     dur={`${3 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      <path d="M240 40 L252 46 M240 100 L252 100 M240 148 L252 142"
            stroke="#34d399" strokeWidth="2" strokeLinecap="round" />

      <text x="130" y="176" textAnchor="middle" fontSize="9" fill="#94a3b8">
        partikel bergerak dalam ruang tertutup
      </text>
    </svg>
  );
}

/* =========================================================================
 * TUMBUKAN PARTIKEL — partikel menabrak dinding dengan efek impact
 * ========================================================================= */
export function ParticleCollisionIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 180" className={className} role="img" aria-label="Ilustrasi tumbukan partikel pada dinding">
      <defs>
        <linearGradient id="wallG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="impactG">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
        </marker>
      </defs>

      <rect x="16" y="16" width="228" height="148" rx="14"
            fill="rgba(2,6,23,0.55)" stroke="#334155" strokeWidth="1" />

      <rect x="222" y="16" width="22" height="148" rx="4" fill="url(#wallG)" opacity="0.55" />
      <line x1="222" y1="16" x2="222" y2="164" stroke="#34d399" strokeWidth="3" />

      {[
        [50, 45], [110, 70], [70, 105], [150, 40],
        [130, 100], [180, 60], [90, 130], [160, 130],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6"
                fill="rgba(34,211,238,0.9)" stroke="#67e8f9" strokeWidth="0.8">
          <animate attributeName="cx" values={`${x};${x + 8};${x}`}
                   dur={`${2 + (i % 4) * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${y};${y + 6};${y}`}
                   dur={`${2.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      <circle cx="196" cy="90" r="7"
              fill="rgba(251,191,36,0.95)" stroke="#f59e0b" strokeWidth="1" />

      <path d="M148 90 L182 90"
            stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#arrowHead)" />

      <circle cx="222" cy="90" r="24" fill="url(#impactG)" opacity="0.7">
        <animate attributeName="r" values="20;28;20" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
      </circle>

      <text x="130" y="176" textAnchor="middle" fontSize="9" fill="#94a3b8">
        tumbukan partikel → gaya pada dinding → tekanan
      </text>
    </svg>
  );
}

/* =========================================================================
 * MOLEKUL GAS — molekul warna-warni dengan gerak acak
 * ========================================================================= */
export function GasMoleculeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 180" className={className} role="img" aria-label="Visualisasi molekul gas bergerak">
      <defs>
        <radialGradient id="mCyan">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="55%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="mGreen">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="55%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="mBlue">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="55%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="mAmber">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <rect x="16" y="16" width="228" height="148" rx="14"
            fill="rgba(2,6,23,0.55)" stroke="#334155" strokeWidth="1" />

      <circle cx="60" cy="60" r="16" fill="url(#mCyan)">
        <animate attributeName="cx" values="60;75;50;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;55;70;60" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="100" r="12" fill="url(#mGreen)">
        <animate attributeName="cx" values="110;95;120;110" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="100;110;95;100" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="170" cy="55" r="18" fill="url(#mBlue)">
        <animate attributeName="cx" values="170;185;160;170" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="55;70;45;55" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="210" cy="110" r="10" fill="url(#mAmber)">
        <animate attributeName="cx" values="210;200;220;210" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="110;120;100;110" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="45" cy="130" r="9" fill="url(#mCyan)">
        <animate attributeName="cx" values="45;55;40;45" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="130;120;135;130" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="135" cy="45" r="8" fill="url(#mGreen)">
        <animate attributeName="cx" values="135;145;128;135" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="145" r="7" fill="url(#mBlue)">
        <animate attributeName="cx" values="90;100;85;90" dur="2.8s" repeatCount="indefinite" />
      </circle>

      <text x="130" y="176" textAnchor="middle" fontSize="9" fill="#94a3b8">
        molekul bergerak ke segala arah
      </text>
    </svg>
  );
}