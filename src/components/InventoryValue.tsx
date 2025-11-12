import { useWarehouse } from '../context/WarehouseContext';

export function InventoryValue() {
  const { units } = useWarehouse();

  const calculateTotalValue = () => {
    return units.reduce((sum, unit) => {
      return sum + (unit.purchasePrice || 0);
    }, 0);
  };

  const getUnitsWithPrice = () => {
    return units.filter(unit => unit.purchasePrice).length;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalValue = calculateTotalValue();
  const unitsWithPrice = getUnitsWithPrice();

  if (unitsWithPrice === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg mb-4" style={{
      background: '#ece9d8',
      border: '3px solid #0831d9',
      borderTopColor: '#5a9fd4',
      borderLeftColor: '#5a9fd4'
    }}>
      {/* Title bar */}
      <div className="p-2" style={{
        background: 'linear-gradient(to bottom, #0054e3 0%, #3d95d9 50%, #0054e3 100%)'
      }}>
        <h2 className="text-base font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Inventory Value
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold" style={{
            color: '#000080',
            fontFamily: 'Tahoma, sans-serif'
          }}>
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm" style={{
            color: '#666',
            fontFamily: 'Tahoma, sans-serif'
          }}>
            across {unitsWithPrice} {unitsWithPrice === 1 ? 'unit' : 'units'}
          </div>
        </div>
        {unitsWithPrice < units.length && (
          <div className="text-xs mt-2" style={{
            color: '#888',
            fontFamily: 'Tahoma, sans-serif'
          }}>
            {units.length - unitsWithPrice} units without price data
          </div>
        )}
      </div>
    </div>
  );
}
