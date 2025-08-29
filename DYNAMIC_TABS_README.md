# DynamicTabs Component

A highly flexible and reusable React Native component for creating dynamic tab interfaces that can easily accommodate any number of tabs without code changes.

## Features

- **Dynamic**: Supports any number of tabs (2, 3, 5, 10+ tabs)
- **Flexible Icons**: Built-in icon system with easy extension to external icon libraries
- **Customizable**: Extensive styling options for tabs, icons, and labels
- **Type-safe**: Full TypeScript support with proper interfaces
- **Reusable**: Can be implemented across different screens and contexts
- **Content Switching**: Automatic content rendering based on active tab

## Why DynamicTabs?

### Before (Hardcoded Approach)
```tsx
// ❌ Hard to maintain and extend
<View style={styles.tabsContainer}>
  <TouchableOpacity onPress={() => setActiveTab('photos')}>
    <Text>📷</Text>
    <Text>PHOTOS</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setActiveTab('video')}>
    <Text>🎥</Text>
    <Text>VIDEO</Text>
  </TouchableOpacity>
</View>

// ❌ Content switching logic scattered
{activeTab === 'photos' ? renderPhotosTab() : renderVideoTab()}
```

### After (Dynamic Approach)
```tsx
// ✅ Easy to maintain and extend
<DynamicTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>

// ✅ Content automatically switches based on active tab
// ✅ Adding new tabs requires only array modification
```

## Usage

### Basic Implementation

```tsx
import { DynamicTabs, IconComponent } from '../components';

const [activeTab, setActiveTab] = useState('photos');

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

<DynamicTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Adding New Tabs

Simply add new objects to the tabs array:

```tsx
const tabs = [
  // ... existing tabs
  {
    id: 'documents',
    label: 'DOCUMENTS',
    icon: <IconComponent name="document" size={14} color="#6b7280" />,
    content: <DocumentsTab />
  },
  {
    id: 'location',
    label: 'LOCATION',
    icon: <IconComponent name="map-pin" size={14} color="#6b7280" />,
    content: <LocationTab />
  }
];
```

### Custom Styling

```tsx
<DynamicTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  style={styles.customTabs}
  activeIconStyle={{ color: '#10b981' }}
  activeLabelStyle={{ color: '#10b981' }}
  tabStyle={styles.customTab}
/>
```

## Props Interface

### IDynamicTabsProps

```tsx
export interface IDynamicTabsProps {
  tabs: ITabItem[];                    // Array of tab configurations
  activeTab: string;                   // Currently active tab ID
  onTabChange: (tabId: string) => void; // Tab change callback
  style?: any;                         // Container styling
  tabStyle?: any;                      // Individual tab styling
  activeTabStyle?: any;                // Active tab styling
  iconStyle?: any;                     // Icon styling
  activeIconStyle?: any;               // Active icon styling
  labelStyle?: any;                    // Label styling
  activeLabelStyle?: any;              // Active label styling
}
```

### ITabItem

```tsx
export interface ITabItem {
  id: string;           // Unique tab identifier
  label: string;        // Tab display label
  icon: React.ReactNode; // Tab icon (can be any React component)
  content: React.ReactNode; // Tab content (rendered when active)
}
```

## Icon System

### Built-in Icons

The `IconComponent` provides a comprehensive set of emoji-based icons:

```tsx
// Camera & Media
<IconComponent name="camera" size={14} />
<IconComponent name="video" size={14} />
<IconComponent name="image" size={14} />

// Business & Commerce
<IconComponent name="shopping-cart" size={14} />
<IconComponent name="warehouse" size={14} />
<IconComponent name="truck" size={14} />
<IconComponent name="package" size={14} />

// User & Settings
<IconComponent name="user" size={14} />
<IconComponent name="settings" size={14} />
<IconComponent name="notifications" size={14} />

