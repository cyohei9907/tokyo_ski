const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 从 event 中解构传入的参数
    const {
      task_title,
      description,
      ticket_num,
      create_user_id,
      create_user_name,
      create_user_icon,
      qr_code_cloud_src,
      display_image_array,
      start_date,
      end_date,
      task_type,
      participating_users
    } = event;
    // 设定创建初期status值
    const status='inProgress';

    // 插入活动信息
    const res = await db.collection('task').add({
      data: {
        task_title,
        description,
        status,
        ticket_num,
        create_user_id,                // 创建用户的 ID
        create_user_name,              // 创建用户的名称
        create_user_icon,              // 创建用户的头像
        create_time: db.serverDate(),  // 使用服务器时间
        qr_code_cloud_src,
        display_image_array,            // 酒店等展示用图
        start_date,
        end_date,
        task_type,
        participating_users,           // 参与的用户列表
        is_active: true                // 设置活动为激活状态
      }
    });

    // await db.collection('discuss').add({
    //   data:{
    //     // task_id:res.result.data._id,
    //     owner:create_user_id,
    //     discuss_list:[],
    //   }
    // })

    return {
      success: true,
      data: res
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: e };
  }
};
