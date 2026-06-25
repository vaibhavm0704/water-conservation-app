# AquaEstate – Smart Water Conservation & Estate Management App

AquaEstate is a frontend-only React Native mobile application built with Expo SDK, designed for residential estates and smart communities. It provides tools to track water usage, manage residents, report and resolve facility complaints, and publish community notices.

This project is built as an **MCA Final Semester Major Project** and an **internship project for DALM Solutions Pvt. Ltd.**

---

## 🌟 Key Features

### 1. Multi-Role Dashboards & Workflows
* **Estate Admin**:
  * View overall community water usage statistics and metrics.
  * Manage residents (add, update, view, or remove).
  * Access property details (block and flat listings).
  * Generate water usage and complaints reports.
* **Facility Admin**:
  * Track active/pending maintenance issues.
  * Manage and resolve resident complaints (assign staff, add resolution notes).
  * Publish water schedules, cleaning alerts, and shutdown notices.
* **Resident**:
  * Monitor daily, weekly, and monthly water usage.
  * Pay water bills and view transaction history.
  * Raise maintenance tickets with image attachment support.
  * View water conservation tips and score.

### 2. Beautiful & Premium UI Design
* Water-inspired color palette (Ocean Blue, Light Aqua, Mint Green, Deep Water).
* Typography powered by **Poppins** font.
* Clean, interactive charts showing usage analytics.
* Smooth micro-animations and tab navigation.
* Responsive layouts designed for both Android and iOS devices.

---

## 🛠️ Technology Stack

* **Framework**: React Native (Expo SDK)
* **Language**: TypeScript
* **Navigation**: React Navigation (Stack and Bottom Tabs)
* **Styling**: StyleSheet API (Vanilla CSS equivalent)
* **Charts**: `react-native-chart-kit` and `react-native-svg`
* **Icons**: `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)
* **Media Handling**: `expo-image-picker` and `expo-image`
* **State & Context**: React Context (Auth, Theme, and Notifications)
* **Storage**: `@react-native-async-storage/async-storage`

---

## 📁 Project Structure

```text
water-conservation-app/
├── assets/                     # App assets (icons, splash screens)
├── src/
│   ├── api/                    # Mock API clients and endpoints
│   ├── config/                 # App configuration & Mock credentials
│   ├── context/                # Context Providers (Auth, Theme, Notifications)
│   ├── features/               # Feature-based folders
│   │   ├── auth/               # Splash, Onboarding, Login, Forgot Password
│   │   ├── estate-admin/       # Estate Admin Screens & Services
│   │   ├── facility-admin/     # Facility Admin Screens & Services
│   │   └── resident/           # Resident Screens & Services
│   ├── navigation/             # Auth and role-based Navigators
│   └── shared/                 # Shared resources
│       ├── components/         # Reusable UI components (AppButton, SummaryCard, etc.)
│       └── constants/          # App theme (colors, spacing, typography)
├── App.tsx                     # Entry point re-export
└── package.json                # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Open the app:
   * Scan the QR code using the **Expo Go** app on your iOS or Android device.
   * Or press `a` to run on an Android Emulator, or `i` to run on an iOS Simulator.

### 🔑 Mock Credentials (For Testing)

To log into different roles on the Login screen, use these mock credentials:

| Role | Email | Password |
|------|-------|----------|
| **Estate Admin** | `admin@greenville.com` | `admin123` |
| **Facility Admin** | `facility@greenville.com` | `facility123` |
| **Resident** | `resident@greenville.com` | `resident123` |

---

## 👨‍💻 Developed for
* **Company**: DALM Solutions Pvt. Ltd. (Internship Project)
* **Course**: MCA Final Semester Major Project
