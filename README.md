# 🏃‍♀️ We-Diet Frontend ✨

A comprehensive web application supporting diet and fitness! A modern SNS community platform built with React & TypeScript 💪

## 🌐 Live Application

Visit our official site: [https://we-diat.com/](https://we-diat.com/) 🌟

## 🎯 Main Features

### 📱 Core Features
- 🍽️ **Food Logging**: Record meals with photos and manage nutritional information
- 🏋️‍♀️ **Exercise Recording**: Log various exercises including strength training and aerobic activities
- ⚖️ **Weight Management**: Visualize weight and body fat progress with graphs
- 👤 **Profile Settings**: Customizable user profiles with avatar support
- 💬 **SNS Community**: Post, like, and comment features for diet companions

### 🔐 Authentication & Login Features
- 🌐 **Social Authentication**: Easy login with Google
- 📧 **Email Authentication**: Traditional email/password authentication support
- 🛡️ **Permission Management**: Administrator permission system

### 🌍 Multi-language & Accessibility
- 🗣️ **Multi-language Support**: Japanese🇯🇵, English🇺🇸, Chinese🇨🇳, Korean🇰🇷, Spanish🇪🇸
- 📱 **PWA Support**: Progressive Web App that feels like a smartphone app
- 🔄 **Responsive Design**: Fully compatible with desktop and mobile

### ⚡ Advanced Features
- 🔔 **Notification System**: Real-time notification management
- 🔄 **Device Sync**: Data synchronization across multiple devices
- 📊 **Performance Monitoring**: User experience optimization
- 🐛 **Debug Log Feature**: Development and maintenance log management
- 🔍 **IndexNow API**: SEO optimization with quick search indexing
- 📈 **Google Analytics**: User behavior analysis integration

### 📲 PWA Feature Details
- 🏠 **Add to Home Screen**: Add app icon to smartphone home screen
- ⚡ **Fast Launch**: Some features available offline
- 🎯 **Shortcuts**: Direct access to food, exercise, and weight recording
- 🔗 **Share Function**: Share images and text directly from other apps

## 🛠 Technology Stack

### 🏗️ Frontend Foundation
- ⚛️ **Framework**: React 18.3.1 with TypeScript
- ⚡ **Build Tool**: Vite 6.3.5
- 🎨 **UI Framework**: Material-UI (MUI) 5.13.7
- 🗂️ **State Management**: Recoil 0.7.7
- 🛣️ **Routing**: React Router DOM 6.23.1

### 📊 Data & Communication
- 📈 **Charts**: Chart.js with react-chartjs-2
- 🌐 **HTTP Communication**: Axios 1.11.0
- 🔄 **Protocol Buffers**: Protocol Buffers (@protobuf-ts/runtime)
- 🖼️ **Image Management**: Cloudinary 2.6.1

### 🎨 Styling & UI
- 💅 **CSS-in-JS**: Emotion (@emotion/react, @emotion/styled)
- 🎪 **Carousel**: React Slick
- 🎭 **Icons**: React Icons & MUI Icons
- 📱 **PWA**: Service Worker + Web App Manifest

### 📊 Analytics & Monitoring
- 📈 **Analytics**: Google Analytics (react-ga4)
- 🔍 **Performance**: Web Vitals monitoring
- 🐛 **Debug**: Custom logging system

## 🏗️ Project Structure

```
frontend/
├── 📁 public/                 # Static files
│   ├── 🌐 amp/               # AMP pages
│   ├── 📄 manifest.json      # PWA configuration
│   ├── 🤖 robots.txt         # SEO settings
│   └── 🗺️ sitemap.xml       # Sitemap
├── 📁 src/
│   ├── 🎨 component/         # Reusable components
│   ├── 📱 page/              # Page components
│   ├── 🪝 hooks/             # Custom hooks
│   ├── 🗂️ recoil/           # State management (Recoil atoms)
│   ├── 🌐 i18n/             # Internationalization settings & language files
│   ├── 🔄 api/              # API communication functions
│   ├── 🛠️ utils/            # Utility functions
│   ├── 📋 proto/            # Protocol Buffers definitions
│   ├── 🎯 context/          # React Context
│   └── 🎨 styles/           # Style files
├── 📄 package.json           # Package configuration
├── ⚙️ vite.config.ts       # Vite configuration
└── 📝 tsconfig.json         # TypeScript configuration
```

# 🍽️ We-Diet Backend ⚡

## 🚀 Main Features

### 🔐 Authentication & User Management
- 🌐 **Social Authentication**: Google, LINE OAuth integration
- 📧 **Email Authentication System**: Custom email registration & authentication
- 🔑 **JWT Authentication**: Secure token-based authentication
- 🛡️ **Permission Management**: Administrator & user permission system
- 🔒 **Password Management**: Secure hashing with bcrypt

### 📱 Core API Features
- 🍽️ **Food Logging API**: Comprehensive food tracking with Protocol Buffers
- 🏋️‍♀️ **Exercise Recording API**: Various exercise types & activities logging
- ⚖️ **Weight Management API**: Weight tracking with historical data
- 👤 **User Profiles**: Complete profile management system
- 🖼️ **Image Upload**: Cloudinary integration for optimized image storage

### 💬 SNS Community Features
- 📝 **Post Management**: Create, edit, delete diet posts
- ❤️ **Like & Retweet**: Complete social functionality implementation
- 💭 **Comment System**: Reply & comment management for posts
- 👥 **Follow System**: User follow & follower functionality
- 🚫 **Block Feature**: User blocking & reporting system

### 📊 Advanced Features
- 🔔 **Notification System**: Real-time notification management API
- 💬 **Messaging**: User-to-user messaging functionality
- 📈 **Trending Feature**: Popular posts & trend analysis
- 🐛 **Debug Logging**: Development & maintenance log management system
- 🔍 **IndexNow API**: Search engine integration for SEO optimization
- 🌍 **Multi-language Support**: Display language management

## 🛠 Technology Stack

### 🏗️ Backend Foundation
- 🐹 **Language**: Go 1.24.2
- 🌐 **Web Framework**: Gin 1.10.1
- 🗄️ **Database**: PostgreSQL with GORM 1.30.0
- 📦 **ORM**: GORM (Go ORM library)
- 🐳 **Containerization**: Docker support

### 🔐 Authentication & Security
- 🔑 **Authentication**: OAuth2 + JWT (golang-jwt/jwt/v5 5.2.3)
- 🔒 **Password**: bcrypt encryption (golang.org/x/crypto)
- 🌐 **CORS**: gin-contrib/cors 1.7.6
- 🛡️ **Security**: Secure authentication flow implementation

### 📊 Data & Communication
- 📋 **Serialization**: Protocol Buffers (google.golang.org/protobuf)
- 🖼️ **Image Storage**: Cloudinary 2.11.0
- 📧 **Email**: Custom email templates
- 🔄 **API**: RESTful API design
- 📈 **Data Types**: GORM datatypes 1.2.6

### 🌍 External Service Integration
- 🌐 **Google API**: Google OAuth & API integration
- 📘 **Facebook SDK**: Facebook authentication integration
- 🎵 **TikTok API**: TikTok authentication system
- 📱 **LINE API**: LINE OAuth authentication
- ☁️ **Cloud**: Google Cloud API integration

## 🏗️ Project Structure

```
backend/
├── 📁 controller/              # API controllers
│   ├── 🔐 *_auth.go          # Various authentication controllers
│   ├── 👤 user_*_controller.go   # User management
│   ├── 🍽️ food_log_controller.go # Food logging
│   ├── 🏋️‍♀️ exercise_record_controller.go # Exercise recording
│   ├── ⚖️ weight_record_controller.go # Weight recording
│   ├── 📝 post_controller.go  # Post management
│   ├── 💬 message_controller.go # Messaging
│   ├── 🔔 notification_controller.go # Notifications
│   ├── 📈 trending_controller.go # Trending
│   ├── 🖼️ cloudinary_*_controller.go # Image management
│   └── 🐛 debug_log_controller.go # Debug logging
├── 📁 database/               # Database related
│   ├── 📊 model/             # Database models
│   ├── 🔄 migrate/           # Migrations
│   └── 🌱 seeds/            # Seed data
├── 📁 proto/                 # Protocol Buffers definitions
│   ├── 🔐 auth.proto         # Authentication
│   ├── 🍽️ dieter.proto      # Diet related
│   ├── 🏋️‍♀️ exercise_record.proto # Exercise recording
│   ├── ⚖️ weight_record.proto # Weight recording
│   └── 🔔 notification.proto # Notifications
├── 📁 service/               # Business logic
├── 📁 util/                  # Utilities
├── 📁 test/                  # Test code
├── 📁 mail_templates/        # Email templates
├── 📄 main.go               # Main entry point
├── 📦 go.mod                # Go modules configuration
└── 🐳 Dockerfile            # Docker configuration
```
