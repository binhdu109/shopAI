import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import BiometricGateScreen from '@screens/BiometricGateScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { useAppLock } from '@hooks/useAppLock';
import { reduxStore } from '@store/redux/store';

const AuthStack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

const linking: LinkingOptions<any> = {
  prefixes: ['shopai://', 'https://shopai.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              ProductDetail: 'product/:productId',
              Scanner: 'scanner',
              AIChat: 'aichat',
            },
          },
          Cart: 'cart',
          Orders: 'orders',
          RTKDemo: 'rtk-demo',
          Profile: 'profile',
        },
      },
      Checkout: 'checkout',
      OrderDetail: 'order/:orderId',
    },
  },
};

function App(): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkLocalToken = useAuthStore((state) => state.checkLocalToken);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    checkLocalToken();
  }, [checkLocalToken]);

  useEffect(() => {
    if (token == null) setIsUnlocked(false);
  }, [token]);

  useAppLock({ isUnlocked, setIsUnlocked });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1677FF" />
      </View>
    );
  }

  if (token != null && !isUnlocked) {
    return <BiometricGateScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={reduxStore}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              {token == null ? (
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                  <AuthStack.Screen name="Login" component={LoginScreen} />
                  <AuthStack.Screen name="Register" component={RegisterScreen} />
                </AuthStack.Navigator>
              ) : (
                <RootStackNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;