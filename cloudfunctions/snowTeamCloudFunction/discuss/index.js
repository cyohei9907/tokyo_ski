// 创建discuss，需要关联到task
// 发送消息，附加到task上

// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取参数
  const { taskName, taskDescription } = event

  // 模拟创建任务
  const task = {
    id: new Date().getTime(),
    name: taskName,
    description: taskDescription,
    createdBy: wxContext.OPENID,
    createdAt: new Date()
  }

  // 返回结果
  return {
    success: true,
    data: task
  }
}