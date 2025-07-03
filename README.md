[![Create release](https://github.com/manuszep/cadrart2025-backend/actions/workflows/create-release.yaml/badge.svg)](https://github.com/manuszep/cadrart2025-backend/actions/workflows/create-release.yaml)

# Cadrart 2025 Backend

A NestJS-based backend API for the Cadrart application - a comprehensive art framing business management system that helps framers create quotes, manage invoices, track tasks, and maintain inventory.

## 🎯 Overview

Cadrart Backend provides a robust REST API and WebSocket support for managing all aspects of an art framing business, including:

- **Client Management** - Customer information and relationships
- **Offer & Quote System** - Create and manage custom frame quotes
- **Task Management** - Track work orders and project progress
- **Inventory Management** - Stock tracking for frames, materials, and supplies
- **Team Management** - Staff and team member coordination
- **File Management** - Image uploads and document handling
- **Authentication & Authorization** - Secure user access control

## 🚀 Features

- **RESTful API** with comprehensive CRUD operations
- **Real-time WebSocket** communication for live updates
- **JWT Authentication** with Passport.js
- **File Upload** with image processing capabilities

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Authentication**: JWT + Passport.js
- **File Upload**: Multer with Sharp for image processing
- **Real-time**: Socket.io
- **Security**: Helmet.js
- **Language**: TypeScript
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

## 📚 Available Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the application in watch mode with debug
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint the codebase
- `npm run format` - Format the code with Prettier

## 🗄 Database Migrations

- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run migration:create` - Create an empty migration file

## 📡 API Endpoints

The API is organized into the following modules:

- **Auth** (`/api/auth`) - Authentication and authorization
- **Clients** (`/api/clients`) - Customer management
- **Offers** (`/api/offers`) - Quote and offer management
- **Tasks** (`/api/tasks`) - Work order tracking
- **Articles** (`/api/articles`) - Inventory items
- **Formulas** (`/api/formulas`) - Pricing formulas
- **Providers** (`/api/providers`) - Supplier management
- **Team Members** (`/api/team-members`) - Staff management
- **Locations** (`/api/locations`) - Business locations
- **Tags** (`/api/tags`) - Categorization system
- **Files** (`/api/files`) - File upload and management
- **Version** (`/api/version`) - API version information

## 🔌 WebSocket Events

The application supports real-time communication through WebSocket connections for:

- Live entities updates
- Real-time notifications
- Collaborative features

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker

The application includes Docker support for containerized deployment:

```bash
# Build the Docker image
docker build -t cadrart-backend .

# Run the container
docker run -p 3000:3000 cadrart-backend
```

## 📦 Deployment

The application can be deployed using:

- **Docker** - Containerized deployment
- **Kubernetes** - Orchestrated deployment (see `infrastructure/kubernetes/`)
- **Traditional hosting** - Direct Node.js deployment

## 📄 License

This project is private and unlicensed. All rights reserved.

## 🔗 Related Projects

- [cadrart2025-frontend](https://github.com/manuszep/cadrart2025-frontend) - Angular frontend application
- [cadrart2025-common](https://github.com/manuszep/cadrart2025-common) - Shared types and utilities
- [es-form-system](https://github.com/manuszep/es-form-system) - Form system library
