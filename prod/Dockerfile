FROM node:18-alpine
WORKDIR /app

# Copier les fichiers importants
COPY package*.json ./
RUN npm install --force

# Inclut tout le répertoire, y compris tsconfig.json et next.config.js
COPY . .  

# Vérification temporaire des fichiers copiés
RUN ls -la /app
RUN cat tsconfig.json

RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]