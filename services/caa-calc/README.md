燃气计算服务暂时放在这里，用于构思接口，后面抽出到单独仓库

接口：

//计算，java模块实现，放在这里备忘
calculate(data:any):result

//计算一个图，根据id获取图，调用java接口计算，计算完把计算结果写入数据库，并调用notification模块发布完成通知
//如果计算出错，则发布错误通知
calculateOne(id:string)