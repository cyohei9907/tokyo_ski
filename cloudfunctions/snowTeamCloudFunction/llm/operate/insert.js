
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    // 这里的 `event` 包含了调用云函数时传入的参数
    const { TeamTitle,TeamDetail,TicketNums  } = event.formData;
    const CreateUser = event.CreateUser;
    const CreatedUserIcon = event.CreatedUserIcon;            //创建者头像
    const eventStartDate = event.startdate;                   //开始日
    const eventEndDate = event.enddate;                       //结束日
    const isWPType = event.isWPType;                          //是否是WP票
    const QRcodeCloudSrc = event.QRcodeCloudSrc;              //图片
    const WPScheduleMap = event.WPScheduleMap;
    const WP_ScheduleTitleList = event.WP_ScheduleTitleList;  //WP票情况下进行Schedule的标题头
    const WP_ScheduleRowList = event.WP_ScheduleRowList;      //WP票情况下进行Schedule
    const ScheduleRowList = event.ScheduleRowList;            //非WP票情况下进行Schedule
    const isActive = true;
        
    // 获取基础信息
    const CreateUserId = cloud.getWXContext().OPENID;

    // 插入活动信息
    const res = await db.collection('active').add({
      data: {
        CreateUserId,
        CreateUser,     //用户名
        CreatedUserIcon, //用户头像
        TeamTitle,
        TeamDetail,
        TicketNums,
        isWPType,                     //是否是WP拼票
        QRcodeCloudSrc,
        WPScheduleMap,
        WP_ScheduleTitleList,       //WP票情况下进行Schedule的标题头
        WP_ScheduleRowList,         //WP票情况下进行Schedule
        ScheduleRowList,            //非WP票情况下进行Schedule
        // type: type || 'wp拼票', // 如果type没有指定，默认为 'wp拼票'
        eventStartDate,
        eventEndDate,
        createTime: db.serverDate(), // 使用服务器时间
        isActive
      }
    })
    return {
      success: true,
      data: res,
    };
  } catch (e) {
    return {reason:false,data:e}
  }
};
