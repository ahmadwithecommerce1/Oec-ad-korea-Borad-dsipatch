import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  push, 
  set, 
  update, 
  remove 
} from 'firebase/database';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  Radio, 
  Monitor, 
  Sparkles, 
  Layers, 
  Sliders, 
  Clock, 
  Check, 
  Search, 
  Pencil, 
  Trash2, 
  Send, 
  Plane, 
  Globe, 
  Activity, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Palette,
  Type,
  Play,
  RotateCcw,
  Save,
  MessageSquare,
  Sparkle,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Copy,
  FolderPlus,
  Eye,
  Download,
  FileUp,
  FileCheck2
} from 'lucide-react';

// Exact Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDOflQBHU_zmXZmgayqiGM4zokzJaTsqOo",
  authDomain: "ok-web-dashboared.firebaseapp.com",
  databaseURL: "https://ok-web-dashboared-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ok-web-dashboared",
  storageBucket: "ok-web-dashboared.firebasestorage.app",
  messagingSenderId: "926104626658",
  appId: "1:926104626658:web:0b33a91fd31f06c146c5bb",
  measurementId: "G-VKPQ5CHB5G"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export type DispatchStatus = 'Active' | 'Pending' | 'Inactive';

export interface OECRecord {
  id: string;
  dataInfo: string;
  boardInfo: string;
  progress: string;
  status: DispatchStatus;
  updatedAt?: number;
  createdAt?: number;
  [key: string]: any;
}

export type MediaCategory = 'Student Results' | 'Class Photos' | 'Videos' | 'Events';

export interface GalleryMediaItem {
  id: string;
  title: string;
  description: string;
  category: MediaCategory;
  downloadURL: string;
  url?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  mediaType: 'image' | 'video' | 'pdf';
  createdAt: number;
  updatedAt?: number;
}

export interface LEDTheme {
  id: string;
  key: string;
  name: string;
  category: string;
  primaryColor: string;
  glowColor: string;
  dotColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
}

export const LED_THEMES: LEDTheme[] = [
  { id: 'classic-green', key: 'green', name: 'Classic Green', category: 'Vintage Airport', primaryColor: '#10b981', glowColor: 'rgba(16, 185, 129, 0.7)', dotColor: '#059669', borderColor: '#10b98166', badgeBg: 'rgba(16, 185, 129, 0.15)', textColor: '#34d399' },
  { id: 'amber-gold', key: 'amber', name: 'Amber Gold', category: 'Split-Flap LED', primaryColor: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.7)', dotColor: '#d97706', borderColor: '#f59e0b66', badgeBg: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24' },
  { id: 'cyan-tech', key: 'cyan', name: 'Cyan Tech', category: 'Sci-Fi Air Traffic', primaryColor: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.7)', dotColor: '#0891b2', borderColor: '#06b6d466', badgeBg: 'rgba(6, 182, 212, 0.15)', textColor: '#22d3ee' },
  { id: 'purple-neon', key: 'purple', name: 'Purple Neon', category: 'Synthwave Neon', primaryColor: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.7)', dotColor: '#9333ea', borderColor: '#a855f766', badgeBg: 'rgba(168, 85, 247, 0.15)', textColor: '#c084fc' },
  { id: 'red-alert', key: 'red', name: 'Red Alert', category: 'Emergency Dispatch', primaryColor: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.75)', dotColor: '#dc2626', borderColor: '#ef444466', badgeBg: 'rgba(239, 68, 68, 0.15)', textColor: '#f87171' },
  { id: 'monochrome', key: 'white', name: 'Monochrome', category: 'Crisp Minimalist', primaryColor: '#f4f4f5', glowColor: 'rgba(244, 244, 245, 0.6)', dotColor: '#a1a1aa', borderColor: '#e4e4e766', badgeBg: 'rgba(244, 244, 245, 0.15)', textColor: '#fafafa' },
  { id: 'tokyo-night', key: 'pink', name: 'Tokyo Night', category: 'Cyberpunk Pink', primaryColor: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.7)', dotColor: '#db2777', borderColor: '#ec489966', badgeBg: 'rgba(236, 72, 153, 0.15)', textColor: '#f472b6' },
  { id: 'sunset-orange', key: 'orange', name: 'Sunset Orange', category: 'Industrial Solar', primaryColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.7)', dotColor: '#ea580c', borderColor: '#f9731666', badgeBg: 'rgba(249, 115, 22, 0.15)', textColor: '#fb923c' },
  { id: 'ice-blue', key: 'blue', name: 'Ice Blue', category: 'Glacier Blue', primaryColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.7)', dotColor: '#0284c7', borderColor: '#38bdf866', badgeBg: 'rgba(56, 189, 248, 0.15)', textColor: '#7dd3fc' },
  { id: 'lime-velocity', key: 'lime', name: 'Lime Velocity', category: 'High-Voltage', primaryColor: '#84cc16', glowColor: 'rgba(132, 204, 22, 0.7)', dotColor: '#65a30d', borderColor: '#84cc1666', badgeBg: 'rgba(132, 204, 22, 0.15)', textColor: '#a3e635' },
  { id: 'cyber-yellow', key: 'yellow', name: 'Cyber Yellow', category: 'Hazard Safety', primaryColor: '#eab308', glowColor: 'rgba(234, 179, 8, 0.7)', dotColor: '#ca8a04', borderColor: '#eab30866', badgeBg: 'rgba(234, 179, 8, 0.15)', textColor: '#fde047' },
  { id: 'phosphor-crt', key: 'crt', name: 'Phosphor CRT', category: 'Retro Mainframe', primaryColor: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.75)', dotColor: '#16a34a', borderColor: '#22c55e66', badgeBg: 'rgba(34, 197, 94, 0.15)', textColor: '#4ade80' },
];

export function getTheme(idOrKey: string): LEDTheme {
  const match = LED_THEMES.find(
    (t) => t.id === idOrKey || t.key === idOrKey || t.name.toLowerCase() === idOrKey.toLowerCase()
  );
  return match || LED_THEMES[0];
}

