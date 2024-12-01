// components/announcement-swiper/announcement-swiper.js
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
    swiperCurrent: 0,//当前所在页面的 index
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔,3s
    duration: 1000, //滑动动画时长1s
    circular: true, //是否采用衔接滑动
    imgUrls: [//图片路径(可以是本地路径，也可以是图片链接)
      '/components/announcement-swiper/imgsource/01.jpg',
      '/components/announcement-swiper/imgsource/02.jpg',
      '/components/announcement-swiper/imgsource/03.jpg',
      '/components/announcement-swiper/imgsource/04.jpg',
    ],
    links: [//点击图片之后跳转的路径
      '../personal/personal',
      '../personal/personal',
      '../personal/personal',
      '../personal/personal',
    ] 
  },

  /**
   * 组件的方法列表
   */
  methods: {
      //轮播图的切换事件
      swiperChange: function (e) {
        this.setData({
          swiperCurrent: e.detail.current
        })
      },

      //点击指示点切换事件
      chuangEvent: function (e) {
        this.setData({
          swiperCurrent: e.currentTarget.id
        })
      },

      //点击图片触发事件
      swipclick: function (e) {
        console.log(this.data.swiperCurrent);
        wx.switchTab({
          url: this.data.links[this.data.swiperCurrent]
        })
      },
  }
})