import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import type { Unit, FloorLocation, RackLocation } from '../types';

interface EditUnitFormProps {
  unit: Unit;
  onClose: () => void;
}

export function EditUnitForm({ unit, onClose }: EditUnitFormProps) {
  const { updateUnit, deleteUnit, layout } = useWarehouse();

  const [serialNumber, setSerialNumber] = useState(unit.serialNumber);
  const [brand, setBrand] = useState(unit.brand);
  const [model, setModel] = useState(unit.model);
  const [status, setStatus] = useState<Unit['status']>(unit.status);
  const [zone, setZone] = useState(unit.location.zone);
  const [column, setColumn] = useState(unit.location.type === 'rack' ? unit.location.column : '');
  const [row, setRow] = useState(unit.location.type === 'rack' ? unit.location.row.toString() : '1');
  const [level, setLevel] = useState(unit.location.type === 'rack' ? unit.location.level.toString() : '1');

  const selectedZone = layout.zones.find(z => z.id === zone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const location: FloorLocation | RackLocation = selectedZone?.hasRacks
      ? { type: 'rack', zone, column, row: parseInt(row), level: parseInt(level) }
      : { type: 'floor', zone };

    updateUnit(unit.id, {
      serialNumber,
      brand,
      model,
      status,
      location,
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${brand} ${model} (S/N: ${serialNumber})?`)) {
      deleteUnit(unit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Unit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setZone(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
