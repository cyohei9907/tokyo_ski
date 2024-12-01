// components/announcement-text/announcement-text.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isQRCodeVisible: false, // 控制二维码弹窗显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示二维码
    showQRCode() {
      this.setData({
        isQRCodeVisible: true,
      });
    },

    // 隐藏二维码
    hideQRCode() {
      this.setData({
        isQRCodeVisible: false,
      });
    },
  }
})