// 12 Text Animation Styles for the Scrolling Text
export const TEXT_ANIMATION_STYLES = [
  { id: 'Scroll', label: 'Scroll (Continuous Marquee)', description: 'Smooth continuous scroll from right to left', class: 'marquee-scroll' },
  { id: 'Bounce', label: 'Bounce (Horizontal Rebound)', description: 'Bounces gently back and forth across view', class: 'ticker-bounce' },
  { id: 'Fade', label: 'Fade (Pulsing Glow)', description: 'Smooth atmospheric glowing fade in and out', class: 'ticker-fade' },
  { id: 'Slide Left', label: 'Slide Left (Push Slide)', description: 'Slides in from right and smoothly exits left', class: 'ticker-slide-left' },
  { id: 'Slide Right', label: 'Slide Right (Push Slide)', description: 'Slides in from left and exits right', class: 'ticker-slide-right' },
  { id: 'Zoom', label: 'Zoom (Scale Pulse)', description: 'Expands and contracts with focus emphasis', class: 'ticker-zoom' },
  { id: 'Flip', label: 'Flip (3D Split-Flap)', description: 'Mechanical airport split-flap style 3D flip', class: 'ticker-flip' },
  { id: 'Typewriter', label: 'Typewriter (Terminal Typing)', description: 'Simulated computer terminal character typing', class: 'ticker-typewriter' },
  { id: 'Neon Pulse', label: 'Neon Pulse (Flicker Glow)', description: 'Electric neon bulb fluorescent flicker', class: 'ticker-neon-pulse' },
  { id: 'Wave', label: 'Wave (Sine Undulation)', description: 'Gentle floating wave harmonic motion', class: 'ticker-wave' },
  { id: 'Flash', label: 'Flash (Emergency Strobe)', description: 'High-contrast emergency strobe flashing', class: 'ticker-flash' },
  { id: 'Slide Up', label: 'Slide Up (Vertical Roll)', description: 'Rolls upward like a vertical broadcast ticker', class: 'ticker-slide-up' },
];

