import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

export default function TermsPoliciesScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    const TermsContent = () => (
        <View>
            <Text className="font-bold text-slate-800 mb-2">제1조 (목적)</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                본 약관은 덴티체크(이하 "회사")가 제공하는 서비스의 이용조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
            </Text>

            <Text className="font-bold text-slate-800 mb-2">제2조 (용어의 정의)</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                1. "서비스"라 함은 회사가 제공하는 AI 구강 검진 및 관련 제반 서비스를 의미합니다.{'\n'}
                2. "이용자"라 함은 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
            </Text>

            <Text className="font-bold text-slate-800 mb-2">제3조 (약관의 게시와 개정)</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </Text>
        </View>
    );

    const PrivacyContent = () => (
        <View>
            <Text className="font-bold text-slate-800 mb-2">1. 수집하는 개인정보 항목</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.{'\n'}
                - 필수항목: 이름, 이메일, 비밀번호{'\n'}
                - 선택항목: 구강 건강 설문 데이터, 구강 촬영 이미지
            </Text>

            <Text className="font-bold text-slate-800 mb-2">2. 개인정보의 수집 및 이용목적</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.{'\n'}
                - AI 기반 구강 건강 분석 제공{'\n'}
                - 맞춤형 병원 및 제품 추천
            </Text>

            <Text className="font-bold text-slate-800 mb-2">3. 개인정보의 보유 및 이용기간</Text>
            <Text className="text-slate-600 mb-4 leading-5 text-sm">
                원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
            </Text>
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
                    <Text className="text-xl font-bold text-slate-800">약관 및 정책</Text>
                </View>

                {/* Tabs */}
                <View className="flex-row border-b border-gray-100">
                    <TouchableOpacity
                        onPress={() => setActiveTab('terms')}
                        className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'terms' ? 'border-blue-500' : 'border-transparent'}`}
                    >
                        <Text className={`font-bold ${activeTab === 'terms' ? 'text-blue-600' : 'text-slate-400'}`}>이용약관</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('privacy')}
                        className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'privacy' ? 'border-blue-500' : 'border-transparent'}`}
                    >
                        <Text className={`font-bold ${activeTab === 'privacy' ? 'text-blue-600' : 'text-slate-400'}`}>개인정보처리방침</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
