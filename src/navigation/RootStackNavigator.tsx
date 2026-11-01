import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@navigation/MainTabNavigator';
import CheckoutScreen from '@screens/CheckoutScreen';
import OrderDetailScreen from '@screens/OrderDetailScreen';
import { useTheme } from '@contexts/ThemeContext';

export type RootStackParamList = {
    MainTabs: undefined;
    Checkout: undefined;
    OrderDetail: { orderId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
            }}
        >
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ presentation: 'modal', headerShown: true, title: 'Thanh toán' }}
            />
            <Stack.Screen
                name="OrderDetail"
                component={OrderDetailScreen}
                options={{ headerShown: true, title: 'Chi tiết hóa đơn' }}
            />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;