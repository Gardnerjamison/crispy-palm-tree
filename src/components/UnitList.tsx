import { useWarehouse } from '../context/WarehouseContext';
import type { Unit } from '../types';

interface UnitListProps {
  onEditUnit: (unit: Unit) => void;
}

export function UnitList({ onEditUnit }: UnitListProps) {
  const { units, selectedUnit, selectUnit, searchQuery, setSearchQuery } = useWarehouse();

  const getLocationText = (unit: Unit) => {
    if (unit.location.type === 'floor') {
      return `Zone: ${unit.location.zone}`;
    } else {
      return `${unit.location.zone} - C${unit.location.column}R${unit.location.row}L${unit.location.level}`;
    }
  };

  const filteredUnits = units.filter(unit => {
    const query = searchQuery.toLowerCase();
    return (
      unit.serialNumber.toLowerCase().includes(query) ||
      unit.brand.toLowerCase().includes(query) ||
      unit.model.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: Unit['status']) => {
    switch (status) {
      case 'In Stock':
        return { bg: 'linear-gradient(to bottom, #90ee90 0%, #32cd32 100%)', border: '#228b22' };
      case 'Sold-Prep':
        return { bg: 'linear-gradient(to bottom, #ffd700 0%, #ffa500 100%)', border: '#ff8c00' };
      case 'Sold-Ready':
        return { bg: 'linear-gradient(to bottom, #87ceeb 0%, #4169e1 100%)', border: '#1e90ff' };
      case 'On Hold':
        return { bg: 'linear-gradient(to bottom, #ff6b6b 0%, #dc143c 100%)', border: '#b22222' };
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-full flex flex-col" style={{
      background: '#ece9d8',
      border: '3px solid #0831d9',
      borderTopColor: '#5a9fd4',
      borderLeftColor: '#5a9fd4'
    }}>
      {/* XP-style title bar */}
      <div className="p-2" style={{
        background: 'linear-gradient(to bottom, #0054e3 0%, #3d95d9 50%, #0054e3 100%)'
      }}>
        <h2 className="text-base font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Units
        </h2>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <input
          type="text"
          placeholder="Search serial, brand, or model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-3 rounded"
          style={{
            background: 'white',
            border: '2px solid #7f9db9',
            borderTopColor: '#003c74',
            borderLeftColor: '#003c74',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)'
          }}
        />

        <div className="flex-1 overflow-y-auto space-y-2" style={{
          background: 'white',
          border: '2px solid #7f9db9',
          borderTopColor: '#003c74',
          borderLeftColor: '#003c74',
          padding: '8px',
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          {filteredUnits.length === 0 ? (
            <div className="text-center text-gray-600 py-8" style={{ fontFamily: 'Tahoma, sans-serif' }}>
              {units.length === 0 ? 'No units added yet' : 'No units match your search'}
            </div>
          ) : (
            filteredUnits.map(unit => {
              const statusStyle = getStatusColor(unit.status);
              const isSelected = selectedUnit?.id === unit.id;

              return (
                <div
                  key={unit.id}
                  className="p-3 rounded transition-all"
                  style={{
                    background: isSelected ? '#316ac5' : 'white',
                    border: '2px solid',
                    borderColor: isSelected ? '#0831d9' : '#7f9db9',
                    borderBottomColor: isSelected ? '#5a9fd4' : '#003c74',
                    borderRightColor: isSelected ? '#5a9fd4' : '#003c74',
                    boxShadow: isSelected ? 'inset 1px 1px 2px rgba(0,0,0,0.1)' : '1px 1px 0 rgba(255,255,255,0.5)',
                  }}
                >
                  <div
                    onClick={() => selectUnit(unit.id === selectedUnit?.id ? null : unit)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold" style={{
                          color: isSelected ? 'white' : '#000080',
                          fontFamily: 'Tahoma, sans-serif'
                        }}>
                          {unit.brand} {unit.model}
                        </div>
                        <div className="text-sm" style={{
                          color: isSelected ? '#e0e0e0' : '#666',
                          fontFamily: 'Tahoma, sans-serif'
                        }}>
                          S/N: {unit.serialNumber}
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-bold text-white"
                        style={{
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                        }}
                      >
                        {unit.status}
                      </span>
                    </div>
                    <div className="text-xs" style={{
                      color: isSelected ? '#e0e0e0' : '#666',
                      fontFamily: 'Tahoma, sans-serif'
                    }}>
                      📍 {getLocationText(unit)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditUnit(unit);
                    }}
                    className="mt-2 w-full text-white text-sm py-1 px-2 rounded font-bold transition-all"
                    style={{
                      background: 'linear-gradient(to bottom, #a4d86f 0%, #73b73e 50%, #5a9d2e 100%)',
                      border: '2px solid #5a9d2e',
                      borderTopColor: '#d4f0b8',
                      borderLeftColor: '#d4f0b8',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
                      fontFamily: 'Tahoma, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to bottom, #b8e384 0%, #86c74d 50%, #6bb03c 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to bottom, #a4d86f 0%, #73b73e 50%, #5a9d2e 100%)';
                    }}
                  >
                    Edit
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
