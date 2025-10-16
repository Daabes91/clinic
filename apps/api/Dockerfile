FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /workspace
COPY build.gradle.kts settings.gradle.kts gradlew ./ 
COPY gradle ./gradle
COPY src ./src
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod
COPY --from=builder /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
