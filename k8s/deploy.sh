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
  --from-literal=DISCORD_REDIRECT_URI="${DISCORD_REDIRECT_URI}" \
  --from-literal=POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  --from-literal=AUTOMATIC_VERIFICATION="${AUTOMATIC_VERIFICATION}" \
  --from-literal=AUTOMATIC_SERVER_TIMEOUT_TIMES="${AUTOMATIC_SERVER_TIMEOUT_TIMES}" \
  --from-literal=AUTOMATIC_SERVER_TIMEOUT_BATCH="${AUTOMATIC_SERVER_TIMEOUT_BATCH}" \
  --from-literal=TOKEN_EXPIRATION_HOURS="${TOKEN_EXPIRATION_HOURS}"

wait 10

echo "Applying Kubernetes Deployments..."
kubectl apply -f $DEPLOYMENT_DIR/postgres-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/redis-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/api-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/frontend-deployment.yaml
kubectl apply -f $DEPLOYMENT_DIR/frontend-ingress.yaml

kubectl get pods -o wide
kubectl get services
kubectl get deployments
