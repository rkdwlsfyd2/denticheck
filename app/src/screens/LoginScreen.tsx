import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Smile } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorTheme } from "../shared/providers/ColorThemeProvider";
import { useAuth } from "../shared/providers/AuthProvider";

export default function LoginScreen() {
  const { theme } = useColorTheme();
  const { signInWithGoogle, signInDev, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const handleDevLogin = async () => {
    try {
      await signInDev();
    } catch (error) {
      console.error("Dev login failed", error);
    }
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.muted, theme.background]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center p-6">
        <View className="w-full max-w-sm items-center">
          {/* Logo & Branding */}
          <View className="items-center mb-12">
            <LinearGradient
              colors={theme.gradient}
              className="w-24 h-24 items-center justify-center rounded-3xl mb-6 shadow-xl"
            >
              <Smile size={48} color="white" />
            </LinearGradient>
            <Text className="text-3xl font-bold text-center text-slate-800 mb-2">
              DentiCheck
            </Text>
            <Text className="text-slate-500 text-center font-medium">
              스마트한 구강 관리의 시작
            </Text>
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white flex-row items-center justify-center py-4 px-6 rounded-2xl shadow-md border border-slate-100 mb-4"
            activeOpacity={0.8}
          >
            {/* Google Icon Placeholder or Text */}
            <Text className="text-lg font-bold text-slate-700 ml-3">
              Google 계정으로 계속하기
            </Text>
          </TouchableOpacity>

          {/* Dev Bypass Button (Only in Dev) */}
          {__DEV__ && (
            <TouchableOpacity
              onPress={handleDevLogin}
              className="w-full bg-slate-800 flex-row items-center justify-center py-4 px-6 rounded-2xl shadow-md mt-2"
              activeOpacity={0.8}
            >
              <Text className="text-lg font-bold text-white">
                🛠️ 개발자 프리패스 (Dev Pass)
              </Text>
            </TouchableOpacity>
          )}

          <Text className="text-slate-400 text-xs text-center mt-8">
            로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
