FROM node:20.10.0 as builder

WORKDIR /

COPY package*.json ./
COPY prisma ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:20.10.0

WORKDIR /

COPY package*.json ./

RUN npm ci --production
RUN npm install -g prisma

COPY --from=builder /dist ./dist
COPY --from=builder /prisma ./prisma

RUN npx prisma generate

CMD [ "npm", "start" ]
