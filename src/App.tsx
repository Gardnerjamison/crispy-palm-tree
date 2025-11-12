import { useState } from 'react';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { WarehouseMap } from './components/WarehouseMap';
import { UnitList } from './components/UnitList';
import { AddUnitPage } from './components/AddUnitPage';
import { EditUnitPage } from './components/EditUnitPage';
import { UnitDetailPage } from './components/UnitDetailPage';
import { ExportButton } from './components/ExportButton';
import { LayoutBuilder } from './components/LayoutBuilder';
import { InventoryValue } from './components/InventoryValue';
import type { Unit } from './types';

function AppContent() {
  const [showLayoutBuilder, setShowLayoutBuilder] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const { layout, updateLayout } = useWarehouse();

  if (showLayoutBuilder) {
    return (
      <LayoutBuilder
        zones={layout.zones}
        gridWidth={layout.gridWidth}
        gridHeight={layout.gridHeight}
        onSave={(zones, gridWidth, gridHeight) => {
          const updates: any = { zones };
          if (gridWidth !== undefined) updates.gridWidth = gridWidth;
          if (gridHeight !== undefined) updates.gridHeight = gridHeight;
          updateLayout(updates);
          setShowLayoutBuilder(false);
        }}
        onClose={() => setShowLayoutBuilder(false)}
      />
    );
  }

  if (showAddUnit) {
    return (
      <AddUnitPage onClose={() => setShowAddUnit(false)} />
    );
  }

  if (viewingUnit) {
    return (
      <UnitDetailPage
        unit={viewingUnit}
        onClose={() => setViewingUnit(null)}
        onEdit={() => {
          setEditingUnit(viewingUnit);
          setViewingUnit(null);
        }}
      />
    );
  }

  if (editingUnit) {
    return (
      <EditUnitPage unit={editingUnit} onClose={() => setEditingUnit(null)} />
    );
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(to bottom, #5a9fd4 0%, #306998 100%)'
    }}>
      <header className="mb-4">
        <div className="rounded-lg overflow-hidden shadow-lg" style={{
          background: 'linear-gradient(to bottom, #0054e3 0%, #3d95d9 50%, #0054e3 100%)',
          border: '3px solid #0831d9',
          borderTopColor: '#5a9fd4',
          borderLeftColor: '#5a9fd4'
        }}>
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                Warehouse Manager
              </h1>
            </div>
            <ExportButton />
          </div>
        </div>
        <p className="text-white text-sm mt-2 ml-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Track equipment locations and manage inventory
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left column: Map */}
        <div className="lg:col-span-1">
          <WarehouseMap onEditLayout={() => setShowLayoutBuilder(true)} />
        </div>

        {/* Right column: Units list */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <InventoryValue />
          <button
            onClick={() => setShowAddUnit(true)}
            className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(to bottom, #a4d86f 0%, #73b73e 50%, #5a9d2e 100%)',
              border: '2px solid #5a9d2e',
              borderTopColor: '#d4f0b8',
              borderLeftColor: '#d4f0b8',
              textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #b8e384 0%, #86c74d 50%, #6bb03c 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #a4d86f 0%, #73b73e 50%, #5a9d2e 100%)';
            }}
          >
            Add New Unit
          </button>
          <div className="flex-1 min-h-[400px]">
            <UnitList
              onEditUnit={setEditingUnit}
              onViewUnit={setViewingUnit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <WarehouseProvider>
      <AppContent />
    </WarehouseProvider>
  );
}

export default App;
