# Icon Installation Guide

## Installing React Native Feather

**REQUIRED**: To use the IconComponent, you must install `react-native-feather` as it now only uses professional vector icons:

### 1. Install the Package

```bash
npm install react-native-feather
# or
yarn add react-native-feather
```

### 2. For iOS (if using CocoaPods)

```bash
cd ios && pod install
```

### 3. Restart Your Development Server

```bash
# Stop the current Metro bundler
# Then restart with:
npx react-native start --reset-cache
```

## What This Gives You

### Professional Vector Icons Only
- 📷 → Professional Camera icon
- 🎥 → Professional Video icon
- 📄 → Professional FileText icon
- 🗑️ → Professional Trash2 icon

**No more emoji icons** - only clean, scalable vector icons for a polished app appearance.

## Icon Names Available

The `IconComponent` supports these icon names:

### Media & Camera
- `camera`, `photo`, `image`

### Video
- `video`, `video-camera`, `film`

### Documents
- `file`, `document`, `clipboard`

### Location & Navigation
- `map-pin`, `location`, `navigation`
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`

### Actions
- `plus`, `minus`, `edit`, `delete`
- `search`, `filter`, `sort`

### Status
- `check`, `x`, `warning`, `info`

### User & Settings
- `user`, `users`, `settings`, `home`

### Business
- `shopping-cart`, `package`, `truck`, `warehouse`

### Social
- `star`, `heart`, `share`

### Communication
- `mail`, `phone`

### Time
- `calendar`, `clock`

### File Operations
- `download`, `upload`

### Visibility
- `eye`, `eye-off`

### Security
- `lock`, `unlock`

## Usage Examples

```tsx
import { IconComponent } from '../components';

// Basic usage
<IconComponent name="camera" size={24} color="#1e3a8a" />

// In tabs
<IconComponent name="video" size={14} color="#6b7280" />

// With custom styling
<IconComponent 
  name="settings" 
  size={20} 
  color="#10b981" 
  style={{ marginRight: 8 }} 
/>
```

## Important Notes

⚠️ **No Fallback Icons**: The component will throw an error if `react-native-feather` is not installed.

⚠️ **Pure Vector Icons**: Only React Feather icons are supported - no emoji fallbacks.

## Troubleshooting

### Icons Not Showing
1. **MUST** install `react-native-feather` first
2. Check that you've restarted the Metro bundler
3. Verify the icon name is correct

### Build Errors
1. For iOS: Run `cd ios && pod install`
2. Clean and rebuild: `npx react-native run-ios --reset-cache`

### Import Errors
If you get import errors, ensure:
1. `react-native-feather` is in your package.json
2. You've run `npm install` or `yarn install`
3. Metro bundler has been restarted

## Adding New Icons

To add new icons:

1. **Import from react-native-feather**:
   ```tsx
   import { Star, Heart, Share } from 'react-native-feather';
   
   // Add to your tabs or components
   <Star size={16} color="#f59e0b" />
   ```

2. **Extend the IconComponent**:
   ```tsx
   // In IconComponent.tsx, add new mappings
   'star': Star,
   'heart': Heart,
   'share': Share,
   ```

## Benefits of Pure Vector Icons

1. **Professional**: Clean, consistent appearance
2. **Scalable**: Crisp at any size
3. **Performance**: Optimized vector rendering
4. **Consistency**: Uniform stroke width and style
5. **Accessibility**: Better screen reader support
6. **Customization**: Easy color and size changes
7. **File Size**: Smaller than bitmap icons
8. **Quality**: No pixelation or blur at any scale

## Migration from Emoji Icons

If you were previously using emoji icons:

1. **Install react-native-feather**: `npm install react-native-feather`
2. **Update icon names**: Use the exact names from the icon mapping
3. **Test thoroughly**: Ensure all icons render correctly
4. **Restart Metro**: Clear cache and restart development server

## Example Icon Usage in Tabs

```tsx
const tabs = [
  {
    id: 'photos',
    label: 'PHOTOS',
    icon: <IconComponent name="camera" size={14} color="#6b7280" />,
    content: <PhotosTab />
  },
  {
    id: 'video',
    label: 'VIDEO',
    icon: <IconComponent name="video" size={14} color="#6b7280" />,
    content: <VideoTab />
  }
];
```

This ensures your app has a professional, consistent icon system throughout.
