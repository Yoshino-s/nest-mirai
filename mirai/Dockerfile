FROM openjdk:11-jre

ENV MCL_VERSION=1.2.1
ENV MAH_VERSION=2.1.0

WORKDIR /app/

RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt-get update

RUN wget https://github.com/iTXTech/mirai-console-loader/releases/download/v${MCL_VERSION}/mcl-${MCL_VERSION}.zip -O /app/mcl.zip && \
    unzip /app/mcl.zip -d /app/ && \
    chmod +x /app/mcl && ./mcl -z

RUN wget https://github.com/project-mirai/mirai-api-http/releases/download/v${MAH_VERSION}/mirai-api-http-v${MAH_VERSION}.mirai.jar -O /app/plugins/mirai-api-http.jar

COPY entrypoint.sh /

EXPOSE 8080

CMD [ "/entrypoint.sh" ]