import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ChevronLeft, Shield, Check, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';
import { Button } from '../shared/components/ui/Button';

export default function InsuranceProductsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useColorTheme();

    type InsuranceItem = {
        id: number;
        title: string;
        description: string;
        monthlyPremium: string;
        benefits: string[];
        recommended: boolean;
        color: readonly [string, string, ...string[]];
    };

    const insurances: InsuranceItem[] = [
        {
            id: 1,
            title: '덴티케어 스탠다드',
            description: '기본적인 치과 치료를 보장하는 실속형 상품',
            monthlyPremium: '15,000원',
            benefits: ['충치 치료 100% 보장', '스케일링 연 1회 무료', '엑스레이 촬영 지원'],
            recommended: false,
            color: ['#3b82f6', '#1d4ed8']
        },
        {
            id: 2,
            title: '덴티케어 프리미엄',
            description: '임플란트, 교정까지 커버하는 종합 보장 상품',
            monthlyPremium: '35,000원',
            benefits: ['스탠다드 혜택 포함', '임플란트 최대 3개 지원', '치아 교정 50% 지원', '고급 잇몸 치료'],
            recommended: true,
            color: ['#8b5cf6', '#6d28d9']
        },
        {
            id: 3,
            title: '키즈 튼튼 보험',
            description: '우리아이 치아 건강을 위한 성장기 맞춤 보험',
            monthlyPremium: '12,000원',
            benefits: ['불소 도포 연 2회', '충치 예방 치료', '유치 발치 지원'],
            recommended: false,
            color: ['#f43f5e', '#be123c']
        }
    ];

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-900">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-800 dark:text-white">보험 상품</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-slate-800 dark:text-white mb-2">나에게 맞는 보험 찾기</Text>
                        <Text className="text-slate-500 text-sm">치과 진료비 걱정 없이{'\n'}건강한 치아를 지키세요.</Text>
                    </View>

                    <View className="space-y-6">
                        {insurances.map((item) => (
                            <TouchableOpacity key={item.id} activeOpacity={0.95}>
                                <View className="bg-white dark:bg-slate-800 rounded-[28px] overflow-hidden shadow-lg shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                    {/* Card Header Gradient */}
                                    <LinearGradient
                                        colors={item.color}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="p-6 relative"
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View>
                                                {item.recommended && (
                                                    <View className="bg-white/20 self-start px-2 py-1 rounded-lg mb-3 flex-row items-center gap-1 backdrop-blur-md">
                                                        <Zap size={12} color="#fbbf24" fill="#fbbf24" />
                                                        <Text className="text-amber-300 text-[10px] font-bold">MD 추천</Text>
                                                    </View>
                                                )}
                                                <Text className="text-white font-bold text-xl mb-1">{item.title}</Text>
                                                <Text className="text-white/80 text-xs font-medium">{item.description}</Text>
                                            </View>
                                            <View className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                                <Shield size={24} color="white" />
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    {/* Card Body */}
                                    <View className="p-6">
                                        <View className="mb-6 space-y-2">
                                            {item.benefits.map((benefit, idx) => (
                                                <View key={idx} className="flex-row items-center gap-3">
                                                    <View className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                                                        <Check size={12} color="#16a34a" />
                                                    </View>
                                                    <Text className="text-slate-600 dark:text-slate-300 text-sm font-medium">{benefit}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        <View className="flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <View>
                                                <Text className="text-slate-400 text-xs">월 예상 납입료</Text>
                                                <Text className="text-slate-800 dark:text-white font-bold text-xl">{item.monthlyPremium}</Text>
                                            </View>
                                            <Button className="rounded-full px-6 bg-slate-900 dark:bg-white">
                                                <Text className="text-white dark:text-slate-900 font-bold">상세보기</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
