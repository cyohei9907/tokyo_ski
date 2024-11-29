const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nick_name: '',
  },
  onLoad(options) {
    // this.setData({});
    // 使用测试用户
    
  },
  // 点击头像时出发操作
  onChooseAvatar(e) {
    const filePath = e.detail.avatarUrl;
    wx.showLoading({
      title: '请稍作等待',
    });
    console.log("start upload");
    let cloudPath = 'userIcon/' + new Date().getTime().toString();
    wx.cloud.uploadFile({
      cloudPath: cloudPath, // 设置云存储路径
      filePath: filePath, // 获取文件内容
    })
    .then(res=>{
      console.log(res);
      this.setData({
        avatarUrl:res.fileID
      });
      wx.hideLoading();
    })
  },
  submitForm(e) {
    const iconUrl = this.data.avatarUrl;
    const nickName = e.detail.value.nickname;
    console.log('nickName:',nickName);
    //昵称Check
    if (!nickName) {
      wx.showToast({
        title: '昵称为必填项',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    //头像Check
    if (!iconUrl.startsWith('cloud://')) {
      wx.showToast({
        title: '请点击头像',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        user_icon:iconUrl,
        nick_name:nickName,
        type: 'user_insert'
      }
    }).then(resp=> {
      console.log('this user:',resp);
      getApp().globalData.user_info = resp.result.current_user_info.data[0];
      wx.setStorageSync('user_info', resp.result.current_user_info.data[0]);
    
      wx.hideLoading();
      wx.navigateBack({
        delta: 100 // 返回的页面数，如果是1则返回上一页面，如果是2则返回上上一个页面，以此类推。
      });
   })
   .catch((e) => {
      console.log('e：',e);
      wx.hideLoading();
   });
  },
  create_test_user(){
    wx.showToast({
      title: '假登录成功',
      icon: 'none',
      duration: 2000
    });
    getApp().globalData.user_info = {
      create_time: "2024-11-16T21:53:11.716Z",
      is_active: true,
      nick_name: "Cyo",
      open_id: "oyIz-47_2Mzhxdjj0IB5Ay6Ep-Ds",
      user_icon: "cloud://dev-env_Id.6465-dev-env_Id-1259275818/userIcon/1731793984989",
      _id: "af3da5c867391447016d776034303e3a"
    }
    wx.setStorageSync('user_info', {
      create_time: "2024-11-16T21:53:11.716Z",
      is_active: true,
      nick_name: "Cyo",
      open_id: "oyIz-47_2Mzhxdjj0IB5Ay6Ep-Ds",
      user_icon: "cloud://dev-env_Id.6465-dev-env_Id-1259275818/userIcon/1731793984989",
      _id: "af3da5c867391447016d776034303e3a"
    });
  }
})