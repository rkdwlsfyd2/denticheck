# API 데이터 적재 스크립트

이 디렉토리는 외부 API에서 데이터를 가져와 Denticheck 데이터베이스에 적재하는 스크립트들을 포함하고 있습니다.

## 스크립트 목록

### `load_dentals.py`

이 스크립트는 [공공데이터포털(data.go.kr)](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15001698)에서 치과 병/의원 정보를 조회하여 `dentals` 테이블에 삽입하거나 업데이트합니다.

#### 사전 요구사항

*   Python 3.x
*   PostgreSQL 데이터베이스 실행 중 (Denticheck DB)
*   `pip` (Python 패키지 설치 관리자)

#### 설정 방법

1.  **의존성 패키지 설치**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **환경 변수 설정**:
    이 디렉토리에 `.env` 파일을 생성하거나 다음 환경 변수를 설정하세요:

    ```env
    OPEN_API_KEY=발급받은_Decoding_인증키
    ```
    *(참고: 공공데이터포털의 **Decoding** 된 인증키를 사용해야 합니다)*

    기본적으로 로컬 데이터베이스에 연결을 시도합니다:
    *   Host: `localhost`
    *   Port: `5432`
    *   DB: `denticheck`
    *   User: `admin`
    *   Password: `admin_password`

    *DB 설정이 다른 경우 `load_dentals.py` 파일 내의 `DB_CONFIG` 변수를 수정하세요.*

#### 사용 방법

파이썬으로 스크립트를 실행합니다:

```bash
python load_dentals.py
```

#### 동작 원리

1.  PostgreSQL 데이터베이스에 연결합니다.
2.  `getHospBasisList` API 오퍼레이션을 통해 데이터를 페이지 단위로 조회합니다.
    *   조회 조건: `zipCd=2050` (치과병원/치과의원).
3.  응답받은 JSON 데이터를 파싱합니다.
4.  `dentals` 테이블에 데이터를 삽입합니다. 이미 존재하는 병원(`source_key` / `ykiho` 기준)인 경우 정보를 업데이트합니다.
5.  진행 상황을 콘솔에 출력합니다.

#### 자동화

데이터를 최신 상태로 유지하기 위해, 이 스크립트를 주기적(예: 매주 1회)으로 실행하도록 Cron 작업이나 스케줄러에 등록하는 것을 권장합니다.
