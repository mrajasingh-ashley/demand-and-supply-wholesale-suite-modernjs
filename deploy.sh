#!/bin/bash

# Build and push Docker image
echo "Building Docker image..."
docker build -t ashleyfurniture.azurecr.io/demand-supply-frontend:latest .

echo "Pushing to Azure Container Registry..."
docker push ashleyfurniture.azurecr.io/demand-supply-frontend:latest

echo "Deploying to Kubernetes..."
kubectl apply -f k8s/

echo "Checking deployment status..."
kubectl get pods -n demand-planning -l app=demand-supply-frontend

echo "Deployment complete!"
echo "To access the app internally:"
echo "kubectl port-forward -n demand-planning service/demand-supply-frontend 8080:80"
