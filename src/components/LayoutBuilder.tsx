import { useState } from 'react';
import { GridBuilder } from './GridBuilder';
import type { Zone } from '../types';

interface LayoutBuilderProps {
  zones: Zone[];
  gridWidth: number;
  gridHeight: number;
  onSave: (zones: Zone[], gridWidth?: number, gridHeight?: number) => void;
  onClose: () => void;
}

export function LayoutBuilder({ zones: initialZones, gridWidth, gridHeight, onSave, onClose }: LayoutBuilderProps) {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [showGridBuilder, setShowGridBuilder] = useState(false);

  // Expanded color palette with various shades for better zone differentiation
  const colors = [
    // Blues
    '#3b82f6', '#1e40af', '#60a5fa', '#0ea5e9',
    // Greens
    '#10b981', '#047857', '#34d399', '#84cc16',
    // Yellows/Oranges
    '#f59e0b', '#d97706', '#fbbf24', '#fb923c',
    // Purples/Pinks
    '#8b5cf6', '#6366f1', '#a855f7', '#ec4899',
    // Reds
    '#ef4444', '#dc2626', '#f87171', '#fb7185',
    // Teals/Cyans
    '#06b6d4', '#0891b2', '#22d3ee', '#14b8a6',
    // Grays (for neutral zones)
    '#6b7280', '#9ca3af', '#4b5563', '#374151'
  ];

  // If showing grid builder
  if (showGridBuilder) {
    return (
      <GridBuilder
        zones={zones}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        onSave={(newZones, newWidth, newHeight) => {
          onSave(newZones, newWidth, newHeight);
        }}
        onClose={onClose}
      />
    );
  }

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
      if (editingZone?.id === id) setEditingZone(null);
    }
  };

  const handleSave = () => {
    onSave(zones);
    onClose();
  };

  // If editing a zone, show edit screen
  if (editingZone) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setEditingZone(null)}
              className="text-blue-400 text-lg font-semibold"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-white">Edit Zone</h2>
            <div className="w-16"></div>
          </div>

          <div className="space-y-6">
            {/* Zone Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zone Name
              </label>
              <input
                type="text"
                value={editingZone.name}
                onChange={(e) => updateZone(editingZone.id, { name: e.target.value })}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zone Color
              </label>

              {/* Preset Colors */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateZone(editingZone.id, { color })}
                    className={`h-12 rounded-lg border-3 transition-all ${
                      editingZone.color === color ? 'border-white ring-2 ring-white' : 'border-gray-700 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <label className="text-sm text-gray-300 font-medium">Custom Color:</label>
                <input
                  type="color"
                  value={editingZone.color}
                  onChange={(e) => updateZone(editingZone.id, { color: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer bg-gray-700 border-2 border-gray-600"
                />
                <input
                  type="text"
                  value={editingZone.color}
                  onChange={(e) => updateZone(editingZone.id, { color: e.target.value })}
                  placeholder="#3b82f6"
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Has Racks Toggle */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Rack Storage</div>
                  <div className="text-sm text-gray-400">Uses Column/Row/Level system</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingZone.hasRacks}
                  onChange={(e) => updateZone(editingZone.id, { hasRacks: e.target.checked })}
                  className="w-6 h-6"
                />
              </label>
            </div>

            {/* Position & Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position & Size (Grid Units)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">X Position</label>
                  <input
                    type="number"
                    min="0"
                    max={gridWidth - editingZone.width}
                    value={editingZone.x}
                    onChange={(e) => updateZone(editingZone.id, { x: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Y Position</label>
                  <input
                    type="number"
                    min="0"
                    max={gridHeight - editingZone.height}
                    value={editingZone.y}
                    onChange={(e) => updateZone(editingZone.id, { y: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Width</label>
                  <input
                    type="number"
                    min="1"
                    max={gridWidth - editingZone.x}
                    value={editingZone.width}
                    onChange={(e) => updateZone(editingZone.id, { width: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Height</label>
                  <input
                    type="number"
                    min="1"
                    max={gridHeight - editingZone.y}
                    value={editingZone.height}
                    onChange={(e) => updateZone(editingZone.id, { height: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Full Warehouse Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Warehouse Layout Preview
              </label>
              <div
                className="w-full bg-gray-800 rounded-lg border-2 border-gray-700 p-4"
                style={{
                  aspectRatio: `${gridWidth}/${gridHeight}`,
                }}
              >
                <div className="relative w-full h-full bg-gray-700 rounded">
                  {zones.map(zone => (
                    <div
                      key={zone.id}
                      className={`absolute border-2 rounded transition-all ${
                        editingZone.id === zone.id ? 'border-white border-4 z-10' : 'border-gray-900'
                      }`}
                      style={{
                        left: `${(zone.x / gridWidth) * 100}%`,
                        top: `${(zone.y / gridHeight) * 100}%`,
                        width: `${(zone.width / gridWidth) * 100}%`,
                        height: `${(zone.height / gridHeight) * 100}%`,
                        backgroundColor: zone.color + '60',
                      }}
                    >
                      <div className="p-1 text-[10px] font-semibold text-white truncate">
                        {zone.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteZone(editingZone.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Delete Zone
            </button>
          </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="min-h-screen bg-gray-950 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Layout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Warehouse Preview */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Layout
          </label>
          <div
            className="w-full bg-gray-800 rounded-lg border-2 border-gray-700 p-4"
            style={{
              aspectRatio: `${gridWidth}/${gridHeight}`,
            }}
          >
            <div className="relative w-full h-full bg-gray-700 rounded">
              {zones.map(zone => (
                <div
                  key={zone.id}
                  onClick={() => setEditingZone(zone)}
                  className="absolute border-2 border-gray-900 rounded cursor-pointer hover:border-white transition-all"
                  style={{
                    left: `${(zone.x / gridWidth) * 100}%`,
                    top: `${(zone.y / gridHeight) * 100}%`,
                    width: `${(zone.width / gridWidth) * 100}%`,
                    height: `${(zone.height / gridHeight) * 100}%`,
                    backgroundColor: zone.color + '60',
                  }}
                >
                  <div className="p-1 text-[10px] font-semibold text-white truncate">
                    {zone.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Grid Builder Button */}
        <button
          onClick={() => setShowGridBuilder(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-6 flex items-center justify-center gap-2"
        >
          <span className="text-xl">🎨</span>
          Visual Grid Builder - Draw Zones
        </button>

        {/* Zone List */}
        <div className="space-y-3 mb-6">
          {zones.map(zone => (
            <div
              key={zone.id}
              onClick={() => setEditingZone(zone)}
              className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700 active:scale-95 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: zone.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{zone.name}</div>
                  <div className="text-sm text-gray-400">
                    {zone.hasRacks ? '📦 Rack Storage' : '🏢 Floor Storage'}
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Zone Button */}
        <button
          onClick={addZone}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors mb-4"
        >
          + Add New Zone
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
        >
          Save Layout
        </button>
    </div>
  );
}
