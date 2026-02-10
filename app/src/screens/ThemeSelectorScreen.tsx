import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';
import { ColorTheme, themes as themeConfig } from '../shared/theme/themeConfig';
import { Card } from '../shared/components/ui/Card';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThemeSelectorScreen() {
    const { setTheme, currentThemeName } = useColorTheme();
    const navigation = useNavigation();

    const themesList: { name: string; label: string; colors: ColorTheme }[] = [
        { name: 'ocean', label: '오션 블루', colors: themeConfig.ocean },
        { name: 'mint', label: '민트 프레시', colors: themeConfig.mint },
        { name: 'sunset', label: '선셋 오렌지', colors: themeConfig.sunset },
        { name: 'lavender', label: '라벤더 퍼플', colors: themeConfig.lavender },
        { name: 'coral', label: '코랄 핑크', colors: themeConfig.coral },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 py-4 flex-row items-center gap-4 border-b border-border">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-foreground">테마 설정</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text className="text-sm text-gray-500 mb-6">앱의 전체적인 색상 분위기를 변경할 수 있습니다.</Text>

                <View className="space-y-4">
                    {themesList.map((t) => (
                        <TouchableOpacity key={t.name} onPress={() => setTheme(t.name as any)}>
                            <Card className={`p-4 border-2 ${currentThemeName === t.name ? 'border-primary' : 'border-transparent'} flex-row items-center justify-between`}>
                                <View className="flex-row items-center gap-4">
                                    <LinearGradient
                                        colors={[t.colors.primary, t.colors.accent]}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <View>
                                        <Text className="font-semibold text-base text-foreground">{t.label}</Text>
                                        <View className="flex-row gap-1 mt-1">
                                            <View className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                                            <View className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                                            <View className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.accent }} />
                                        </View>
                                    </View>
                                </View>
                                {currentThemeName === t.name && (
                                    <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                                        <Check size={16} color="white" />
                                    </View>
                                )}
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
