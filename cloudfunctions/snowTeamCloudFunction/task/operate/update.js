const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 活动的整条信息进行更新
// 用户参加，用户退出，用户删除
exports.update_task_record = async (event, context) => {
  try {
    // 遍历修改数据库信息
      await db.collection('task').where({
        _id: event._id
      })
      .update({
        data: event.record,
      });
    return {
      success: true,
      data: event.record
    };
  } catch (e) {
    return {
      success: false,
      errMsg: event.record
    };
  }
};
