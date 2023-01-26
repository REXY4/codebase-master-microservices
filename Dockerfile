# Build image
# docker build --rm -t be-master -f Dockerfile .

# Run image (test mode)
# docker run -it --rm -p 3000:3000 -p 30000:30000 be-master

# Run image
# docker run -d -t -p 3000:3000 -p 30000:30000 be-master

FROM node:lts-bullseye

LABEL maintainer="com.devops"
LABEL description="be-master"

# Create app directory
WORKDIR /opt/app

# Install the modules and build the code.
COPY package*.json ./
# RUN npm config set registry http://${NPM_REGISTRY}/ --> no artifactory yet
# RUN WITH_SASL=0 npm install --production --verbose

RUN npm install

# Bundle App Source
COPY . .

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Run layers
RUN [[ -f /opt/app/.env ]] || touch /opt/app/.env
RUN sed -i "s|localhost|host.docker.internal|g" /opt/app/.env
RUN chmod +x /opt/app/entrypoint.sh

EXPOSE 3000
EXPOSE 30000

CMD ["/bin/bash", "entrypoint.sh"]