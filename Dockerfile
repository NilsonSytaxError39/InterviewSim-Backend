# Usar una imagen base de Node.js
FROM node:18

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json (o yarn.lock)
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que se ejecuta el backend (ejemplo: 8000)
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["npm", "start"]