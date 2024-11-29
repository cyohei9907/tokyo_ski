const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
     // 这里的 `event` 包含了调用云函数时传入的参数
     const nick_name = event.nick_name?event.nick_name:'';
     const user_icon = event.user_icon?event.user_icon:'';
     const is_active = true;
         
     // 获取用户表基础信息
     const open_id = cloud.getWXContext().OPENID;
     const selectResult = await db.collection('user')
                .where({
                  open_id: cloud.getWXContext().OPENID
                })
                .orderBy('create_time', 'desc')
                .get();

     //新用户的场合追加用户数据
     let createResult = '';
     if(selectResult.data.length == 0)
     {
      createResult = await db.collection('user').add({
        data: {
          open_id,                       //用户Id
          nick_name,                     //用户头像
          user_icon,                     //用户头像
          is_active,
          create_time: db.serverDate(),  // 使用服务器时间
        }
      });
     }

     //Icon以及Name需要更新的场合
     let updateResult = '';
     if(selectResult.data.length == 1 && selectResult.data[0].nick_name=='' && nick_name)
     {
      updateResult = await db.collection('user')
                .where({
                  open_id: cloud.getWXContext().OPENID
                })
                .update({
                  data:{
                    nick_name: nick_name,
                    user_icon: user_icon
                  }
                });
     }

     const current_user_info = await db.collection('user')
     .where({
       open_id: cloud.getWXContext().OPENID
     })
     .orderBy('create_time', 'desc')
     .get();

  // 返回数据库查询结果
  return {selectResult:selectResult, createResult: createResult,updateResult:updateResult,open_id:open_id,current_user_info:current_user_info};
};
