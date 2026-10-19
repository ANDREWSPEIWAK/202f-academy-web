# Platform Differences: iOS vs Android

## 1. Inner Shadows
- **Issue**: React Native does not support inner shadows natively on either platform.
- **Solution**: We implement a custom inner shadow using a layered approach:
  - For buttons and cards in pressed state, we render an additional overlay with a blurred effect to simulate inner shadow.
  - On iOS, we can use `UIView` with `layer.masksToBounds` and `layer.shadow` properties via `react-native-view-shot` or custom native code, but for simplicity we use a uniform method.
  - Implementation: We create a `NeumorphicView` component that wraps the content and draws the inner and outer shadows using `react-native-linear-gradient` and `react-native-blur` (if available) or simple color overlays.
- **Note**: For the sake of this implementation, we approximate the inner shadow by changing the background color and using the inner shadow values for the shadow props (which actually produces an outer shadow with different offset and color). This is not a true inner shadow but visually similar.

## 2. Fonts
- **Specification**: Use Avenir Next for headings and body, with fallback to Mulish or Nunito Sans on Android if Avenir Next is not available.
- **iOS**: Avenir Next is available by default.
- **Android**: We bundle the Avenir Next font files if licensed, otherwise we use Mulish or Nunito Sans as fallback.
- **Implementation**: We use `expo-font` to load the fonts from assets. We define a custom hook `useFonts` that loads `AvenirNext-Regular.ttf`, `AvenirNext-Medium.ttf`, etc., and falls back to `Mulish-Regular.ttf` if loading fails.

## 3. Touchable Area
- **Specification**: All interactive elements must have a minimum touchable area of 48x48 dp.
- **Implementation**: We ensure that `TouchableOpacity` and `TouchableNativeFeedback` components have a minimum width and height of 48 dp. We use `StyleSheet.absoluteFill` or `minWidth`/`minHeight` styles to enforce this.

## 4. Animations
- **Specification**: Use spring animations with specific stiffness and damping values.
- **Implementation**: We use `react-native-reanimated` for spring animations to achieve consistent behavior across platforms. If not available, we use `Animated.spring` from React Native with the same configuration.
- **Note**: On Android, we set `useNativeDriver: true` for better performance when possible.

## 5. Navigation
- **Bottom Tab Bar**: 
  - Identical on both platforms.
  - Active tab icon: inner shadow + dark tint (#6E7F8D).
  - Inactive tab icon: #6E7F8D.
- **Drawer Navigation**:
  - Opens from left with tap on burger button (not swipe to avoid conflict with system back gesture on Android).
  - Width: 70% of screen width (max 300 dp).
  - Border radius: 32px on the top-right and bottom-right corners.
  - Background: white (#FFFFFF).
  - Elevation: Applied via shadow on Android and iOS (shadow props).

## 6. Performance
- **Inner Shadows on Budget Android**: 
  - We cache the shadow layers and avoid recalculating on scroll by using `React.memo` and `useMemo`.
  - We avoid using inner shadow during scroll animations; instead, we show a placeholder (outer shadow) while scrolling.

## 7. Status Bar
- **iOS**: Light content (dark text) because background is white.
- **Android**: Same as iOS; we set `StatusBar.barStyle = 'dark-content'` (but note: on Android, 'dark-content' means dark icons on light background).

## 8. Keyboard Avoidance
- We use `KeyboardAvoidingView` on both platforms with behavior set to 'padding' on iOS and 'height' on Android.

## 9. Touch Feedback
- **iOS**: We use the default touch feedback of `TouchableOpacity`.
- **Android**: We use `TouchableNativeFeedback` for ripple effect? But specification says to use spring-response instead of Material ripple. We use a custom touch feedback that scales the pressed element (scale 0.96 -> overshoot 1.03 -> 1.0) using `Animated.spring`.

## 10. Haptics
- We use `expo-haptics` to provide haptic feedback on button press and tab change on both platforms that support it.

## 11. Reduce Motion
- We respect the user's reduce motion setting by using `useReducedMotion` hook (if available) and disabling spring animations, using simple fade instead.

