# Utiliser Node.js
FROM node:18

# Activer Corepack (nécessaire pour Yarn moderne)
RUN corepack enable

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et yarn.lock
COPY package.json yarn.lock ./

# Installer les dépendances avec la version correcte de Yarn Il assure que yarn.lock est respecté et évite toute modification imprévue des dépendances.
RUN yarn install --immutable --check-cache


# Copier le reste des fichiers
COPY . .

# Build du projet TypeScript
RUN yarn build

# Exposer le port 3333
EXPOSE 3333

# Lancer l'application
CMD ["yarn", "start:prod"]
