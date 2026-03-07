# Cinematica - Kubernetes Deployment

Deploying a full-stack movie review application on Kubernetes using Minikube.

## 📋 Table of Contents

- [About Cinematica](#about-cinematica)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Deployment Guide](#deployment-guide)
- [Accessing the Application](#accessing-the-application)

---

## 🎬 About Cinematica

**Cinematica** is a full-stack MERN (MongoDB, Express, React, Node.js) movie review application that allows users to:

- Browse popular movies and TV shows powered by **TMDB API**
- Create an account and authenticate securely with **JWT tokens**
- Write and publish movie reviews
- Read reviews from other users
- Search and discover new content

The application features a modern React frontend built with Vite, a RESTful API backend with Express.js, and MongoDB for data persistence.

**Live Application:** [https://github.com/KarimShahid/Cinematica](https://github.com/KarimShahid/Cinematica)

---

## ☸️ Kubernetes Deployment

This repository documents the complete Kubernetes deployment of Cinematica, demonstrating:

### What Was Accomplished

✅ **Containerized Application**
- Dockerized frontend and backend with multi-architecture support (amd64/arm64)
- Multi-stage Docker builds for optimized image sizes
- Published images to Docker Hub for easy deployment

✅ **MongoDB with Persistent Storage**
- Deployed MongoDB with PersistentVolumeClaim (1Gi storage)
- Data survives pod restarts and deletions
- Single replica with ReadWriteOnce access mode

✅ **Backend API Deployment**
- Node.js/Express backend running as 2 replicas for high availability
- Kubernetes Secrets for sensitive credentials (JWT secrets, TMDB API key)
- Environment variables for runtime configuration (MongoDB URI, PORT)
- Resource limits and requests for efficient cluster usage

✅ **Frontend Deployment**
- React application served by nginx as 2 replicas
- Custom nginx configuration for API proxy routing
- Single-file artifacts for simplified deployment

✅ **Service Discovery & Communication**
- ClusterIP Services for internal pod-to-pod communication
- DNS-based service discovery (service names as hostnames)
- Backend connects to MongoDB via `cinematica-mongodb-service:27017`
- Frontend proxies API calls to `cinematica-backend-service:5001`

✅ **Ingress for External Access**
- Enabled Minikube Ingress addon (nginx ingress controller)
- Configured routing rules for external access
- Accessible via `localhost` using `minikube tunnel`

✅ **Best Practices Implemented**
- Separation of concerns (database, backend, frontend layers)
- No hardcoded credentials (using Kubernetes Secrets)
- Resource management with CPU/memory limits
- Scalable architecture with multiple replicas
- Health checks with proper healthcheck configurations


---

## 🏗️ Architecture

The Kubernetes deployment follows a three-tier architecture:

```
                    Internet
                       ↓
                 Ingress (nginx)
                       ↓
        ┌──────────────┴──────────────┐
        ↓                              ↓
  Frontend Service              Backend Service
  (ClusterIP:80)               (ClusterIP:5001)
        ↓                              ↓
  Frontend Pods (2)             Backend Pods (2)
  [React + nginx]               [Node.js + Express]
                                       ↓
                              MongoDB Service
                              (ClusterIP:27017)
                                       ↓
                                MongoDB Pod (1)
                                       ↓
                            PersistentVolume (1Gi)
```

### Components

**Ingress Layer**
- Nginx ingress controller for external traffic routing
- Routes all traffic to frontend service

**Application Layer**
- **Frontend**: 2 replicas of React app served by nginx
- **Backend**: 2 replicas of Node.js/Express API
- Both use ClusterIP services for internal communication

**Data Layer**
- **MongoDB**: Single pod with persistent storage
- **PersistentVolume**: 1Gi storage for database data
- Data persists across pod restarts


---

## ✅ Prerequisites

- **Docker** - Container runtime
- **Minikube** - Local Kubernetes cluster
- **kubectl** - Kubernetes command-line tool
- **TMDB API Key** - Required for movie data ([Get yours here](https://www.themoviedb.org/settings/api))

### Verify Installation

```bash
minikube version
kubectl version --client
docker --version
```

### Start Minikube

```bash
minikube start
kubectl cluster-info
```


---

## 🚀 Deployment Guide

### Step 1: Clone Repository

```bash
git clone https://github.com/KarimShahid/Cinematica.git
cd Cinematica/k8s/manifests
```

### Step 2: Configure Secrets

Create `backend-secret.yaml` with your base64-encoded credentials:

```bash
# Encode your secrets
echo -n 'your-jwt-secret' | base64
echo -n 'your-refresh-secret' | base64
echo -n 'your-tmdb-api-key' | base64
```

**Important:** The secret must include `TMDB_API_KEY` (not IMDB_API_KEY).

### Step 3: Deploy MongoDB

```bash
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml
```

Verify MongoDB is running:
```bash
kubectl get pods -l app=cinematica-mongodb
```

### Step 4: Deploy Backend

```bash
kubectl apply -f backend-secret.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
```

Verify backend is running and connected to MongoDB:
```bash
kubectl logs -l app=cinematica-backend
```

Expected output: `Connected to MongoDB` and `Cinematica server running at http://localhost:5001`

### Step 5: Deploy Frontend

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

Verify all pods are running:
```bash
kubectl get pods
```

### Step 6: Configure Ingress

```bash
# Enable ingress addon
minikube addons enable ingress

# Apply ingress configuration
kubectl apply -f ingress.yaml

# Verify ingress
kubectl get ingress
```


---

## 🌐 Accessing the Application

### Using Minikube Tunnel (Recommended)

Start the tunnel in a separate terminal and keep it running:

```bash
sudo minikube tunnel
```

Access the application at:
- **http://localhost**
- **http://127.0.0.1**

---

## 📞 Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/KarimShahid/Cinematica/issues)
- Check existing issues for solutions

---

## 👤 Author

**Karim Shahid**
- GitHub: [@KarimShahid](https://github.com/KarimShahid)
- Docker Hub: [karimshahid](https://hub.docker.com/u/karimshahid)

---

**Happy Deploying! ☸️**
