import { useState, useEffect } from 'react';

interface Preset {
  id: string;
  name: string;
  type: string;
  decay: string;
  mix: string;
  p1: string;
  p2: string;
  p3: string;
}

const clockPositions = [
  '7h (Min)', '8h', '9h', '10h', '11h', '12h (Meio)', '1h', '2h', '3h', '4h', '5h (Max)'
];

const reverbTypes = ['Cloud', 'Hall', 'Plate', 'Spring', 'Shimmer', 'Room', 'Mod', 'Trem'];

const emptyPreset: Omit<Preset, 'id'> = {
  name: '',
  type: 'Cloud',
  decay: '12h (Meio)',
  mix: '12h (Meio)',
  p1: '12h (Meio)',
  p2: '12h (Meio)',
  p3: '12h (Meio)',
};

function getPresets(): Preset[] {
  try {
    return JSON.parse(localStorage.getItem('pedalPresets') || '[]');
  } catch {
    return [];
  }
}

function savePresets(data: Preset[]) {
  localStorage.setItem('pedalPresets', JSON.stringify(data));
}

export default function App() {
  const [presets, setPresets] = useState<Preset[]>(getPresets());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Preset, 'id'>>(emptyPreset);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  const openNewForm = () => {
    setEditId(null);
    setFormData(emptyPreset);
    setShowForm(true);
  };

  const openEditForm = (id: string) => {
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
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(emptyPreset);
  };

  const savePreset = () => {
    if (!formData.name.trim()) {
      alert('Dê um nome para o preset!');
      return;
    }

    if (editId) {
      setPresets(prev => prev.map(p => p.id === editId ? { ...formData, id: editId } : p));
    } else {
      const newPreset: Preset = { ...formData, id: Date.now().toString() };
      setPresets(prev => [...prev, newPreset]);
    }
    cancelForm();
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
  };

  const updateField = (field: keyof Omit<Preset, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] p-4 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-3 border-2 border-[#f5a623] shadow-lg shadow-[#f5a623]/20">
          <img 
            src="https://image.qwenlm.ai/generated-images/ad9513f9-75b8-48df-8d94-db801f356af9/_result.png" 
            alt="M-Vave Mini Universe" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-[#f5a623] text-2xl font-bold text-center">🎸 Meu Reverb</h1>
        <p className="text-[#a0a0a0] text-sm mt-1">M-Vave Mini Universe</p>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={openNewForm}
          className="w-full py-3 bg-[#f5a623] text-black font-bold rounded-lg text-base cursor-pointer hover:bg-[#e09500] transition-colors active:scale-[0.98]"
        >
          + Adicionar Novo Preset
        </button>
      )}

      {/* Form Card */}
      {showForm && (
        <div className="bg-[#1e1e1e] rounded-xl p-4 mb-4 shadow-lg">
          <h2 className="text-[#f5a623] text-lg font-bold mb-4">
            {editId ? `Editar: ${formData.name}` : 'Novo Preset'}
          </h2>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm text-[#a0a0a0] mb-1">Nome da Música / Preset</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Ex: Adoração"
              className="w-full p-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-[#e0e0e0] text-base outline-none focus:border-[#f5a623] transition-colors"
            />
          </div>

          {/* Reverb Type */}
          <div className="mb-3">
            <label className="block text-sm text-[#a0a0a0] mb-1">Tipo de Reverb</label>
            <select
              value={formData.type}
              onChange={e => updateField('type', e.target.value)}
              className="w-full p-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-[#e0e0e0] text-base outline-none focus:border-[#f5a623] transition-colors"
            >
              {reverbTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Knobs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <KnobSelect label="Decay" value={formData.decay} onChange={v => updateField('decay', v)} />
            <KnobSelect label="Mix" value={formData.mix} onChange={v => updateField('mix', v)} />
            <KnobSelect label="Param 1" value={formData.p1} onChange={v => updateField('p1', v)} />
            <KnobSelect label="Param 2" value={formData.p2} onChange={v => updateField('p2', v)} />
            <KnobSelect label="Param 3" value={formData.p3} onChange={v => updateField('p3', v)} />
          </div>

          {/* Buttons */}
          <button
            onClick={savePreset}
            className="w-full py-3 bg-[#f5a623] text-black font-bold rounded-lg text-base cursor-pointer hover:bg-[#e09500] transition-colors mb-2"
          >
            Salvar Preset
          </button>
          <button
            onClick={cancelForm}
            className="w-full py-3 bg-[#333] text-[#e0e0e0] font-bold rounded-lg text-base cursor-pointer hover:bg-[#444] transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Presets List */}
      <div className="mt-5 space-y-4">
        {presets.length === 0 && !showForm && (
          <p className="text-center text-[#a0a0a0]">Nenhum preset salvo ainda.</p>
        )}

        {presets.map(preset => (
          <div key={preset.id} className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[#f5a623] text-lg font-bold">{preset.name}</h2>
              {confirmDelete === preset.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="px-3 py-1 bg-[#cf6679] text-white text-xs font-bold rounded cursor-pointer hover:bg-[#b85567]"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1 bg-[#333] text-[#e0e0e0] text-xs font-bold rounded cursor-pointer hover:bg-[#444]"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(preset.id)}
                  className="px-3 py-1 border border-[#cf6679] text-[#cf6679] text-xs font-bold rounded cursor-pointer hover:bg-[#cf6679]/10 transition-colors"
                >
                  Apagar
                </button>
              )}
            </div>
            <p className="text-sm text-[#a0a0a0] italic mb-3">Tipo: {preset.type}</p>
            
            <div className="grid grid-cols-3 gap-2">
              <KnobDisplay label="Decay" value={preset.decay} />
              <KnobDisplay label="Mix" value={preset.mix} />
              <KnobDisplay label="Param 1" value={preset.p1} />
              <KnobDisplay label="Param 2" value={preset.p2} />
              <KnobDisplay label="Param 3" value={preset.p3} />
            </div>

            <button
              onClick={() => openEditForm(preset.id)}
              className="w-full mt-4 py-2.5 bg-[#333] text-[#e0e0e0] font-bold rounded-lg text-sm cursor-pointer hover:bg-[#444] transition-colors"
            >
              ✏️ Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnobSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-[#a0a0a0] mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-[#e0e0e0] text-sm outline-none focus:border-[#f5a623] transition-colors"
      >
        {clockPositions.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
    </div>
  );
}

function KnobDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-[#2a2a2a] p-2 rounded-lg">
      <span className="block text-xs text-[#a0a0a0] mb-1">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
