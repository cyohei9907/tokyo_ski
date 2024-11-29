Component({
  properties: {
    show: {
      type: Boolean,
      value: false, // 控制弹窗显示
    },
    title: {
      type: String,
      value: '公告', // 弹窗标题
    },
    message: {
      type: String,
      value: '', // 弹窗内容
    },
  },
  methods: {
    closePopup() {
      this.setData({ show: false });
      this.triggerEvent('close'); // 触发关闭事件
    },
  },
});
