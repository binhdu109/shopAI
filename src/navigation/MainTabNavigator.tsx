import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ReduxCartDemoScreen from '@screens/ReduxCartDemoScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS } from '@constants/theme';

export type MainTabParamList = {
    HomeTab: undefined;
    Cart: undefined;
    Orders: undefined;
    RTKDemo: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
    const totalQuantity = useCartStore((state) => state.totalQuantity());
    const { colors, isDark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStackNavigator}
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => <Icon name="home-variant-outline" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    title: 'Giỏ hàng',
                    tabBarIcon: ({ color, size }) => <Icon name="cart-outline" color={color} size={size} />,
                    tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    title: 'Đơn hàng',
                    tabBarIcon: ({ color, size }) => <Icon name="receipt" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="RTKDemo"
                component={ReduxCartDemoScreen}
                options={{
                    title: 'RTK Demo',
                    tabBarIcon: ({ color, size }) => <Icon name="flask-outline" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: ({ color, size }) => <Icon name="account-outline" color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;