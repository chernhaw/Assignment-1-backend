FROM alpine

WORKDIR /app

RUN apk add npm

COPY package.json .

RUN npm install 

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN npm install mysql

COPY . .

CMD ["node", "App.js"]