# syntax=docker/dockerfile:1

# ---- Build stage -------------------------------------------------------------
# Uses a Maven image so no local Maven/JDK is required to build the image.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first: only re-downloads when pom.xml changes.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Build the application.
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---- Runtime stage -----------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
