# 안드로이드 설정 가이드

이 프로젝트는 안드로이드 에뮬레이터를 사용하여 실행하도록 설정되어 있습니다.

## 필수 조건 (Prerequisites)

- **Android Studio**가 설치되어 있어야 합니다.
- **Android SDK**가 `%LOCALAPPDATA%\Android\Sdk`에 설치되어 있거나 `ANDROID_HOME` 환경 변수로 설정되어 있어야 합니다.
- **Android Virtual Device (AVD)**가 생성되어 있어야 합니다.

## 추천 설정 (일회성)

터미널에서 `adb`나 `emulator` 같은 명령어를 쉽게 사용하기 위해, Android SDK 도구를 시스템 PATH에 추가하는 것을 권장합니다:

1.  **Windows 검색**을 열고 "env" 또는 "환경 변수"를 검색합니다.
2.  **"시스템 환경 변수 편집"**을 선택합니다.
3.  **"환경 변수..."** 버튼을 클릭합니다.
4.  사용자 변수 목록에서 **Path**를 선택하고 **편집...**을 클릭합니다.
5.  **새로 만들기**를 클릭하고 다음 경로들을 추가합니다:
    -   `%LOCALAPPDATA%\Android\Sdk\platform-tools`
    -   `%LOCALAPPDATA%\Android\Sdk\emulator`
6.  모든 창에서 **확인**을 클릭합니다.
7.  변경 사항을 적용하기 위해 **터미널(및 VS Code)을 재시작**합니다.

## 에뮬레이터 실행하기

### 방법 1: 제공된 스크립트 사용 (PATH 설정 불필요)

에뮬레이터를 쉽게 실행할 수 있도록 PowerShell 스크립트를 제공합니다:

```powershell
./scripts/start-emulator.ps1
```

이 스크립트는 자동으로 Android SDK 위치를 찾고 사용 가능한 첫 번째 에뮬레이터를 실행합니다.

### 방법 2: 수동 실행

SDK 도구를 PATH에 추가했다면 다음 명령어로 실행할 수 있습니다:

```bash
emulator -avd Medium_Phone_API_36
```

(`Medium_Phone_API_36` 대신 실제 생성한 AVD 이름을 입력하세요. `emulator -list-avds` 명령어로 목록을 확인할 수 있습니다.)

## 앱 실행하기

에뮬레이터가 실행 중인 상태에서:

1.  새 터미널 창을 열고 프로젝트 폴더로 이동합니다:
    ```bash
    cd denticheck-app
    ```
2.  앱을 실행합니다:
    ```bash
    npx expo start --android
    ```
    또는 Expo Metro Bundler 터미널에서 `a`를 누릅니다.
