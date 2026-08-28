import React from 'react';
import { ActivityIndicator, BackHandler, Image, Linking, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { WEB_URL, CANDIDATE_URLS, LOGO_URI } from './src/config/web';

// Android WebView (react-native-webview <=13.15) sometimes never fires
// `onLoadEnd` after an in-page full navigation (login, cart, catalog...),
// which would leave the loading overlay covering the site forever.
// We therefore hide it on a hard timeout as a safety net.
const LOADING_TIMEOUT_MS = 10000;
const PROBE_TIMEOUT_MS = 3000;

async function probe(url) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(`${url}/api/health`, { signal: ctl.signal });
    clearTimeout(timer);
    return res.ok ? url : null;
  } catch {
    return null;
  }
}

function LoadingScreen({ message }) {
  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#38BDF8', '#0284C7', '#0369A1', '#0C4A6E']}
      locations={[0, 0.2, 0.45, 0.65, 0.85, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fill}
    >
      <ActivityIndicator size="large" color="#0284C7" />
      <Image source={require('./logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.hint}>{message || 'Yuklanmoqda...'}</Text>
    </LinearGradient>
  );
}

function ErrorScreen({ onRetry, onManual, manualUrl, setManualUrl }) {
  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#38BDF8', '#0284C7', '#0369A1', '#0C4A6E']}
      locations={[0, 0.2, 0.45, 0.65, 0.85, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fill}
    >
      <Image source={require('./logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.errorTitle}>Server topilmadi</Text>
      <Text style={styles.errorSub}>
        Kompyuterdagi backend yoqilgani va telefon bilan bitta tarmoqda ekanini tekshiring.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="http://192.168.137.1:5173"
        placeholderTextColor="#0369A1"
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        value={manualUrl}
        onChangeText={setManualUrl}
      />
      <TouchableOpacity style={styles.retryBtn} onPress={onManual} activeOpacity={0.8}>
        <Text style={styles.retryText}>Bu manzilni ochish</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.retryBtnOutline} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.retryTextOutline}>Qayta urinish</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

export default function App() {
  const webRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [status, setStatus] = React.useState('probing'); // probing | ready | error
  const [resolvedUrl, setResolvedUrl] = React.useState(null);
  const [manualUrl, setManualUrl] = React.useState(WEB_URL);
  const loadedOnceRef = React.useRef(false);
  const loadingTimer = React.useRef(null);
  const canGoBackRef = React.useRef(false);

  // Find the server: try every candidate (Wi-Fi IP, hotspot IP...) and open
  // whichever answers first. The web app calls its own origin for /api, so
  // one URL covers the whole site + backend.
  const probeAndOpen = React.useCallback(async (customUrl) => {
    setStatus('probing');
    setError(false);
    let url = null;
    const candidates = customUrl ? [customUrl] : CANDIDATE_URLS;
    const results = await Promise.all(candidates.map((c) => probe(c)));
    url = results.find((r) => r !== null) || null;
    if (url) {
      setResolvedUrl(url);
      setStatus('ready');
    } else {
      setStatus('error');
    }
  }, []);

  React.useEffect(() => {
    probeAndOpen();
  }, [probeAndOpen]);

  // Show the full-screen overlay ONLY while the very first page is loading.
  // In-app navigation (login, cart, wishlist...) is instant client-side
  // routing, so no overlay is needed there — and Android WebView sometimes
  // never fires onLoadEnd after such navigations, which used to leave the
  // overlay stuck forever, covering the site.
  const showLoading = React.useCallback(() => {
    if (loadedOnceRef.current) return;
    setLoading(true);
    clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => setLoading(false), LOADING_TIMEOUT_MS);
  }, []);

  const hideLoading = React.useCallback(() => {
    loadedOnceRef.current = true;
    clearTimeout(loadingTimer.current);
    setLoading(false);
  }, []);

  // Android hardware back button: go back in the WebView history first,
  // only exit the app when already on the home page.
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBackRef.current) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const handleShouldStartLoad = ({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    Linking.openURL(url).catch(() => {});
    return false;
  };

  if (status === 'probing') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.fill} edges={['top', 'bottom', 'left', 'right']}>
          <LoadingScreen message="Server qidirilmoqda..." />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.fill} edges={['top', 'bottom', 'left', 'right']}>
          <ErrorScreen
            onRetry={() => probeAndOpen()}
            onManual={() => {
              const clean = manualUrl.trim().replace(/\/+$/, '');
              if (clean.startsWith('http://') || clean.startsWith('https://')) {
                setResolvedUrl(clean);
                setStatus('ready');
              } else {
                alert('Manzil http:// bilan boshlanishi kerak, masalan http://192.168.137.1:5000');
              }
            }}
            manualUrl={manualUrl}
            setManualUrl={setManualUrl}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.fill} edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        <WebView
          ref={webRef}
          source={{ uri: resolvedUrl }}
          style={styles.fill}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          startInLoadingState
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          onLoadStart={showLoading}
          onLoadEnd={hideLoading}
          onNavigationStateChange={(navState) => {
            canGoBackRef.current = !!navState.canGoBack;
            if (!navState.loading) hideLoading();
          }}
          onError={() => setError(true)}
          onHttpError={(syntheticEvent) => {
            const { statusCode } = syntheticEvent.nativeEvent;
            if (statusCode >= 500) setError(true);
          }}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          renderLoading={() => <LoadingScreen />}
          renderError={(errorDomain, errorCode, errorDesc) => (
            <ErrorScreen
              onRetry={() => {
                setError(false);
                webRef.current?.reload();
              }}
              onManual={() => {
                setError(false);
                webRef.current?.reload();
              }}
              manualUrl={manualUrl}
              setManualUrl={setManualUrl}
            />
          )}
          containerStyle={styles.fill}
          automaticallyAdjustContentInsets={false}
        />
        {loading && !error && <View pointerEvents="none" style={StyleSheet.absoluteFill}><LoadingScreen /></View>}
        {error && (
          <ErrorScreen
            onRetry={() => {
              setError(false);
              webRef.current?.reload();
            }}
            onManual={() => {
              setError(false);
              webRef.current?.reload();
            }}
            manualUrl={manualUrl}
            setManualUrl={setManualUrl}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set to white to match the navbar and bottom nav
  },
  logo: {
    marginTop: 24,
    width: 180,
    height: 60,
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: '#075985',
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  errorTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '800',
    color: '#0C4A6E',
  },
  errorSub: {
    marginTop: 8,
    fontSize: 13,
    color: '#075985',
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  input: {
    marginTop: 20,
    width: '80%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7DD3FC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0C4A6E',
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#0284C7',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  retryBtnOutline: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  retryTextOutline: {
    color: '#0284C7',
    fontSize: 15,
    fontWeight: '800',
  },
});