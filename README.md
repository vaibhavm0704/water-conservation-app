# Water Conservation App 💧

A mobile app for managing water conservation in residential estates. Built with React Native + Expo as part of my internship project.

## What it does

- Estate admins can set up their account, register estate details, and add residents
- Location-based estate mapping with search functionality
- Dashboard to manage addresses and residents
- Works on both Android (via Expo Go or standalone APK) and web

## Screenshots

Coming soon — will add once the final build is ready.

## Tech Stack

- **React Native** with Expo SDK 54
- **Expo Router** for file-based navigation
- **Drawer navigation** for the main app section
- **TypeScript** throughout

## How to run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/vaibhavmalhotra002/water-conservation-app.git
   cd water-conservation-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npx expo start
   ```

4. Open in Expo Go (scan the QR code) or press `w` to open in browser.

## Building the APK

```bash
npx eas-cli build --platform android --profile preview
```

This will queue a build on EAS and give you a download link when done.

## Project Structure

```
app/
├── (auth)/          # Onboarding screens (password, estate, address, location, residents)
├── (main)/          # Main app screens (dashboard with drawer nav)
├── _layout.tsx      # Root layout
└── index.tsx        # Entry point (redirects to onboarding)

components/          # Reusable UI components
constants/           # Colors and theme config
```

## Notes

- The map component has a fallback view for web since `react-native-maps` doesn't support web
- The drawer navigation uses `@react-navigation/drawer` under the hood
- Built and tested on Expo Go (Android) and web browser

## License

This project was built for educational/internship purposes.
