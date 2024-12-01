Page({
  data: {
    searchText: '', // 用户输入的搜索关键词
  },

  // 捕获输入框内容
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value,
    });
  },

  // 点击搜索按钮
  onSearch() {
    const { searchText } = this.data;

    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
      });
      return;
    }

    wx.showToast({
      title: `搜索：${searchText}`,
      icon: 'success',
    });

    // TODO: 在此处处理实际的搜索逻辑
    console.log('搜索关键词:', searchText);
  },
});
