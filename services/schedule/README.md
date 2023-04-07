定时任务

任务可以分为一次性任务跟周期执行任务

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