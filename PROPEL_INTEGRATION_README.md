# 🚀 Propel Apps Integration

This document describes the integration with Propel Apps API for the Mobile Supply Chain application.

## 📋 Overview

The app now integrates with the Propel Apps API to provide:
- **Authenticated login** with username/password
- **User data management** with responsibilities and organization info
- **Persistent storage** using SQLite (placeholder implementation)
- **Modern UI/UX** matching the Propel Apps design

## 🔧 API Integration

### Login API Endpoint
```
POST https://<hostname>/<project>/<version>/login
```

**Example:**
```
POST https://testnode.propelapps.com/EBS/20D/login
```

### Request Format
```json
{
  "username": "manideep j",
  "password": "Propel@123"
}
```

### Response Format
```json
{
  "metadata": [
    { "name": "STATUS", "type": "number" },
    { "name": "USER_NAME", "type": "text" },
    { "name": "USER_ID", "type": "number" }
  ],
  "data": [
    {
      "STATUS": "1",
      "USER_NAME": "MANIDEEP J",
      "USER_ID": "1015845",
      "TIMESTAMP": "21-AUG-2025 05:12:16",
      "TIMEZONE_OFFSET": "-04:00",
      "FULL_NAME": "John, Mr. Smith",
      "PERSON_ID": "32849",
      "RESPONSIBILITY": "MOVE COMPLETION PACK",
      "SET_OF_BOOK_ID": "290",
      "DEFAULT_ORG_ID": "888",
      "DEFAULT_INV_ORG_NAME": "Vision France",
      "RESPONSIBILITY_ID": "20419"
    }
  ]
}
```

## 🏗️ Architecture

### Core Components

#### 1. **API Service** (`src/services/api.ts`)
- Handles HTTP requests to Propel Apps API
- Manages request/response formatting
- Provides error handling and timeout management

#### 2. **Storage Service** (`src/services/storage.ts`)
- Manages local data persistence
- Currently uses AsyncStorage (placeholder for SQLite)
- Stores user data, responsibilities, and organization info

#### 3. **Auth Context** (`src/context/AuthContext.tsx`)
- Manages authentication state
- Handles login/logout flow
- Stores user data and responsibilities
- Provides authentication context to components

#### 4. **Configuration** (`src/config/api.ts`)
- Centralized API configuration
- Environment-specific settings
- Easy switching between dev/staging/production

### Data Flow

1. **Login Request** → API Service → Propel Apps Server
2. **Response Processing** → Extract user data and responsibilities
3. **Data Storage** → Save to local storage (SQLite)
4. **State Update** → Update AuthContext state
5. **UI Update** → Components reflect new data

## 🎨 UI/UX Features

### Login Screen
- **Modern design** with background image
- **Username/Password fields** with icons
- **Password visibility toggle**
- **Demo login button** for quick testing
- **Loading states** and error handling
- **Propel Apps branding** and version info

### Dashboard (Home Screen)
- **User information** display
- **Organization details** with default org ID
- **Responsibilities list** with tap-to-access
- **User statistics** (User ID, Person ID, etc.)
- **Quick actions** for common tasks
- **App information** section

## 📱 Features Implemented

### ✅ Core Features
- [x] **API Integration** - Full Propel Apps API integration
- [x] **User Authentication** - Login with username/password
- [x] **Data Extraction** - Parse API response for user data
- [x] **Responsibilities Management** - Extract and display user responsibilities
- [x] **Organization Validation** - Check for DEFAULT_ORG_ID
- [x] **Error Handling** - Comprehensive error messages
- [x] **Loading States** - User feedback during API calls
- [x] **Demo Mode** - Quick login with demo credentials

### ✅ UI/UX Features
- [x] **Modern Design** - Clean, professional interface
- [x] **Responsive Layout** - Works on different screen sizes
- [x] **Accessibility** - Proper touch targets and contrast
- [x] **Loading Indicators** - Visual feedback during operations
- [x] **Error Messages** - User-friendly error handling
- [x] **Brand Consistency** - Propel Apps design language

