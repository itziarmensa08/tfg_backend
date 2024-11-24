# Imagen base de Windows Server Core con Node.js preinstalado
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Establecer variables de entorno
ENV DEBUG=puppeteer:*

# Instalar Node.js y sus herramientas globales
RUN npm install -g ts-node typescript
RUN npm install -g nodemon

# Configurar el directorio de trabajo
WORKDIR C:/app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 4002

# Comando por defecto
CMD ["npm", "run", "dev"]