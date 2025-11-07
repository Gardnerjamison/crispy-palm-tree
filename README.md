# Warehouse Manager

A mobile-first web application for tracking equipment locations in warehouse facilities. Built for small to mid-size equipment dealers who need a simple, effective solution without expensive barcode or RFID systems.

## Features

### Core Functionality
- **Visual Warehouse Layout**: Interactive color-coded zone map showing different areas of your warehouse
- **Unit Management**: Add and track equipment by serial number, brand, model, and status
- **Dual Location System**:
  - Floor storage (zone-based)
  - Rack storage (column/row/level system)
- **Smart Search**: Search and filter by serial number, brand, or model
- **Status Tracking**: Track units through different states:
  - In Stock
  - Sold - Prep
  - Sold - Ready
  - On Hold
- **Local Storage**: All data persists in browser localStorage

### Mobile-First Design
- Optimized for warehouse workers using phones/tablets
- Quick "park and tag" workflow for incoming units
- Visual highlighting of selected unit locations on the map

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Adding a Unit

1. Click the "+ Add Unit" button
2. Fill in the required fields:
   - Serial Number
   - Brand (e.g., CAT, John Deere)
   - Model (e.g., 416F, 310G)
   - Status
   - Zone
3. For rack areas, also specify:
   - Column (e.g., A, B, C)
   - Row (number)
   - Level (number)
4. Click "Save Unit"

### Finding a Unit

1. Use the search box to enter a serial number, brand, or model
2. Click on a unit in the list
3. The map will highlight the zone where the unit is located
4. Location details are shown below the map

### Default Warehouse Layout

The app comes with a default 5-zone layout:
- **Front Zone** (blue) - Floor storage
- **Rack Area A** (green) - Racked storage
- **Rack Area B** (orange) - Racked storage
- **Floor Storage** (purple) - Floor storage
- **Back Zone** (red) - Floor storage

You can modify the zones in `src/context/WarehouseContext.tsx`.

## Customization

### Modifying Zones

Edit the `defaultLayout` in `src/context/WarehouseContext.tsx`:

```typescript
const defaultLayout: WarehouseLayout = {
  id: '1',
  name: 'Your Warehouse Name',
  gridWidth: 12,  // Grid columns
  gridHeight: 8,  // Grid rows
  zones: [
    {
      id: 'z1',
      name: 'Zone Name',
      color: '#3b82f6',  // Hex color
      hasRacks: true,     // true for rack storage, false for floor
      x: 0,               // Grid position (column)
      y: 0,               // Grid position (row)
      width: 4,           // Width in grid units
      height: 2,          // Height in grid units
    },
    // Add more zones...
  ],
};
```

## Roadmap / Future Features

- [ ] Multi-warehouse support
- [ ] User authentication
- [ ] Export data to CSV/Excel
- [ ] Print location labels
- [ ] Photo attachments for units
- [ ] Custom fields per brand/category
- [ ] Unit history tracking
- [ ] Cloud sync option
- [ ] Barcode scanning integration
- [ ] Move history / audit log

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── AddUnitForm.tsx  # Form to add new units
│   ├── UnitList.tsx     # List and search units
│   └── WarehouseMap.tsx # Visual warehouse layout
├── context/             # React context providers
│   └── WarehouseContext.tsx  # App state management
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
└── index.css            # Global styles
```

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. Deploy this to any static hosting service (Vercel, Netlify, etc.).

## License

MIT

## Contributing

This is currently a personal project, but suggestions and feedback are welcome!
