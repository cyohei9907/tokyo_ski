// pages/profile/index.js
const globalUser = getApp().globalData.user_info;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:{},
    taskList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (){
    this.setData({user_info: globalUser});

    if(!this.data.user_info?._id){
      // get currunt user or direct to create profile page
      console.log('get currunt user or direct to create profile page')
      this.getCurrentByOpenId();
    }
    else{
      this.init_data();
    }
  },
  init_data(){

  },
  getCurrentByOpenId(){
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        type: 'user_select',                // 查询的函数类
      }
    })
    .then(r=>{
      console.log(r);
      result = r.result.selectResult.data[0];
      this.setData({user_info: result});
      globalUser = result;
      if(!result._id){
        wx.redirectTo({
          url: '/pages/profile/profile_create/index',
        })
      }
    })
    .catch(e=>{
      console.log(e);
    })
  },
  // 点击任务项跳转到详细页面
  onTaskItemClick(event) {
    const taskId = event.currentTarget.dataset.id; // 获取任务的 id
    wx.navigateTo({
      url: `/pages/task/task_detail/index?_id=${taskId}` // 跳转到任务详细页面，并传递 task_id
    });
  },

})