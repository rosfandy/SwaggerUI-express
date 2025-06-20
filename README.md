# 🚀 SwaggerUI OpenAPI Module

## Folder Structure

```javascript
.
├── docs/
│   ├── openapi.yaml    // main file swagger openapi
│   ├── bundled.yaml    // don't edit this
│   └── path            // folder for open api files/
│       ├── users/
│       │   ├── users.get.yaml  // use this format name "<path>.<method>.yaml"
│       │   ├── users.post.yaml
│       │   └── users.getId.yaml // use camelcase for specific method
│       └── ...
└── ...
```

## Installation

1. Clone Repository

   ```bash
   git clone <repo>
   cd <repo>
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Running

   ```bash
   npm start
   ```

4. App running on[ http://localhost:5123](http://localhost:5123)

## How to use

### Manual

1. Edit file `openapi.yaml`

   ```yaml
   openapi: 3.0.0
   info:
     title: OpenAPI
     description: Dokumentasi OpenAPI
     version: 1.0.0
   servers:
     - url: http://localhost:3000
   paths:
     # ADD PATH HERE
     # USE REF TO SPECIFIED FILES

     /hello: # PATH
       $ref: "./paths/hello/hello.get.yaml" # FILE

     /users:
       get:
         $ref: "./paths/users/users.get.yaml"
       post:
         $ref: "./paths/users/users.post.yaml"
   ```

2. Create `.yaml` files

### Generator

1. Run command

   ```javascript
   npx generate <resource_name>
   ```

2. Edit generated file `.yaml`
