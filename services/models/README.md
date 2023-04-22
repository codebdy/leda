模型引擎

docker内连宿主机mysql host.docker.internal

创建镜像：
docker build --pull --rm -f "Dockerfile" -t models:lastest "."

创建容器
docker create -p 4000:4000  --name entify  models:lastest