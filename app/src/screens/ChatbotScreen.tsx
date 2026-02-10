import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useColorTheme } from '../shared/providers/ColorThemeProvider';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export default function ChatbotScreen() {
    const { theme } = useColorTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '안녕하세요! 구강 건강 상담 AI입니다. 궁금하신 점을 편하게 물어보세요.',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    const quickQuestions = [
        '충치 원인', '스케일링 주기', '올바른 양치법', '치실 사용법'
    ];

    const getResponse = (question: string): string => {
        const lowerQuestion = question.toLowerCase();
        if (lowerQuestion.includes('충치')) return '충치는 입안의 세균이 당분을 분해하며 만드는 산이 치아를 부식시켜 발생합니다.\n\n예방 팁:\n• 식후 3분 이내 양치\n• 당분 섭취 줄이기\n• 불소 치약 사용';
        if (lowerQuestion.includes('스케일링')) return '스케일링은 보통 6개월~1년 주기를 권장합니다. 잇몸이 약하거나 흡연자의 경우 3개월 주기가 적당할 수 있습니다.\n\n연 1회는 건강보험이 적용됩니다.';
        if (lowerQuestion.includes('양치')) return '올바른 양치법(회전법):\n칫솔모를 잇몸 쪽으로 45도 기울여 대고, 손목을 돌려 치아 끝방향으로 쓸어내리듯 닦아주세요. 꼼꼼히 3분 이상 하시는 게 중요합니다.';
        if (lowerQuestion.includes('치실')) return '치실은 30-40cm 정도로 끊어 양 중지에 감고, 치아 사이에 조심스럽게 넣어 C자로 감싸 위아래로 닦아내듯 사용합니다. 잇몸에 상처가 나지 않게 주의하세요.';
        return '죄송합니다. 조금 더 구체적으로 질문해 주시겠어요? 가까운 치과 방문을 추천드립니다.';
    };

    const handleSend = (text?: string) => {
        const messageText = text || input;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getResponse(messageText),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-900">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Minimal Header */}
                <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 z-10">
                    <Text className="text-2xl font-extrabold text-slate-800 dark:text-white">AI 상담</Text>
                    <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-green-500" />
                        <Text className="text-[10px] font-bold text-green-700">Online</Text>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-4"
                    contentContainerStyle={{ paddingVertical: 20 }}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            className={`flex-row gap-3 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {message.role === 'assistant' && (
                                <View className="w-8 h-8 rounded-full bg-blue-1000 items-center justify-center border border-slate-200 bg-white">
                                    <Bot size={18} color={theme.primary} />
                                </View>
                            )}

                            <View className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <View
                                    className={`p-4 rounded-2xl ${message.role === 'user'
                                        ? 'bg-blue-500 rounded-tr-none'
                                        : 'bg-white rounded-tl-none border border-slate-100 shadow-sm'
                                        }`}
                                >
                                    <Text className={`text-[15px] leading-6 ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                                        {message.content}
                                    </Text>
                                </View>
                                <Text className="text-[10px] text-slate-400 mt-1 px-1">
                                    {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {isTyping && (
                        <View className="flex-row gap-3 mb-6">
                            <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center">
                                <Bot size={18} color={theme.primary} />
                            </View>
                            <View className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm w-16 items-center">
                                <View className="flex-row gap-1 h-3 items-center">
                                    <BouncingDot delay={0} />
                                    <BouncingDot delay={150} />
                                    <BouncingDot delay={300} />
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Quick Actions & Input */}
                <View className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-2">
                    {messages.length < 3 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-3 px-4 border-b border-slate-50">
                            {quickQuestions.map((q, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => handleSend(q)}
                                    className="mr-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full"
                                >
                                    <Text className="text-slate-600 text-xs font-medium">{q}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
                        <View className="px-4 py-3 flex-row gap-3 items-center">
                            <TextInput
                                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white text-base max-h-24"
                                placeholder="메시지를 입력하세요..."
                                placeholderTextColor="#94a3b8"
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />
                            <TouchableOpacity
                                onPress={() => handleSend()}
                                disabled={!input.trim()}
                                className={`w-12 h-12 rounded-full items-center justify-center ${input.trim() ? 'bg-blue-500 shadow-md shadow-blue-200' : 'bg-slate-200'
                                    }`}
                            >
                                <Send size={20} color="white" style={{ marginLeft: 2 }} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </View>
    );
}

function BouncingDot({ delay }: { delay: number }) {
    const animation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: -4,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, animation]);

    return (
        <Animated.View style={{ transform: [{ translateY: animation }] }}>
            <View className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        </Animated.View>
    );
}
