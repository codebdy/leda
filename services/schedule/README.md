定时任务

任务可以分为一次性任务跟周期执行任务

每个服务用的实体需要单独定义

接口定义

type Task struct {
  id int
  name string
  config json
  api string
  type string //post， graphql muation
}

tasks():Task[]
createTask(task: Task, start: bool)

start(taskId: string)
end(taskId: string)

创建镜像：
docker build --pull --rm -f "Dockerfile" -t idlewater2/schedule:v0.0.1 "."