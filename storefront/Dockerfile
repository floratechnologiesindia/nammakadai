FROM node:20-alpine AS builder

WORKDIR /app 

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY --from=builder /app ./

EXPOSE 5001

CMD ["npm", "run", "start"]

