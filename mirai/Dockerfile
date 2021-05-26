FROM openjdk:11-jre-slim

WORKDIR /app/

COPY ./src/ /app/
COPY entrypoint.sh /

EXPOSE 8080

CMD [ "/entrypoint.sh" ]