// components/task-list/task-list.js
Component({

  lifetimes: {
    attached() {
      console.log("组件已加载到页面节点树中");
      // 初始化操作
      this.getTaskList();
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {
    method:'',
    task_type:'',
    limit:'',
  },

  /**
   * 组件的初始数据
   */
  data: {
    taskList: [], // 用于存储获取的任务列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTaskList() {
      wx.showLoading()
      const that = this;
      // 获取
      wx.cloud.callFunction({
        name: 'snowTeamCloudFunction',
        data: {
          task_type: this.properties.task_type,  // 将 type 传递给云函数，这里是一个示例值
          limit:10,
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
  
    // 点击任务项跳转到详细页面
    onTaskItemClick(event) {
      const taskId = event.currentTarget.dataset.id; // 获取任务的 id
      wx.navigateTo({
        url: `/pages/task/task_detail/index?_id=${taskId}` // 跳转到任务详细页面，并传递 task_id
      });
    },

  }
})