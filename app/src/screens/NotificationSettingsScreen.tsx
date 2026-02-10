import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';

export default function NotificationSettingsScreen() {
    const navigation = useNavigation();
    const { theme } = useColorTheme();

    const [settings, setSettings] = useState({
        push: true,
        marketing: false,
        healthCheck: true,
        community: true,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingItem = ({ label, description, value, onValueChange }: any) => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1 mr-4">
                <Text className="text-base font-medium text-slate-800 mb-1">{label}</Text>
                {description && <Text className="text-sm text-slate-400">{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                thumbColor={value ? '#ffffff' : '#f1f5f9'}
                ios_backgroundColor="#e2e8f0"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-1"
                    >
                        <ChevronLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-800">알림 설정</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <Text className="text-sm font-bold text-slate-400 mb-2">기본 알림</Text>
                    <View className="mb-8">
                        <SettingItem
                            label="푸시 알림"
                            description="앱의 모든 푸시 알림을 받습니다."
                            value={settings.push}
                            onValueChange={() => toggleSwitch('push')}
                        />
                    </View>

                    <Text className="text-sm font-bold text-slate-400 mb-2">서비스 알림</Text>
                    <View className="mb-8">
                        <SettingItem
                            label="건강 검진 알림"
                            description="정기 검진 및 양치 알림을 받습니다."
                            value={settings.healthCheck}
                            onValueChange={() => toggleSwitch('healthCheck')}
                        />
                        <SettingItem
                            label="커뮤니티 활동"
                            description="내 글에 달린 댓글, 좋아요 알림을 받습니다."
                            value={settings.community}
                            onValueChange={() => toggleSwitch('community')}
                        />
                    </View>

                    <Text className="text-sm font-bold text-slate-400 mb-2">마케팅 정보</Text>
                    <View>
                        <SettingItem
                            label="혜택 및 이벤트 알림"
                            description="다양한 할인 혜택과 이벤트 소식을 받습니다."
                            value={settings.marketing}
                            onValueChange={() => toggleSwitch('marketing')}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
