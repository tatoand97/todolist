# Build stage
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o todolist ./cmd/api

# Run stage
FROM alpine:3.19
WORKDIR /app
COPY --from=build /src/todolist ./todolist
COPY migrations ./migrations
EXPOSE 8080
CMD ["./todolist"]
