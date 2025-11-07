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
      'Status': unit.status,
      'Location Type': unit.location.type === 'floor' ? 'Floor' : 'Rack',
      'Zone': unit.location.zone,
      'Column': unit.location.type === 'rack' ? unit.location.column : '',
      'Row': unit.location.type === 'rack' ? unit.location.row : '',
      'Level': unit.location.type === 'rack' ? unit.location.level : '',
      'Full Location': getLocationText(unit),
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
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
      title="Export to Excel"
    >
      📊 Export to Excel
    </button>
  );
}
