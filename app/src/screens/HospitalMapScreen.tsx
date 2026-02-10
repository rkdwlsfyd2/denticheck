import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ChevronLeft, List } from 'lucide-react-native';
import { useColorTheme } from '../shared/providers/ColorThemeProvider';

const { width, height } = Dimensions.get('window');

// Mock Data (Same as HospitalsScreen for consistency)
const hospitals = [
    {
        id: '1',
        name: '스마일 치과의원',
        latitude: 37.500000,
        longitude: 127.035000, // Near Yeoksam/Gangnam
        address: '서울특별시 강남구 테헤란로 123',
    },
    {
        id: '2',
        name: '밝은미소 치과',
        latitude: 37.502000,
        longitude: 127.038000,
        address: '서울특별시 강남구 역삼동 456',
    },
    {
        id: '3',
        name: '건강한치과',
        latitude: 37.508000,
        longitude: 127.060000,
        address: '서울특별시 강남구 삼성동 789',
    },
    {
        id: '4',
        name: '프리미엄 치과의원',
        latitude: 37.512000,
        longitude: 127.030000,
        address: '서울특별시 강남구논현동 321',
    },
];

export default function HospitalMapScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useColorTheme();
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

    // Default region: Gangnam, Seoul
    const [region, setRegion] = useState({
        latitude: 37.50448,
        longitude: 127.04895,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
    });

    return (
        <View className="flex-1 bg-white">
            <View className="absolute top-12 left-4 z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md bg-opacity-90"
                >
                    <ChevronLeft size={24} color="#1f2937" />
                </TouchableOpacity>
            </View>

            <MapView
                style={{ width, height: '100%' }}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {hospitals.map((hospital) => (
                    <Marker
                        key={hospital.id}
                        coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
                        title={hospital.name}
                        description={hospital.address}
                        onPress={() => setSelectedHospital(hospital.id)}
                    />
                ))}
            </MapView>

            {/* Bottom Card for Selected Hospital (Optional) */}
            {selectedHospital && (
                <View className="absolute bottom-10 left-4 right-4 bg-white p-4 rounded-2xl shadow-lg">
                    <Text className="font-bold text-lg text-slate-800">
                        {hospitals.find(h => h.id === selectedHospital)?.name}
                    </Text>
                    <Text className="text-slate-500 text-sm mt-1">
                        {hospitals.find(h => h.id === selectedHospital)?.address}
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-blue-600 py-3 rounded-xl items-center"
                        onPress={() => {
                            const hospital = hospitals.find(h => h.id === selectedHospital);
                            if (hospital) {
                                navigation.navigate('HospitalDetail', { hospital: { ...hospital, rating: 4.5, reviewCount: 100, phone: '02-000-0000', isOpen: true, openTime: '09:00 - 18:00', features: ['주차가능'] } }); // Mock extra data
                            }
                        }}
                    >
                        <Text className="text-white font-bold">상세보기</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
