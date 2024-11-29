// pages/taskList/taskList.js
Page({
  data: {
    taskList: [], // 用于存储获取的任务列表
    task_type:''
  },
  
  onLoad(options) {
    // 设定当前页面type
    this.setData({task_type:options.task_type})
    // 调用云函数 获取任务列表
    this.getTaskList();
  },
  
  getTaskList() {
    wx.showLoading()
    const that = this;
    // 获取
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        task_type: that.data.task_type,  // 将 type 传递给云函数，这里是一个示例值
        type: 'task_select',                // 查询的函数类
        method: 'get_task_list',            // 查询的函数名
      }
    }).then(res => {
      console.log("查询成功:", res.result.data);
      // 处理查询到的数据
      that.setData({
        taskList: res.result.data
      });
      wx.stopPullDownRefresh();
      wx.hideLoading()
    }).catch(err => {
      console.error("查询失败:", err);
      wx.stopPullDownRefresh();
      wx.hideLoading()
    });
  },

  // 跳转到任务创建页面
  onCreateTaskButtonClick(){
    const task_type = this.data.task_type
    wx.navigateTo({
      url: `/pages/task/task_create/index?task_type=${task_type}`, // 创建活动画面
    });
  },

  // 点击任务项跳转到详细页面
  onTaskItemClick(event) {
    const taskId = event.currentTarget.dataset.id; // 获取任务的 id
    wx.navigateTo({
      url: `/pages/task/task_detail/index?_id=${taskId}` // 跳转到任务详细页面，并传递 task_id
    });
  },

  onPullDownRefresh(){
    this.getTaskList();
  },

});