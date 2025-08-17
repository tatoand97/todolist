# Build stage
FROM golang:1.24-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o todolist ./cmd/api

# Run stage
FROM alpine:3.19
WORKDIR /app
COPY --from=build /src/todolist ./todolist
COPY internal/infrastructure/migrations internal/infrastructure/migrations
COPY static static
EXPOSE 8080
CMD ["./todolist"]
