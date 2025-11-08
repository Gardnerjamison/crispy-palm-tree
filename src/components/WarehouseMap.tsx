import { useWarehouse } from '../context/WarehouseContext';
import type { Zone } from '../types';

interface WarehouseMapProps {
  onEditLayout: () => void;
}

export function WarehouseMap({ onEditLayout }: WarehouseMapProps) {
  const { layout, units, selectedUnit } = useWarehouse();

  const getUnitsInZone = (zoneId: string) => {
    return units.filter(u => {
      if (u.location.type === 'floor') {
        return u.location.zone === zoneId;
      } else {
        return u.location.zone === zoneId;
      }
    });
  };

  const isZoneHighlighted = (zoneId: string) => {
    if (!selectedUnit) return false;
    return selectedUnit.location.zone === zoneId;
  };

  const renderZone = (zone: Zone) => {
    const unitsCount = getUnitsInZone(zone.id).length;
    const isHighlighted = isZoneHighlighted(zone.id);

    return (
      <div
        key={zone.id}
        className={`absolute border-2 rounded-lg p-2 transition-all ${
          isHighlighted
            ? 'border-yellow-400 border-4 shadow-lg shadow-yellow-400/50'
            : 'border-gray-700'
        }`}
        style={{
          left: `${(zone.x / layout.gridWidth) * 100}%`,
          top: `${(zone.y / layout.gridHeight) * 100}%`,
          width: `${(zone.width / layout.gridWidth) * 100}%`,
          height: `${(zone.height / layout.gridHeight) * 100}%`,
          backgroundColor: zone.color + '20',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="text-xs font-semibold text-gray-200">
            {zone.name}
          </div>
          <div className="text-xs text-gray-400">
            {zone.hasRacks ? '📦 Racks' : '🏢 Floor'}
          </div>
          <div className="mt-auto text-sm font-bold" style={{ color: zone.color }}>
            {unitsCount} units
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{layout.name}</h2>
        <button
          onClick={onEditLayout}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-3 rounded transition-colors"
        >
          🏗️ Edit Layout
        </button>
      </div>
      <div className="relative w-full aspect-[3/2] bg-gray-800 rounded border-2 border-gray-700">
        {layout.zones.map(renderZone)}
      </div>
      {selectedUnit && (
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
          <div className="text-sm text-yellow-200">
            <strong>Selected:</strong> {selectedUnit.brand} {selectedUnit.model}
          </div>
          <div className="text-xs text-yellow-300 mt-1">
            Serial: {selectedUnit.serialNumber}
          </div>
        </div>
      )}
    </div>
  );
}
