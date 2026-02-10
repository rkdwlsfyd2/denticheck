import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Label } from '../shared/components/ui/Label';
import { Checkbox } from '../shared/components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../shared/components/ui/RadioGroup';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';

export default function SurveyScreen() {
    const navigation = useNavigation<any>();
    const { theme } = useColorTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const [habits, setHabits] = useState({
        smoking: '',
        drinking: '',
        brushing: '',
        flossing: '',
        sweetFood: '',
    });

    const [symptoms, setSymptoms] = useState<string[]>([]);

    const handleSymptomToggle = (symptom: string) => {
        setSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
        );
    };

    const canProceed = () => {
        if (currentPage === 1) return habits.smoking && habits.drinking && habits.brushing;
        if (currentPage === 2) return habits.flossing && habits.sweetFood;
        return true;
    };

    const handleSubmit = () => {
        // Mock submission
        navigation.replace('Main');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 py-4 flex-row items-center gap-4 border-b border-border">
                <TouchableOpacity onPress={() => currentPage === 1 ? navigation.goBack() : setCurrentPage(currentPage - 1)}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-foreground">구강 건강 설문</Text>
            </View>

            <View className="flex-1 p-6">
                <View className="mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-sm text-gray-600">
                            {currentPage === 1 ? '생활 습관' : currentPage === 2 ? '식습관' : '자각 증상'}
                        </Text>
                        <Text className="text-sm text-gray-600">{currentPage}/{totalPages}</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-full transition-all" style={{ width: `${(currentPage / totalPages) * 100}%`, backgroundColor: theme.primary }} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {currentPage === 1 && (
                        <View className="space-y-6">
                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">흡연을 하시나요?</Text>
                                <RadioGroup value={habits.smoking} onValueChange={(val) => setHabits({ ...habits, smoking: val })}>
                                    {[
                                        { val: 'never', label: '비흡연' },
                                        { val: 'quit', label: '과거 흡연 (현재 금연)' },
                                        { val: 'current', label: '흡연 중' },
                                    ].map((opt) => (
                                        <View key={opt.val} className="flex-row items-center gap-2 mb-2">
                                            <RadioGroupItem value={opt.val} />
                                            <Label onPress={() => setHabits({ ...habits, smoking: opt.val })}>{opt.label}</Label>
                                        </View>
                                    ))}
                                </RadioGroup>
                            </Card>

                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">음주는 얼마나 자주 하시나요?</Text>
                                <RadioGroup value={habits.drinking} onValueChange={(val) => setHabits({ ...habits, drinking: val })}>
                                    {[
                                        { val: 'never', label: '전혀 안 함' },
                                        { val: 'rare', label: '월 1-2회' },
                                        { val: 'regular', label: '주 1-2회' },
                                        { val: 'frequent', label: '주 3회 이상' },
                                    ].map(opt => (
                                        <View key={opt.val} className="flex-row items-center gap-2 mb-2">
                                            <RadioGroupItem value={opt.val} />
                                            <Label onPress={() => setHabits({ ...habits, drinking: opt.val })}>{opt.label}</Label>
                                        </View>
                                    ))}
                                </RadioGroup>
                            </Card>

                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">하루에 몇 번 양치질을 하시나요?</Text>
                                <RadioGroup value={habits.brushing} onValueChange={(val) => setHabits({ ...habits, brushing: val })}>
                                    {[
                                        { val: '1', label: '1회' },
                                        { val: '2', label: '2회' },
                                        { val: '3+', label: '3회 이상' },
                                    ].map(opt => (
                                        <View key={opt.val} className="flex-row items-center gap-2 mb-2">
                                            <RadioGroupItem value={opt.val} />
                                            <Label onPress={() => setHabits({ ...habits, brushing: opt.val })}>{opt.label}</Label>
                                        </View>
                                    ))}
                                </RadioGroup>
                            </Card>
                        </View>
                    )}

                    {currentPage === 2 && (
                        <View className="space-y-6">
                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">치실이나 치간칫솔을 사용하시나요?</Text>
                                <RadioGroup value={habits.flossing} onValueChange={(val) => setHabits({ ...habits, flossing: val })}>
                                    {[
                                        { val: 'never', label: '전혀 사용 안 함' },
                                        { val: 'sometimes', label: '가끔 사용' },
                                        { val: 'regularly', label: '매일 사용' },
                                    ].map(opt => (
                                        <View key={opt.val} className="flex-row items-center gap-2 mb-2">
                                            <RadioGroupItem value={opt.val} />
                                            <Label onPress={() => setHabits({ ...habits, flossing: opt.val })}>{opt.label}</Label>
                                        </View>
                                    ))}
                                </RadioGroup>
                            </Card>

                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">단 음식이나 음료를 얼마나 자주 드시나요?</Text>
                                <RadioGroup value={habits.sweetFood} onValueChange={(val) => setHabits({ ...habits, sweetFood: val })}>
                                    {[
                                        { val: 'rare', label: '거의 안 먹음' },
                                        { val: 'sometimes', label: '주 1-2회' },
                                        { val: 'often', label: '거의 매일' },
                                    ].map(opt => (
                                        <View key={opt.val} className="flex-row items-center gap-2 mb-2">
                                            <RadioGroupItem value={opt.val} />
                                            <Label onPress={() => setHabits({ ...habits, sweetFood: opt.val })}>{opt.label}</Label>
                                        </View>
                                    ))}
                                </RadioGroup>
                            </Card>
                        </View>
                    )}

                    {currentPage === 3 && (
                        <View className="space-y-6">
                            <Card className="p-6">
                                <Text className="font-semibold mb-4 text-foreground">현재 느끼는 증상을 모두 선택해주세요</Text>
                                <Text className="text-sm text-gray-600 mb-4">해당 사항이 없다면 다음으로 진행하세요</Text>
                                <View className="space-y-3">
                                    {[
                                        { id: 'bad-breath', label: '구취 (입냄새)' },
                                        { id: 'bleeding', label: '잇몸 출혈' },
                                        { id: 'sensitivity', label: '치아 시림' },
                                        { id: 'pain', label: '통증' },
                                        { id: 'swelling', label: '잇몸 부기' },
                                        { id: 'loose', label: '치아 흔들림' },
                                        { id: 'cavity', label: '충치 의심' },
                                    ].map((symptom) => (
                                        <View key={symptom.id} className="flex-row items-center gap-2">
                                            <Checkbox
                                                value={symptoms.includes(symptom.id)}
                                                onValueChange={() => handleSymptomToggle(symptom.id)}
                                                color={theme.primary}
                                            />
                                            <Label onPress={() => handleSymptomToggle(symptom.id)}>{symptom.label}</Label>
                                        </View>
                                    ))}
                                </View>
                            </Card>

                            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <Text className="text-sm text-blue-800">
                                    💡 설문 결과를 바탕으로 맞춤형 구강 관리 가이드를 제공해드립니다.
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View className="flex-row gap-3 mt-4">
                    {currentPage > 1 && (
                        <Button variant="outline" className="flex-1" onPress={() => setCurrentPage(currentPage - 1)}>
                            <Text className="text-foreground">이전</Text>
                        </Button>
                    )}
                    <Button
                        className="flex-1"
                        onPress={() => currentPage < totalPages ? setCurrentPage(currentPage + 1) : handleSubmit()}
                        disabled={!canProceed()}
                    >
                        <Text className="text-primary-foreground">{currentPage < totalPages ? '다음' : '완료'}</Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}
