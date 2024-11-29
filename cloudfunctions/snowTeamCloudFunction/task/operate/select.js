const cloud = require('wx-server-sdk');
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV});
const db = cloud.database();

// 获取list
exports.get_task_list = async (event, context) => {
    try {
      // 取得结束日在当前日期之前的日期
      const currentDate = new Date();
      const temp_limit_date = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate()
      // 查询 `task` 集合中的所有数据
      const res = await db.collection('task').where({
        status: "inProgress",                 // 条件 1：status 为 "inProgress"
        end_date: db.command.gt(temp_limit_date),  // 条件 2：endDate 大于当前日期
        is_active:true,                           //条件 3：活动中的事件
        task_type:event.task_type
      }).orderBy('create_time', 'desc').get();
      console.log(res);
      return {
        success: true,
        data: res.data // 返回查询到的数据
      };
    }
    catch (e) {
      console.log(e);
      return {reason:false, data:e}
    }
};

// 获取单条记录
exports.get_task_by_id = async (event, context) => {
  try {
    // 查询 `task` 某一条数据
    const res = await db.collection('task').where({
      _id:event._id
    }).get();
    return {
      success: true,
      data: res.data // 返回查询到的数据
    };
  }
  catch (e) {
    console.log(e);
    return {reason:false, data:e}
  }
};


// 获取单条记录
exports.get_task_list_by_user = async (event, context) => {
  try {
    // 查询 `task` 某一条数据
    const res = await db.collection('task').where({
      _id:event._id
    }).get();
    return {
      success: true,
      data: res.data // 返回查询到的数据
    };
  }
  catch (e) {
    console.log(e);
    return {reason:false, data:e}
  }
};

// 获取单条记录
exports.get_task_count = async (event, context) => {
  try {
    // 取得结束日在当前日期之前的日期
    const currentDate = new Date();
    const temp_limit_date = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate()
    // 查询 `task` 集合中的各个种类数据的数量
    const res = await db.collection('task')
    .aggregate()
    .match({
      is_active: true,
      end_date: db.command.gt(temp_limit_date),
    })
    .group({
      _id: '$task_type', // 根据 `task_type` 字段进行分组
      count: { $sum: 1 } // 计算每种类型的数量
    })
    .end();

    let wp_count = 0;
    let car_count = 0;
    let homestay_count = 0;
    let equipment_count = 0;
    let ticket_count = 0;
    let coach_count = 0;

    // 遍历结果，将各个类型的数量赋值
    res.list.forEach(item => {
      if (item._id === 'wp') wp_count = item.count;
      if (item._id === 'car') car_count = item.count;
      if (item._id === 'homestay') homestay_count = item.count;
      if (item._id === 'equipment') equipment_count = item.count;
      if (item._id === 'ticket') ticket_count = item.count;
      if (item._id === 'coach') coach_count = item.count;
    });

    return {
      success: true,
      data: {wp_count,car_count, homestay_count, equipment_count, ticket_count, coach_count} // 返回查询到的数据
    };
  }
  catch (e) {
    console.log(e);
    return {reason:false, data:e}
  }
};
