# Reusable Button Components

This document describes the three new reusable button components that have been created to replace the inline button implementations in the LoadToDockListScreen.

## Components Overview

### 1. RefreshButton
A reusable refresh button with a circular arrow icon (↻).

**Props:**
- `onPress: () => void` - Required callback function
- `size?: number` - Button size (default: 40)
- `color?: string` - Icon color (default: '#ffffff')
- `backgroundColor?: string` - Button background (default: 'rgba(255, 255, 255, 0.1)')
- `style?: any` - Additional styles

**Usage:**
```tsx
import { RefreshButton } from '../components';

<RefreshButton onPress={handleRefresh} />
<RefreshButton 
  onPress={handleRefresh} 
  size={50} 
  color="#ff0000" 
  backgroundColor="rgba(255, 0, 0, 0.2)" 
/>
```

### 2. MenuButton
A reusable menu button with three vertical dots (⋮).

**Props:**
- `onPress: () => void` - Required callback function
- `size?: number` - Button size (default: 40)
- `color?: string` - Icon color (default: '#ffffff')
- `backgroundColor?: string` - Button background (default: 'rgba(255, 255, 255, 0.1)')
- `style?: any` - Additional styles

**Usage:**
```tsx
import { MenuButton } from '../components';

<MenuButton onPress={() => setShowMenu(true)} />
<MenuButton 
  onPress={() => setShowMenu(true)} 
  size={45} 
  color="#00ff00" 
/>
```

### 3. ScanButton
A reusable scan button with a barcode icon (📊) and optional hint text below.

**Props:**
- `onPress: () => void` - Required callback function
- `size?: number` - Button size (default: 48)
- `iconColor?: string` - Icon color (default: '#10b981')
- `backgroundColor?: string` - Button background (default: '#ffffff')
- `borderColor?: string` - Border color (default: '#10b981')
- `hintText?: string` - Text below button (default: 'Scan')
- `hintTextColor?: string` - Hint text color (default: '#6b7280')
- `style?: any` - Additional styles

**Usage:**
```tsx
import { ScanButton } from '../components';

<ScanButton onPress={handleScan} />
<ScanButton 
  onPress={handleScan} 
  size={60} 
  hintText="Scan Barcode" 
  iconColor="#3b82f6" 
  borderColor="#3b82f6" 
/>
```

## Benefits of These Components

1. **Reusability**: Can be used across different screens and components
2. **Consistency**: Maintains consistent styling and behavior
3. **Maintainability**: Changes to button styling only need to be made in one place
4. **Customization**: Flexible props allow for different use cases
5. **Type Safety**: Full TypeScript support with proper interfaces

## Migration from Inline Buttons

**Before (Inline):**
```tsx
<TouchableOpacity
  style={styles.headerButton}
  onPress={handleRefreshData}
  activeOpacity={0.7}
>
  <Text style={styles.headerButtonText}>↻</Text>
</TouchableOpacity>
```

**After (Component):**
```tsx
<RefreshButton onPress={handleRefreshData} />
```

## File Locations

- `src/components/RefreshButton.tsx` - Refresh button component
- `src/components/MenuButton.tsx` - Menu button component  
- `src/components/ScanButton.tsx` - Scan button component
- `src/components/index.ts` - Export file for easy importing

## Future Enhancements

These components can be extended with:
- Loading states
- Disabled states
- Different icon options
- Animation support
- Accessibility improvements
- Theme integration
