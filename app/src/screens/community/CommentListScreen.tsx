import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Send, Heart, MoreHorizontal } from 'lucide-react-native';
import { useColorTheme } from '../../shared/providers/ColorThemeProvider';

export default function CommentListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useColorTheme();
    // const { postId } = route.params as { postId: string } || { postId: '1' }; // Removed unused var check for now

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        {
            id: '1',
            author: '김철수',
            content: '저도 여기 다녀왔는데 정말 좋더라고요! 추천합니다. 원장님이 정말 친절하세요.',
            createdAt: '10분 전',
            likes: 5,
            isLiked: false,
        },
        {
            id: '2',
            author: '이영희',
            content: '가격은 어느 정도 하나요? 보험 적용 되는지 궁금해요.',
            createdAt: '1시간 전',
            likes: 2,
            isLiked: true,
        },
        {
            id: '3',
            author: '박지민',
            content: '꿀팁 감사합니다~ 담에 갈 때 참고해야겠어요!',
            createdAt: '2시간 전',
            likes: 0,
            isLiked: false,
        },
    ]);

    const handleSend = () => {
        if (!comment.trim()) return;

        setComments([
            ...comments,
            {
                id: Date.now().toString(),
                author: '나',
                content: comment,
                createdAt: '방금 전',
                likes: 0,
                isLiked: false,
            },
        ]);
        setComment('');
    };

    const toggleLike = (id: string) => {
        setComments(comments.map(c =>
            c.id === id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
        ));
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-1"
                    >
                        <ChevronLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-slate-800">댓글</Text>
                </View>

                {/* Comments List */}
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    {comments.map((item) => (
                        <View key={item.id} className="flex-row gap-3 mb-6">
                            {/* Avatar */}
                            <View className="w-9 h-9 rounded-full bg-slate-200 items-center justify-center overflow-hidden">
                                <Text className="text-sm font-bold text-slate-500">{item.author[0]}</Text>
                            </View>

                            {/* Content Block */}
                            <View className="flex-1 pr-2">
                                <View className="flex-row items-baseline mb-1">
                                    <Text className="font-bold text-sm text-slate-900 mr-2">{item.author}</Text>
                                    <Text className="text-xs text-slate-400">{item.createdAt}</Text>
                                </View>

                                <Text className="text-slate-800 text-sm leading-5 mb-2">
                                    {item.content}
                                </Text>

                                <View className="flex-row items-center gap-4">
                                    <TouchableOpacity>
                                        <Text className="text-xs font-bold text-slate-400">답글 달기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Like & More Actions */}
                            <View className="items-center gap-3 pt-1">
                                <TouchableOpacity onPress={() => toggleLike(item.id)} className="items-center">
                                    <Heart
                                        size={14}
                                        color={item.isLiked ? '#ef4444' : '#94a3b8'}
                                        fill={item.isLiked ? '#ef4444' : 'transparent'}
                                    />
                                    {item.likes > 0 && (
                                        <Text className="text-[10px] text-slate-400 mt-0.5">{item.likes}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area (Pinned Bottom) */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3"
                >
                    <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 rounded-full bg-slate-200 items-center justify-center">
                            <Text className="text-xs font-bold text-slate-500">나</Text>
                        </View>
                        <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-2 border border-slate-200">
                            <TextInput
                                className="flex-1 h-9 text-sm text-slate-800"
                                placeholder={`나(으)로 댓글 달기...`}
                                placeholderTextColor="#94a3b8"
                                value={comment}
                                onChangeText={setComment}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={!comment.trim()}
                            >
                                <Text className={`text-sm font-bold ${comment.trim() ? 'text-blue-600' : 'text-slate-300'}`}>게시</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