export const AdminConsole: React.FC<{ onOpenBoard?: () => void }> = ({ onOpenBoard }) => {
  const [records, setRecords] = useState<OECRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Settings from /oec_board_settings
  const [selectedThemeId, setSelectedThemeId] = useState('classic-green');
  const [animationSpeed, setAnimationSpeed] = useState(3);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Form states
  const [dataInfo, setDataInfo] = useState('');
  const [boardInfo, setBoardInfo] = useState('');
  const [progress, setProgress] = useState('');
  const [status, setStatus] = useState<DispatchStatus>('Active');
  const [editingRecord, setEditingRecord] = useState<OECRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Website Scrolling Text Control states (/scrolling_text_settings)
  const defaultNoticeText = 'ATTENTION DEPARTING OVERSEAS PERSONNEL: ENSURE VALID OEC STAMP BEFORE REACHING IMMIGRATION • GATE CLOSES 20 MIN PRIOR TO DEPARTURE';
  const [scrollingText, setScrollingText] = useState(defaultNoticeText);
  const [animationType, setAnimationType] = useState('Scroll');
  const [scrollSpeed, setScrollSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [scrollSpeedSlider, setScrollSpeedSlider] = useState(3); // 1 = Slow, 3 = Normal, 5 = Fast
  const [isSavingScrollingText, setIsSavingScrollingText] = useState(false);
  const [lastScrollingSavedAt, setLastScrollingSavedAt] = useState<number | null>(null);

  // Filter / Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [recordToDelete, setRecordToDelete] = useState<OECRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displaySettingsRef = useRef<HTMLDivElement>(null);
  const scrollingTextRef = useRef<HTMLDivElement>(null);
  const mediaManagementRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Website Media Management states (/website_gallery & Firebase Storage)
  const [mediaItems, setMediaItems] = useState<GalleryMediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaCategory, setMediaCategory] = useState<MediaCategory>('Student Results');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [mediaValidationError, setMediaValidationError] = useState<string | null>(null);
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('ALL');
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [mediaToDelete, setMediaToDelete] = useState<GalleryMediaItem | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Convert slider (1-5) to duration in seconds
  const getScrollDurationSeconds = (speedVal: number) => {
    switch (speedVal) {
      case 1: return 28; // Slow
      case 2: return 22;
      case 3: return 15; // Normal
      case 4: return 10;
      case 5: return 6;  // Fast
      default: return 15;
    }
  };

  // Convert slider value to 'Slow' | 'Normal' | 'Fast'
  const getScrollSpeedLabel = (speedVal: number): 'Slow' | 'Normal' | 'Fast' => {
    if (speedVal <= 2) return 'Slow';
    if (speedVal >= 4) return 'Fast';
    return 'Normal';
  };

  const getSpeedDetails = (speed: number) => {
    switch (speed) {
      case 1: return { flipSeconds: 12, blinkSeconds: 1.4, flipSpeed: '12s', blinkDuration: '1.4s', label: 'Slow (12s flip / 1.4s blink)' };
      case 2: return { flipSeconds: 9, blinkSeconds: 1.1, flipSpeed: '9s', blinkDuration: '1.1s', label: 'Moderate (9s flip / 1.1s blink)' };
      case 3: return { flipSeconds: 7, blinkSeconds: 0.8, flipSpeed: '7s', blinkDuration: '0.8s', label: 'Standard (7s flip / 0.8s blink)' };
      case 4: return { flipSeconds: 5, blinkSeconds: 0.55, flipSpeed: '5s', blinkDuration: '0.55s', label: 'Brisk (5s flip / 0.55s blink)' };
      case 5: return { flipSeconds: 3, blinkSeconds: 0.35, flipSpeed: '3s', blinkDuration: '0.35s', label: 'Fast (3s flip / 0.35s blink)' };
      default: return { flipSeconds: 7, blinkSeconds: 0.8, flipSpeed: '7s', blinkDuration: '0.8s', label: 'Standard (7s flip / 0.8s blink)' };
    }
  };

  // 1. Listen for Connection status
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    const unsub = onValue(connectedRef, (snap) => setIsConnected(!!snap.val()));
    return () => unsub();
  }, []);

  // 2. Real-time listener for /oec_board_settings
  useEffect(() => {
    const settingsRef = ref(db, 'oec_board_settings');
    const unsub = onValue(settingsRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const themeIdFromDb = val.themeId || val.theme || 'classic-green';
        setSelectedThemeId(themeIdFromDb);
        if (typeof val.animationSpeed === 'number') {
          setAnimationSpeed(val.animationSpeed);
        } else if (val.speed) {
          const num = parseInt(val.speed, 10);
          if (num <= 4) setAnimationSpeed(5);
          else if (num <= 6) setAnimationSpeed(4);
          else if (num <= 8) setAnimationSpeed(3);
          else if (num <= 10) setAnimationSpeed(2);
          else setAnimationSpeed(1);
        }
      }
    });
    return () => unsub();
  }, []);

  // 3. Real-time listener for /scrolling_text_settings (Website Scrolling Text Control)
  useEffect(() => {
    const scrollingRef = ref(db, 'scrolling_text_settings');
    const unsub = onValue(scrollingRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        if (typeof val.text === 'string' && val.text.length > 0) {
          setScrollingText(val.text);
        }
        if (val.animationType) {
          setAnimationType(val.animationType);
        }
        if (val.speed) {
          setScrollSpeed(val.speed);
          if (typeof val.speedValue === 'number') {
            setScrollSpeedSlider(val.speedValue);
          } else {
            if (val.speed === 'Slow') setScrollSpeedSlider(1);
            else if (val.speed === 'Fast') setScrollSpeedSlider(5);
            else setScrollSpeedSlider(3);
          }
        }
      }
    });
    return () => unsub();
  }, []);

  // 4. Real-time listener for /oec_board
  useEffect(() => {
    setIsLoading(true);
    const boardRef = ref(db, 'oec_board');
    const unsub = onValue(boardRef, (snapshot) => {
      const val = snapshot.val();
      const list: OECRecord[] = [];
      if (val) {
        if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            if (item) {
              const d = item.dataInfo || item.oecNumber || item.oec || item.flight || '';
              const b = item.boardInfo || item.countryInfo || item.country || item.origin || '';
              list.push({ ...item, id: String(idx), dataInfo: d, boardInfo: b, progress: item.progress || item.time || item.departure || '', status: item.status || 'Active' });
            }
          });
        } else if (typeof val === 'object') {
          Object.entries(val).forEach(([key, item]: [string, any]) => {
            if (item && typeof item === 'object') {
              const d = item.dataInfo || item.oecNumber || item.oec || item.flight || '';
              const b = item.boardInfo || item.countryInfo || item.country || item.origin || '';
              list.push({ ...item, id: key, dataInfo: d, boardInfo: b, progress: item.progress || item.time || item.departure || '', status: item.status || 'Active' });
            }
          });
        }
      }
      list.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
      setRecords(list);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // 5. Real-time listener for /website_gallery
  useEffect(() => {
    setIsLoadingMedia(true);
    const galleryRef = ref(db, 'website_gallery');
    const unsub = onValue(galleryRef, (snapshot) => {
      const val = snapshot.val();
      const list: GalleryMediaItem[] = [];
      if (val) {
        if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            if (item) {
              list.push({
                ...item,
                id: String(idx),
                downloadURL: item.downloadURL || item.url || '',
                mediaType: item.mediaType || (item.fileType?.startsWith('video') ? 'video' : item.fileType === 'application/pdf' ? 'pdf' : 'image'),
              });
            }
          });
        } else if (typeof val === 'object') {
          Object.entries(val).forEach(([key, item]: [string, any]) => {
            if (item && typeof item === 'object') {
              list.push({
                ...item,
                id: key,
                downloadURL: item.downloadURL || item.url || '',
                mediaType: item.mediaType || (item.fileType?.startsWith('video') ? 'video' : item.fileType === 'application/pdf' ? 'pdf' : 'image'),
              });
            }
          });
        }
      }
      list.sort((a, b) => (b.createdAt || b.updatedAt || 0) - (a.createdAt || a.updatedAt || 0));
      setMediaItems(list);
      setIsLoadingMedia(false);
    }, (err) => {
      console.error('Error listening to /website_gallery:', err);
      setIsLoadingMedia(false);
    });
    return () => unsub();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (timestamp?: number): string => {
    if (!timestamp) return 'Just now';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleCopyUrl = (url: string, title: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      showToast(`Copied URL for "${title}" to clipboard!`);
    }).catch(() => {
      showToast('Failed to copy URL', 'error');
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setMediaValidationError('File exceeds 100MB limit. Please select a smaller file.');
      return;
    }

    setSelectedFile(file);
    setMediaValidationError(null);

    // Generate local preview URL for images
    if (file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setFilePreviewUrl(localUrl);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleClearSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) {
      setMediaValidationError('Please enter a Media Title');
      return;
    }
    if (!selectedFile) {
      setMediaValidationError('Please select an Image, Video, or PDF file to upload');
      return;
    }

    setMediaValidationError(null);
    setIsUploadingMedia(true);
    setUploadProgress(0);

    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `website_gallery/${Date.now()}_${safeName}`;
    const fileStorageRef = storageRef(storage, storagePath);

    try {
      const uploadTask = uploadBytesResumable(fileStorageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(pct);
          }
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          showToast('Storage upload failed: ' + error.message, 'error');
          setIsUploadingMedia(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const galleryDbRef = ref(db, 'website_gallery');
            const newRef = push(galleryDbRef);

            const detectedType: 'image' | 'video' | 'pdf' = 
              selectedFile.type.startsWith('video') ? 'video' : 
              selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';

            await set(newRef, {
              title: mediaTitle.trim(),
              description: mediaDescription.trim(),
              category: mediaCategory,
              downloadURL,
              url: downloadURL,
              fileName: selectedFile.name,
              fileType: selectedFile.type || 'application/octet-stream',
              fileSize: selectedFile.size,
              storagePath,
              mediaType: detectedType,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });

            showToast(`"${mediaTitle.trim()}" uploaded to Firebase Storage & saved to website_gallery!`, 'success');
            
            // Clean up
            setMediaTitle('');
            setMediaDescription('');
            setSelectedFile(null);
            if (filePreviewUrl) {
              URL.revokeObjectURL(filePreviewUrl);
              setFilePreviewUrl(null);
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
            setUploadProgress(0);
          } catch (dbErr: any) {
            console.error('Database write error:', dbErr);
            showToast('Failed to save to website_gallery database: ' + dbErr.message, 'error');
          } finally {
            setIsUploadingMedia(false);
          }
        }
      );
    } catch (err: any) {
      console.error('Upload initiation error:', err);
      showToast('Error starting upload: ' + err.message, 'error');
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async () => {
    if (!mediaToDelete) return;
    setIsDeletingMedia(true);
    try {
      // 1. Delete from Firebase Storage if storagePath exists
      if (mediaToDelete.storagePath) {
        try {
          const itemStorageRef = storageRef(storage, mediaToDelete.storagePath);
          await deleteObject(itemStorageRef);
        } catch (storageErr) {
          console.warn('Storage delete warning:', storageErr);
        }
      }

      // 2. Delete from Realtime Database
      await remove(ref(db, `website_gallery/${mediaToDelete.id}`));
      showToast(`Deleted "${mediaToDelete.title}" from website gallery`, 'success');
      setMediaToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Failed to delete item: ' + err.message, 'error');
    } finally {
      setIsDeletingMedia(false);
    }
  };

  // Save Settings to Firebase /oec_board_settings
  const saveSettingsToFirebase = async (targetThemeId: string, targetSpeed: number) => {
    setIsSavingSettings(true);
    const themeObj = getTheme(targetThemeId);
    const speedDetails = getSpeedDetails(targetSpeed);

    try {
      const settingsRef = ref(db, 'oec_board_settings');
      await set(settingsRef, {
        theme: themeObj.key,
        themeId: themeObj.id,
        themeName: themeObj.name,
        speed: speedDetails.flipSpeed,
        animationSpeed: targetSpeed,
        flipIntervalSeconds: speedDetails.flipSeconds,
        blinkRateSeconds: speedDetails.blinkSeconds,
        blinkDuration: speedDetails.blinkDuration,
        flipDuration: speedDetails.flipSpeed,
        primaryColor: themeObj.primaryColor,
        glowColor: themeObj.glowColor,
        dotColor: themeObj.dotColor,
        borderColor: themeObj.borderColor,
        badgeBg: themeObj.badgeBg,
        textColor: themeObj.textColor,
        updatedAt: Date.now(),
      });
      showToast(`Settings broadcasted: ${themeObj.name} (${speedDetails.flipSpeed} flip)`);
    } catch (err: any) {
      showToast('Error syncing settings: ' + err.message, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Save Website Scrolling Text Settings to Firebase /scrolling_text_settings
  const handleSaveScrollingText = async () => {
    if (!scrollingText.trim()) {
      showToast('Please type a message before saving', 'error');
      return;
    }

    setIsSavingScrollingText(true);
    const durationSec = getScrollDurationSeconds(scrollSpeedSlider);
    const speedLabel = getScrollSpeedLabel(scrollSpeedSlider);

    try {
      const scrollingRef = ref(db, 'scrolling_text_settings');
      // Save full data object: text, animationType, and speed
      const payload = {
        text: scrollingText.trim(),
        animationType,
        speed: speedLabel, // 'Slow' | 'Normal' | 'Fast'
        speedDuration: `${durationSec}s`,
        speedSeconds: durationSec,
        duration: `${durationSec}s`,
        speedValue: scrollSpeedSlider,
        updatedAt: Date.now(),
      };
      await set(scrollingRef, payload);
      setLastScrollingSavedAt(Date.now());
      showToast(`Saved to Firebase (/scrolling_text_settings): { text: "${scrollingText.trim().substring(0, 22)}...", animationType: "${animationType}", speed: "${speedLabel}" }`, 'success');
    } catch (err: any) {
      console.error('Failed to save scrolling text settings:', err);
      showToast('Failed to save scrolling text: ' + err.message, 'error');
    } finally {
      setIsSavingScrollingText(false);
    }
  };

  const handleSelectTheme = (id: string) => {
    setSelectedThemeId(id);
    saveSettingsToFirebase(id, animationSpeed);
  };

  const handleSpeedSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAnimationSpeed(val);
    saveSettingsToFirebase(selectedThemeId, val);
  };

  const handleScrollSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setScrollSpeedSlider(val);
    setScrollSpeed(getScrollSpeedLabel(val));
  };

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataInfo.trim()) return setValidationError('Please enter Data Info (OEC / Flight)');
    if (!boardInfo.trim()) return setValidationError('Please enter Board Info (Destination / Origin)');
    if (!progress.trim()) return setValidationError('Please enter Progress (Departure / Time)');

    setValidationError(null);
    setIsSubmitting(true);

    try {
      if (editingRecord) {
        const recordRef = ref(db, `oec_board/${editingRecord.id}`);
        await update(recordRef, {
          dataInfo: dataInfo.trim(),
          boardInfo: boardInfo.trim(),
          progress: progress.trim(),
          status,
          oecNumber: dataInfo.trim(),
          countryInfo: boardInfo.trim(),
          updatedAt: Date.now(),
        });
        showToast(`Updated "${dataInfo.trim()}" on LED Board`);
        setEditingRecord(null);
      } else {
        const boardRef = ref(db, 'oec_board');
        const newRef = push(boardRef);
        await set(newRef, {
          dataInfo: dataInfo.trim(),
          boardInfo: boardInfo.trim(),
          progress: progress.trim(),
          status,
          oecNumber: dataInfo.trim(),
          countryInfo: boardInfo.trim(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        showToast(`Dispatched "${dataInfo.trim()}" to LED Board`);
      }
      setDataInfo('');
      setBoardInfo('');
      setProgress('');
      setStatus('Active');
    } catch (err: any) {
      showToast('Error saving record: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, current: DispatchStatus) => {
    let next: DispatchStatus = current === 'Active' ? 'Pending' : current === 'Pending' ? 'Inactive' : 'Active';
    try {
      await update(ref(db, `oec_board/${id}`), { status: next, updatedAt: Date.now() });
      showToast(`Status toggled to ${next}`);
    } catch (err: any) {
      showToast('Failed to toggle status: ' + err.message, 'error');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await remove(ref(db, `oec_board/${id}`));
      showToast('Record deleted from LED board');
      setRecordToDelete(null);
    } catch (err: any) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  const handleSeedData = async () => {
    const samples = [
      { dataInfo: 'OEC-8840', boardInfo: 'BANGLADESH (DAC)', progress: 'Check-In Open', status: 'Active' as DispatchStatus },
      { dataInfo: 'OEC-4180', boardInfo: 'PAKISTAN (ISB)', progress: 'Gate Closed', status: 'Active' as DispatchStatus },
      { dataInfo: 'OEC-9042', boardInfo: 'PHILIPPINES (MNL)', progress: 'Boarding - 14:30', status: 'Active' as DispatchStatus },
      { dataInfo: 'WY 343', boardInfo: 'BUSAN PORT', progress: '13:05', status: 'Active' as DispatchStatus },
      { dataInfo: 'OEC 8046', boardInfo: 'SEOUL INCHEON', progress: '12:15', status: 'Active' as DispatchStatus },
      { dataInfo: 'KOR 712', boardInfo: 'DAEGU CENTRAL', progress: '14:30', status: 'Active' as DispatchStatus },
    ];

    try {
      const boardRef = ref(db, 'oec_board');
      for (const item of samples) {
        const itemRef = push(boardRef);
        await set(itemRef, {
          ...item,
          oecNumber: item.dataInfo,
          countryInfo: item.boardInfo,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      showToast('Seeded South Korea & OEC flights to Firebase');
    } catch (err: any) {
      showToast('Failed to seed: ' + err.message, 'error');
    }
  };

  const activeTheme = getTheme(selectedThemeId);
  const speedDetails = getSpeedDetails(animationSpeed);
  const scrollDurationSec = getScrollDurationSeconds(scrollSpeedSlider);

  // Determine CSS animation style for preview - all 12 styles scale with selected speed
  const getPreviewAnimationStyle = () => {
    // Normal baseline is 15s (speedSlider = 3).
    // Speed factor: Slow (28s) -> 1.87x, Normal (15s) -> 1.0x, Fast (6s) -> 0.4x
    const speedRatio = +(scrollDurationSec / 15).toFixed(2);
    const scaleSec = (baseSec: number) => {
      const s = Math.max(0.2, +(baseSec * speedRatio).toFixed(2));
      return `${s}s`;
    };

    switch (animationType) {
      case 'Scroll':
        return { animation: `marquee-scroll ${scrollDurationSec}s linear infinite` };
      case 'Bounce':
        return { animation: `ticker-bounce ${scaleSec(2.5)} ease-in-out infinite alternate` };
      case 'Fade':
        return { animation: `ticker-fade ${scaleSec(2.8)} ease-in-out infinite` };
      case 'Slide Left':
        return { animation: `ticker-slide-left ${scaleSec(4.0)} cubic-bezier(0.4, 0, 0.2, 1) infinite` };
      case 'Slide Right':
        return { animation: `ticker-slide-right ${scaleSec(4.0)} cubic-bezier(0.4, 0, 0.2, 1) infinite` };
      case 'Zoom':
        return { animation: `ticker-zoom ${scaleSec(3.0)} ease-in-out infinite` };
      case 'Flip':
        return { animation: `ticker-flip ${scaleSec(3.5)} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite` };
      case 'Neon Pulse':
        return { animation: `ticker-neon-pulse ${scaleSec(1.8)} ease-in-out infinite` };
      case 'Wave':
        return { animation: `ticker-wave ${scaleSec(1.8)} ease-in-out infinite` };
      case 'Flash':
        return { animation: `ticker-flash ${scaleSec(0.8)} infinite` };
      case 'Slide Up':
        return { animation: `ticker-slide-up ${scaleSec(3.2)} ease-in-out infinite` };
      case 'Typewriter':
        return { borderRight: '2px solid currentColor', animation: `ticker-typewriter ${scaleSec(0.7)} step-end infinite` };
      default:
        return { animation: `marquee-scroll ${scrollDurationSec}s linear infinite` };
    }
  };

  const filteredRecords = records.filter((r) => {
    const d = (r.dataInfo || '').toLowerCase();
    const b = (r.boardInfo || '').toLowerCase();
    const p = (r.progress || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return (!q || d.includes(q) || b.includes(q) || p.includes(q)) &&
           (filterStatus === 'ALL' || (r.status || 'Active').toUpperCase() === filterStatus.toUpperCase());
  });

  const filteredMediaItems = mediaItems.filter((item) => {
    const matchesCategory = mediaCategoryFilter === 'ALL' || item.category === mediaCategoryFilter;
    const term = mediaSearchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      item.title?.toLowerCase().includes(term) || 
      item.description?.toLowerCase().includes(term) ||
      item.fileName?.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#111214] text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#181a1f] border border-zinc-700 shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-zinc-500 hover:text-zinc-300 ml-2"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#24272c] bg-[#141518]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">OEC Dispatch Admin Console</h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>Live Firebase RTDB</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border bg-[#191b22]" style={{ borderColor: activeTheme.primaryColor, color: activeTheme.textColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTheme.primaryColor }} />
                  <span>Theme: {activeTheme.name}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Broadcast direct updates, themes & live scrolling tickers to the Main LED Board</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
            <button
              type="button"
              onClick={() => scrollingTextRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 hover:text-white bg-[#191c22] hover:bg-[#22262e] border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg transition-all cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scrolling Text</span>
            </button>

            <button
              type="button"
              onClick={() => mediaManagementRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-300 hover:text-white bg-[#191c22] hover:bg-[#22262e] border border-purple-500/30 hover:border-purple-500/60 rounded-lg transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>Website Media</span>
              <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded text-[10px] font-mono">{mediaItems.length}</span>
            </button>

            {onOpenBoard && (
              <button
                type="button"
                onClick={onOpenBoard}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-black rounded-lg transition-all shadow-md cursor-pointer group"
                style={{ backgroundColor: activeTheme.primaryColor, boxShadow: `0 0 15px ${activeTheme.glowColor}` }}
              >
                <Monitor className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>Launch Main LED Board</span>
                <span className="bg-black/25 text-black px-1.5 py-0.5 rounded text-[10px] font-mono font-black">{records.length}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSeedData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#191c22] hover:bg-[#22262e] border border-[#272a30] rounded-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sample Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sync Status bar */}
      <div className="bg-[#15171c] border-b border-[#24272c] px-4 sm:px-6 py-2 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isConnected ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Wifi className="w-3.5 h-3.5" />
                <span>Firebase RTDB Synchronized</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Connecting to Firebase...</span>
              </span>
            )}
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-[11px] text-zinc-400">
              Synced nodes: <code className="text-emerald-400">/oec_board</code>, <code className="text-emerald-400">/oec_board_settings</code>, <code className="text-emerald-400">/scrolling_text_settings</code>, <code className="text-purple-400">/website_gallery</code>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Media: <strong className="text-purple-400">{mediaItems.length} items</strong></span>
            <span>Flip: <strong className="text-emerald-400">{speedDetails.flipSpeed}</strong></span>
            <span>Ticker: <strong className="text-zinc-300">{animationType} ({scrollSpeed})</strong></span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Form: Add New Record */}
        <section className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#24272c]">
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {editingRecord ? `Editing: ${editingRecord.dataInfo}` : 'Add New Record (South Korea & OEC Board)'}
            </h2>
            {editingRecord && (
              <button type="button" onClick={() => setEditingRecord(null)} className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-[#20232a] border border-[#2d313a] cursor-pointer">Cancel Edit</button>
            )}
          </div>

          {validationError && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg text-xs">{validationError}</div>
          )}

          <form onSubmit={handleSubmitRecord} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase">
                  <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded mr-1">LED SIGNALS</span>
                  Data Info (OEC / Flight) *
                </label>
                <div className="relative">
                  <input type="text" value={dataInfo} onChange={(e) => setDataInfo(e.target.value)} placeholder="e.g. OEC-8840 or KOR 712" className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono outline-none" />
                  <Plane className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase">Board Info (Origin / Destination) *</label>
                <div className="relative">
                  <input type="text" value={boardInfo} onChange={(e) => setBoardInfo(e.target.value)} placeholder="e.g. Seoul Incheon or Philippines" className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none" />
                  <Globe className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase">Progress (Departure / Time) *</label>
                <div className="relative">
                  <input type="text" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="e.g. Check-In Open or 13:05" className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none" />
                  <Clock className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase">Status *</label>
                <div className="relative">
                  <select value={status} onChange={(e) => setStatus(e.target.value as DispatchStatus)} className="w-full bg-[#101114] border border-[#272a31] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer">
                    <option value="Active">● Active (Display on LED)</option>
                    <option value="Pending">● Pending (Standby)</option>
                    <option value="Inactive">● Inactive (Hidden)</option>
                  </select>
                  <Activity className="w-4 h-4 text-zinc-600 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#10b981] hover:bg-[#059669] text-zinc-950 font-extrabold text-sm sm:text-base tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              <Send className="w-5 h-5 fill-current" />
              <span>{editingRecord ? 'UPDATE RECORD ON LED BOARD' : 'SUBMIT TO LED BOARD'}</span>
            </button>
          </form>
        </section>

        {/* SECTION: Live Website Scrolling Text Control */}
        <section ref={scrollingTextRef} className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle accent border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#24272c] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-display tracking-wide">
                    Live Website Scrolling Text
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    RTDB: /scrolling_text_settings
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Broadcast animated ticker banners across the website and the Main LED Board display in real-time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {isSavingScrollingText ? (
                <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <Radio className="w-3 h-3 animate-spin" />
                  <span>Saving to Firebase...</span>
                </span>
              ) : lastScrollingSavedAt ? (
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Saved & Live</span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            {/* 1. Text Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                  Ticker Message Content <span className="text-cyan-400">*</span>
                </label>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setScrollingText('ATTENTION DEPARTING OVERSEAS PERSONNEL: ENSURE VALID OEC STAMP BEFORE REACHING IMMIGRATION • GATE CLOSES 20 MIN PRIOR')}
                    className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    OEC Gate Notice
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setScrollingText('FLIGHT CLEARANCE ACTIVE • PASSENGERS WITH APPROVED OEC PROCEED TO DESIGNATED TERMINAL GATES')}
                    className="hover:text-zinc-300 cursor-pointer"
                  >
                    Clearance Active
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setScrollingText('WEATHER ADVISORY: SCHEDULED DEPARTURES RUNNING ON TIME • PLEASE MONITOR REAL-TIME LED SIGNALS')}
                    className="hover:text-zinc-300 cursor-pointer"
                  >
                    Weather Advisory
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={scrollingText}
                  onChange={(e) => setScrollingText(e.target.value)}
                  placeholder="Type scrolling message or bulletin announcement here..."
                  className="w-full bg-[#101114] border border-[#272a31] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 rounded-lg p-3 text-sm text-white placeholder-zinc-500 font-mono transition-all outline-none resize-none"
                />
                <MessageSquare className="w-4 h-4 text-zinc-600 absolute right-3 bottom-3 pointer-events-none" />
              </div>
            </div>

            {/* 2. Controls Grid: Animation Selector & Speed Control Slider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Animation Selector: Dropdown with 12 styles */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                  Text Animation Style (12 Styles) <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={animationType}
                    onChange={(e) => setAnimationType(e.target.value)}
                    className="w-full bg-[#101114] border border-[#272a31] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 rounded-lg px-3.5 py-3 text-sm text-white transition-all outline-none cursor-pointer appearance-none"
                  >
                    {TEXT_ANIMATION_STYLES.map((style) => (
                      <option key={style.id} value={style.id} className="bg-[#16181d] text-zinc-200 py-1">
                        ● {style.label}
                      </option>
                    ))}
                  </select>
                  <Activity className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-zinc-500">
                  {TEXT_ANIMATION_STYLES.find((s) => s.id === animationType)?.description}
                </p>
              </div>

              {/* Speed Control Slider */}
              <div className="space-y-2.5 bg-[#101114] border border-[#252830] rounded-lg p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200 uppercase tracking-wider">Scroll Speed Control</span>
                  <div className="flex items-center gap-2">
                    {/* Quick Speed Buttons */}
                    <div className="flex items-center gap-1 bg-[#181a20] p-0.5 rounded border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => { setScrollSpeedSlider(1); setScrollSpeed('Slow'); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          scrollSpeedSlider <= 2 ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Slow
                      </button>
                      <button
                        type="button"
                        onClick={() => { setScrollSpeedSlider(3); setScrollSpeed('Normal'); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          scrollSpeedSlider === 3 ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => { setScrollSpeedSlider(5); setScrollSpeed('Fast'); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          scrollSpeedSlider >= 4 ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Fast
                      </button>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold text-xs">
                      {scrollSpeed} ({scrollDurationSec}s)
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={scrollSpeedSlider}
                    onChange={handleScrollSliderChange}
                    className="w-full h-2 bg-[#20232a] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className={scrollSpeedSlider <= 2 ? 'font-bold text-cyan-300' : ''}>🐢 Slow (28s)</span>
                  <span className={scrollSpeedSlider === 3 ? 'font-bold text-cyan-300' : ''}>⚡ Normal (15s)</span>
                  <span className={scrollSpeedSlider >= 4 ? 'font-bold text-cyan-300' : ''}>🚀 Fast (6s)</span>
                </div>
              </div>
            </div>

            {/* 3. Live Animation Preview Ticker */}
            <div className="bg-[#0c0d10] border border-[#232731] rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-Time Ticker Preview:</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  Style: <strong className="text-zinc-300">{animationType}</strong> • Speed: <strong className="text-cyan-400">{scrollSpeed} ({scrollDurationSec}s cycle)</strong>
                </span>
              </div>

              {/* Visual ticker screen with instant dynamic key refresh */}
              <div className="bg-black/80 rounded-md border border-cyan-500/25 p-2.5 overflow-hidden flex items-center relative h-11 shadow-inner">
                <div 
                  key={`${animationType}-${scrollDurationSec}-${scrollingText}`}
                  className="whitespace-nowrap font-mono text-xs sm:text-sm text-cyan-300 font-bold tracking-wider inline-block select-none"
                  style={{
                    textShadow: '0 0 10px rgba(6, 182, 212, 0.7)',
                    ...getPreviewAnimationStyle(),
                  }}
                >
                  {scrollingText || 'Type a message above to preview animation...'}
                </div>
              </div>

              {/* Data Structure Preview Card */}
              <div className="bg-[#121419] border border-[#23262e] rounded-md px-3 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Firebase Saved Object Structure:</span>
                </div>
                <code className="text-cyan-300 text-[10px] sm:text-[11px] truncate max-w-full">
                  {`{ text: "${scrollingText.substring(0, 24)}${scrollingText.length > 24 ? '...' : ''}", animationType: "${animationType}", speed: "${scrollSpeed}" }`}
                </code>
              </div>
            </div>

            {/* 4. Save Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSaveScrollingText}
                disabled={isSavingScrollingText}
                className="w-full bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-extrabold text-sm uppercase tracking-wider py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingScrollingText ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Saving to Firebase RTDB...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-black" />
                    <span>SAVE SCROLLING TEXT SETTINGS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: Website Media Management */}
        <section ref={mediaManagementRef} className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Accent top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#24272c] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-white font-display tracking-wide">
                    Website Media Management
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    RTDB: /website_gallery
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Storage: ok-web-dashboared.firebasestorage.app
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Upload Student Results (PDF), Class Photos, Videos, and Events directly to Firebase Storage with instant public gallery synchronization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {isUploadingMedia ? (
                <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Uploading {uploadProgress}%...</span>
                </span>
              ) : (
                <span className="text-[11px] text-purple-400 font-mono flex items-center gap-1.5 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{mediaItems.length} Live Items</span>
                </span>
              )}
            </div>
          </div>

          {mediaValidationError && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{mediaValidationError}</span>
            </div>
          )}

          {/* Form: Upload New Media */}
          <form onSubmit={handleUploadMedia} className="space-y-4 mb-8 bg-[#121418] border border-[#22252c] p-4 sm:p-5 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252c]">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-purple-400" />
                <span>Upload Media Item</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">Accepts Images, Videos & PDFs (up to 100MB)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Media Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g. JLPT N4 Examination Results 2026"
                  className="w-full bg-[#0d0e11] border border-[#272a31] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isUploadingMedia}
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Category <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as MediaCategory)}
                    className="w-full bg-[#0d0e11] border border-[#272a31] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none transition-all"
                    disabled={isUploadingMedia}
                  >
                    <option value="Student Results">📄 Student Results (PDF / Score Sheets)</option>
                    <option value="Class Photos">📷 Class Photos (Images / Campus)</option>
                    <option value="Videos">🎥 Videos (Lectures & Promo)</option>
                    <option value="Events">🎉 Events (Orientation & Seminars)</option>
                  </select>
                  <Activity className="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Description / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  placeholder="e.g. Official dispatch result list for Batch 42"
                  className="w-full bg-[#0d0e11] border border-[#272a31] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isUploadingMedia}
                />
              </div>
            </div>

            {/* File Selector Zone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Select File (Image, Video, or PDF) <span className="text-purple-400">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="media-file-input"
                disabled={isUploadingMedia}
              />

              {!selectedFile ? (
                <label
                  htmlFor="media-file-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-[#2d313c] hover:border-purple-500/60 bg-[#0d0e11] hover:bg-[#15171d] rounded-xl p-6 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-zinc-200 group-hover:text-white mb-1">
                    Click to browse or drag & drop file here
                  </div>
                  <p className="text-xs text-zinc-500">
                    Supports <strong className="text-zinc-400">PDFs</strong> (Student Results), <strong className="text-zinc-400">Images</strong> (PNG, JPG, WebP), and <strong className="text-zinc-400">Videos</strong> (MP4, WebM)
                  </p>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-[#0e1014] border border-purple-500/40 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail / Icon */}
                    {filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-purple-500/30 shrink-0"
                      />
                    ) : selectedFile.type.startsWith('video') ? (
                      <div className="w-12 h-12 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-xs font-mono font-bold text-white truncate max-w-sm sm:max-w-md">
                        {selectedFile.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                          {selectedFile.type.startsWith('video') ? 'VIDEO' : selectedFile.type === 'application/pdf' ? 'PDF DOCUMENT' : 'IMAGE'}
                        </span>
                        <span>•</span>
                        <span>{formatBytes(selectedFile.size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label
                      htmlFor="media-file-input"
                      className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-[#191c22] hover:bg-[#22262e] border border-zinc-700 rounded-lg cursor-pointer transition-colors"
                    >
                      Change
                    </label>
                    <button
                      type="button"
                      onClick={handleClearSelectedFile}
                      disabled={isUploadingMedia}
                      className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {isUploadingMedia && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading to Firebase Storage & Registering URL...</span>
                  </span>
                  <span className="text-white font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#1e2129] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploadingMedia || !selectedFile}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 text-white font-extrabold text-sm uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploadingMedia ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>UPLOADING FILE ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-white" />
                    <span>UPLOAD TO WEBSITE GALLERY</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Uploaded Gallery Items */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#24272c]">
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Website Gallery Media Items ({filteredMediaItems.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Synchronized live to public website at node <code className="text-purple-400 font-mono">/website_gallery</code>
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={mediaSearchTerm}
                    onChange={(e) => setMediaSearchTerm(e.target.value)}
                    placeholder="Search media..."
                    className="w-full bg-[#101114] border border-[#272a31] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center rounded-lg bg-[#101114] border border-[#272a31] p-0.5 text-xs flex-wrap">
                  {(['ALL', 'Student Results', 'Class Photos', 'Videos', 'Events'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMediaCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        mediaCategoryFilter === cat
                          ? 'bg-purple-500/25 text-purple-300 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat === 'ALL' ? 'All' : cat}
                      {cat !== 'ALL' && (
                        <span className="ml-1 text-[10px] opacity-70">
                          ({mediaItems.filter(m => m.category === cat).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Cards Grid */}
            {isLoadingMedia && mediaItems.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                  <span>Loading website gallery media from Firebase...</span>
                </div>
              </div>
            ) : filteredMediaItems.length === 0 ? (
              <div className="py-12 text-center bg-[#111215] border border-dashed border-[#22252c] rounded-xl">
                <FolderPlus className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-300 font-medium text-sm">No media items found</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {mediaItems.length === 0 ? 'Use the form above to upload images, videos, or student results PDFs.' : 'No items match your filter/search criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMediaItems.map((item) => {
                  const isPdf = item.mediaType === 'pdf' || item.fileType === 'application/pdf' || item.fileName?.toLowerCase().endsWith('.pdf');
                  const isVid = item.mediaType === 'video' || item.fileType?.startsWith('video');

                  const categoryBadgeColor = 
                    item.category === 'Student Results' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                    item.category === 'Class Photos' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                    item.category === 'Videos' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                    'bg-amber-500/15 text-amber-300 border-amber-500/30';

                  return (
                    <div
                      key={item.id}
                      className="bg-[#111317] border border-[#232730] hover:border-purple-500/40 rounded-xl overflow-hidden flex flex-col justify-between transition-all group shadow-md"
                    >
                      {/* Media Display Header */}
                      <div className="relative bg-black/60 h-44 flex items-center justify-center overflow-hidden border-b border-[#20232a]">
                        {isPdf ? (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-2 shadow-inner">
                              <FileText className="w-7 h-7" />
                            </div>
                            <span className="font-mono text-xs font-bold text-red-300 uppercase">PDF Document</span>
                            <span className="font-mono text-[10px] text-zinc-500 mt-0.5 truncate max-w-xs">{item.fileName}</span>
                          </div>
                        ) : isVid ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            <video
                              src={item.downloadURL}
                              controls={false}
                              className="w-full h-full object-cover opacity-75"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setLightboxItem(item)}
                                className="w-12 h-12 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                                title="Play video"
                              >
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.downloadURL}
                            alt={item.title}
                            onClick={() => setLightboxItem(item)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            loading="lazy"
                          />
                        )}

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${categoryBadgeColor}`}>
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-zinc-300 border border-white/10 backdrop-blur-md">
                            {formatBytes(item.fileSize)}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors" title={item.title}>
                            {item.title}
                          </h4>
                          {item.description ? (
                            <p className="text-xs text-zinc-400 line-clamp-2" title={item.description}>
                              {item.description}
                            </p>
                          ) : (
                            <p className="text-xs text-zinc-600 italic">No description provided</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-[#1e2128]">
                          <span className="truncate max-w-[140px]" title={item.fileName}>
                            {item.fileName}
                          </span>
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="bg-[#0e0f12] px-4 py-2.5 border-t border-[#20232a] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={item.downloadURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-[#181a20] hover:bg-[#22252c] border border-zinc-700/80 rounded-md transition-colors"
                            title="Open original file in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                            <span>View</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyUrl(item.downloadURL, item.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#181a20] hover:bg-[#22252c] border border-zinc-700/80 rounded-md transition-colors cursor-pointer"
                            title="Copy Direct URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setMediaToDelete(item)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Delete from Gallery & Storage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Display Settings: 12 Themes & Speed Slider */}
        <section ref={displaySettingsRef} className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#24272c] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: activeTheme.badgeBg, borderColor: activeTheme.borderColor }}>
                <Palette className="w-4 h-4" style={{ color: activeTheme.primaryColor }} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-display">Display Settings (Live Theme & Speed)</h2>
                <p className="text-xs text-zinc-400">Syncs immediately to node <code className="text-emerald-400 font-mono">/oec_board_settings</code></p>
              </div>
            </div>
            {isSavingSettings && <span className="text-xs text-amber-400 font-mono">Syncing to Firebase...</span>}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-zinc-200 uppercase font-display">
                <span>1. Select LED Theme (12 Themes)</span>
                <span className="font-mono text-zinc-400">Active: <strong style={{ color: activeTheme.primaryColor }}>{activeTheme.name}</strong></span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {LED_THEMES.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${isSelected ? 'bg-[#1e222a] shadow-lg scale-[1.02]' : 'bg-[#101114] hover:bg-[#191c22] border-[#252830]'}`}
                      style={{ borderColor: isSelected ? theme.primaryColor : undefined, boxShadow: isSelected ? `0 0 15px ${theme.glowColor}` : undefined }}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 6px ${theme.primaryColor}` }} />
                        <span className="w-2 h-2 rounded-full opacity-70" style={{ backgroundColor: theme.dotColor }} />
                        {isSelected && <span className="ml-auto w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></span>}
                      </div>
                      <div className="font-mono text-xs font-bold text-white">{theme.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{theme.category}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speed Slider */}
            <div className="bg-[#101114] border border-[#252830] rounded-lg p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200 uppercase font-display">
                <span>2. LED Board Page-Flip Speed Control</span>
                <span className="font-mono text-emerald-400">{speedDetails.flipSpeed} Flip / {speedDetails.blinkDuration} Blink</span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={animationSpeed}
                onChange={handleSpeedSliderChange}
                className="w-full h-2.5 bg-[#20232a] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: activeTheme.primaryColor }}
              />

              <div className="flex items-center justify-between text-xs font-mono font-medium text-zinc-400">
                <span>🐢 Slow (12s)</span>
                <span>Moderate (9s)</span>
                <span className="text-emerald-400 font-bold">⚡ Standard (7s)</span>
                <span>Brisk (5s)</span>
                <span>🚀 Fast (3s)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Records Table */}
        <section className="bg-[#16181d] border border-[#24272c] rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#24272c] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#14161a]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">Live LED Board Records ({records.length})</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Click status badge to toggle between Active / Pending / Inactive</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full bg-[#101114] border border-[#272a31] rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none" />
              </div>

              <div className="flex items-center rounded-lg bg-[#101114] border border-[#272a31] p-0.5 text-xs">
                {(['ALL', 'Active', 'Pending', 'Inactive'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                      filterStatus.toUpperCase() === st.toUpperCase()
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#24272c] bg-[#111215] text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  <th className="py-3.5 px-4 sm:px-6"><span className="text-emerald-400 font-bold mr-1.5 text-[10px]">LED SIGNALS</span><span>Data Info</span></th>
                  <th className="py-3.5 px-4 sm:px-6">Board Info</th>
                  <th className="py-3.5 px-4 sm:px-6">Progress</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2026] text-sm">
                {isLoading && records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                        <span>Connecting to Firebase Realtime Database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      <p className="text-white font-medium text-sm">No records found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-[#1a1d23]/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-emerald-300">{r.dataInfo || r.oecNumber || 'N/A'}</td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-zinc-200">{r.boardInfo || r.countryInfo || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-300 text-xs sm:text-sm">{r.progress}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <button type="button" onClick={() => handleToggleStatus(r.id, r.status || 'Active')} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer bg-emerald-500/15 text-emerald-400 border-emerald-500/40">
                          <span>{r.status || 'Active'}</span>
                          <span className="text-[10px] ml-1">↻</span>
                        </button>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button type="button" onClick={() => { setEditingRecord(r); setDataInfo(r.dataInfo || ''); setBoardInfo(r.boardInfo || ''); setProgress(r.progress || ''); setStatus(r.status || 'Active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1.5 text-zinc-400 hover:text-emerald-400 cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button type="button" onClick={() => setRecordToDelete(r)} className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Delete modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#181a1f] border border-[#2b2f38] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Record from LED Board?</h3>
            <p className="text-xs text-zinc-400">Are you sure you want to remove flight <strong className="text-emerald-400">{recordToDelete.dataInfo}</strong>?</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setRecordToDelete(null)} className="px-4 py-2 text-xs text-zinc-300 hover:text-white bg-[#22252c] rounded-lg cursor-pointer">Cancel</button>
              <button type="button" onClick={() => handleDeleteRecord(recordToDelete.id)} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Media Confirmation Modal */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181a1f] border border-[#2b2f38] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Media Item?</h3>
                <p className="text-xs text-zinc-400">This will remove the file from Firebase Storage & database</p>
              </div>
            </div>

            <div className="bg-[#111215] border border-zinc-800 rounded-lg p-3 space-y-1.5 text-xs font-mono">
              <div>Title: <strong className="text-white">{mediaToDelete.title}</strong></div>
              <div>Category: <span className="text-purple-400">{mediaToDelete.category}</span></div>
              <div className="truncate">File: <span className="text-zinc-400">{mediaToDelete.fileName} ({formatBytes(mediaToDelete.fileSize)})</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingMedia}
                onClick={() => setMediaToDelete(null)}
                className="px-4 py-2 text-xs text-zinc-300 hover:text-white bg-[#22252c] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingMedia}
                onClick={handleDeleteMedia}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingMedia ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Media Viewer Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#121418] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-white truncate">{lightboxItem.title}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{lightboxItem.category} • {formatBytes(lightboxItem.fileSize)}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxItem.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 rounded-md flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50 min-h-[300px]">
              {lightboxItem.mediaType === 'video' || lightboxItem.fileType?.startsWith('video') ? (
                <video
                  src={lightboxItem.downloadURL}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full rounded-lg"
                />
              ) : lightboxItem.mediaType === 'pdf' || lightboxItem.fileType === 'application/pdf' ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <FileText className="w-16 h-16 text-red-400" />
                  <div className="text-sm text-zinc-200 font-mono">{lightboxItem.fileName}</div>
                  <a
                    href={lightboxItem.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / View Full PDF</span>
                  </a>
                </div>
              ) : (
                <img
                  src={lightboxItem.downloadURL}
                  alt={lightboxItem.title}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>

            {lightboxItem.description && (
              <div className="p-3.5 bg-[#0e1013] border-t border-zinc-800 text-xs text-zinc-300">
                {lightboxItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;
