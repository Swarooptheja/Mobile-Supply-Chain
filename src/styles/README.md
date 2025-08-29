# Styling System Documentation

This directory contains the styling system for the React Native app, designed to support theming and maintain consistency across components.

## Overview

The styling system uses a hybrid approach that combines:
- **Theme-aware styles** using React Native's StyleSheet
- **CSS-like organization** with SCSS-inspired naming conventions
- **Global utility styles** for common patterns
- **Component-specific styles** for unique styling needs

## File Structure

```
src/styles/
├── index.ts                 # Main export file
├── global.styles.ts         # Global utility styles and theme-aware styles
├── LoginScreen.styles.ts    # Component-specific styles for LoginScreen
└── README.md               # This documentation file
```

## Key Features

### 1. Theme Support
- All styles automatically adapt to light/dark themes
- Uses the `useTheme()` hook from `ThemeContext`
- Colors, backgrounds, and borders change based on theme

### 2. Consistent Spacing & Typography
- Predefined spacing values: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- Standardized font sizes and weights
- Consistent border radius values

### 3. Utility Classes
- Layout utilities: `flex`, `center`, `spaceBetween`, etc.
- Spacing utilities: `padding`, `margin`, etc.
- Common component styles: `card`, `button`, `input`

## Usage Examples

### Basic Component Styling

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createLoginScreenStyles } from '../styles/LoginScreen.styles';

const MyComponent = () => {
  const theme = useTheme();
  const styles = createLoginScreenStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};
```

### Using Global Styles

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createGlobalStyles } from '../styles/global.styles';

const MyComponent = () => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  return (
    <View style={[globalStyles.card, globalStyles.padding]}>
      <Text style={globalStyles.textCenter}>Centered Text</Text>
    </View>
  );
};
```

### Combining Multiple Styles

```tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createGlobalStyles } from '../styles/global.styles';
import { createLoginScreenStyles } from '../styles/LoginScreen.styles';

const MyComponent = () => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const componentStyles = createLoginScreenStyles(theme);
  
  return (
    <View style={[
      globalStyles.card,
      globalStyles.padding,
      componentStyles.customStyle
    ]}>
      {/* Component content */}
    </View>
  );
};
```

## Creating New Component Styles

### 1. Create a new styles file

```tsx
// src/styles/MyComponent.styles.ts
import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createMyComponentStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  // ... more styles
});
```

### 2. Export from index.ts

```tsx
// src/styles/index.ts
export * from './MyComponent.styles';
```

### 3. Use in component

```tsx
import { createMyComponentStyles } from '../styles/MyComponent.styles';

const MyComponent = () => {
  const theme = useTheme();
  const styles = createMyComponentStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Component</Text>
    </View>
  );
};
```

## Theme Colors

The theme system provides these color categories:

- `background`: Main background color
- `textPrimary`: Primary text color
- `textSecondary`: Secondary text color
- `primary`: Primary brand color
- `border`: Border and separator colors
- `separator`: Line separators
- `pillBg`: Background for pill components
- `pillBgSelected`: Selected pill background
- `pillText`: Pill text color
- `pillTextSelected`: Selected pill text color
- `buttonBg`: Button background color
- `buttonText`: Button text color
- `radioBorder`: Radio button border color

## Best Practices

### 1. Naming Conventions
- Use descriptive names: `container`, `headerTitle`, `inputField`
- Follow BEM-like structure: `card__title`, `input__field`
- Use camelCase for style properties

### 2. Theme Integration
- Always use theme colors instead of hardcoded values
- Create fallback styles for when theme is not available
- Test both light and dark themes

### 3. Performance
- Styles are created once per theme change
- Use StyleSheet.create for optimal performance
- Avoid inline styles when possible

### 4. Responsiveness
- Use relative dimensions when possible
- Consider different screen sizes
- Test on various devices

## Migration from Inline Styles

### Before (Inline Styles)
```tsx
<View style={{
  backgroundColor: '#ffffff',
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb'
}}>
```

### After (Theme-aware Styles)
```tsx
const styles = createComponentStyles(theme);

<View style={styles.card}>
```

## Troubleshooting

### Common Issues

1. **Theme not updating**: Ensure `ThemeProvider` wraps your component
2. **Styles not applying**: Check that styles are properly imported and used
3. **Type errors**: Verify theme interface matches expected structure

### Debug Tips

- Use `console.log(theme)` to verify theme values
- Check that `useTheme()` hook is working
- Verify style objects are being created correctly

## Future Enhancements

- [ ] Add animation utilities
- [ ] Implement responsive breakpoints
- [ ] Add more color schemes
- [ ] Create style presets for common UI patterns
- [ ] Add accessibility-focused styles
