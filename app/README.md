# DentiCheck App

덴티체크 모바일 애플리케이션 프로젝트입니다. 이 문서는 프로젝트를 처음 세팅하는 팀원들이 **순서대로 따라하면 바로 실행할 수 있도록** 작성되었습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| Category       | Technology               | Version |
| -------------- | ------------------------ | ------- |
| **Framework**  | Expo SDK                 | 54      |
| **Engine**     | React Native             | 0.81.x  |
| **Language**   | TypeScript               | 5.x     |
| **Styling**    | NativeWind (TailwindCSS) | v4      |
| **Navigation** | React Navigation         | v6      |

---

## ✅ 개발/테스트 운영 방식 (현재 기준)

### 개발 단계(지금)

- **Android(에뮬레이터/실기기)**: Dev Build(네이티브)로 테스트
  - `@react-native-google-signin/google-signin` 사용 가능
  - 실행: `npx expo run:android`
- **iOS(실기기, Expo Go)**: Expo Go로 테스트
  - 네이티브 Google Sign-In은 Expo Go에서 제한될 수 있어 OAuth(auth-session) 또는 Dev Login 사용

### 운영/배포 단계(추후)

- Android/iOS 모두 Dev Build / EAS Build 기반으로 네이티브 Sign-In 통일

---

### 1. 사전 준비 사항 (Prerequisites)

