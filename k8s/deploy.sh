#!/bin/bash

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
DEPLOYMENT_DIR="/opt/k8s/generated"

mkdir -p $DEPLOYMENT_DIR

echo "Updating Kubernetes Secrets..."
kubectl delete secret mc-secrets --ignore-not-found
kubectl create secret generic mc-secrets \
  --from-literal=COOKIE_SECRET="${COOKIE_SECRET}" \
  --from-literal=DISCORD_CLIENT_ID="${DISCORD_CLIENT_ID}" \
  --from-literal=DISCORD_CLIENT_SECRET="${DISCORD_CLIENT_SECRET}" \
  --from-literal=DISCORD_REDIRECT_URI="${DISCORD_REDIRECT_URI}"

echo "Applying Kubernetes Deployments..."
kubectl apply -f $DEPLOYMENT_DIR/postgres-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/redis-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/api-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/frontend-deployment.yaml

kubectl get pods -o wide
kubectl get services
kubectl get deployments
