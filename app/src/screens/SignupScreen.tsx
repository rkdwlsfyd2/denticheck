import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Label } from '../shared/components/ui/Label';
import { Checkbox } from '../shared/components/ui/Checkbox';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';

export default function SignupScreen() {
    const navigation = useNavigation<any>();
    const { theme } = useColorTheme();
    const [step, setStep] = useState(1);
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        service: false,
        privacy: false,
        marketing: false,
        age: false,
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const handleAgreementChange = (key: keyof typeof agreements, value: boolean) => {
        const newAgreements = { ...agreements, [key]: value };
        setAgreements(newAgreements);
        setAllAgreed(Object.values(newAgreements).every(Boolean));
    };

    const handleAllAgree = (checked: boolean) => {
        setAllAgreed(checked);
        setAgreements({
            service: checked,
            privacy: checked,
            marketing: checked,
            age: checked,
        });
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (agreements.service && agreements.privacy && agreements.age) {
                setStep(2);
            } else {
                Alert.alert("알림", "필수 약관에 동의해주세요.");
            }
        }
    };

    const handleSignup = () => {
        if (formData.password !== formData.confirmPassword) {
            Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
            return;
        }
        // Mock signup and navigate to survey
        Alert.alert("성공", "회원가입이 완료되었습니다!", [
            { text: "확인", onPress: () => navigation.replace('Survey') }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 py-4 flex-row items-center gap-4 border-b border-border">
                <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-foreground">회원가입</Text>
            </View>

            <View className="flex-1 p-6">
                <View className="mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-sm text-gray-600">{step === 1 ? '약관 동의' : '정보 입력'}</Text>
                        <Text className="text-sm text-gray-600">{step}/2</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-full transition-all" style={{ width: `${(step / 2) * 100}%`, backgroundColor: theme.primary }} />
                    </View>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {step === 1 && (
                            <View className="space-y-4">
                                <Card className="p-6">
                                    <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-border">
                                        <Checkbox
                                            value={allAgreed}
                                            onValueChange={handleAllAgree}
                                            color={allAgreed ? theme.primary : undefined}
                                        />
                                        <Label className="font-semibold text-base">전체 동의</Label>
                                    </View>

                                    <View className="space-y-4">
                                        {[
                                            { key: 'service', label: '[필수] 서비스 이용약관' },
                                            { key: 'privacy', label: '[필수] 개인정보 수집 및 이용' },
                                            { key: 'age', label: '[필수] 만 14세 이상입니다' },
                                            { key: 'marketing', label: '[선택] 마케팅 정보 수신', isLast: true },
                                        ].map((item: any) => (
                                            <View key={item.key} className={`flex-row items-center justify-between ${item.key === 'marketing' ? 'pt-4 border-t border-border' : ''}`}>
                                                <View className="flex-row items-center gap-3">
                                                    <Checkbox
                                                        value={agreements[item.key as keyof typeof agreements]}
                                                        onValueChange={(val) => handleAgreementChange(item.key as keyof typeof agreements, val)}
                                                        color={agreements[item.key as keyof typeof agreements] ? theme.primary : undefined}
                                                    />
                                                    <Label>{item.label}</Label>
                                                </View>
                                                <ChevronRight size={20} color="#9ca3af" />
                                            </View>
                                        ))}
                                    </View>
                                </Card>

                                <Button onPress={handleNextStep} className="mt-4">
                                    <Text className="text-primary-foreground">다음</Text>
                                </Button>
                            </View>
                        )}

                        {step === 2 && (
                            <View className="space-y-4">
                                <Card className="p-6 space-y-4">
                                    <View>
                                        <Label>이름</Label>
                                        <Input
                                            placeholder="홍길동"
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        />
                                    </View>
                                    <View>
                                        <Label>이메일</Label>
                                        <Input
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <View>
                                        <Label>휴대폰 번호</Label>
                                        <Input
                                            placeholder="010-1234-5678"
                                            value={formData.phone}
                                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <View>
                                        <Label>비밀번호</Label>
                                        <Input
                                            placeholder="8자 이상 입력해주세요"
                                            value={formData.password}
                                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                                            secureTextEntry
                                        />
                                    </View>
                                    <View>
                                        <Label>비밀번호 확인</Label>
                                        <Input
                                            placeholder="비밀번호를 다시 입력해주세요"
                                            value={formData.confirmPassword}
                                            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                                            secureTextEntry
                                        />
                                    </View>
                                </Card>

                                <Button onPress={handleSignup} className="mt-4">
                                    <Text className="text-primary-foreground">회원가입 완료</Text>
                                </Button>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
