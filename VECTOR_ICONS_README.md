# Vector Icons System

This document explains how to use the new unified VectorIcon system throughout the application.

## Overview

The VectorIcon system provides a consistent way to use vector icons across the entire application. It supports multiple icon sets and provides convenience components for common icons.

## Components

### 1. VectorIcon (Base Component)

The main component that renders icons from any supported icon set.

```tsx
import { VectorIcon } from '../components';

<VectorIcon 
  name="heart" 
  size={24} 
  color="#FF3B30" 
  iconSet="MaterialIcons" 
/>
```

**Props:**
- `name`: Icon name (string)
- `size`: Icon size (number)
- `color`: Icon color (string)
- `iconSet`: Icon set to use (optional, defaults to 'MaterialIcons')
- `style`: Additional styles (optional)

**Supported Icon Sets:**
- MaterialIcons (default)
- MaterialCommunityIcons
- Ionicons
- FontAwesome
- FontAwesome5
- FontAwesome6
- Feather
- AntDesign
- Entypo
- EvilIcons
- Foundation
- Octicons
- SimpleLineIcons
- Zocial
- Fontisto

### 2. CommonIcon (Convenience Component)

A convenience component for commonly used icons that automatically uses the correct icon set.

```tsx
import { CommonIcon } from '../components';

<CommonIcon 
  icon="back" 
  size={24} 
  color="#007AFF" 
/>
```

**Props:**
- `icon`: Predefined icon key (see available icons below)
- `size`: Icon size (number)
- `color`: Icon color (string)
- `style`: Additional styles (optional)

**Available Common Icons:**
- **Navigation**: `back`, `home`, `menu`, `close`
- **Actions**: `refresh`, `search`, `add`, `edit`, `delete`
- **Media**: `camera`, `video`, `image`
- **Barcode/QR**: `qrCode`, `barcode`
- **Status**: `check`, `error`, `warning`, `info`
- **More Options**: `more`, `dots`

### 3. CommonIcons (Configuration Object)

Reference object containing all available common icon configurations.

```tsx
import { CommonIcons } from '../components';

// Access icon configuration
const backIconConfig = CommonIcons.back;
// Returns: { name: 'arrow-back', iconSet: 'MaterialIcons' }
```

## Usage Examples

### Basic Usage

```tsx
// Using CommonIcon (Recommended for common icons)
<CommonIcon icon="search" size={16} color="#9CA3AF" />

// Using VectorIcon with specific icon set
<VectorIcon name="heart" size={24} color="#FF3B30" iconSet="FontAwesome" />

// Using VectorIcon with default MaterialIcons
<VectorIcon name="arrow-back" size={24} color="#ffffff" />
```

### In Components

```tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { CommonIcon } from '../components';

const MyButton = () => (
  <TouchableOpacity>
    <CommonIcon icon="add" size={24} color="#007AFF" />
    <Text>Add Item</Text>
  </TouchableOpacity>
);
```

### Different Icon Sets for Same Concept

```tsx
// Same icon from different sets
<VectorIcon name="home" size={20} color="#007AFF" iconSet="MaterialIcons" />
<VectorIcon name="home" size={20} color="#007AFF" iconSet="FontAwesome" />
<VectorIcon name="home" size={20} color="#007AFF" iconSet="Feather" />
```

## Migration from Old Icon System

### Before (IconComponent)
```tsx
import IconComponent from './icons/IconComponent';

<IconComponent name="arrow-left" size={24} color="#ffffff" />
```

### After (CommonIcon)
```tsx
import { CommonIcon } from '../components';

<CommonIcon icon="back" size={24} color="#ffffff" />
```

### After (VectorIcon)
```tsx
import { VectorIcon } from '../components';

<VectorIcon name="arrow-back" size={24} color="#ffffff" iconSet="MaterialIcons" />
```

## Benefits

1. **Consistency**: All icons use the same interface
2. **Type Safety**: Full TypeScript support with proper types
3. **Maintainability**: Centralized icon management
4. **Flexibility**: Support for multiple icon sets
5. **Performance**: Optimized icon rendering
6. **Ease of Use**: Simple API for common icons

## Best Practices

1. **Use CommonIcon** for standard icons (back, home, search, etc.)
2. **Use VectorIcon** when you need specific icons or different icon sets
3. **Keep icon names consistent** across the application
4. **Use semantic icon names** that describe the action/purpose
5. **Maintain consistent sizing** for similar UI elements

## Adding New Common Icons

To add a new common icon, update the `CommonIcons` object in `src/components/VectorIcon.tsx`:

```tsx
export const CommonIcons = {
  // ... existing icons
  newIcon: { name: 'new-icon-name', iconSet: 'MaterialIcons' as IconSet },
};
```

## Troubleshooting

### Icons Not Displaying
1. Ensure the icon name exists in the specified icon set
2. Check that the font files are properly linked
3. Verify the icon set is correctly specified
4. Use the fallback MaterialIcons if unsure

### Performance Issues
1. Use CommonIcon for frequently used icons
2. Avoid changing icon sets frequently
3. Consider icon caching for complex icon lists

## Example Component

See `src/components/VectorIconExample.tsx` for a complete demonstration of all features.

## Support

For questions or issues with the VectorIcon system, refer to:
- This README
- The VectorIconExample component
- The VectorIcon source code
- React Native Vector Icons documentation
