# ISIS-4426 Taller Nivelación 0 - Todo List API

## 📋 Descripción

API REST para gestión de tareas desarrollada en Go con arquitectura hexagonal. Permite a los usuarios registrarse, autenticarse y gestionar sus tareas organizadas por categorías.

## 🔧 Tecnologías Utilizadas

- **Go 1.23.0** - Lenguaje de programación
- **Gin** - Framework web HTTP
- **PostgreSQL** - Base de datos relacional
- **GORM** - ORM para Go
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de servicios
- **Migrate** - Migraciones de base de datos

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Clean Architecture)** con las siguientes capas:

```
internal/
├── domain/           # Entidades y reglas de negocio
│   ├── entities/     # Modelos de dominio
│   └── interfaces/   # Contratos/Puertos
├── application/      # Casos de uso
│   ├── useCase/      # Lógica de aplicación
│   └── validations/  # Validaciones
├── infrastructure/   # Adaptadores externos
│   ├── repository/   # Implementación de repositorios
│   └── migrations/   # Migraciones SQL
└── presentation/     # Controladores HTTP
```

### Diagrama de Arquitectura Hexagonal

```mermaid
graph TB
    subgraph "External Actors"
        Client[Cliente HTTP]
        DB[(PostgreSQL)]
    end
    
    subgraph "Presentation Layer"
        Router[Gin Router]
        AuthH[Auth Handler]
        CatH[Category Handler]
        TaskH[Task Handler]
        Middleware[JWT Middleware]
    end
    
    subgraph "Application Layer"
        AuthUC[Auth UseCase]
        CatUC[Category UseCase]
        TaskUC[Task UseCase]
        Validations[Validations]
    end
    
    subgraph "Domain Layer"
        UserE[User Entity]
        CatE[Category Entity]
        TaskE[Task Entity]
        UserI[User Interface]
        CatI[Category Interface]
        TaskI[Task Interface]
    end
    
    subgraph "Infrastructure Layer"
        UserR[User Repository]
        CatR[Category Repository]
        TaskR[Task Repository]
        Migrations[DB Migrations]
    end
    
    Client --> Router
    Router --> Middleware
    Middleware --> AuthH
    Middleware --> CatH
    Middleware --> TaskH
    
    AuthH --> AuthUC
    CatH --> CatUC
    TaskH --> TaskUC
    
    AuthUC --> UserI
    CatUC --> CatI
    TaskUC --> TaskI
    AuthUC --> Validations
    CatUC --> Validations
    TaskUC --> Validations
    
    UserI --> UserE
    CatI --> CatE
    TaskI --> TaskE
    
    UserI -.-> UserR
    CatI -.-> CatR
    TaskI -.-> TaskR
    
    UserR --> DB
    CatR --> DB
    TaskR --> DB
    Migrations --> DB
```

### Flujo de Datos

```mermaid
flowchart LR
    A[HTTP Request] --> B[Gin Router]
    B --> C{Auth Required?}
    C -->|Yes| D[JWT Middleware]
    C -->|No| E[Handler]
    D --> F{Valid Token?}
    F -->|Yes| E
    F -->|No| G[401 Unauthorized]
    E --> H[UseCase]
    H --> I[Validation]
    I --> J{Valid?}
    J -->|Yes| K[Repository]
    J -->|No| L[400 Bad Request]
    K --> M[(Database)]
    M --> N[Response]
    N --> O[HTTP Response]
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Go 1.23.0+
- Docker
- Docker Compose

## 🐳 Ejecución con Docker (Recomendado)

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 🔧 Ejecución Local

### 1. Configurar Base de Datos

```bash
# Ejecutar PostgreSQL
docker run --name todolist-db -p 5432:5432 \
  -e POSTGRES_DB=todolist \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -d postgres:15-alpine
```

### 2. Variables de Entorno

```bash
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/todolist?sslmode=disable"
export JWT_SECRET="tu_clave_secreta_jwt"
export PORT="8080"
```

### 3. Ejecutar la Aplicación

```bash
# Instalar dependencias
go mod tidy

