#!/bin/bash


echo "clean compose from previous execution"
docker compose down -v

echo "start compose in detached mode"
docker compose up -d

container_id=$(docker compose ps -q neo4j)
if [ -z "$container_id" ]; then
  echo "failed to find neo4j container"
  exit 1
fi

echo "waiting for database to be ready"
while [ "$(docker inspect -f '{{.State.Health.Status}}' "$container_id" 2>/dev/null)" != "healthy" ]; do
  echo -n "."
  sleep 1
done
echo

echo "building application"
docker build -t nodejs-neo4j .

echo "remove previous container application if exists"
docker rm -f nodejs-neo4j 2>/dev/null

echo "starting application"
docker run -it --rm \
  --name nodejs-neo4j \
  --network host \
  -e NODE_ENV=development \
  -e NEO4J_URI=bolt://localhost:7687 \
  -e NEO4J_USER=neo4j \
  -e NEO4J_PASSWORD=uniasselvi \
  -v "$(pwd)":/usr/src/app \
  nodejs-neo4j

echo "finished application run"

echo "remove application image"
docker rmi nodejs-neo4j

echo "clean compose from previous execution"
docker compose down -v
