import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function UploadScreen() {
    return (
        <View style={styles.container}>
            <Text>치아 사진을 업로드해주세요.</Text>
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
