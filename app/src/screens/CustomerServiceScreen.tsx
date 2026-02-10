import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, ChevronUp, Phone, Mail, MessageSquare } from 'lucide-react-native';

export default function CustomerServiceScreen() {
    const navigation = useNavigation();

    // FAQ Data
    const faqs = [
        {
            question: 'AI 검진 결과는 얼마나 정확한가요?',
            answer: 'AI 검진 모델은 수만 건의 임상 데이터를 바탕으로 학습되었으며, 전문의 진단과 90% 이상의 일치율을 보입니다. 단, 정확한 진단을 위해서는 치과 방문을 권장합니다.'
        },
        {
            question: '회원 탈퇴는 어떻게 하나요?',
            answer: '마이페이지 하단의 [회원탈퇴] 메뉴를 통해 가능합니다. 탈퇴 시 모든 데이터는 즉시 삭제되며 복구할 수 없습니다.'
        },
        {
            question: '병원 예약은 어떻게 확인하나요?',
            answer: '예약 기능은 준비 중입니다. 현재는 병원 전화번호를 통해 직접 예약하셔야 합니다.'
        },
    ];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const ContactItem = ({ icon: Icon, label, value, color }: any) => (
        <TouchableOpacity className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 bg-white shadow-sm`}>
                <Icon size={20} color={color} />
            </View>
            <View>
                <Text className="text-xs text-slate-500 mb-0.5">{label}</Text>
                <Text className="text-sm font-bold text-slate-800">{value}</Text>
            </View>
        </TouchableOpacity>
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
                    <Text className="text-xl font-bold text-slate-800">고객센터</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {/* Contact Info */}
                    <Text className="text-lg font-bold text-slate-800 mb-4">문의하기</Text>
                    <ContactItem icon={Phone} label="고객센터 전화번호" value="02-1234-5678" color="#3b82f6" />
                    <ContactItem icon={Mail} label="이메일 문의" value="help@denticheck.com" color="#8b5cf6" />
                    <ContactItem icon={MessageSquare} label="카카오톡 상담" value="@덴티체크" color="#fbbf24" />

                    <View className="h-px bg-gray-100 my-6" />

                    {/* FAQ */}
                    <Text className="text-lg font-bold text-slate-800 mb-4">자주 묻는 질문 (FAQ)</Text>
                    <View>
                        {faqs.map((faq, index) => (
                            <View key={index} className="mb-3 border border-gray-100 rounded-xl overflow-hidden">
                                <TouchableOpacity
                                    onPress={() => toggleExpand(index)}
                                    className={`flex-row items-center justify-between p-4 bg-white ${expandedIndex === index ? 'bg-slate-50' : ''}`}
                                >
                                    <Text className="text-sm font-bold text-slate-700 flex-1 mr-2">Q. {faq.question}</Text>
                                    {expandedIndex === index ? (
                                        <ChevronUp size={20} color="#94a3b8" />
                                    ) : (
                                        <ChevronDown size={20} color="#94a3b8" />
                                    )}
                                </TouchableOpacity>
                                {expandedIndex === index && (
                                    <View className="p-4 bg-slate-50 border-t border-gray-100">
                                        <Text className="text-sm text-slate-600 leading-5">{faq.answer}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
