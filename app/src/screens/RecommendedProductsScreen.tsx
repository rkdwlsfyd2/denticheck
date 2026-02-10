import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ChevronLeft, ShoppingCart, Star } from 'lucide-react-native';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';
import { Button } from '../shared/components/ui/Button';
import { Badge } from '../shared/components/ui/Badge';

export default function RecommendedProductsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useColorTheme();

    const products = [
        {
            id: 1,
            name: '덴티마스터 치실',
            detail: '치간 케어 필수품. 부드러운 왁스 코팅으로 잇몸 자극 최소화.',
            price: '12,900원',
            rating: 4.8,
            reviewCount: 1240,
            tag: 'BEST',
            color: 'bg-teal-50',
            iconColor: 'text-teal-600'
        },
        {
            id: 2,
            name: '센서티브 치약',
            detail: '시린이 완화 효과. 임상 시험으로 입증된 시린이 개선 효과.',
            price: '8,500원',
            rating: 4.6,
            reviewCount: 856,
            tag: 'SALE',
            color: 'bg-rose-50',
            iconColor: 'text-rose-600'
        },
        {
            id: 3,
            name: '음파 전동 칫솔',
            detail: '분당 3만회 진동. 구석구석 깨끗하게 플라그 제거.',
            price: '45,000원',
            rating: 4.9,
            reviewCount: 2103,
            tag: 'HOT',
            color: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        },
        {
            id: 4,
            name: '프리미엄 구강세정기',
            detail: '강력한 물줄기로 잇몸 마사지와 세정을 동시에.',
            price: '89,900원',
            rating: 4.7,
            reviewCount: 542,
            tag: 'NEW',
            color: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            id: 5,
            name: '미백 치아 패치',
            detail: '하루 30분, 2주 만에 경험하는 놀라운 하얀 치아.',
            price: '24,000원',
            rating: 4.5,
            reviewCount: 320,
            tag: 'BEST',
            color: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
    ];

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-900">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-800 dark:text-white">추천 상품</Text>
                    <View className="flex-1" />
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                        <ShoppingCart size={24} color="#1e293b" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    <View className="space-y-4">
                        {products.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('ProductDetail', { product })}
                            >
                                <View className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex-row gap-4">
                                    {/* Image Placeholder */}
                                    <View className={`w-24 h-24 ${product.color} rounded-2xl items-center justify-center`}>
                                        <Text className={`font-bold text-lg opacity-30 ${product.iconColor}`}>IMG</Text>
                                    </View>

                                    {/* Content */}
                                    <View className="flex-1 justify-between py-1">
                                        <View>
                                            <View className="flex-row items-center justify-between mb-1">
                                                <Badge variant="outline" className="bg-slate-50 border-slate-200">
                                                    <Text className="text-[10px] font-bold text-slate-600">{product.tag}</Text>
                                                </Badge>
                                                <View className="flex-row items-center gap-1">
                                                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                                                    <Text className="text-xs text-slate-500 font-medium">{product.rating} ({product.reviewCount})</Text>
                                                </View>
                                            </View>
                                            <Text className="font-bold text-base text-slate-800 dark:text-white line-clamp-1 mb-1">{product.name}</Text>
                                            <Text className="text-xs text-slate-400 line-clamp-2 leading-4">{product.detail}</Text>
                                        </View>

                                        <View className="flex-row items-center justify-between mt-2">
                                            <Text className="font-bold text-lg text-primary">{product.price}</Text>
                                            <Button size="sm" className="h-8 px-3 rounded-full">
                                                <Text className="text-xs font-bold text-white">담기</Text>
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
