# Arquitectura de la Aplicación

Esta sección describe los componentes principales y el despliegue de la solución.

## Modelo de Componentes

```mermaid
graph TB
    subgraph "Presentation"
        API[Handlers HTTP]
    end
    subgraph "Application"
        UC[Use Cases]
    end
    subgraph "Domain"
        Entities[Entidades]
    end
    subgraph "Infrastructure"
        DB[(PostgreSQL)]
    end

    API --> UC
    UC --> Entities
    UC --> DB
```

## Modelo de Despliegue

```mermaid
graph TB
    client[Cliente] --> api[API Go]
    api --> db[(PostgreSQL)]
```

Los diagramas están construidos con **Mermaid** para facilitar su actualización y lectura.
