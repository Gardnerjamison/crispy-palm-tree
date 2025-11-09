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

    // Different styling for rack vs floor zones to show vertical separation
    const isRackZone = zone.hasRacks;

    // Rack zones: darker, elevated appearance with stronger shadow
    // Floor zones: lighter, flat appearance
    const zoneStyle = isRackZone ? {
      backgroundColor: zone.color + '60', // More opaque for racks
      border: isHighlighted ? '3px solid #ffcc00' : '3px solid ' + zone.color,
      borderTopColor: isHighlighted ? '#ffff66' : zone.color,
      borderLeftColor: isHighlighted ? '#ffff66' : zone.color,
      boxShadow: isHighlighted
        ? '0 0 10px rgba(255, 204, 0, 0.8), 4px 4px 8px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(0,0,0,0.2)'
        : '4px 4px 8px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(0,0,0,0.2)', // Strong shadow = elevated
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0,0,0,0.05) 10px,
        rgba(0,0,0,0.05) 20px
      )` // Diagonal lines pattern for racks
    } : {
      backgroundColor: zone.color + '30', // More transparent for floor
      border: isHighlighted ? '3px solid #ffcc00' : '2px solid ' + zone.color,
      borderTopColor: isHighlighted ? '#ffff66' : zone.color + 'aa',
      borderLeftColor: isHighlighted ? '#ffff66' : zone.color + 'aa',
      boxShadow: isHighlighted
        ? '0 0 8px rgba(255, 204, 0, 0.6), inset 1px 1px 2px rgba(255,255,255,0.3)'
        : 'inset 1px 1px 2px rgba(255,255,255,0.3)' // Subtle shadow = ground level
    };

    return (
      <div
        key={zone.id}
        className="absolute rounded p-2 transition-all"
        style={{
          left: `${(zone.x / layout.gridWidth) * 100}%`,
          top: `${(zone.y / layout.gridHeight) * 100}%`,
          width: `${(zone.width / layout.gridWidth) * 100}%`,
          height: `${(zone.height / layout.gridHeight) * 100}%`,
          fontFamily: 'Tahoma, sans-serif',
          ...zoneStyle
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-1">
            <div className="text-xs font-bold" style={{
              color: '#000080',
              textShadow: '1px 1px 1px rgba(255,255,255,0.5)'
            }}>
              {zone.name}
            </div>
            {isRackZone && (
              <span className="text-xs" style={{ color: '#666' }}>↑</span>
            )}
          </div>
          <div className="text-xs font-semibold" style={{
            color: isRackZone ? '#8b4513' : '#2d5016',
            textShadow: '1px 1px 1px rgba(255,255,255,0.7)'
          }}>
            {zone.hasRacks ? '📦 Elevated Racks' : '🏢 Ground Floor'}
          </div>
          <div className="mt-auto text-sm font-bold" style={{
            color: '#000080',
            textShadow: '1px 1px 1px rgba(255,255,255,0.5)'
          }}>
            {unitsCount} {unitsCount === 1 ? 'unit' : 'units'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-full flex flex-col" style={{
      background: '#ece9d8',
      border: '3px solid #0831d9',
      borderTopColor: '#5a9fd4',
      borderLeftColor: '#5a9fd4'
    }}>
      {/* XP-style title bar */}
      <div className="p-2 flex items-center justify-between" style={{
        background: 'linear-gradient(to bottom, #0054e3 0%, #3d95d9 50%, #0054e3 100%)'
      }}>
        <h2 className="text-base font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)', fontFamily: 'Tahoma, sans-serif' }}>
          {layout.name}
        </h2>
        <button
          onClick={onEditLayout}
          className="text-white text-xs font-bold py-1 px-3 rounded transition-all"
          style={{
            background: 'linear-gradient(to bottom, #d4a5ff 0%, #b366ff 50%, #9933ff 100%)',
            border: '2px solid #9933ff',
            borderTopColor: '#e8d5ff',
            borderLeftColor: '#e8d5ff',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
            fontFamily: 'Tahoma, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, #e0b8ff 0%, #c780ff 50%, #ad47ff 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, #d4a5ff 0%, #b366ff 50%, #9933ff 100%)';
          }}
        >
          🏗️ Edit Layout
        </button>
      </div>

      {/* Map content */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="relative w-full aspect-[3/2] rounded" style={{
          background: '#ffffff',
          border: '2px solid #7f9db9',
          borderTopColor: '#003c74',
          borderLeftColor: '#003c74',
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          {layout.zones.map(renderZone)}
        </div>

        {selectedUnit && (
          <div className="mt-3 p-2 rounded" style={{
            background: '#ffffcc',
            border: '2px solid #ffcc00',
            fontFamily: 'Tahoma, sans-serif'
          }}>
            <div className="text-sm font-bold" style={{ color: '#000080' }}>
              Selected: {selectedUnit.brand} {selectedUnit.model}
            </div>
            <div className="text-xs" style={{ color: '#666' }}>
              Serial: {selectedUnit.serialNumber}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
