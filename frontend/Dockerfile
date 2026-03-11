FROM node:22
WORKDIR /app
COPY package-lock.json package.json /app/
RUN npm install
COPY . .
CMD [ "npm", "run", "dev", "--", "--host" ]