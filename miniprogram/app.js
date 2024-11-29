// app.js
App({
  globalData: {
    user_info:'',
    open_id:''
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'dev-env_Id',
      traceUser: true,
    });
    //  检查用户登录状态
    this.checkUserIsRegist();

  },
  // 画面初期化如果用户未注册，则注册
  checkUserIsRegist() {
    const user_info = wx.getStorageSync('user_info');
    if(!user_info){
      this.login();
    }else{
      this.globalData.user_info = wx.getStorageSync('user_info');
    }
  },
  // 跳转到用户认证页面
  login() {
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        type: 'user_select',                // 查询的函数类
      }
    })
    .then(r=>{
      console.log(r);
      let result = r.result.selectResult.data[0];
      if(!result._id){
        wx.navigateTo({
          url: '/pages/profile/profile_create/index'
        });
      }
      this.globalData.user_info = result;
      wx.setStorageSync('user_info', result);
    })
    .catch(e=>{
      console.log(e);
      wx.navigateTo({
        url: '/pages/profile/profile_create/index'
      });
    })
  },

});
