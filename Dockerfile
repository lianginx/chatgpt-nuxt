# 设置基础镜像 Set up base image
FROM node:slim

# 设置工作目录 Set working directory
WORKDIR /app

# 复制生产版本到镜像中 Copy production version into the image.
COPY .output .

# 暴露应用程序端口 Expose application ports
EXPOSE 3000

# 启动服务 Start Service
CMD [ "node","server/index.mjs" ]