# Ejecutar servidor (las migraciones se aplican automáticamente)
go run cmd/api/main.go
```

## 📁 Estructura del Proyecto

```
todolist/
├── cmd/api/main.go                    # Punto de entrada
├── internal/
│   ├── domain/
│   │   ├── entities/                  # User, Category, Task
│   │   ├── interfaces/                # Repositorios
│   │   └── errors.go                  # Errores de dominio
│   ├── application/
│   │   ├── useCase/                   # AuthService, CategoryService, TaskService
│   │   ├── validations/               # Validaciones de negocio
│   │   └── context_utils.go           # Utilidades de contexto
│   ├── infrastructure/
│   │   ├── repository/                # Implementaciones GORM
│   │   └── migrations/                # Migraciones SQL
│   └── presentation/                  # Handlers HTTP
├── client/todolist/                   # Frontend Angular (opcional)
├── docker-compose.yml                 # Orquestación de servicios
├── Dockerfile                         # Imagen de la API
├── openapi.yaml                       # Documentación OpenAPI
├── Task-Manager-API.postman_collection.json  # Colección Postman
├── go.mod                            # Dependencias Go
└── README.md
```

## 📖 Documentación API

- **OpenAPI**: `openapi.yaml`
- **Postman**: `Task-Manager-API.postman_collection.json` (colección unificada)

## 🛣️ Endpoints

### Públicos
- `POST /usuarios` - Registro de usuario
- `POST /usuarios/iniciar-sesion` - Login
- `GET /health` - Health check

### Protegidos (requieren JWT)
- `POST /usuarios/cerrar-sesion` - Logout

#### Categorías
- `GET /categorias` - Listar todas las categorías
- `POST /categorias` - Crear categoría global
- `GET /categorias/:id` - Obtener categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

#### Tareas
- `POST /tareas` - Crear tarea
- `GET /tareas/usuario` - Listar tareas del usuario (con filtros)
- `GET /tareas/:id` - Obtener tarea
- `PUT /tareas/:id` - Actualizar tarea
- `DELETE /tareas/:id` - Eliminar tarea

## 📊 Modelo de Base de Datos

```sql
users (id, username, password_hash, profile_image_url)
categories (id, name, description)
tasks (id, text, created_at, due_date, state, category_id, user_id)
```

### Diagrama Entidad-Relación

```mermaid
erDiagram
    USERS {
        int id PK
        varchar username UK
        varchar password_hash
        text profile_image_url
    }
    
    CATEGORIES {
        int id PK
        varchar name
        text description
    }
    
    TASKS {
        int id PK
        text text
        timestamp created_at
        timestamp due_date
        varchar state
        int category_id FK
        int user_id FK
    }
    
    USERS ||--o{ TASKS : "creates"
    CATEGORIES ||--o{ TASKS : "contains"
```

### Estados de Tareas
- `Sin Empezar` - Estado inicial
- `Empezada` - Tarea en progreso  
- `Finalizada` - Tarea completada

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Middleware de autorización
- Validación de permisos por usuario
- Migraciones automáticas al iniciar

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as API Server
    participant DB as PostgreSQL
    
    Note over C,DB: Registro de Usuario
    C->>API: POST /usuarios
    API->>API: Hash password (bcrypt)
    API->>DB: INSERT usuario
    DB-->>API: user_id
    API-->>C: 201 Created
    
    Note over C,DB: Login
    C->>API: POST /usuarios/iniciar-sesion
    API->>DB: SELECT usuario por username
    DB-->>API: user data
    API->>API: Verificar password
    API->>API: Generar JWT token
    API-->>C: 200 OK + JWT token
    
    Note over C,DB: Acceso a recursos protegidos
    C->>API: GET /tareas (+ JWT Header)
    API->>API: Validar JWT token
    API->>DB: SELECT tareas WHERE user_id
    DB-->>API: lista de tareas
    API-->>C: 200 OK + tareas
```

### Flujo de Gestión de Tareas

```mermaid
flowchart TD
    A[Usuario Autenticado] --> B{Acción}
    B -->|Crear| C[POST /tareas]
    B -->|Listar| D[GET /tareas/usuario]
    B -->|Ver| E[GET /tareas/:id]
    B -->|Actualizar| F[PUT /tareas/:id]
    B -->|Eliminar| G[DELETE /tareas/:id]
    
    C --> H[Validar datos]
    D --> I[Aplicar filtros]
    E --> J[Verificar propiedad]
    F --> K[Validar cambios]
    G --> L[Verificar propiedad]
    
    H --> M{¿Válido?}
    I --> N[Consultar BD]
    J --> O{¿Es propietario?}
    K --> P{¿Válido?}
    L --> Q{¿Es propietario?}
    
    M -->|Sí| R[Crear en BD]
    M -->|No| S[400 Error]
    N --> T[Retornar lista]
    O -->|Sí| U[Retornar tarea]
    O -->|No| V[404 Not Found]
    P -->|Sí| W[Actualizar BD]
    P -->|No| S
    Q -->|Sí| X[Eliminar de BD]
    Q -->|No| V
    
    R --> Y[201 Created]
    T --> Z[200 OK]
    U --> Z
    W --> Z
    X --> AA[204 No Content]
```

## 🧪 Testing con Postman

1. Importar `Task-Manager-API.postman_collection.json`
2. La colección incluye variables integradas
3. Ejecutar "Login" para obtener JWT automáticamente
4. Usar endpoints protegidos con token configurado

### Variables Incluidas
- `base_url`: http://localhost:8080
- `username`: usuario123
- `password`: password123
- `jwt_token`: (se llena automáticamente)

### Flujo de Testing

```mermaid
flowchart TD
    A[Importar Colección] --> B[Ejecutar Register User]
    B --> C[Ejecutar Login]
    C --> D{¿Token obtenido?}
    D -->|Sí| E[Token guardado automáticamente]
    D -->|No| F[Verificar credenciales]
    E --> G[Crear Categoría]
    G --> H[Listar Categorías]
    H --> I[Crear Tarea]
    I --> J[Listar Tareas]
    J --> K[Actualizar Tarea]
    K --> L[Eliminar Tarea]
    L --> M[Logout]
    F --> B
```

## 📝 Comandos Útiles

```bash
# Ver logs de la base de datos
docker-compose logs db

# Conectar a PostgreSQL
docker exec -it todolist-db-1 psql -U postgres -d todolist

# Ejecutar tests
go test ./...

# Limpiar módulos Go
go mod tidy

# Ver contenedores
docker ps

# Rebuild completo
docker-compose down -v && docker-compose up --build
```

## 🌐 Frontend (Opcional)

El proyecto incluye un cliente Angular en `client/todolist/` para interfaz web.

```bash
cd client/todolist
npm install
ng serve
```

## 🔄 Migraciones

Las migraciones se ejecutan automáticamente al iniciar la aplicación. Los archivos están en `internal/infrastructure/migrations/`.

### Flujo de Migraciones

```mermaid
flowchart TD
    A[Inicio de Aplicación] --> B[Conectar a BD]
    B --> C[Inicializar Migrate]
    C --> D{¿Migraciones pendientes?}
    D -->|Sí| E[Ejecutar migraciones UP]
    D -->|No| F[Continuar inicio]
    E --> G{¿Éxito?}
    G -->|Sí| F
    G -->|No| H[Error y terminar]
    F --> I[Inicializar GORM]
    I --> J[Configurar repositorios]
    J --> K[Iniciar servidor HTTP]
```

## 📈 Características Técnicas

- **Arquitectura Hexagonal**: Separación clara de responsabilidades
- **Inyección de Dependencias**: Servicios desacoplados
- **Migraciones Automáticas**: Base de datos siempre actualizada
- **Health Checks**: Monitoreo de servicios
- **Contenedorización**: Despliegue simplificado
- **Documentación OpenAPI**: API bien documentada

### Arquitectura de Despliegue

```mermaid
graph TB
    subgraph "Docker Compose"
        subgraph "API Container"
            API[Go API Server]
            PORT[":8080"]
        end
        
        subgraph "DB Container"
            DB[(PostgreSQL)]
            DBPORT[":5432"]
        end
        
        subgraph "Volumes"
            VOL[db-data]
        end
    end
    
    subgraph "External"
        CLIENT[Cliente HTTP]
        ADMIN[pgAdmin]
    end
    
    CLIENT --> PORT
    PORT --> API
    API --> DBPORT
    DBPORT --> DB
    DB --> VOL
    ADMIN --> DBPORT
    
    API -.->|Health Check| API
    DB -.->|Health Check| DB
```

## 👥 Equipo de Desarrollo

- **Ricardo Andres Leyva Osorio** - Developer
- **Edda Camila Rodriguez Mojica** - Developer
- **Cristian David Paredes Bravo** - Developer
- **Andrea Carolina Cely Duarte** - Developer
- **Juan Carlos Martinez Muñoz** - Developer
