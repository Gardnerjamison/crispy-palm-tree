import { useWarehouse } from '../context/WarehouseContext';
import type { Unit } from '../types';

export function UnitList() {
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
      case 'In Stock': return 'bg-green-600';
      case 'Sold-Prep': return 'bg-yellow-600';
      case 'Sold-Ready': return 'bg-blue-600';
      case 'On Hold': return 'bg-red-600';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Units</h2>

      <input
        type="text"
        placeholder="Search serial, brand, or model..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredUnits.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {units.length === 0 ? 'No units added yet' : 'No units match your search'}
          </div>
        ) : (
          filteredUnits.map(unit => (
            <div
              key={unit.id}
              onClick={() => selectUnit(unit.id === selectedUnit?.id ? null : unit)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedUnit?.id === unit.id
                  ? 'bg-blue-600 border-2 border-blue-400'
                  : 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">
                    {unit.brand} {unit.model}
                  </div>
                  <div className="text-sm text-gray-400">
                    S/N: {unit.serialNumber}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(unit.status)}`}>
                  {unit.status}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                📍 {getLocationText(unit)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
