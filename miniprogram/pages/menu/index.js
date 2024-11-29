
const current_announcement_version = '0.0.1';
Page({
  data:{
    wp_count:0,
    car_count:0,
    homestay_count:0,
    equipment_count:0,
    ticket_count:0,
    coach_count:0,
    showPopup: false, // 控制弹窗显示

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.test_llm();
    // 进行初期检索
    this.init_search();

    // 进行公告展示
    let announce = wx.getStorageSync('announcement—version');
    if(announce != current_announcement_version){
      this.setData({ showPopup: true });
    }
  },

  toTaskPage (e){
      console.log(e.currentTarget.dataset.searchactivetype);
      let searchactivetype = e.currentTarget.dataset.searchactivetype;
      // wx.setStorageSync('searchactivetype', parameter);
      //跳转到WP票画面
      wx.navigateTo({
        url: `/pages/task/index?task_type=${searchactivetype}`, // 创建活动画面
      });
  },
  // 查询各种票数
  init_search(){
    const that = this;
    console.log('load 统计')
    wx.showLoading({
      title: '活动统计中',
    });
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        type: 'task_select',                 // 查询的函数类
        method: 'get_task_count',            // 查询的函数名
      }
    }).then(res => {
      that.init_data_count(res);
      wx.hideLoading();
    }).catch(err => {
      console.error("查询失败:", err);
      wx.hideLoading();
    });
  },
  init_data_count(res){
    console.log();
    this.setData(res.result.data);
  },
  onPullDownRefresh(){
    this.onLoad();
  },
  onShareAppMessage() {
    return {
      title: '滑雪组团小助手',
      path: '/pages/menu/index', 
    };
  },
  showPopup() {
    this.setData({ showPopup: true });
    wx.setStorageSync('announcement—version',current_announcement_version);
  },
  handlePopupClose() {
    console.log('弹窗已关闭');
    this.setData({ showPopup: false });
    wx.setStorageSync('announcement—version',current_announcement_version);
  },
  async test_llm(){
    
  }

})