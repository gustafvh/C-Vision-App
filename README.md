

# C-Vision-App
Simple and (for now) **non-polished** Image Recognizition Application that labels what an uploaded image contains. All labels are graded on certainty-scale and top candidates are displayed. 

## Logo

<img src="lightning-logo.png" alt="Logo"
	title="Logo" height="150" height="100" />

## Technologies
- The app is written in Javascript, but uses the framework **React Native** to target native API on both iOS and Android. 
- For the development and build proccess I used **Expo CLI**
- The Image Recognizition is done with help of **Googles Cloud Vision API**.
- The Images are stored in Google Cloud Storage and their data in a realtime **Firebase database**.

Because it is written in React Native it works for both iOS, Android and Web (Experimental).

## Demo

<img src="/c-vision-demo.gif" alt="Demo"
	title="Demo" height="550" height="100" />

## Packages and dependencies used

```javascript
    "@expo/samples": "~3.0.0",
    "@expo/vector-icons": "^10.0.1",
    "@react-navigation/web": "^1.0.0-alpha.9",
    "expo": "^33.0.0",
    "expo-asset": "^5.0.0",
    "expo-constants": "^5.0.0",
    "expo-font": "^5.0.0",
    "expo-image-picker": "~5.0.2",
    "expo-web-browser": "^5.0.0",
    "firebase": "^6.2.4",
    "react": "16.8.3",
    "react-dom": "^16.8.6",
    "react-native": "https://github.com/expo/react-native/archive/sdk-33.0.0.tar.gz",
    "react-native-web": "^0.11.4",
    "react-navigation": "^3.11.0"

```
