# Denticheck API

치아 건강 체크 및 관리 플랫폼 Denticheck의 백엔드 API 서버입니다.

## 기술 스택
- Java 17
- Spring Boot 3.5.x
- Spring Data JPA + QueryDSL
- GraphQL
- PostgreSQL 15
- Flyway (DB Migration)
- Docker & Docker Compose

## 시작하기

### 환경 변수 설정
`.env.example` 파일을 `.env`로 복사하고 환경에 맞게 수정하세요.

### 프로젝트 실행
```bash
./gradlew bootRun
```

### Docker를 이용한 실행
```bash
docker-compose -f docker/docker-compose.local.yml up -d
```
