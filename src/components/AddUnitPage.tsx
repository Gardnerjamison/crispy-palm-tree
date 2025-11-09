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
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Photo must be less than 10MB');
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

  const inputStyle = {
    background: 'white',
    border: '2px solid #7f9db9',
    borderTopColor: '#003c74',
    borderLeftColor: '#003c74',
    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)',
    fontFamily: 'Tahoma, sans-serif'
  };

  const labelStyle = {
    color: '#000080',
    fontFamily: 'Tahoma, sans-serif',
    fontWeight: 'bold' as const
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(to bottom, #5a9fd4 0%, #306998 100%)'
    }}>
      {/* XP Window */}
      <div className="max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl" style={{
        background: '#ece9d8',
        border: '3px solid #0831d9',
        borderTopColor: '#5a9fd4',
        borderLeftColor: '#5a9fd4'
      }}>
        {/* Title Bar */}
        <div className="p-2 flex items-center justify-between" style={{
          background: 'linear-gradient(to bottom, #0054e3 0%, #3d95d9 50%, #0054e3 100%)'
        }}>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Add Unit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 text-white font-bold rounded"
            style={{
              background: 'linear-gradient(to bottom, #dc6c50 0%, #c94824 100%)',
              border: '2px solid #c94824',
              borderTopColor: '#ff9d88',
              borderLeftColor: '#ff9d88',
              textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
              fontFamily: 'Tahoma, sans-serif'
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Photo (optional)
              </label>
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="Unit"
                    className="w-full h-48 object-cover rounded"
                    style={{
                      border: '2px solid #7f9db9',
                      borderBottomColor: '#003c74',
                      borderRightColor: '#003c74'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 px-3 py-1 text-white font-bold rounded text-sm"
                    style={{
                      background: 'linear-gradient(to bottom, #dc6c50 0%, #c94824 100%)',
                      border: '2px solid #c94824',
                      borderTopColor: '#ff9d88',
                      borderLeftColor: '#ff9d88',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
                      fontFamily: 'Tahoma, sans-serif'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block w-full h-48 border-2 border-dashed rounded cursor-pointer hover:border-blue-600 transition-colors" style={{
                  borderColor: '#7f9db9',
                  background: 'white'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-full" style={{ color: '#666' }}>
                    <span className="text-sm" style={{ fontFamily: 'Tahoma, sans-serif' }}>Tap to add photo</span>
                  </div>
                </label>
              )}
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Serial Number *
              </label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full p-3 rounded text-lg"
                style={inputStyle}
                placeholder="Enter serial number"
              />
            </div>

            {/* Equipment Number */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Equipment Number (EQ #)
              </label>
              <input
                type="text"
                value={equipmentNumber}
                onChange={(e) => setEquipmentNumber(e.target.value)}
                className="w-full p-3 rounded text-lg"
                style={inputStyle}
                placeholder="Company equipment number"
              />
            </div>

            {/* Fleet Number */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Rental Fleet Number
              </label>
              <input
                type="text"
                value={fleetNumber}
                onChange={(e) => setFleetNumber(e.target.value)}
                className="w-full p-3 rounded text-lg"
                style={inputStyle}
                placeholder="Fleet number (if rental)"
              />
            </div>

            {/* Brand and Model */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-3 rounded text-lg"
                  style={inputStyle}
                  placeholder="e.g., CAT"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={labelStyle}>
                  Model *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-3 rounded text-lg"
                  style={inputStyle}
                  placeholder="e.g., 416F"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Unit['status'])}
                className="w-full p-3 rounded text-lg"
                style={inputStyle}
              >
                <option value="In Stock">In Stock</option>
                <option value="Sold-Prep">Sold - Prep</option>
                <option value="Sold-Ready">Sold - Ready</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm mb-2" style={labelStyle}>
                Zone *
              </label>
              <select
                required
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full p-3 rounded text-lg"
                style={inputStyle}
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
              <div className="p-4 rounded" style={{
                background: '#d4d0c8',
                border: '2px solid #7f9db9',
                borderTopColor: '#003c74',
                borderLeftColor: '#003c74',
              }}>
                <h3 className="font-bold mb-3" style={{ color: '#000080', fontFamily: 'Tahoma, sans-serif' }}>
                  Rack Location
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ ...labelStyle, fontSize: '11px' }}>
                      Column *
                    </label>
                    <input
                      type="text"
                      required
                      value={column}
                      onChange={(e) => setColumn(e.target.value.toUpperCase())}
                      className="w-full p-2 rounded text-center text-lg"
                      style={inputStyle}
                      placeholder="A"
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ ...labelStyle, fontSize: '11px' }}>
                      Row *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={row}
                      onChange={(e) => setRow(e.target.value)}
                      className="w-full p-2 rounded text-center text-lg"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ ...labelStyle, fontSize: '11px' }}>
                      Level *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full p-2 rounded text-center text-lg"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white font-bold py-4 px-6 rounded transition-all shadow-lg text-lg"
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
              Add Unit to Inventory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
