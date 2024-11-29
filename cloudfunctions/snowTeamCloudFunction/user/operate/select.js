const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 通过openid获取到已登录用户的基础信息
exports.select_user_by_openid = async () => {
     // 获取用户表基础信息
     const open_id = cloud.getWXContext().OPENID;
     const selectResult = await db.collection('user')
                .where({
                  open_id: open_id
                })
                .orderBy('create_time', 'desc')
                .get();

    // 返回数据库查询结果
    return {selectResult:selectResult};
};
