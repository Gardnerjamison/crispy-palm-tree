import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Unit, WarehouseLayout } from '../types';

interface WarehouseContextType {
  layout: WarehouseLayout;
  units: Unit[];
  selectedUnit: Unit | null;
  addUnit: (unit: Unit) => void;
  updateUnit: (id: string, unit: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  selectUnit: (unit: Unit | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  updateLayout: (layout: Partial<WarehouseLayout>) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterZone: string;
  setFilterZone: (zone: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// Default warehouse layout
const defaultLayout: WarehouseLayout = {
  id: '1',
  name: 'Main Warehouse',
  gridWidth: 12,
  gridHeight: 8,
  zones: [
    { id: 'z1', name: 'Front Zone', color: '#3b82f6', hasRacks: false, x: 0, y: 0, width: 12, height: 2 },
    { id: 'z2', name: 'Rack Area A', color: '#10b981', hasRacks: true, x: 0, y: 2, width: 4, height: 4 },
    { id: 'z3', name: 'Rack Area B', color: '#f59e0b', hasRacks: true, x: 4, y: 2, width: 4, height: 4 },
    { id: 'z4', name: 'Floor Storage', color: '#8b5cf6', hasRacks: false, x: 8, y: 2, width: 4, height: 4 },
    { id: 'z5', name: 'Back Zone', color: '#ef4444', hasRacks: false, x: 0, y: 6, width: 12, height: 2 },
  ],
};

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<WarehouseLayout>(() => {
    const saved = localStorage.getItem('warehouse-layout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });
  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('warehouse-units');
    if (!saved) return [];

    // Migrate old units to include timestamps if missing
    const parsedUnits = JSON.parse(saved);
    return parsedUnits.map((unit: any) => {
      const now = new Date().toISOString();
      return {
        ...unit,
        createdDate: unit.createdDate || now,
        updatedDate: unit.updatedDate || now,
      };
    });
  });
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  // Save to localStorage whenever units or layout change
  useEffect(() => {
    localStorage.setItem('warehouse-units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('warehouse-layout', JSON.stringify(layout));
  }, [layout]);

  const addUnit = (unit: Unit) => {
    setUnits([...units, unit]);
  };

  const updateUnit = (id: string, updatedUnit: Partial<Unit>) => {
    setUnits(units.map(u => u.id === id ? { ...u, ...updatedUnit } : u));
  };

  const deleteUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
    if (selectedUnit?.id === id) {
      setSelectedUnit(null);
    }
  };

  const selectUnit = (unit: Unit | null) => {
    setSelectedUnit(unit);
  };

  const updateLayout = (updates: Partial<WarehouseLayout>) => {
    setLayout({ ...layout, ...updates });
  };

  return (
    <WarehouseContext.Provider
      value={{
        layout,
        units,
        selectedUnit,
        addUnit,
        updateUnit,
        deleteUnit,
        selectUnit,
        searchQuery,
        setSearchQuery,
        updateLayout,
        filterStatus,
        setFilterStatus,
        filterZone,
        setFilterZone,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}
