import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function QualityGateScreen() {
    return (
        <View style={styles.container}>
            <Text>사진 품질을 확인 중입니다...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
