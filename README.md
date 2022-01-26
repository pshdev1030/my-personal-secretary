## My Personal Secretery

## Describe

Web app where you can manage your schedule and receive information from your ai secretary.

## Development Period

1.11-1.25

## BackEnd

javascript + nodejs + express + mongoose

```
npm i
npm run dev
```

### Folder Structure

```
back
├── models // 스키마 정의
│   ├── schedule.js
│   └── user.js
├── modules // jwt인증
│   └── auth.js
├── router // 라우터 정의
│   ├── schedule.js
│   └── user.js
├── app.js // 메인 파일
├── mongo.js // MongoDB
├── nodemon.json // hot-reloading
├── package-lock.json
├── package.json
├── .env // mongodb등 환경변수
├── .gitignore
└── README.md
```

## FrontEnd

typescript nextjs + antd + swr

dev

```
npm i
npm run dev
```

build and run

```
npm i
npm run build
npm run start
```

### Folder Structure

```
front
├── .next
├── components
│   ├── AppLayout.tsx // common layout
│   ├── Calendar.tsx
│   ├── EventForm.tsx
│   ├── LoginForm.tsx
│   ├── Modal.tsx
│   ├── Secretary.tsx
│   ├── SignUpForm.tsx
│   └── UserInfo.tsx
├── constant //constant
│   └── api.ts
├── fetcher //swr fetcher
│   ├── event.ts
│   ├── secretary.ts
│   └── user.ts
├── pages //pages
│   ├── _app.tsx // common
│   ├── index.tsx //main(calendar)
│   ├── signup.tsx //signup
│   └── secretary.tsx //ai secretary
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.js //proxy+ css in node_modules
├── package-lock.json
├── package.json
└── tsconfig.json
```
