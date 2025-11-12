import * as XLSX from 'xlsx';
import { useWarehouse } from '../context/WarehouseContext';
import type { Unit } from '../types';

export function ExportButton() {
  const { units } = useWarehouse();

  const getLocationText = (unit: Unit) => {
    if (unit.location.type === 'floor') {
      return unit.location.zone;
    } else {
      return `${unit.location.zone} - C${unit.location.column}R${unit.location.row}L${unit.location.level}`;
    }
  };

  const handleExport = () => {
    if (units.length === 0) {
      alert('No units to export');
      return;
    }

    // Prepare data for export
    const exportData = units.map(unit => ({
      'Serial Number': unit.serialNumber,
      'Brand': unit.brand,
      'Model': unit.model,
      'Equipment Number': unit.equipmentNumber || '',
      'Fleet Number': unit.fleetNumber || '',
      'Status': unit.status,
      'Location Type': unit.location.type === 'floor' ? 'Floor' : 'Rack',
      'Zone': unit.location.zone,
      'Column': unit.location.type === 'rack' ? unit.location.column : '',
      'Row': unit.location.type === 'rack' ? unit.location.row : '',
      'Level': unit.location.type === 'rack' ? unit.location.level : '',
      'Full Location': getLocationText(unit),
      'Purchase Price': unit.purchasePrice || '',
      'Purchase Date': unit.purchaseDate || '',
      'Supplier': unit.supplier || '',
      'Date Added': unit.createdDate || '',
      'Added By': unit.addedBy || '',
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Units');

    // Auto-size columns
    const maxWidth = 50;
    const cols = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.min(
        maxWidth,
        Math.max(
          key.length,
          ...exportData.map(row => String(row[key as keyof typeof row] || '').length)
        ) + 2
      )
    }));
    worksheet['!cols'] = cols;

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `warehouse-inventory-${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="text-white font-bold py-2 px-4 rounded transition-all text-sm"
      title="Export to Excel"
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
      Export
    </button>
  );
}
