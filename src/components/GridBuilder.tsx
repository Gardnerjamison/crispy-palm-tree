import { useState } from 'react';
import type { Zone } from '../types';

interface GridBuilderProps {
  zones: Zone[];
  gridWidth: number;
  gridHeight: number;
  onSave: (zones: Zone[], gridWidth: number, gridHeight: number) => void;
  onClose: () => void;
}

export function GridBuilder({ zones: initialZones, onSave, onClose }: GridBuilderProps) {
  const [gridSize, setGridSize] = useState<'12x8' | '16x12' | '24x16'>('12x8');
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCell, setStartCell] = useState<{ x: number; y: number } | null>(null);
  const [previewZone, setPreviewZone] = useState<Zone | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [zoneName, setZoneName] = useState('');
  const [hasRacks, setHasRacks] = useState(false);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

  const gridDimensions = {
    '12x8': { width: 12, height: 8 },
    '16x12': { width: 16, height: 12 },
    '24x16': { width: 24, height: 16 },
  };

  const currentGrid = gridDimensions[gridSize];

  const handleMouseDown = (x: number, y: number) => {
    setIsDrawing(true);
    setStartCell({ x, y });
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing || !startCell) return;

    const minX = Math.min(startCell.x, x);
    const minY = Math.min(startCell.y, y);
    const maxX = Math.max(startCell.x, x);
    const maxY = Math.max(startCell.y, y);

    const preview: Zone = {
      id: 'preview',
      name: zoneName || `Zone ${zones.length + 1}`,
      color: selectedColor,
      hasRacks,
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    };

    setPreviewZone(preview);
  };

  const handleMouseUp = () => {
    if (previewZone && isDrawing) {
      const newZone: Zone = {
        ...previewZone,
        id: `z${Date.now()}`,
      };
      setZones([...zones, newZone]);
      setZoneName('');
    }
    setIsDrawing(false);
    setStartCell(null);
    setPreviewZone(null);
  };

  const deleteZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const handleSave = () => {
    onSave(zones, currentGrid.width, currentGrid.height);
    onClose();
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < currentGrid.height; y++) {
      for (let x = 0; x < currentGrid.width; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            className="border border-gray-600 hover:bg-gray-500 transition-colors cursor-crosshair aspect-square"
            onMouseDown={() => handleMouseDown(x, y)}
            onMouseEnter={() => {
              if (isDrawing) handleMouseMove(x, y);
            }}
            onTouchStart={() => handleMouseDown(x, y)}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const element = document.elementFromPoint(touch.clientX, touch.clientY);
              if (element) {
                const cellKey = element.getAttribute('data-cell');
                if (cellKey) {
                  const [cellX, cellY] = cellKey.split('-').map(Number);
                  handleMouseMove(cellX, cellY);
                }
              }
            }}
            onTouchEnd={handleMouseUp}
            data-cell={`${x}-${y}`}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Grid Layout Builder</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-3xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Grid Size Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Grid Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['12x8', '16x12', '24x16'] as const).map(size => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                gridSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Controls */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white font-semibold mb-3">Draw New Zone</h3>

        <div className="mb-3">
          <label className="block text-sm text-gray-300 mb-1">Zone Name (optional)</label>
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder={`Zone ${zones.length + 1}`}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-300 mb-1">Color</label>
          <div className="grid grid-cols-8 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-10 rounded border-2 transition-all ${
                  selectedColor === color ? 'border-white scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              checked={hasRacks}
              onChange={(e) => setHasRacks(e.target.checked)}
              className="mr-2"
            />
            Rack Storage (Column/Row/Level)
          </label>
        </div>

        <div className="text-sm text-gray-400 bg-gray-900 p-3 rounded">
          <strong>Instructions:</strong> Click and drag on the grid below to draw a zone
        </div>
      </div>

      {/* Grid */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Warehouse Grid - Click and drag to create zones
        </label>
        <div
          className="bg-gray-800 p-4 rounded-lg overflow-x-auto"
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <div className="relative">
            <div
              className="grid gap-0 select-none relative"
              style={{
                gridTemplateColumns: `repeat(${currentGrid.width}, minmax(0, 1fr))`,
                aspectRatio: `${currentGrid.width}/${currentGrid.height}`,
                maxWidth: '100%',
              }}
            >
              {renderGrid()}
            </div>

            {/* Existing zones */}
            {zones.map(zone => (
              <div
                key={zone.id}
                className="absolute border-2 border-gray-900 rounded pointer-events-none"
                style={{
                  left: `${(zone.x / currentGrid.width) * 100}%`,
                  top: `${(zone.y / currentGrid.height) * 100}%`,
                  width: `${(zone.width / currentGrid.width) * 100}%`,
                  height: `${(zone.height / currentGrid.height) * 100}%`,
                  backgroundColor: zone.color + '80',
                }}
              >
                <div className="text-[10px] font-semibold text-white p-1 truncate">
                  {zone.name}
                </div>
              </div>
            ))}

            {/* Preview zone */}
            {previewZone && (
              <div
                className="absolute border-2 border-white rounded pointer-events-none animate-pulse"
                style={{
                  left: `${(previewZone.x / currentGrid.width) * 100}%`,
                  top: `${(previewZone.y / currentGrid.height) * 100}%`,
                  width: `${(previewZone.width / currentGrid.width) * 100}%`,
                  height: `${(previewZone.height / currentGrid.height) * 100}%`,
                  backgroundColor: previewZone.color + '60',
                }}
              >
                <div className="text-xs font-semibold text-white p-1">
                  {previewZone.name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone List */}
      {zones.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">Created Zones</h3>
          <div className="space-y-2">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <div>
                    <div className="text-white font-medium">{zone.name}</div>
                    <div className="text-xs text-gray-400">
                      {zone.hasRacks ? 'Racks' : 'Floor'} • {zone.width}×{zone.height}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteZone(zone.id)}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Save Layout
        </button>
        <button
          onClick={() => setZones([])}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
