FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install        # install inside container

COPY . .

EXPOSE 7778

CMD ["npm", "start"]