// Actions & Navigation
<IconComponent name="plus" size={14} />
<IconComponent name="search" size={14} />
<IconComponent name="arrow-left" size={14} />
```

### Extending with External Icon Libraries

Easy to extend with libraries like `react-native-feather`:

```tsx
import { Camera, Video, FileText } from 'react-native-feather';

const tabs = [
  {
    id: 'photos',
    label: 'PHOTOS',
    icon: <Camera size={14} color="#6b7280" />,
    content: <PhotosTab />
  },
  {
    id: 'video',
    label: 'VIDEO',
    icon: <Video size={14} color="#6b7280" />,
    content: <VideoTab />
  }
];
```

## Use Cases

### 1. Media Management
- Photo/Video capture
- Document uploads
- Media galleries

### 2. Business Processes
- Order management
- Inventory tracking
- Shipping details

### 3. User Management
- Profile settings
- Account preferences
- Notification center

### 4. Data Views
- Different data formats
- Multiple chart types
- Various list views

## Migration Guide

### From Hardcoded Tabs

1. **Replace tab JSX**:
   ```tsx
   // Before
   <View style={styles.tabsContainer}>
     <TouchableOpacity>...</TouchableOpacity>
   </View>
   
   // After
   <DynamicTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
   ```

2. **Create tabs configuration**:
   ```tsx
   const tabs = [
     {
       id: 'photos',
       label: 'PHOTOS',
       icon: <IconComponent name="camera" size={14} />,
       content: renderPhotosTab()
     }
   ];
   ```

3. **Remove duplicate styles**:
   ```tsx
   // Remove these styles from parent component
   tabsContainer, tab, activeTab, tabIcon, etc.
   ```

4. **Update content rendering**:
   ```tsx
   // Before
   {activeTab === 'photos' ? renderPhotosTab() : renderVideoTab()}
   
   // After
   {tabs.find(tab => tab.id === activeTab)?.content}
   ```

## Advanced Features

### Custom Tab Styling

```tsx
<DynamicTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  style={{
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db'
  }}
  activeTabStyle={{
    backgroundColor: '#10b981',
    transform: [{ scale: 1.05 }]
  }}
/>
```

### Conditional Tab Rendering

```tsx
const tabs = [
  // Always show
  { id: 'photos', label: 'PHOTOS', icon: ..., content: ... },
  
  // Conditional tab
  ...(userHasVideoAccess ? [{
    id: 'video',
    label: 'VIDEO',
    icon: <IconComponent name="video" size={14} />,
    content: <VideoTab />
  }] : [])
];
```

### Dynamic Tab Labels

```tsx
const tabs = [
  {
    id: 'notifications',
    label: `NOTIFICATIONS (${notificationCount})`,
    icon: <IconComponent name="info" size={14} />,
    content: <NotificationsTab />
  }
];
```

## Performance Considerations

- **Content Rendering**: Only the active tab content is rendered
- **Icon Optimization**: Icons are lightweight emoji-based by default
- **State Management**: Minimal re-renders with proper state handling
- **Memory Usage**: Efficient content switching without memory leaks

## Future Enhancements

- **Animation Support**: Smooth tab transitions and content animations
- **Accessibility**: Screen reader support and keyboard navigation
- **Theme Integration**: Dark/light mode support
- **Gesture Support**: Swipe between tabs
- **Lazy Loading**: Content loading on demand
- **Tab Persistence**: Remember last active tab across sessions

## Examples

See `DynamicTabsExample.tsx` for comprehensive usage examples including:
- Basic media tabs
- Business process tabs
- User management tabs
- Custom styling variations
- Code examples for adding new tabs

## Benefits

1. **Maintainability**: Single source of truth for tab logic
2. **Scalability**: Easy to add/remove tabs without code changes
3. **Consistency**: Uniform appearance across all tab implementations
4. **Flexibility**: Customizable styling and behavior
5. **Type Safety**: Full TypeScript support prevents runtime errors
6. **Reusability**: Can be implemented in any screen requiring tabs
7. **Performance**: Efficient rendering and state management
