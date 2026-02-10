# 트러블슈팅 가이드 (Troubleshooting Guide)

개발 중 발생할 수 있는 일반적인 문제와 해결 방법을 정리한 문서입니다.

## 1. 터미널이 멈추거나(Hang), Ctrl+C가 먹히지 않을 때

Node.js 프로세스가 메모리 부족이나 무한 루프로 인해 좀비 프로세스가 되면 터미널이 응답하지 않을 수 있습니다.

### 해결 방법
프로젝트 루트에서 다음 명령어를 실행하여 **모든 Node 프로세스를 강제 종료하고 캐시를 초기화**한 뒤 다시 시작하세요.

```powershell
npm run clean:start
```

또는 수동으로 다음을 수행할 수 있습니다:
```powershell
# 1. Node 프로세스 전체 종료
taskkill /F /IM node.exe

# 2. 캐시를 지우고 다시 시작
npx expo start --clear
```

---

## 2. "Property doesn't exist" 또는 알 수 없는 참조 오류

새로운 파일을 만들거나 이름을 바꾼 직후에 Metro Bundler가 변경 사항을 즉시 감지하지 못해서 발생할 수 있습니다.

### 해결 방법
1.  터미널에서 `r` 키를 눌러 앱을 리로드합니다.
2.  그래도 해결되지 않으면, `npm run clean:start`를 실행하여 캐시를 비웁니다.

---

## 3. 안드로이드 에뮬레이터 연결 실패

### 해결 방법
1.  **에뮬레이터가 켜져 있는지 확인**: Android Studio Device Manager에서 에뮬레이터를 먼저 실행하세요.
2.  **ADB 연결 확인**:
    ```powershell
    adb devices
    ```
    위 명령어를 쳤을 때 `List of devices attached` 아래에 기기가 보여야 합니다.
3.  **Expo 서버 재시작**: `a` 키를 눌러 안드로이드 연결을 재시도합니다.

---

## 4. 새로운 라이브러리 설치 후 오류

네이티브 모듈이 포함된 라이브러리(`react-native-maps` 등)를 설치한 경우, Expo Go 앱만으로는 실행이 불가능할 수 있습니다(Development Build 필요). 하지만 순수 자바스크립트 라이브러리나 Expo SDK 포함 라이브러리는 보통 바로 작동합니다.

### 해결 방법
1.  서버를 껐다 켭니다 (`Ctrl+C` 후 `npx expo start`).
2.  `npx expo install [패키지명]` 명령어로 설치하여 버전 호환성을 맞춥니다.
