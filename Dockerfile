# ==============================================================
# Dockerfile cho Hugging Face Spaces (Port 7860)
# ==============================================================

# Giai đoạn 1: Build React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend ./frontend
RUN cd frontend && npm run build

# Giai đoạn 2: Production Server
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist
RUN mkdir -p /app/data

WORKDIR /app/backend

# Hugging Face Spaces lắng nghe trên cổng 7860
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

CMD ["node", "src/server.js"]