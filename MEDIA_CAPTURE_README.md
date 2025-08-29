# Media Capture Component

A comprehensive, reusable media capture component that handles multiple photos and videos with automatic base64 conversion. Built following React Native best practices and your project's coding standards.

## Features

- 📱 **Multiple Media Types**: Support for photos, videos, or both
- 🔢 **Multiple Items**: Capture multiple photos and videos in a single session
- 🔄 **Base64 Conversion**: Automatic conversion to base64 for easy storage/transmission
- 📷 **Camera Integration**: Direct camera capture with permission handling
- 🖼️ **Gallery Selection**: Choose existing media from device gallery
- 🎯 **Limit Management**: Configurable limits for photos and videos
- 🎨 **Reusable Design**: Built using your existing Button component
- 📱 **Cross-platform**: Works on both iOS and Android
- 🔒 **Permission Handling**: Automatic camera permission requests
- 🎥 **Video Support**: Video recording with duration and thumbnail support

## Installation

The component uses `react-native-image-picker` which has been installed:

```bash
npm install react-native-image-picker
```

## Components

### 1. MediaCapture

The main component for capturing media.

```tsx
import { MediaCapture } from '../components';

<MediaCapture
  mediaType="both" // 'photo' | 'video' | 'both'
  maxPhotos={10}
  maxVideos={5}
  onMediaCaptured={handleMediaCaptured}
  onMediaRemoved={handleMediaRemoved}
  existingMedia={[]}
  allowMultiple={true}
  showPreview={true}
/>
```

### 2. MediaGallery

Displays captured media in a grid layout.

```tsx
import { MediaGallery } from '../components';

<MediaGallery
  media={capturedMedia}
  onRemove={handleMediaRemoved}
  onView={handleMediaView}
  maxItems={6}
/>
```

### 3. useMediaCapture Hook

Custom hook for managing media capture state and logic.

```tsx
import { useMediaCapture } from '../hooks';

const {
  photos,
  videos,
  isCapturing,
  hasPermission,
  handleCameraCapture,
  handleGallerySelection,
  removeMedia,
  getAllMedia,
} = useMediaCapture('both', 10, 5);
```

## Usage Examples

### Basic Photo Capture

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { MediaCapture } from '../components';
import { IMediaItem } from '../types/media.interface';

const PhotoCaptureScreen = () => {
  const [capturedPhotos, setCapturedPhotos] = useState<IMediaItem[]>([]);

  const handleMediaCaptured = (media: IMediaItem[]) => {
    setCapturedPhotos(media);
    console.log('Photos captured:', media.length);
    
    // Access base64 data
    media.forEach(photo => {
      console.log('Photo base64:', photo.base64.substring(0, 100) + '...');
    });
  };

  const handleMediaRemoved = (mediaId: string) => {
    setCapturedPhotos(prev => prev.filter(item => item.id !== mediaId));
  };

  return (
    <View>
      <MediaCapture
        mediaType="photo"
        maxPhotos={5}
        onMediaCaptured={handleMediaCaptured}
        onMediaRemoved={handleMediaRemoved}
        existingMedia={capturedPhotos}
        allowMultiple={true}
        showPreview={true}
      />
    </View>
  );
};
```

### Video Capture with Limits

```tsx
const VideoCaptureScreen = () => {
  const [capturedVideos, setCapturedVideos] = useState<IMediaItem[]>([]);

  const handleMediaCaptured = (media: IMediaItem[]) => {
    setCapturedVideos(media);
    
    // Log video details
    media.forEach(video => {
      console.log('Video:', {
        duration: video.duration,
        size: video.size,
        base64Length: video.base64.length,
        thumbnail: video.thumbnail ? 'Available' : 'None'
      });
    });
  };

  return (
    <MediaCapture
      mediaType="video"
      maxVideos={3}
      onMediaCaptured={handleMediaCaptured}
      onMediaRemoved={(id) => setCapturedVideos(prev => prev.filter(v => v.id !== id))}
      allowMultiple={true}
    />
  );
};
```

### Combined Media Capture

```tsx
const CombinedCaptureScreen = () => {
  const [allMedia, setAllMedia] = useState<IMediaItem[]>([]);

  const handleMediaCaptured = (media: IMediaItem[]) => {
    setAllMedia(media);
    
    const photos = media.filter(m => m.type === 'photo');
    const videos = media.filter(m => m.type === 'video');
    
    console.log(`Total: ${media.length}, Photos: ${photos.length}, Videos: ${videos.length}`);
  };

  return (
    <MediaCapture
      mediaType="both"
      maxPhotos={8}
      maxVideos={4}
      onMediaCaptured={handleMediaCaptured}
      onMediaRemoved={(id) => setAllMedia(prev => prev.filter(m => m.id !== id))}
      allowMultiple={true}
      showPreview={true}
    />
  );
};
```

## Props

### MediaCapture Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mediaType` | `'photo' \| 'video' \| 'both'` | - | Type of media to capture |
| `maxPhotos` | `number` | `10` | Maximum number of photos allowed |
| `maxVideos` | `number` | `5` | Maximum number of videos allowed |
| `onMediaCaptured` | `(media: IMediaItem[]) => void` | - | Callback when media is captured |
| `onMediaRemoved` | `(mediaId: string) => void` | - | Callback when media is removed |
| `existingMedia` | `IMediaItem[]` | `[]` | Previously captured media |
| `allowMultiple` | `boolean` | `true` | Allow multiple media items |
| `showPreview` | `boolean` | `true` | Show media preview gallery |
| `style` | `ViewStyle` | - | Custom styles |

### MediaGallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `media` | `IMediaItem[]` | - | Media items to display |
| `onRemove` | `(mediaId: string) => void` | - | Remove media callback |
| `onView` | `(media: IMediaItem) => void` | - | View media callback |
| `maxItems` | `number` | - | Maximum items to display |
| `style` | `ViewStyle` | - | Custom styles |

## Media Item Structure

```tsx
interface IMediaItem {
  id: string;                    // Unique identifier
  uri: string;                   // File URI
  base64: string;                // Base64 encoded data
  type: 'photo' | 'video';       // Media type
  timestamp: number;              // Capture timestamp
  size: number;                   // File size in bytes
  duration?: number;              // Video duration (videos only)
  thumbnail?: string;             // Base64 thumbnail (videos only)
}
```

## Integration with LoadToDockItemDetailsScreen

The component has been integrated into your existing `LoadToDockItemDetailsScreen`:

```tsx
// Photos tab
const renderPhotosTab = () => (
  <View style={styles.tabContent}>
    <MediaCapture
      mediaType="photo"
      maxPhotos={10}
      onMediaCaptured={handleMediaCaptured}
      onMediaRemoved={handleMediaRemoved}
      existingMedia={capturedMedia.filter(media => media.type === 'photo')}
      allowMultiple={true}
      showPreview={true}
      style={styles.mediaCaptureArea}
    />
  </View>
);

// Videos tab
const renderVideoTab = () => (
  <View style={styles.tabContent}>
    <MediaCapture
      mediaType="video"
      maxVideos={5}
      onMediaCaptured={handleMediaCaptured}
      onMediaRemoved={handleMediaRemoved}
      existingMedia={capturedMedia.filter(media => media.type === 'video')}
      allowMultiple={true}
      showPreview={true}
      style={styles.mediaCaptureArea}
    />
  </View>
);
```

## Base64 Data Usage

The component automatically converts all media to base64 format:

```tsx
// Access base64 data for storage/transmission
const handleSaveMedia = async () => {
  const mediaData = capturedMedia.map(item => ({
    id: item.id,
    type: item.type,
    base64: item.base64,        // Base64 string
    size: item.size,
    timestamp: item.timestamp,
  }));

  // Send to backend
  await api.saveMedia(mediaData);
  
  // Store locally
  await AsyncStorage.setItem('capturedMedia', JSON.stringify(mediaData));
};
```

## Permission Handling

The component automatically handles camera permissions:

- **Android**: Uses `PermissionsAndroid.request()` for camera access
- **iOS**: Relies on system permission dialogs
- **Fallback**: Shows permission warning if access is denied

## Performance Considerations

- Base64 conversion happens automatically during capture
- Media previews are optimized for grid display
- Lazy loading for large media collections
- Memory-efficient thumbnail generation for videos

## Error Handling

The component includes comprehensive error handling:

- Camera permission errors
- Capture failures
- Gallery selection errors
- Base64 conversion errors

## Styling

The component follows your project's design system:

- Uses existing `Button` component with consistent styling
- Responsive grid layout for media previews
- Consistent color scheme and typography
- Proper spacing and padding following your standards

## Testing

Use the `MediaCaptureExample` component for testing:

```tsx
import { MediaCaptureExample } from '../components';

// In your navigation or test screen
<MediaCaptureExample />
```

## Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Check device settings
   - Restart the app
   - Use gallery selection as fallback

2. **Base64 Conversion Fails**
   - Ensure media file is valid
   - Check available memory
   - Try smaller media files

3. **Performance Issues**
   - Reduce `maxPhotos`/`maxVideos` limits
   - Enable `showPreview={false}` for large collections
   - Use lower quality settings in image picker options

### Debug Mode

Enable console logging to debug issues:

```tsx
const handleMediaCaptured = (media: IMediaItem[]) => {
  console.log('Media captured:', media);
  console.log('Base64 length:', media[0]?.base64?.length);
  // ... rest of your logic
};
```

## Future Enhancements

- [ ] Image compression options
- [ ] Custom camera UI
- [ ] Media editing capabilities
- [ ] Cloud storage integration
- [ ] Offline media queue
- [ ] Advanced filtering and search

## Dependencies

- `react-native-image-picker`: Media capture and gallery access
- `react-native`: Core React Native functionality
- Your existing `Button` component for UI consistency

## License

This component follows your project's existing license and coding standards.
