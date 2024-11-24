FROM mcr.microsoft.com/windows/servercore:1803 as installer

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';$ProgressPreference='silentlyContinue';"]

RUN Invoke-WebRequest -OutFile nodejs.zip -UseBasicParsing "https://nodejs.org/dist/v12.4.0/node-v12.4.0-win-x64.zip"; Expand-Archive nodejs.zip -DestinationPath C:\; Rename-Item "C:\\node-v12.4.0-win-x64" c:\nodejs

FROM mcr.microsoft.com/windows/nanoserver:1803

WORKDIR C:/nodejs
COPY --from=installer C:/nodejs/ .
RUN SETX PATH C:\nodejs
RUN npm config set registry https://registry.npmjs.org/

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