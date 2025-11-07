import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import type { Unit, FloorLocation, RackLocation } from '../types';

export function AddUnitForm() {
  const { addUnit, layout } = useWarehouse();
  const [isOpen, setIsOpen] = useState(false);

  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState<Unit['status']>('In Stock');
  const [locationType, setLocationType] = useState<'floor' | 'rack'>('floor');
  const [zone, setZone] = useState('');
  const [column, setColumn] = useState('');
  const [row, setRow] = useState('1');
  const [level, setLevel] = useState('1');

  const resetForm = () => {
    setSerialNumber('');
    setBrand('');
    setModel('');
    setStatus('In Stock');
    setLocationType('floor');
    setZone('');
    setColumn('');
    setRow('1');
    setLevel('1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const location: FloorLocation | RackLocation = locationType === 'floor'
      ? { type: 'floor', zone }
      : { type: 'rack', zone, column, row: parseInt(row), level: parseInt(level) };

    const newUnit: Unit = {
      id: Date.now().toString(),
      serialNumber,
      brand,
      model,
      status,
      location,
    };

    addUnit(newUnit);
    resetForm();
    setIsOpen(false);
  };

  const selectedZone = layout.zones.find(z => z.id === zone);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        {isOpen ? '✕ Cancel' : '+ Add Unit'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Serial Number *
            </label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter serial number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CAT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 416F"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Unit['status'])}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="In Stock">In Stock</option>
              <option value="Sold-Prep">Sold - Prep</option>
              <option value="Sold-Ready">Sold - Ready</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Zone *
            </label>
            <select
              required
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                const z = layout.zones.find(zone => zone.id === e.target.value);
                if (z) {
                  setLocationType(z.hasRacks ? 'rack' : 'floor');
                }
              }}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select zone</option>
              {layout.zones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name} {z.hasRacks ? '(Racks)' : '(Floor)'}
                </option>
              ))}
            </select>
          </div>

          {selectedZone?.hasRacks && (
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-800 rounded border border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Column *
                </label>
                <input
                  type="text"
                  required
                  value={column}
                  onChange={(e) => setColumn(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Row *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={row}
                  onChange={(e) => setRow(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Level *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Save Unit
          </button>
        </form>
      )}
    </div>
  );
}
