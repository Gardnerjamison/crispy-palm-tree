import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import type { Unit, FloorLocation, RackLocation } from '../types';

interface AddUnitPageProps {
  onClose: () => void;
}

export function AddUnitPage({ onClose }: AddUnitPageProps) {
  const { addUnit, layout } = useWarehouse();

  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [fleetNumber, setFleetNumber] = useState('');
  const [status, setStatus] = useState<Unit['status']>('In Stock');
  const [zone, setZone] = useState('');
  const [column, setColumn] = useState('');
  const [row, setRow] = useState('1');
  const [level, setLevel] = useState('1');
  const [photoUrl, setPhotoUrl] = useState('');

  const selectedZone = layout.zones.find(z => z.id === zone);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const location: FloorLocation | RackLocation = selectedZone?.hasRacks
      ? { type: 'rack', zone, column, row: parseInt(row), level: parseInt(level) }
      : { type: 'floor', zone };

    const newUnit: Unit = {
      id: Date.now().toString(),
      serialNumber,
      brand,
      model,
      status,
      location,
      equipmentNumber: equipmentNumber || undefined,
      fleetNumber: fleetNumber || undefined,
      photoUrl: photoUrl || undefined,
    };

    addUnit(newUnit);
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="text-blue-400 text-lg font-semibold"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-white">Add Unit</h2>
        <div className="w-16"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Photo (optional)
          </label>
          {photoUrl ? (
            <div className="relative">
              <img
                src={photoUrl}
                alt="Unit"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="block w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-sm">Tap to add photo</span>
              </div>
            </label>
          )}
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Serial Number *
          </label>
          <input
            type="text"
            required
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter serial number"
          />
        </div>

        {/* Equipment Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Equipment Number (EQ #)
          </label>
          <input
            type="text"
            value={equipmentNumber}
            onChange={(e) => setEquipmentNumber(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company equipment number"
          />
        </div>

        {/* Fleet Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rental Fleet Number
          </label>
          <input
            type="text"
            value={fleetNumber}
            onChange={(e) => setFleetNumber(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fleet number (if rental)"
          />
        </div>

        {/* Brand and Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand *
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CAT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Model *
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 416F"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Unit['status'])}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="In Stock">In Stock</option>
            <option value="Sold-Prep">Sold - Prep</option>
            <option value="Sold-Ready">Sold - Ready</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Zone *
          </label>
          <select
            required
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select zone</option>
            {layout.zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name} {z.hasRacks ? '(Racks)' : '(Floor)'}
              </option>
            ))}
          </select>
        </div>

        {/* Rack Location (if applicable) */}
        {selectedZone?.hasRacks && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3">Rack Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Column *
                </label>
                <input
                  type="text"
                  required
                  value={column}
                  onChange={(e) => setColumn(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Row *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={row}
                  onChange={(e) => setRow(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Level *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Add Unit to Inventory
        </button>
      </form>
    </div>
  );
}
