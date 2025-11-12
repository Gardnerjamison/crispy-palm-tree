import { useWarehouse } from '../context/WarehouseContext';
import type { Unit } from '../types';

interface UnitDetailPageProps {
  unit: Unit;
  onClose: () => void;
  onEdit: () => void;
}

export function UnitDetailPage({ unit, onClose, onEdit }: UnitDetailPageProps) {
  const { layout } = useWarehouse();

  const getLocationText = () => {
    const zone = layout.zones.find(z => z.id === unit.location.zone);
    const zoneName = zone?.name || unit.location.zone;

    if (unit.location.type === 'floor') {
      return `${zoneName} (Floor Storage)`;
    } else {
      return `${zoneName} - Column ${unit.location.column}, Row ${unit.location.row}, Level ${unit.location.level}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysInSystem = () => {
    if (!unit.createdDate) return null;
    const created = new Date(unit.createdDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = () => {
    switch (unit.status) {
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

  const statusStyle = getStatusColor();

  const fieldStyle = {
    background: 'white',
    border: '2px solid #7f9db9',
    borderTopColor: '#003c74',
    borderLeftColor: '#003c74',
    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)',
    fontFamily: 'Tahoma, sans-serif',
    padding: '12px',
    borderRadius: '4px',
    color: '#000',
    fontSize: '16px'
  };

  const labelStyle = {
    color: '#000080',
    fontFamily: 'Tahoma, sans-serif',
    fontWeight: 'bold' as const,
    fontSize: '12px',
    marginBottom: '6px'
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
              Unit Details
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

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Photo */}
          {unit.photoUrl && (
            <div className="mb-6">
              <img
                src={unit.photoUrl}
                alt={`${unit.brand} ${unit.model}`}
                className="w-full h-64 object-cover rounded"
                style={{
                  border: '2px solid #7f9db9',
                  borderBottomColor: '#003c74',
                  borderRightColor: '#003c74'
                }}
              />
            </div>
          )}

          {/* Equipment Header */}
          <div className="mb-6 p-4 rounded" style={{
            background: 'white',
            border: '2px solid #7f9db9',
            borderTopColor: '#003c74',
            borderLeftColor: '#003c74',
          }}>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#000080', fontFamily: 'Tahoma, sans-serif' }}>
              {unit.brand} {unit.model}
            </h3>
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded text-sm font-bold text-white"
                style={{
                  background: statusStyle.bg,
                  border: `2px solid ${statusStyle.border}`,
                  textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                }}
              >
                {unit.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Serial Number */}
            <div>
              <label className="block" style={labelStyle}>
                Serial Number
              </label>
              <div style={fieldStyle}>
                {unit.serialNumber}
              </div>
            </div>

            {/* Equipment Number */}
            {unit.equipmentNumber && (
              <div>
                <label className="block" style={labelStyle}>
                  Equipment Number (EQ #)
                </label>
                <div style={fieldStyle}>
                  {unit.equipmentNumber}
                </div>
              </div>
            )}

            {/* Fleet Number */}
            {unit.fleetNumber && (
              <div>
                <label className="block" style={labelStyle}>
                  Rental Fleet Number
                </label>
                <div style={fieldStyle}>
                  {unit.fleetNumber}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block" style={labelStyle}>
                Location
              </label>
              <div style={fieldStyle}>
                {getLocationText()}
              </div>
            </div>

            {/* Brand & Model Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block" style={labelStyle}>
                  Brand
                </label>
                <div style={fieldStyle}>
                  {unit.brand}
                </div>
              </div>
              <div>
                <label className="block" style={labelStyle}>
                  Model
                </label>
                <div style={fieldStyle}>
                  {unit.model}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            {(unit.purchasePrice || unit.purchaseDate || unit.supplier) && (
              <div className="pt-4 mt-4" style={{
                borderTop: '2px solid #7f9db9'
              }}>
                <h4 className="text-sm font-bold mb-3" style={{ color: '#000080', fontFamily: 'Tahoma, sans-serif' }}>
                  Financial Information
                </h4>
                <div className="space-y-3">
                  {unit.purchasePrice && (
                    <div>
                      <label className="block" style={labelStyle}>
                        Purchase Price
                      </label>
                      <div style={fieldStyle}>
                        {formatCurrency(unit.purchasePrice)}
                      </div>
                    </div>
                  )}
                  {unit.purchaseDate && (
                    <div>
                      <label className="block" style={labelStyle}>
                        Purchase Date
                      </label>
                      <div style={fieldStyle}>
                        {formatDate(unit.purchaseDate)}
                      </div>
                    </div>
                  )}
                  {unit.supplier && (
                    <div>
                      <label className="block" style={labelStyle}>
                        Supplier/Vendor
                      </label>
                      <div style={fieldStyle}>
                        {unit.supplier}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps Section */}
            {unit.createdDate && (
              <div className="pt-4 mt-4" style={{
                borderTop: '2px solid #7f9db9'
              }}>
                <h4 className="text-sm font-bold mb-3" style={{ color: '#000080', fontFamily: 'Tahoma, sans-serif' }}>
                  Tracking Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block" style={labelStyle}>
                      Date Added
                    </label>
                    <div style={fieldStyle}>
                      {formatDate(unit.createdDate)} ({getDaysInSystem()} days ago)
                    </div>
                  </div>
                  {unit.addedBy && (
                    <div>
                      <label className="block" style={labelStyle}>
                        Added By
                      </label>
                      <div style={fieldStyle}>
                        {unit.addedBy}
                      </div>
                    </div>
                  )}
                  {unit.updatedDate && unit.updatedDate !== unit.createdDate && (
                    <div>
                      <label className="block" style={labelStyle}>
                        Last Updated
                      </label>
                      <div style={fieldStyle}>
                        {formatDate(unit.updatedDate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 text-white font-bold py-4 px-6 rounded transition-all shadow-lg text-lg"
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
              Edit Unit
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-white font-bold py-4 px-6 rounded transition-all shadow-lg text-lg"
              style={{
                background: 'linear-gradient(to bottom, #a0a0a0 0%, #808080 50%, #606060 100%)',
                border: '2px solid #606060',
                borderTopColor: '#c0c0c0',
                borderLeftColor: '#c0c0c0',
                textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
                fontFamily: 'Tahoma, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #b0b0b0 0%, #909090 50%, #707070 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #a0a0a0 0%, #808080 50%, #606060 100%)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
