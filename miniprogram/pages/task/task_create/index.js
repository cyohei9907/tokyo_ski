// pages/createTask/createTask.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form_data: {}, // 修改 form_data -> form_data
    user_info: {}, // 修改 user_info -> user_info
    is_wp_type: false, // 修改 isWPType -> is_wp_type
    is_date_selected: false, // 修改 is_date_selected -> is_date_selected
    is_ticket_num_selected: false, // 修改 is_ticket_num_selected -> is_ticket_num_selected
    ticket_num: '', // 修改 ticket_num -> ticket_num
    data_num_list: [], // 修改 dateNumList -> data_num_list
    qr_code_cloud_src: '', // 修改 qr_code_src -> qr_code_cloud_src
    pending: false,
    start_date: '开始日期', // 默认起始时间
    end_date: '结束日期', // 默认结束时间
    is_full_screen: false, // 修改 is_full_screen -> is_full_screen
    default_schedule_img_src: '/images/icon/plus-circle-dotted.svg', // 修改 defaultScheduleImgSrc -> default_schedule_img_src
    wp_schedule_title_list: [], // 修改 WP_ScheduleTitleList -> wp_schedule_title_list
    wp_schedule_row_list: [], // 修改 WP_ScheduleRowList -> wp_schedule_row_list
    schedule_row_list: [], // 修改 ScheduleRowList -> schedule_row_list
    display_image_array:[], //民宿等展示图
    price_form: '', // 修改 priceForm -> price_form
    show_price_book_flag: false, // 修改 showPriceBookFlag -> show_price_book_flag
    is_loading: false, // 修改 is_loading -> is_loading
    is_submit: false, // 是否上传
    is_floating_image_visible: false, // 控制浮窗是否可见
    floating_display_image_src: '', // 浮窗显示的图片路径
    task_type: '',
    title:''
  },

  onLoad: function (options) {
    this.connect_llm();
    // 设定当前页面type
    this.setData({
      task_type: options?.task_type
    })
    if(!this.data.task_type){
      wx.navigateBack({
        delta: 100 // 返回的页面数，如果是1则返回上一页面，如果是2则返回上上一个页面，以此类推。
      });
    }
    
    // 设定当前画面标签
    this.setTitle(); 

    if (getApp().globalData.user_info) { // 修改 user_info -> user_info
      this.setData({
        user_info: getApp().globalData.user_info
      });
      console.log(getApp().globalData.user_info);
      console.log(this.data.user_info);
    }
  },
  connect_llm(){
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        type: 'llm'
      }
    }).then(r=>{
      console.log('this is llm',r);
    }).catch(e=>{
      console.log(e);
    })
  },
  direcrToHome:function(e){
    wx.navigateBack({
      delta: 100
    });
  },
  setTitle(){
    if(!this.data.task_type) this.direcrToHome()
    if (this.data.task_type === 'wp') {
      this.setData({ title: '拼票' });
    } else if (this.data.task_type === 'car') {
      this.setData({ title: '拼车' });
    } else if (this.data.task_type === 'homestay') {
      this.setData({ title: '民宿' });
    } else if (this.data.task_type === 'equipment') {
      this.setData({ title: '装备' });
    } else if (this.data.task_type === 'ticket') {
      this.setData({ title: '雪票' });
    } else if (this.data.task_type === 'coach') {
      this.setData({ title: '教练' });
    }
  },
  bindDateChange: function (e) {
    this.setData({
      start_date: e.detail.value,
    });
    if ((this.data.start_date && this.data.start_date != '开始日期') &&
      (this.data.end_date && this.data.end_date != '结束日期')) {
      this.setData({
        is_date_selected: true, // 修改 is_date_selected -> is_date_selected
      });
    } else {
      this.setData({
        is_date_selected: false, // 修改 is_date_selected -> is_date_selected
      });
    }
    // 设置时间计划表
    this.setSchedule();
  },
  bindDateChange2: function (e) {
    this.setData({
      end_date: e.detail.value,
    });
    if ((this.data.start_date && this.data.start_date != '开始日期') &&
      (this.data.end_date && this.data.end_date != '结束日期')) {
      this.setData({
        is_date_selected: true, // 修改 is_date_selected -> is_date_selected
      });
    } else {
      this.setData({
        is_date_selected: false, // 修改 is_date_selected -> is_date_selected
      });
    }
    // 设置时间计划表
    this.setSchedule();
  },
  change_ticket_num: function (event) {
    if (event.detail.value) {
      this.data.ticket_num = event.detail.value; // 修改 ticket_num -> ticket_num
      this.setData({
        is_ticket_num_selected: true
      }); // 修改 is_ticket_num_selected -> is_ticket_num_selected
    } else {
      this.setData({
        is_ticket_num_selected: false
      }); // 修改 is_ticket_num_selected -> is_ticket_num_selected
    }
    // 设置时间计划表
    this.setSchedule();
  },

  submitForm: function (e) {
    const that = this;
    if (that.data.is_loading) return
    that.setData({is_loading: true});
    that.form_data = e.detail.value;
    console.log(that.form_data);
    //标题check
    if (!that.form_data.task_title) {
      wx.showToast({
        title: '标题为必填项',
        icon: 'none',
        duration: 2000
      });
      that.setData({is_loading: false});
      return;
    }
    //标题check
    if (!that.data.qr_code_cloud_src) {
      wx.showToast({
        title: '联系用二维码为必填项',
        icon: 'none',
        duration: 2000
      });
      that.setData({is_loading: false});
      return;
    }

    // 初期创建者用户添加到参与用户中
    let participating_users = []
    participating_users.push(that.data.user_info);
    // 提交表单数据
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        task_title:that.form_data.task_title,
        description:that.form_data.description,
        ticket_num:that.form_data.ticket_num,
        start_date: that.data.start_date,               //开始日期
        end_date: that.data.end_date,                   //结束日期
        create_user_id: that.data.user_info._id,
        create_user_name: that.data.user_info.nick_name, //用户名设定
        create_user_icon: that.data.user_info.user_icon, //用户头像设定
        qr_code_cloud_src: that.data.qr_code_cloud_src,
        task_type:that.data.task_type,                 //用户
        participating_users:participating_users,
        display_image_array:that.data.display_image_array,

        type: 'task_insert'
      },
      success: function (res) {
        that.setData({
          is_loading: false
        })
        //用户依赖状况更新
        // that.updateUserTicket(res.result.data._id);
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              // 跳转到detail页面
              wx.reLaunch({
                url: '/pages/task/task_detail/index?_id=' + res.result.data._id
              })
            }, 2000);
          }
        });
      },
      fail: function (err) {
        that.setData({
          is_loading: false
        })
        console.log(err)
        wx.showToast({
          title: '创建失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  chooseDisplayImage(){
    const that = this;
    wx.chooseMedia({
      count: 1, // 默认9，设置为1表示只能选择一张图片
      mediaType: ['image'], // 选择媒体类型为图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表
        that.uploadDisplayImage(res.tempFiles[0].tempFilePath);
      }
    });
  },
  //上传图片
  uploadDisplayImage: function (filePath) {
    wx.showLoading({
      title: '图片上传中',
    });
    const that = this;
    console.log("start upload");
    let match = filePath.match(/\.\w+$/);
    let cloudPath = 'display_image/' + new Date().getTime().toString() + (match ? match[0] : '');
    console.log(filePath);
    console.log(cloudPath);
    wx.cloud.uploadFile({
        cloudPath: cloudPath, // 设置云存储路径
        filePath: filePath, // 获取文件内容
      })
      .then(res => {
        console.log(res);
        let display_image_array = that.data.display_image_array;
        display_image_array.push(res.fileID);
        that.setData({
          display_image_array: display_image_array
        });
        wx.hideLoading();
      })
  },
  // 点击图片列表中的图片
  onDisplayImageClick(event) {
    const src = event.currentTarget.dataset.src; // 获取点击图片的路径
    this.setData({
      floating_display_image_src: src,
      is_floating_image_visible: true
    });
  },
  // 点击浮窗隐藏图片
  hideFloatingDisplayImage() {
    this.setData({
      is_floating_image_visible: false,
      floating_display_image_src: ''
    });
  },
  //选择QR Code图片
  chooseImage: function () {
    const that = this;
    wx.chooseMedia({
      count: 1, // 默认9，设置为1表示只能选择一张图片
      mediaType: ['image'], // 选择媒体类型为图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表
        that.uploadImage(res.tempFiles[0].tempFilePath);
      }
    });
  },
  //图片是否全屏
  toggleImageSize: function () {
    this.setData({
      is_full_screen: !this.data.is_full_screen // 切换状态
    });
  },
  //上传图片
  uploadImage: function (filePath) {
    wx.showLoading({
      title: '图片上传中',
    });
    const that = this;
    console.log("start upload");
    let match = filePath.match(/\.\w+$/);
    let cloudPath = 'qr_code/' + new Date().getTime().toString() + (match ? match[0] : '');
    console.log(filePath);
    console.log(cloudPath);
    wx.cloud.uploadFile({
        cloudPath: cloudPath, // 设置云存储路径
        filePath: filePath, // 获取文件内容
      })
      .then(res => {
        console.log(res);
        that.setData({
          qr_code_cloud_src: res.fileID
        });
        wx.hideLoading();
      })
  },
  checkWPType: function (event) {
    this.setData({
      isWPType: event.detail.value
    });
    //设置时间表
    this.setSchedule();
  },
  checkNeedShowPrice(event) {
    console.log(event.detail.value);
    let showPriceForm = event.detail.value;
    if (showPriceForm) {
      this.setPriceBook();
    }
  },
  setPriceSchedule() {
    console.log('start show price book')
  },
  setSchedule() {
    //初期化开始结束时间
    let temp_start_date = new Date(this.data.start_date);
    let temp_end_date = new Date(this.data.end_date);
    if (this.data.is_ticket_num_selected && this.data.is_date_selected && this.data.isWPType) {
      //
      this.setData({
        ScheduleRowList: ""
      });
      //WP票情况下进行schedule
      let temp_WP_ScheduleTitleList = [];
      let temp_WP_ScheduleRowList = [];
      //相差最大10天 设定日期
      for (let i = 0; i < 10; i++) {
        temp_WP_ScheduleTitleList.push({
          date: temp_start_date.getFullYear() + '-' + temp_start_date.getMonth() + '-' + temp_start_date.getDate(),
          position: temp_start_date.getDate() + '日'
        });

        if (temp_start_date.getDate() == temp_end_date.getDate()) break;

        temp_start_date.setDate(temp_start_date.getDate() + 1);
      }
      //设定票数
      for (let i = 0; i < temp_WP_ScheduleTitleList.length; i++) {
        let row = [];
        for (let j = 0; j < this.data.ticket_num; j++) {
          let position = temp_WP_ScheduleTitleList[i].position + '-' + j;
          let colContent = {
            position: position,
            date: temp_WP_ScheduleTitleList[i].date,
            openId: '',
            iconUrl: this.data.defaultScheduleImgSrc
          };
          row.push(colContent);
        }
        temp_WP_ScheduleRowList.push(row);
      }
      this.setData({
        WP_ScheduleTitleList: temp_WP_ScheduleTitleList,
        WP_ScheduleRowList: temp_WP_ScheduleRowList
      });
      console.log('WP_ScheduleTitleList', this.data.WP_ScheduleTitleList);
    } else if (this.data.is_ticket_num_selected && this.data.is_date_selected && !this.data.isWPType) {
      //
      this.setData({
        WP_ScheduleTitleList: "",
        WP_ScheduleRowList: ""
      });
      //非WP票情况下进行schedule
      let temp_ScheduleRowList = [];
      let dateList = [];
      //相差最大10天 设定日期
      for (let i = 0; i < 10; i++) {
        dateList.push(temp_start_date.getFullYear() + '-' + temp_start_date.getMonth() + '-' + temp_start_date.getDate());
        if (temp_start_date.getDate() == temp_end_date.getDate()) break;
        temp_start_date.setDate(temp_start_date.getDate() + 1);
      }
      for (let i = 0; i < this.data.ticket_num; i++) {
        temp_ScheduleRowList.push({
          position: i,
          openId: '',
          date: dateList,
          iconUrl: this.data.defaultScheduleImgSrc
        });
      }
      this.setData({
        ScheduleRowList: temp_ScheduleRowList
      });
    } else {
      this.setData({
        ScheduleRowList: "",
        WP_ScheduleTitleList: "",
        WP_ScheduleRowList: ""
      });
    }
  },
  //WP票用户逻辑
  updateWPUserPosition: function (event) {
    console.log('updateWPUserPosition');
    const position = event.currentTarget.dataset.position;
    const temp_row_list = this.data.WP_ScheduleRowList;
    for (let i = 0; i < temp_row_list.length; i++) {
      for (let j = 0; j < temp_row_list[i].length; j++) {
        if (temp_row_list[i][j].position == position) {
          if (temp_row_list[i][j].openId == '') {
            temp_row_list[i][j].openId = this.data.user_info.openId;
            temp_row_list[i][j].iconUrl = this.data.user_info.UserIcon;
          } else if (temp_row_list[i][j].openId != '') {
            temp_row_list[i][j].openId = '';
            temp_row_list[i][j].iconUrl = this.data.defaultScheduleImgSrc;
          }
        }
      }
    }
    this.setData({
      WP_ScheduleRowList: temp_row_list
    });
  },
  //非WP票用户tap动作
  updateUserPosition: function (event) {
    const position = event.currentTarget.dataset.position;
    const temp_list = this.data.ScheduleRowList;
    for (let i = 0; i < temp_list.length; i++) {
      if (temp_list[i].position == position) {
        if (temp_list[i].openId == '') {
          temp_list[i].openId = this.data.user_info.openId;
          temp_list[i].iconUrl = this.data.user_info.UserIcon;
        } else if (temp_list[i].openId != '') {
          temp_list[i].openId = '';
          temp_list[i].iconUrl = this.data.defaultScheduleImgSrc;
        }
      }
    }
    this.setData({
      ScheduleRowList: temp_list
    });
  },
  priceChangeHandle(e) {
    const position = e.target.dataset.position;
    console.log(e.target);
    let price = e.detail.value;
    let temp_wp_scheduleTitleList = this.data.WP_ScheduleTitleList;
    for (let i = 0; i < temp_wp_scheduleTitleList.length; i++) {
      if (temp_wp_scheduleTitleList[i].position == position) {
        temp_wp_scheduleTitleList[i].price = price;
      }
    }
    this.setData({
      WP_ScheduleTitleList: temp_wp_scheduleTitleList
    });
    console.log(this.data.WP_ScheduleTitleList);
  },
  updateUserTicket: function (activeId) {
    console.log('activeId:' + activeId);
    let updateUserMap = new Map();
    if (this.data.isWPType) {
      let tempdata = this.data.WP_ScheduleRowList;
      for (let i = 0; i < tempdata.length; i++) {
        for (let j = 0; j < tempdata[i].length; j++) {
          if (tempdata[i][j].openId) {
            if (updateUserMap.has(tempdata[i][j].openId)) {
              console.log('tempdata[i][j] length', tempdata[i][j]);
              let dateSetValue = updateUserMap.get(tempdata[i][j].openId);
              dateSetValue.add(tempdata[i][j].date);
              updateUserMap.set(tempdata[i][j].openId, dateSetValue);
            } else {
              console.log('tempdata[i][j] length new ', tempdata[i][j]);
              let tempDateSet = new Set();
              tempDateSet.add(tempdata[i][j].date);
              updateUserMap.set(tempdata[i][j].openId, tempDateSet)
            }
          }
        }
      }
    } else {
      let tempdata = this.data.ScheduleRowList;
      for (let j = 0; j < tempdata.length; j++) {
        if (tempdata.openId != '') {
          updateUserMap.set(tempdata[i][j].openId, tempdata[i][j].date);
        }
      }
    }
    console.log('updateUserMap:');
    console.log(updateUserMap);
    if (updateUserMap.size > 0) {
      wx.cloud.callFunction({
          name: 'snowTeamCloudFunction',
          data: {
            activeId: activeId,
            userMap: updateUserMap,
            type: 'updateUserRelationToActive'
          }
        })
        .then(res => {
          console.log(res);
        })
    }
  },

  // Task 类定义
  Task(id, task_title, description, status, create_user, create_user_icon, create_time, start_date, end_date, task_type, participating_users) {
    this.id = id;
    this.task_title = task_title;
    this.description = description;
    this.status = status;
    this.ticket_num = ticket_num;
    this.create_user_id = create_user_id;
    this.create_user_name = create_user_name;
    this.create_user_icon = create_user_icon;
    this.create_time = create_time;
    this.start_date = start_date;
    this.end_date = end_date;
    this.task_type = task_type;
    this.participating_users = participating_users;
  }
});