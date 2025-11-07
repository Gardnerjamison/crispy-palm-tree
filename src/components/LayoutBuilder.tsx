import { useState } from 'react';
import type { Zone } from '../types';

interface LayoutBuilderProps {
  zones: Zone[];
  gridWidth: number;
  gridHeight: number;
  onSave: (zones: Zone[]) => void;
  onClose: () => void;
}

export function LayoutBuilder({ zones: initialZones, gridWidth, gridHeight, onSave, onClose }: LayoutBuilderProps) {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

  const addZone = () => {
    const newZone: Zone = {
      id: `z${Date.now()}`,
      name: `Zone ${zones.length + 1}`,
      color: colors[zones.length % colors.length],
      hasRacks: false,
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    };
    setZones([...zones, newZone]);
    setEditingZone(newZone);
  };

  const updateZone = (id: string, updates: Partial<Zone>) => {
    setZones(zones.map(z => z.id === id ? { ...z, ...updates } : z));
    if (editingZone?.id === id) {
      setEditingZone({ ...editingZone, ...updates });
    }
  };

  const deleteZone = (id: string) => {
    if (window.confirm('Delete this zone?')) {
      setZones(zones.filter(z => z.id !== id));
      if (selectedZone?.id === id) setSelectedZone(null);
      if (editingZone?.id === id) setEditingZone(null);
    }
  };

  const handleSave = () => {
    onSave(zones);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Warehouse Layout Builder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Grid Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Layout Preview</h3>
              <div
                className="relative w-full bg-gray-700 rounded border-2 border-gray-600"
                style={{
                  aspectRatio: `${gridWidth}/${gridHeight}`,
                  backgroundImage: `
                    linear-gradient(to right, #4b5563 1px, transparent 1px),
                    linear-gradient(to bottom, #4b5563 1px, transparent 1px)
                  `,
                  backgroundSize: `${100/gridWidth}% ${100/gridHeight}%`
                }}
              >
                {zones.map(zone => (
                  <div
                    key={zone.id}
                    onClick={() => setEditingZone(zone)}
                    className={`absolute border-2 rounded cursor-pointer transition-all hover:opacity-80 ${
                      editingZone?.id === zone.id ? 'border-white border-4' : 'border-gray-900'
                    }`}
                    style={{
                      left: `${(zone.x / gridWidth) * 100}%`,
                      top: `${(zone.y / gridHeight) * 100}%`,
                      width: `${(zone.width / gridWidth) * 100}%`,
                      height: `${(zone.height / gridHeight) * 100}%`,
                      backgroundColor: zone.color + '40',
                    }}
                  >
                    <div className="p-2 text-xs font-semibold text-white truncate">
                      {zone.name}
                      <div className="text-[10px] text-gray-300">
                        {zone.hasRacks ? '📦 Racks' : '🏢 Floor'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={addZone}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              + Add Zone
            </button>
          </div>

          {/* Right: Zone Editor */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                {editingZone ? 'Edit Zone' : 'Select a zone to edit'}
              </h3>

              {editingZone && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Zone Name
                    </label>
                    <input
                      type="text"
                      value={editingZone.name}
                      onChange={(e) => updateZone(editingZone.id, { name: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => updateZone(editingZone.id, { color })}
                          className={`w-full h-8 rounded border-2 ${
                            editingZone.color === color ? 'border-white' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={editingZone.hasRacks}
                        onChange={(e) => updateZone(editingZone.id, { hasRacks: e.target.checked })}
                        className="rounded"
                      />
                      <span>Has Racks (Column/Row/Level)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        X Position
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={gridWidth - editingZone.width}
                        value={editingZone.x}
                        onChange={(e) => updateZone(editingZone.id, { x: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Y Position
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={gridHeight - editingZone.height}
                        value={editingZone.y}
                        onChange={(e) => updateZone(editingZone.id, { y: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={gridWidth - editingZone.x}
                        value={editingZone.width}
                        onChange={(e) => updateZone(editingZone.id, { width: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={gridHeight - editingZone.y}
                        value={editingZone.height}
                        onChange={(e) => updateZone(editingZone.id, { height: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => deleteZone(editingZone.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Delete Zone
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Save Layout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
