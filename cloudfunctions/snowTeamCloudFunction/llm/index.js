
// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')


// 初始化 cloud
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const client = new OpenAI({
  //   apiKey: process.env[apiKey], 
  // });


  try {
    // 发起HTTP请求连接到远程的OpenAPI
    // const chatCompletion = await client.chat.completions.create({
    //   messages: [{ role: 'user', content: 'Say this is a test' }],
    //   model: 'gpt-4o',
    // });

    // 返回结果
    return {
      success: true,
      data: 'chatCompletion'
    }
  } catch (error) {
    // 错误处理
    return {
      success: false,
      error: error.message
    }
  }
}