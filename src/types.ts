export interface Unit {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
  status: 'In Stock' | 'Sold-Prep' | 'Sold-Ready' | 'On Hold';
  location: FloorLocation | RackLocation;
  equipmentNumber?: string;  // Company EQ number
  fleetNumber?: string;       // Rental fleet number
  photoUrl?: string;          // Photo (base64 or URL)
  createdDate: string;        // ISO date string
  updatedDate: string;        // ISO date string
  addedBy?: string;           // User name who added the unit
  purchasePrice?: number;     // Purchase price in dollars
  purchaseDate?: string;      // ISO date string
  supplier?: string;          // Supplier/vendor name
}

export interface FloorLocation {
  type: 'floor';
  zone: string;
}

export interface RackLocation {
  type: 'rack';
  zone: string;
  column: string;
  row: number;
  level: number;
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  hasRacks: boolean;
  x: number; // grid position
  y: number;
  width: number;
  height: number;
}

export interface WarehouseLayout {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  zones: Zone[];
}
