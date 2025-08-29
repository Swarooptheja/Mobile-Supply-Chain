# ItemDetailsCard Component

A reusable React Native component for displaying item details in a consistent card format across different screens and contexts.

## Features

- **Reusable**: Can be used across multiple detail pages
- **Customizable**: Accepts custom styling through the `style` prop
- **Type-safe**: Fully typed with TypeScript interfaces
- **Consistent Design**: Maintains uniform appearance across the app
- **Responsive**: Adapts to different content lengths

## Usage

### Basic Implementation

```tsx
import { ItemDetailsCard } from '../components';

<ItemDetailsCard
  itemId="ITM001"
  itemNumber="ABC123"
  itemDescription="Product Description"
  qtyRequested="100"
  qtyPicked="75"
  itemUom="PCS"
/>
```

### With Custom Styling

```tsx
<ItemDetailsCard
  itemId="ITM002"
  itemNumber="XYZ789"
  itemDescription="Product with Custom Styling"
  qtyRequested="50"
  qtyPicked="50"
  itemUom="KG"
  style={{
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b'
  }}
/>
```

### In Lists

```tsx
{items.map((item, index) => (
  <ItemDetailsCard
    key={`${item.itemId}-${index}`}
    {...item}
    style={styles.listItem}
  />
))}
```

## Props Interface

```tsx
export interface IItemDetailsCardProps {
  itemId: string;           // Unique identifier for the item
  itemNumber: string;       // Item number/code
  itemDescription: string;  // Item description text
  qtyRequested: string;     // Requested quantity
  qtyPicked: string;        // Picked/loaded quantity
  itemUom: string;          // Unit of measurement
  style?: any;              // Optional custom styles
}
```

## Use Cases

The `ItemDetailsCard` component is designed to be used in various contexts:

1. **Load to Dock Item Details** - Display item information during loading operations
2. **Transaction History** - Show item details in transaction records
3. **Order Management** - Display order line items
4. **Inventory Tracking** - Show inventory item details
5. **Shipping Details** - Display shipping item information

## Styling

The component comes with predefined styles that can be overridden:

- **Card**: White background with subtle shadow and border
- **Item Identifier**: Bold text for item ID and number
- **Description**: Medium weight text for item description
- **Quantity Section**: Organized display of requested and picked quantities
- **Responsive**: Adapts to different content lengths

## Example Implementation

See `ItemDetailsCardExample.tsx` for comprehensive usage examples including:
- Basic usage
- Custom styling
- List implementations
- Different context scenarios

## Benefits

1. **Consistency**: Ensures uniform item display across the app
2. **Maintainability**: Single source of truth for item detail styling
3. **Reusability**: Can be implemented in any screen requiring item details
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Performance**: Optimized rendering with React.memo if needed

## Migration from Hardcoded Cards

To migrate existing hardcoded item detail cards:

1. Replace the hardcoded JSX with `<ItemDetailsCard />`
2. Pass the required props from your data source
3. Remove duplicate styles from the parent component
4. Import the component from the components index

## Future Enhancements

Potential improvements for the component:
- Support for additional item properties
- Customizable layout options
- Animation support
- Accessibility improvements
- Theme support
