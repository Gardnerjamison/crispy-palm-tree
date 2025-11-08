import { useState } from 'react';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { WarehouseMap } from './components/WarehouseMap';
import { UnitList } from './components/UnitList';
import { AddUnitForm } from './components/AddUnitForm';
import { ExportButton } from './components/ExportButton';
import { LayoutBuilder } from './components/LayoutBuilder';

function AppContent() {
  const [showLayoutBuilder, setShowLayoutBuilder] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <header className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📦 Warehouse Manager
            </h1>
            <p className="text-gray-400">
              Track equipment locations and manage inventory
            </p>
          </div>
          <ExportButton />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left column: Map */}
        <div className="lg:col-span-1">
          <WarehouseMap onEditLayout={() => setShowLayoutBuilder(true)} />
        </div>

        {/* Right column: Units list */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <AddUnitForm />
          <div className="flex-1 min-h-[400px]">
            <UnitList />
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
