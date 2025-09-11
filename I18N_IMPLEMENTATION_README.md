# 🌍 Internationalization (i18n) Implementation

This document describes the internationalization system implemented for the Mobile Supply Chain application.

## 📋 Overview

The app now supports multiple languages with a lightweight, easy-to-extend i18n system that doesn't require additional dependencies.

### Supported Languages
- **English** (en) - Default
- **Spanish** (es) - Español  
- **French** (fr) - Français

## 🏗️ Architecture

### Core Components

#### 1. **Language Files** (`src/locales/`)
- `en.ts` - English translations
- `es.ts` - Spanish translations  
- `fr.ts` - French translations
- `index.ts` - Language configuration and utilities

#### 2. **I18n Context** (`src/context/I18nContext.tsx`)
- Manages current language state
- Provides translation function (`t`)
- Handles language persistence with AsyncStorage
- Supports parameter interpolation

#### 3. **Translation Hook** (`src/hooks/useTranslation.ts`)
- Simplified hook for easy translation usage
- Exports `t`, `language`, and `setLanguage`

## 🚀 Usage

### Basic Translation
```typescript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <Text>{t('settings.title')}</Text>;
};
```

### With Parameters
```typescript
const { t } = useTranslation();

// Translation: "Select {language} language"
const message = t('settings.selectLanguageOption', { language: 'English' });
// Result: "Select English language"
```

### Language Switching
```typescript
const { language, setLanguage } = useTranslation();

const handleLanguageChange = async (newLanguage: 'en' | 'es' | 'fr') => {
  await setLanguage(newLanguage);
};
```

## 📁 File Structure

```
src/
├── locales/
│   ├── en.ts          # English translations
│   ├── es.ts          # Spanish translations
│   ├── fr.ts          # French translations
│   └── index.ts       # Language configuration
├── context/
│   └── I18nContext.tsx # i18n context provider
└── hooks/
    └── useTranslation.ts # Translation hook
```

## 🔧 Adding New Languages

### 1. Create Language File
Create a new file in `src/locales/` (e.g., `de.ts` for German):

```typescript
export const de = {
  common: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    // ... other translations
  },
  settings: {
    title: 'Einstellungen',
    // ... other translations
  },
  // ... other sections
};
```

### 2. Update Language Configuration
Update `src/locales/index.ts`:

```typescript
import { de } from './de';

export type Language = 'en' | 'es' | 'fr' | 'de';

export const translations = {
  en,
  es,
  fr,
  de, // Add new language
} as const;

export const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch', // Add new language name
} as const;
```

### 3. Update TypeScript Types
The `Language` type will automatically include the new language code.

## 🎯 Key Features

- ✅ **Zero Dependencies** - No external i18n libraries required
- ✅ **Type Safety** - Full TypeScript support with autocomplete
- ✅ **Persistence** - Language preference saved to AsyncStorage
- ✅ **Parameter Interpolation** - Support for dynamic values in translations
- ✅ **Easy Extension** - Simple process to add new languages
- ✅ **Performance** - Lightweight and fast
- ✅ **Accessibility** - Proper accessibility labels in all languages

## 🔄 Language Switching

The language can be changed from the Settings screen:
1. Tap on "Language" setting
2. Select desired language from dropdown
3. Language changes immediately across the app
4. Preference is saved and restored on app restart

## 📝 Translation Keys Structure

```typescript
{
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    // ... common UI elements
  },
  settings: {
    title: 'Settings',
    theme: 'Theme',
    // ... settings specific translations
  },
  alerts: {
    logoutTitle: 'Logout',
    logoutMessage: 'Are you sure you want to logout?',
    // ... alert messages
  },
  languages: {
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    // ... language names
  }
}
```

## 🚀 Future Enhancements

- RTL (Right-to-Left) language support
- Pluralization rules
- Date/time formatting per locale
- Number formatting per locale
- Dynamic language loading from server
