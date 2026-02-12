# Image Node.js LTS légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de prod
RUN npm install --omit=dev

# Copier le reste du projet
COPY . .

# Port exposé (adapte si ton app utilise un autre port)
EXPOSE 5001

# Commande de démarrage
CMD ["npm", "start"]
