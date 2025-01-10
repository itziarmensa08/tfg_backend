# Usar la imagen oficial de Node.js
FROM node:21.7.1

# Instalar herramientas globales necesarias
RUN npm install -g ts-node typescript nodemon

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias antes del código para aprovechar la caché de Docker
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 4002

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]