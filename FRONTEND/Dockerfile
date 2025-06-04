# Usa una imagen base de Node
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto Vite por defecto
EXPOSE 5173

# Comando por defecto: modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
