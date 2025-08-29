export interface IMediaItem {
  id: string;
  uri: string;
  base64: string;
  type: 'photo' | 'video';
  timestamp: number;
  size: number;
  duration?: number; // for videos
  thumbnail?: string; // base64 thumbnail for videos
}

export interface IMediaCaptureProps {
  mediaType: 'photo' | 'video' | 'both';
  maxPhotos?: number;
  maxVideos?: number;
  onMediaCaptured: (media: IMediaItem[]) => void;
  onMediaRemoved: (mediaId: string) => void;
  existingMedia?: IMediaItem[];
  allowMultiple?: boolean;

  style?: any;
}

export interface IMediaCaptureState {
  photos: IMediaItem[];
  videos: IMediaItem[];
  isCapturing: boolean;
  hasPermission: boolean;
  error: string | null;
}

export interface IMediaPreviewProps {
  media: IMediaItem;
  onRemove: () => void;
  onView: () => void;
  style?: any;
}

export interface IMediaGalleryProps {
  media: IMediaItem[];
  onRemove: (mediaId: string) => void;
  onView: (media: IMediaItem) => void;
  maxItems?: number;
  style?: any;
}
