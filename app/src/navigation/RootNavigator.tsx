import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { BottomTabs } from './BottomTabs';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SurveyScreen from '../screens/SurveyScreen';
import ThemeSelectorScreen from '../screens/ThemeSelectorScreen';
import HospitalMapScreen from '../screens/HospitalMapScreen';
import RecommendedProductsScreen from '../screens/RecommendedProductsScreen';
import InsuranceProductsScreen from '../screens/InsuranceProductsScreen';
import HospitalDetailScreen from '../screens/HospitalDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CommentListScreen from '../screens/CommentListScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import CustomerServiceScreen from '../screens/CustomerServiceScreen';
import TermsPoliciesScreen from '../screens/TermsPoliciesScreen';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Main: undefined;
    Survey: undefined;
    ThemeSelector: undefined;
    HospitalMap: undefined;
    RecommendedProducts: undefined;
    InsuranceProducts: undefined;
    HospitalDetail: { hospital: any };
    ProductDetail: { product: any };
    Cart: undefined;
    CommentList: { postId: string };
    NotificationSettings: undefined;
    CustomerService: undefined;
    TermsPolicies: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Initial Route: Check auth state later. For now, maybe Login? Or BottomTabs? */}
                {/* Assuming user starts at Login for this migration context, or maybe Home if public */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={BottomTabs} />
                <Stack.Screen name="Survey" component={SurveyScreen} />
                <Stack.Screen name="ThemeSelector" component={ThemeSelectorScreen} />
                <Stack.Screen name="HospitalMap" component={HospitalMapScreen} />
                <Stack.Screen name="RecommendedProducts" component={RecommendedProductsScreen} />
                <Stack.Screen name="InsuranceProducts" component={InsuranceProductsScreen} />
                <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="CommentList" component={CommentListScreen} />
                <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
                <Stack.Screen name="CustomerService" component={CustomerServiceScreen} />
                <Stack.Screen name="TermsPolicies" component={TermsPoliciesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
