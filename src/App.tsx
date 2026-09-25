import { useState, useEffect, useCallback } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Preset {
  id: string;
  name: string;
  type: string;
  decay: string;
  mix: string;
  p1: string;
  p2: string;
  p3: string;
  createdAt: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const CLOCK_POSITIONS = [
  '7h', '8h', '9h', '10h', '11h', '12h', '1h', '2h', '3h', '4h', '5h'
];

const REVERB_TYPES = [
  { name: 'Spring', icon: '🌀', color: '#4fc3f7' },
  { name: 'Shimmer', icon: '✨', color: '#ce93d8' },
  { name: 'Cloud', icon: '☁️', color: '#90caf9' },
  { name: 'Plate', icon: '🪞', color: '#b0bec5' },
  { name: 'Hall', icon: '🏛️', color: '#a5d6a7' },
  { name: 'Room', icon: '🏠', color: '#ffcc80' },
  { name: 'Blom', icon: '💥', color: '#ef9a9a' },
  { name: 'Swel', icon: '🌊', color: '#80cbc4' },
  { name: 'Lofi', icon: '📻', color: '#fff59d' },
];

const KNOB_LABELS: { key: keyof Pick<Preset, 'decay' | 'mix' | 'p1' | 'p2' | 'p3'>; label: string }[] = [
  { key: 'decay', label: 'Decay' },
  { key: 'mix', label: 'Mix' },
  { key: 'p1', label: 'Param 1' },
  { key: 'p2', label: 'Param 2' },
  { key: 'p3', label: 'Param 3' },
];

const DEFAULT_PRESET: Omit<Preset, 'id' | 'createdAt'> = {
  name: '',
  type: 'Spring',
  decay: '12h',
  mix: '12h',
  p1: '12h',
  p2: '12h',
  p3: '12h',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadPresets(): Preset[] {
  try {
    const data = localStorage.getItem('m-vave-presets');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function savePresets(data: Preset[]) {
  localStorage.setItem('m-vave-presets', JSON.stringify(data));
}

function getReverbInfo(typeName: string) {
  return REVERB_TYPES.find(t => t.name === typeName) || REVERB_TYPES[0];
}

// Converte posição do relógio em ângulo (7h = -150°, 5h = +150°)
function clockToAngle(position: string): number {
  const idx = CLOCK_POSITIONS.indexOf(position);
  if (idx === -1) return 0;
  // 7h = -150°, 5h = +150°, distribuídos em 10 passos
  return -150 + (idx * 30);
}

// ─── Componente Pedal Visual ─────────────────────────────────────────────────
function PedalVisual({ preset }: { preset: Preset }) {
  const reverbInfo = getReverbInfo(preset.type);
  
  const getKnobAngle = (value: string) => {
    const idx = CLOCK_POSITIONS.indexOf(value);
    if (idx === -1) return 0;
    return -150 + (idx * 30);
  };

  const renderKnob = (x: number, y: number, value: string, label: string, size = 36) => {
    const angle = getKnobAngle(value);
    const r = size / 2;
    const indicatorLength = r - 5;
    const rad = (angle - 90) * (Math.PI / 180);
    const x2 = x + indicatorLength * Math.cos(rad);
    const y2 = y + indicatorLength * Math.sin(rad);

    return (
      <g key={label}>
        {/* Tick marks */}
        {CLOCK_POSITIONS.map((pos, i) => {
          const tickAngle = -150 + (i * 30);
          const tickRad = (tickAngle - 90) * (Math.PI / 180);
          const innerR = r + 3;
          const outerR = r + 7;
          const isActive = pos === value;
          return (
            <line
              key={i}
              x1={x + innerR * Math.cos(tickRad)}
              y1={y + innerR * Math.sin(tickRad)}
              x2={x + outerR * Math.cos(tickRad)}
              y2={y + outerR * Math.sin(tickRad)}
              stroke={isActive ? reverbInfo.color : '#555'}
              strokeWidth={isActive ? 2.5 : 1}
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Base do knob */}
        <circle cx={x} cy={y} r={r} fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <circle cx={x} cy={y} r={r - 3} fill="#2a2a2a" />
        
        {/* Centro */}
        <circle cx={x} cy={y} r={3.5} fill="#444" />
        
        {/* Indicador */}
        <line
          x1={x} y1={y}
          x2={x2} y2={y2}
          stroke={reverbInfo.color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={x2} cy={y2} r="2.5" fill={reverbInfo.color} />
        
        {/* Label */}
        <text
          x={x}
          y={y + r + 16}
          textAnchor="middle"
          fontSize="9"
          fill="#999"
          fontFamily="system-ui, sans-serif"
        >
          {label}
        </text>
        <text
          x={x}
          y={y + r + 27}
          textAnchor="middle"
          fontSize="8"
          fill="#fff"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full flex justify-center py-2">
      <svg viewBox="0 0 260 320" className="w-full max-w-[260px]">
        <defs>
          <linearGradient id={`pedalGrad-${preset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5a623" />
            <stop offset="50%" stopColor="#e09500" />
            <stop offset="100%" stopColor="#c47f00" />
          </linearGradient>
          <filter id={`pedalShadow-${preset.id}`}>
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.4" />
          </filter>
        </defs>
        
        {/* Sombra */}
        <rect x="18" y="18" width="224" height="284" rx="18" fill="#000" opacity="0.3" filter={`url(#pedalShadow-${preset.id})`} />
        
        {/* Corpo principal */}
        <rect x="18" y="18" width="224" height="284" rx="18" fill={`url(#pedalGrad-${preset.id})`} />
        
        {/* Borda interna */}
        <rect x="22" y="22" width="216" height="276" rx="16" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.2" />
        
        {/* Parafusos nos cantos */}
        <circle cx="34" cy="34" r="4" fill="#c47f00" stroke="#a06800" strokeWidth="1" />
        <circle cx="226" cy="34" r="4" fill="#c47f00" stroke="#a06800" strokeWidth="1" />
        <circle cx="34" cy="286" r="4" fill="#c47f00" stroke="#a06800" strokeWidth="1" />
        <circle cx="226" cy="286" r="4" fill="#c47f00" stroke="#a06800" strokeWidth="1" />
        
        {/* Área dos knobs (painel escuro) */}
        <rect x="30" y="45" width="200" height="180" rx="10" fill="#111" opacity="0.85" />
        <rect x="30" y="45" width="200" height="180" rx="10" fill="none" stroke="#333" strokeWidth="0.5" />
        
        {/* Knobs linha superior: Decay, Mix, Param1 */}
        {renderKnob(72, 90, preset.decay, 'Decay', 32)}
        {renderKnob(130, 90, preset.mix, 'Mix', 32)}
        {renderKnob(188, 90, preset.p1, 'Param 1', 32)}
        
        {/* Seletor central de tipo */}
        <circle cx="130" cy="155" r="22" fill="#111" stroke="#444" strokeWidth="1.5" />
        <circle cx="130" cy="155" r="18" fill="#1a1a1a" />
        <text
          x="130"
          y="151"
          textAnchor="middle"
          fontSize="16"
        >
          {reverbInfo.icon}
        </text>
        <text
          x="130"
          y="167"
          textAnchor="middle"
          fontSize="9"
          fill={reverbInfo.color}
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {preset.type}
        </text>
        
        {/* Knobs linha inferior: Param2, Param3 */}
        {renderKnob(88, 195, preset.p2, 'Param 2', 32)}
        {renderKnob(172, 195, preset.p3, 'Param 3', 32)}
        
        {/* LED indicador */}
        <circle cx="130" cy="240" r="4" fill={reverbInfo.color} opacity="0.9" />
        <circle cx="130" cy="240" r="6" fill={reverbInfo.color} opacity="0.2" />
        
        {/* Logo */}
        <text
          x="130"
          y="262"
          textAnchor="middle"
          fontSize="12"
          fill="#000"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          opacity="0.6"
        >
          M-VAVE
        </text>
        <text
          x="130"
          y="276"
          textAnchor="middle"
          fontSize="8"
          fill="#000"
          fontFamily="system-ui, sans-serif"
          opacity="0.5"
        >
          MINI UNIVERSE
        </text>
        
        {/* Footswitch */}
        <circle cx="130" cy="295" r="10" fill="#333" stroke="#555" strokeWidth="1" />
        <circle cx="130" cy="295" r="6" fill="#2a2a2a" />
      </svg>
    </div>
  );
}

// ─── Componente Knob Visual ───────────────────────────────────────────────────
function KnobVisual({ value, label, color = '#f5a623', size = 64 }: { 
  value: string; 
  label: string; 
  color?: string; 
  size?: number;
}) {
  const angle = clockToAngle(value);
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  
  // Indicador do knob
  const indicatorLength = r - 8;
  const rad = (angle - 90) * (Math.PI / 180);
  const x2 = cx + indicatorLength * Math.cos(rad);
  const y2 = cy + indicatorLength * Math.sin(rad);

  // Tick marks
  const ticks = CLOCK_POSITIONS.map((pos, i) => {
    const tickAngle = -150 + (i * 30);
    const tickRad = (tickAngle - 90) * (Math.PI / 180);
    const innerR = r - 3;
    const outerR = r + 1;
    return {
      x1: cx + innerR * Math.cos(tickRad),
      y1: cy + innerR * Math.sin(tickRad),
      x2: cx + outerR * Math.cos(tickRad),
      y2: cy + outerR * Math.sin(tickRad),
      isActive: pos === value,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Fundo do knob */}
        <circle cx={cx} cy={cy} r={r - 4} fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1.5" />
        
        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1} y1={tick.y1}
            x2={tick.x2} y2={tick.y2}
            stroke={tick.isActive ? color : '#555'}
            strokeWidth={tick.isActive ? 2 : 1}
            strokeLinecap="round"
          />
        ))}
        
        {/* Centro do knob */}
        <circle cx={cx} cy={cy} r={6} fill="#3a3a3a" />
        
        {/* Indicador */}
        <line
          x1={cx} y1={cy}
          x2={x2} y2={y2}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={x2} cy={y2} r="2.5" fill={color} />
      </svg>
      <span className="text-[10px] text-[#a0a0a0] mt-0.5 leading-tight text-center">{label}</span>
      <span className="text-xs font-bold text-white leading-tight">{value}</span>
    </div>
  );
}

// ─── Componente Knob Selector (para formulário) ──────────────────────────────
function KnobSelector({ label, value, onChange }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <label className="text-xs text-[#a0a0a0] mb-1 font-medium">{label}</label>
      <div className="relative">
        <KnobVisual value={value} label="" size={56} />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-label={label}
        />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full p-1.5 bg-[#2a2a2a] border border-[#333] rounded text-[#e0e0e0] text-xs text-center outline-none focus:border-[#f5a623]"
      >
        {CLOCK_POSITIONS.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Componente Preset Card ──────────────────────────────────────────────────
function PresetCard({ preset, onEdit, onDelete }: { 
  preset: Preset; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reverbInfo = getReverbInfo(preset.type);

  return (
    <div className="bg-[#1e1e1e] rounded-2xl shadow-lg border border-[#2a2a2a] relative overflow-hidden">
      {/* Barra de cor do tipo */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: reverbInfo.color }} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 mt-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">{preset.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-base">{reverbInfo.icon}</span>
              <span className="text-sm font-semibold" style={{ color: reverbInfo.color }}>
                {preset.type}
              </span>
            </div>
          </div>
          {showConfirm ? (
            <div className="flex gap-1.5 ml-2">
              <button
                onClick={onDelete}
                className="px-2.5 py-1 bg-[#cf6679] text-white text-xs font-bold rounded-lg cursor-pointer active:scale-95 transition-transform"
              >
                ✓ Sim
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2.5 py-1 bg-[#333] text-[#e0e0e0] text-xs font-bold rounded-lg cursor-pointer active:scale-95 transition-transform"
              >
                ✕ Não
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5 ml-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-2.5 py-1 bg-[#2a2a2a] text-[#a0a0a0] text-xs font-bold rounded-lg cursor-pointer hover:text-[#f5a623] active:scale-95 transition-all"
                aria-label={expanded ? 'Ver knobs' : 'Ver pedal'}
                title={expanded ? 'Ver knobs' : 'Ver pedal'}
              >
                {expanded ? '🎛️' : '🎸'}
              </button>
              <button
                onClick={onEdit}
                className="px-2.5 py-1 bg-[#2a2a2a] text-[#a0a0a0] text-xs font-bold rounded-lg cursor-pointer hover:text-[#f5a623] active:scale-95 transition-all"
                aria-label="Editar"
              >
                ✏️
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-2.5 py-1 bg-[#2a2a2a] text-[#a0a0a0] text-xs font-bold rounded-lg cursor-pointer hover:text-[#cf6679] active:scale-95 transition-all"
                aria-label="Apagar"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Vista expandida: Pedal visual */}
        {expanded ? (
          <div className="animate-in">
            <PedalVisual preset={preset} />
            <button
              onClick={() => setExpanded(false)}
              className="w-full mt-2 py-1.5 text-xs text-[#a0a0a0] bg-[#2a2a2a] rounded-lg cursor-pointer hover:text-white transition-colors"
            >
              ▲ Ver knobs
            </button>
          </div>
        ) : (
          <>
            {/* Vista padrão: Knobs visuais */}
            <div className="flex justify-around items-center py-2 bg-[#161616] rounded-xl">
              <KnobVisual value={preset.decay} label="Decay" color={reverbInfo.color} size={56} />
              <KnobVisual value={preset.mix} label="Mix" color={reverbInfo.color} size={56} />
              <KnobVisual value={preset.p1} label="P1" color={reverbInfo.color} size={56} />
              <KnobVisual value={preset.p2} label="P2" color={reverbInfo.color} size={56} />
              <KnobVisual value={preset.p3} label="P3" color={reverbInfo.color} size={56} />
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="w-full mt-2 py-1.5 text-xs text-[#a0a0a0] bg-[#2a2a2a] rounded-lg cursor-pointer hover:text-white transition-colors"
            >
              ▼ Ver pedal
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [presets, setPresets] = useState<Preset[]>(loadPresets());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Preset, 'id' | 'createdAt'>>(DEFAULT_PRESET);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  const openNew = useCallback(() => {
    setEditId(null);
    setFormData(DEFAULT_PRESET);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    setEditId(id);
    setFormData({
      name: preset.name,
      type: preset.type,
      decay: preset.decay,
      mix: preset.mix,
      p1: preset.p1,
      p2: preset.p2,
      p3: preset.p3,
    });
    setShowForm(true);
  }, [presets]);

  const cancelForm = useCallback(() => {
    setShowForm(false);
    setEditId(null);
  }, []);

  const saveForm = useCallback(() => {
    if (!formData.name.trim()) {
      alert('Dê um nome para o preset!');
      return;
    }
    if (editId) {
      setPresets(prev => prev.map(p => p.id === editId ? { ...p, ...formData } : p));
    } else {
      const newPreset: Preset = {
        ...formData,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      setPresets(prev => [newPreset, ...prev]);
    }
    cancelForm();
  }, [formData, editId, cancelForm]);

  const deletePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const filteredPresets = presets.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reverbInfo = getReverbInfo(formData.type);

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-sm border-b border-[#2a2a2a] px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#1e1e1e] border-2 border-[#f5a623] flex items-center justify-center text-lg">
              🎸
            </div>
            <div>
              <h1 className="text-[#f5a623] font-bold text-base leading-tight">Meu Reverb</h1>
              <p className="text-[#666] text-[10px] leading-tight">M-Vave Mini Universe</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#666]">{presets.length} preset{presets.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {/* Formulário */}
        {showForm && (
          <div className="bg-[#1e1e1e] rounded-2xl p-4 mb-4 shadow-xl border border-[#2a2a2a] animate-in">
            <h2 className="text-[#f5a623] text-lg font-bold mb-4 flex items-center gap-2">
              {editId ? '✏️ Editar Preset' : '✨ Novo Preset'}
            </h2>

            {/* Nome */}
            <div className="mb-3">
              <label className="block text-xs text-[#a0a0a0] mb-1 font-medium">Nome da Música / Preset</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="Ex: Adoração, Ocean Eyes..."
                className="w-full p-2.5 bg-[#2a2a2a] border border-[#333] rounded-xl text-[#e0e0e0] text-sm outline-none focus:border-[#f5a623] transition-colors placeholder:text-[#555]"
                autoFocus
              />
            </div>

            {/* Tipo de Reverb */}
            <div className="mb-4">
              <label className="block text-xs text-[#a0a0a0] mb-2 font-medium">Tipo de Reverb</label>
              <div className="grid grid-cols-3 gap-2">
                {REVERB_TYPES.map(type => (
                  <button
                    key={type.name}
                    onClick={() => updateField('type', type.name)}
                    className={`p-2 rounded-xl text-center transition-all cursor-pointer active:scale-95 ${
                      formData.type === type.name
                        ? 'border-2 shadow-lg'
                        : 'bg-[#2a2a2a] border-2 border-transparent'
                    }`}
                    style={formData.type === type.name ? {
                      borderColor: type.color,
                      background: `${type.color}15`,
                      boxShadow: `0 0 12px ${type.color}30`
                    } : {}}
                  >
                    <span className="text-lg block">{type.icon}</span>
                    <span className="text-[10px] font-bold block mt-0.5" style={{
                      color: formData.type === type.name ? type.color : '#a0a0a0'
                    }}>
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Knobs */}
            <div className="mb-4">
              <label className="block text-xs text-[#a0a0a0] mb-2 font-medium">Posições dos Knobs</label>
              <div className="grid grid-cols-5 gap-1">
                {KNOB_LABELS.map(({ key, label }) => (
                  <KnobSelector
                    key={key}
                    label={label}
                    value={formData[key]}
                    onChange={v => updateField(key, v)}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-4 p-3 bg-[#161616] rounded-xl">
              <p className="text-[10px] text-[#666] mb-2 uppercase tracking-wider">Preview</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white truncate">{formData.name || 'Sem nome'}</p>
                  <p className="text-xs" style={{ color: reverbInfo.color }}>
                    {reverbInfo.icon} {formData.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <KnobVisual value={formData.decay} label="" size={32} color={reverbInfo.color} />
                  <KnobVisual value={formData.mix} label="" size={32} color={reverbInfo.color} />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={saveForm}
                className="flex-1 py-3 bg-[#f5a623] text-black font-bold rounded-xl text-sm cursor-pointer hover:bg-[#e09500] active:scale-[0.98] transition-all"
              >
                💾 Salvar
              </button>
              <button
                onClick={cancelForm}
                className="flex-1 py-3 bg-[#2a2a2a] text-[#a0a0a0] font-bold rounded-xl text-sm cursor-pointer hover:bg-[#333] active:scale-[0.98] transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Busca */}
        {!showForm && presets.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar presets..."
              className="w-full p-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl text-[#e0e0e0] text-sm outline-none focus:border-[#f5a623] transition-colors placeholder:text-[#555]"
            />
          </div>
        )}

        {/* Lista de Presets */}
        <div className="space-y-3">
          {filteredPresets.length === 0 && !showForm && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🎵</div>
              <p className="text-[#a0a0a0] text-sm">
                {presets.length === 0
                  ? 'Nenhum preset salvo ainda.'
                  : 'Nenhum preset encontrado.'}
              </p>
              {presets.length === 0 && (
                <p className="text-[#666] text-xs mt-1">
                  Toque no botão abaixo para criar seu primeiro!
                </p>
              )}
            </div>
          )}

          {filteredPresets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onEdit={() => openEdit(preset.id)}
              onDelete={() => deletePreset(preset.id)}
            />
          ))}
        </div>
      </main>

      {/* FAB - Botão Flutuante */}
      {!showForm && (
        <button
          onClick={openNew}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#f5a623] text-black rounded-full shadow-lg shadow-[#f5a623]/30 flex items-center justify-center text-2xl font-bold cursor-pointer hover:bg-[#e09500] active:scale-90 transition-all z-40"
          aria-label="Novo Preset"
        >
          +
        </button>
      )}
    </div>
  );
}
