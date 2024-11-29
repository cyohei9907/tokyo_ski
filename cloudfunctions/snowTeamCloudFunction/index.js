// user
const user_insert = require('./user/operate/insert');
const user_select = require('./user/operate/select');
const user_update = require('./user/operate/update');
// upload
const upload_insert = require('./uploadImg/operate/insert');
// task
const task_select = require('./task/operate/select');
const task_insert = require('./task/operate/insert');
const task_update = require('./task/operate/update');
// llm
const llm = require('./llm/index');


// const createTeam = require('./createTeam/index');
// const updateTeam = require('./updateTeam/index');
// const updateUserRelationToActive = require('./user/updateUserRelationToActive');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    // 用户初期插入
    case 'user_insert':
      return await user_insert.main(event, context);
    case 'user_update':
      if(event.method == 'update_users_task') return await user_update.update_users_task(event, context);
    // 用户通过OpenId获取用户信息
    case 'user_select':
      return await user_select.select_user_by_openid(event, context);
    // 用户上传头像
    case 'upload_insert':
      return await upload_insert.upload_user_icon(event, context);
    // 事件查询
    case 'task_select':
      if(event.method == 'get_task_list') return await task_select.get_task_list(event, context);
      if(event.method == 'get_task_by_id') return await task_select.get_task_by_id(event, context);
      if(event.method == 'get_task_count') return await task_select.get_task_count(event, context);
    // 事件创建
    case 'task_insert':
      return await task_insert.main(event, context);
    // 事件更新
    case 'task_update':
      return await task_update.update_task_record(event,context);
    case 'llm':
      return await llm.main(event, context);
  }
};
