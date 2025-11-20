# 1단계: 빌드(Build) 스테이지
# node:22 버전을 베이스 이미지로 사용합니다. (alpine 태그로 더 가볍게)
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 배포 시 사용할 API 주소를 빌드 시점에 주입 (기본값은 Nginx 프록시 경로)
ARG VITE_API_BASE_URL=/fast_api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# 1. package.json과 package-lock.json (또는 yarn.lock)만 먼저 복사
COPY package*.json ./

# 2. 의존성 설치 (소스 코드 변경과 상관없이 캐시 활용)
RUN npm install

# 3. 나머지 소스 코드 복사
COPY . .

# 4. React 앱 빌드
RUN npm run build

# -------------------------------------------

# 2단계: 서빙(Serve) 스테이지
# 가벼운 nginx 이미지를 베이스로 사용
FROM nginx:alpine

# Nginx 기본 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 1단계(builder)에서 빌드된 결과물(/app/build)을 
# Nginx의 웹 루트 디렉토리(/usr/share/nginx/html)로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# React Router 등을 위한 Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80번 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