- **Node.js**: [Node.js 공식 홈페이지](https://nodejs.org/)에서 LTS 버전 (v18 또는 v20) 설치 권장.
- **Git**: 소스 코드 버전 관리 도구.
- **Expo Go 앱**: 본인의 스마트폰(iOS/Android)에 설치.
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

### 💻 안드로이드 에뮬레이터 설정 (Windows)

PC에서 모바일 환경을 테스트하려면 에뮬레이터 설정이 필요합니다.
자세한 설정 방법은 [📖 ANDROID_SETUP.md](docs/ANDROID_SETUP.md) 문서를 참고하세요.

**간편 실행 스크립트:**

```powershell
./scripts/start-emulator.ps1
```

---

### 2. 프로젝트 설치 및 세팅 (Setup)

#### 2-1. 팀원이 “홈 debug.keystore”에 넣기 (중요!)

✅ debug.keystore는 커밋하지 않음  
✅ 전달은 개인 DM/사내 비공개 공유로만

**Windows (PowerShell)**

```powershell
# 0) .android 폴더 생성
New-Item -ItemType Directory -Force "$env:USERPROFILE\.android" | Out-Null

# 1) 기존 debug.keystore 백업(있으면)
if (Test-Path "$env:USERPROFILE\.android\debug.keystore") {
  Copy-Item "$env:USERPROFILE\.android\debug.keystore" "$env:USERPROFILE\.android\debug.keystore.bak" -Force
}

# 2) 받은 공용 debug.keystore를 홈으로 복사 (경로만 수정)
Copy-Item "C:\path\to\debug.keystore" "$env:USERPROFILE\.android\debug.keystore" -Force

# 3) SHA-1 확인(팀 공용과 같은지) (중요! 확인후 공용채널에 같은지 공유)
& "$env:JAVA_HOME\bin\keytool.exe" -list -v `
  -keystore "$env:USERPROFILE\.android\debug.keystore" `
  -alias androiddebugkey `
  -storepass android `
  -keypass android | findstr "SHA1"
```

**macOS/Linux (bash/zsh)**

```bash
mkdir -p ~/.android

# 기존 debug.keystore 백업(있으면)
if [ -f ~/.android/debug.keystore ]; then
  cp ~/.android/debug.keystore ~/.android/debug.keystore.bak
fi

# 받은 공용 debug.keystore를 홈으로 복사 (경로만 수정)
cp /path/to/debug.keystore ~/.android/debug.keystore

# SHA-1 확인(팀 공용과 같은지) (중요! 확인후 공용채널에 같은지 공유)
"$JAVA_HOME/bin/keytool" -list -v \
  -keystore "$HOME/.android/debug.keystore" \
  -alias androiddebugkey \
  -storepass android \
  -keypass android | grep "SHA1"
```

> **“Warning: SHA1withRSA (weak)” 이거 신경 써야 해?**
>
> - 이건 키스토어 인증서 서명 알고리즘이 낡았다는 경고인데,
> - Google Sign-In의 SHA-1 등록은 여전히 필요하고, 개발 단계에서는 일반적으로 그냥 사용해.
> - 운영/배포용 릴리즈 키는 어차피 별도로 관리(EAS/Play App Signing)하니까 지금 단계에서는 OK.

#### 2-2. 저장소 가져오기 및 이동

_(이미 소스를 받았다면 생략)_

**Windows , Mac , Linux**

```bash
git clone https://github.com/DentiCheck/app.git
cd app
```

#### 2-3. 패키지 설치

이 프로젝트는 `npm`을 사용합니다.

**Windows , Mac , Linux**

```bash
npm install
```

#### 2-4. 환경 변수 설정 (중요!)

프로젝트 실행을 위한 환경 변수 파일을 생성합니다.

```bash
# Windows (PowerShell)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

> **Note**:
>
> - `.env` 파일이 생성되었는지 확인해주세요. API URL 등이 여기에 포함됩니다.
> - `.env`에 최소 아래 채우기:
>   - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
>   - EXPO_PUBLIC_API_SERVER_URL=...

---

### 3. 앱 실행 (How to Run)

팀원 간 원격 협업 시(서로 다른 와이파이 사용 시) **Tunnel 모드**를 강력 권장합니다.

#### ✅ 옵션 A: Android (에뮬레이터) — Dev Build (권장)

##### A-1. 에뮬레이터 실행

**Windows (PowerShell)**

```powershell
./scripts/start-emulator.ps1
```

**macOS/Linux (bash/zsh)**

- Android Studio의 Device Manager에서 에뮬레이터 실행을 권장합니다.
- 또는 SDK 경로가 잡혀있다면:

```bash
emulator -list-avds
emulator -avd "<AVD_NAME>"
```

##### A-2. (처음 1회 또는 네이티브 의존성 변경 시) prebuild

> `package.json`에서 네이티브 모듈 추가/삭제했거나, android/ios 폴더가 없으면 실행

**Windows (PowerShell) , macOS/Linux (bash/zsh)**

```bash
npx expo prebuild --clean
```

##### A-3. Android Dev Build 설치 + 실행

> 이 명령은 APK 빌드/설치 + Metro 실행까지 포함합니다.

**Windows (PowerShell) , macOS/Linux (bash/zsh)**

```bash
npx expo run:android
```

##### A-4. 이미 Dev Client 앱이 설치되어 있을 때(빠른 개발)

> 이미 에뮬레이터/실기기에 dev client가 깔려 있고 “JS 코드만” 바뀌는 상황이면 Metro만 켜도 됩니다.

**Windows (PowerShell) , macOS/Linux (bash/zsh)**

```bash
npx expo start --dev-client
```

✅ 정리

- `expo run:android` = 앱(네이티브) 빌드/설치 + **Metro**
- `npx expo start --dev-client` = **Metro**만 실행 (이미 설치된 dev client 앱이 필요)

#### 옵션 B: iOS (실기기) — Expo Go (현재 개발 단계)

> Expo Go는 네이티브 Google Sign-In이 제한될 수 있습니다.  
> iOS는 OAuth(auth-session) 또는 Dev Login 방식으로 테스트합니다.

##### B-1. 실행 (권장: tunnel)

**Windows (PowerShell) , macOS/Linux (bash/zsh)**

```bash
npx expo start --tunnel
```

> iPhone에서 Expo Go로 QR 스캔 후 실행

---

### 4. 자주 묻는 질문 & 문제 해결 (Troubleshooting)

#### Q1. "SDK version issue" 경고가 떠요.

- 현재 프로젝트는 **Expo SDK 54** 기준입니다.
- `package.json`의 Expo 버전을 임의로 변경하지 마세요. (호환성 문제가 발생할 수 있습니다.)
- Expo Go 앱 버전이 SDK 54를 지원하는지 확인하고, 필요하면 Expo Go를 최신으로 업데이트하세요.

#### Q2. 스타일이 깨지거나 적용이 안 돼요. (NativeWind)

- 스타일링 라이브러리(NativeWind) 캐시 문제일 수 있습니다. 캐시를 지우고 다시 시작하세요.
  ```bash
  npx expo start --clear
  ```

#### Q3. `env` 관련 에러가 발생해요.

- `2-4` 단계에서 `.env` 파일을 올바르게 생성했는지 확인하세요.
- `.env` 파일 내용이 비어있지 않은지 확인하세요.

#### Q4. 앱이 켜지다가 바로 꺼져요.

- 터미널을 종료(`Ctrl + C`)하고 다시 실행해보세요.
- 그래도 안 되면 `node_modules` 폴더를 삭제하고 다시 설치해보세요.
  ```bash
  rm -rf node_modules
  npm install
  ```

#### Q5. 포트 8081이 사용 중이라 떠요

- 기존 Metro가 떠 있을 수 있습니다.
- 실행 중인 터미널에서 `Ctrl + C`로 종료하거나, Expo가 제안하는 다른 포트를 사용해도 됩니다.

#### Q6. prebuild가 EBUSY(파일 잠김)로 실패해요 (Windows)

- node/java/adb 프로세스가 파일을 잡고 있을 수 있습니다.

**Windows (PowerShell)**

```powershell
taskkill /F /IM node.exe
taskkill /F /IM java.exe
taskkill /F /IM adb.exe
```

그 후 다시:

```powershell
npx expo prebuild --clean
```

#### Q7. Google Sign-In 에러(DEVELOPER_ERROR 등)

대부분:

- Google Console 설정(패키지명 / SHA-1 / OAuth Client)이 불일치일 가능성이 큽니다.
- 팀원이 각자 디버그 키스토어가 다르면 SHA-1도 달라질 수 있어 팀원별 등록이 필요할 수 있습니다
- 콘솔 Android OAuth의 패키지명이 현재 빌드 package와 다름
- 콘솔 SHA-1이 실제 빌드 서명 SHA-1과 다름(= keystore 통일 실패)
- webClientId가 “웹 클라이언트”가 아닌 걸 넣음

해결 순서:

1. 홈 debug.keystore SHA-1 확인
2. APK 서명 SHA-1 확인(apksigner)
3. 콘솔 Android OAuth에 package+SHA-1 재확인
4. webClientId는 Web OAuth client ID로 고정.

#### Q8. 스타일/번들 캐시 문제 같아요

**Windows (PowerShell) , macOS/Linux (bash/zsh)**

```bash
npx expo start -c
```

#### Q9. 팀원이 “SHA-1 다른데요?”

- 홈 파일이 제대로 교체 안 된 거임  
  → 다시 복사 후 keytool로 확인

#### Q10. 콘솔에서 “Requested entity already exists”

- 같은 package+SHA-1이 이미 어딘가에 등록되어 있음  
  → 기존 Android OAuth Client 삭제/정리 후 다시 생성
