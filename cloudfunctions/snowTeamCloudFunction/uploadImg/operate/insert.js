const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});

// 创建集合云函数入口函数
exports.upload_user_icon = async (event, context) => {
  try{
    // 上传图片到云存储
    const result = await wx.cloud.uploadFile({
      cloudPath: event.cloudPath, // 设置云存储路径
      fileContent: await cloud.getTempFileURL({ fileList: [event.filePath] }) // 获取文件内容
    });
    return {
            result:result,
            event:event
          }; // 返回文件ID
  }
  catch (e) {
    return {result :e, event:event}; // 返回文件ID
  }
}