### ✅ Technical Features
- [x] **TypeScript** - Full type safety
- [x] **Configuration Management** - Environment-specific settings
- [x] **Error Boundaries** - Graceful error handling
- [x] **Code Organization** - Clean, maintainable structure
- [x] **Documentation** - Comprehensive code comments

## 🔧 Configuration

### Environment Settings
Update `src/config/api.ts` to switch between environments:

```typescript
export const CURRENT_ENVIRONMENT: keyof typeof API_CONFIG = 'development';
```

### API Configuration
```typescript
export const API_CONFIG = {
  development: {
    hostname: 'https://testnode.propelapps.com',
    project: 'EBS',
    version: '20D',
  },
  production: {
    hostname: 'https://prod.propelapps.com',
    project: 'EBS',
    version: '20D',
  },
  // ... more environments
};
```

## 🚀 Usage

### For Users
1. **Launch the app**
2. **Enter credentials** or tap "Demo" for quick access
3. **View dashboard** with responsibilities and organization info
4. **Navigate** using bottom tabs
5. **Access features** based on assigned responsibilities

### For Developers
1. **Update API configuration** in `src/config/api.ts`
2. **Add new endpoints** in `src/services/api.ts`
3. **Extend user data** in `src/types/auth.ts`
4. **Update UI components** as needed
5. **Test with demo credentials** for quick validation

## 🧪 Testing

### Demo Credentials
```typescript
username: "manideep j"
password: "Propel@123"
```

### Test Scenarios
1. **Valid Login** - Use demo credentials
2. **Invalid Credentials** - Test error handling
3. **Network Errors** - Test offline scenarios
4. **API Errors** - Test server error responses
5. **No Responsibilities** - Test edge cases

## 📦 Dependencies

### Required Packages
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Bottom tabs
- `@react-navigation/stack` - Stack navigation
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Screen optimization

### Optional (for production)
- `react-native-sqlite-storage` - SQLite database
- `@react-native-async-storage/async-storage` - AsyncStorage
- `react-native-vector-icons` - Icons

## 🔒 Security Considerations

### Data Protection
- **No password storage** - Passwords are not persisted
- **Secure API calls** - HTTPS only
- **Token management** - Ready for future token-based auth
- **Data validation** - Input sanitization and validation

### Best Practices
- **Error handling** - No sensitive data in error messages
- **Loading states** - Prevent multiple API calls
- **Input validation** - Client-side validation
- **Network security** - HTTPS enforcement

## 🐛 Troubleshooting

### Common Issues

#### 1. **API Connection Failed**
- Check network connectivity
- Verify API configuration
- Ensure correct hostname/project/version

#### 2. **Login Fails**
- Verify credentials
- Check API response format
- Review error logs

#### 3. **No Responsibilities**
- Contact administrator
- Check user permissions
- Verify API response data

#### 4. **UI Issues**
- Check device compatibility
- Verify React Native version
- Review component props

### Debug Steps
1. **Check console logs** for API responses
2. **Verify API configuration** in `src/config/api.ts`
3. **Test with demo credentials** first
4. **Check network requests** in browser dev tools
5. **Review error messages** for specific issues

## 📝 Future Enhancements

### Planned Features
- [ ] **SQLite Integration** - Replace AsyncStorage with SQLite
- [ ] **Token Authentication** - JWT token support
- [ ] **Offline Support** - Cached data and offline mode
- [ ] **Push Notifications** - Real-time updates
- [ ] **Deep Linking** - Direct navigation to features
- [ ] **Biometric Auth** - Fingerprint/Face ID support

### API Extensions
- [ ] **User Profile API** - Update user information
- [ ] **Organization API** - List available organizations
- [ ] **Responsibility API** - Get detailed responsibility info
- [ ] **Logout API** - Server-side logout

## 📞 Support

For technical support or questions:
- **API Issues** - Contact Propel Apps support
- **App Issues** - Review this documentation
- **Configuration** - Check `src/config/api.ts`
- **Development** - Follow React Native best practices

---

**Version:** VRZ-V1.1.0  
**Last Updated:** January 2024  
**Compatibility:** React Native 0.81.0+
