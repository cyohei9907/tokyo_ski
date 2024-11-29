const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 通过openid获取到已登录用户的基础信息
exports.update_users_task = async (event, context) => {
     // 获取用户表基础信息
     const updateResult = await db.collection('user')
                .where({
                  _id: event._id
                })
                .update({
                  data: event.record,
                });

    // 返回数据库查询结果
    return {success:true, updateResult:updateResult};
};
