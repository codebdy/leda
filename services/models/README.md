模型引擎

docker内连宿主机mysql host.docker.internal

创建镜像：
docker build --pull --rm -f "Dockerfile" -t idlewater2/models:v0.0.1 "."

创建容器
docker create -p 4000:4000  --name models  idlewater2/models:v0.0.1

创建标签
docker tag $mageId idlewater2/models

推送镜像
docker push idlewater2/models:v0.0.1