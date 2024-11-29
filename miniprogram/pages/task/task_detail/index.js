// pages/task/task_detail/index.js
Page({

  data: {
    task_id:'',
    record:{},
    create_time:'',        //格式化后创建时间
    start_date:'',       //格式化后开始日期
    end_date:'',         //格式化后结束日期
    user_info:{},
    openId:'',
    nick_name:'',
    avatar_url:'',
    is_owner:false,
    is_join:false,
    isFullScreen:false,
    is_edit:false,
    is_ending:false,
    is_floating_qrcode_image_visible:false,
    is_share:false,       //正在分享的时候，将button隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options);
    //设定用户初始数据
    if(!getApp().globalData.user_info)
    {
      wx.redirectTo({
        url: '/pages/profile/profile_create/index',
      })
    }
    else
    {
      this.setData({user_info:getApp().globalData.user_info});
    }

    if(options)
    {
      wx.showLoading({
        title: '数据获取中',
      });
      // 获取
      wx.cloud.callFunction({
        name: 'snowTeamCloudFunction',
        data: {
          _id:options._id,                    // 将 type 传递给云函数，这里是一个示例值
          type: 'task_select',                // 查询的函数类
          method: 'get_task_by_id',            // 查询的函数名
        }
      }).then(res => {
        console.log(res);
        this.setData({task_id:options._id});
        this.setData({record:res.result.data[0]});
        this.initOtherData();
        // 判断是否是所有者
        const user_id = this.data.user_info._id;
        if(this.data.record.create_user_id == user_id)
        {
          this.setData({is_owner: true })
        }
        // 判断是否是参与者
        const participating_users = this.data.record.participating_users;
        participating_users.forEach(item=>{
          if(item._id == user_id) this.setData({is_join:true})
        })
        wx.hideLoading();
      }).catch(err => {
        console.error("查询失败:", err);
        wx.hideLoading();
      });
    }
  },
  // 加入活动
  join_task:async function(){
    let that = this;
    if(!this.data.user_info)
    {
      // 未登录状态下，请求用户信息
      wx.navigateTo({
        url: '/pages/profile/profile_create/index' // 创建活动画面
      });
      return ;
    }
    let record = this.data.record;

    let is_exist = false
    record.participating_users.forEach(item=>{ if(item._id == this.data.user_info._id) is_exist=true})
    if(is_exist) return ;

    record.participating_users.push(this.data.user_info)
    this.setData({'record.participating_users': record.participating_users})
    this.setData({is_join: true});
    const new_record = {...record }
    delete new_record._id;
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        _id: record._id,
        record: new_record,
        type: 'task_update',
        method: 'get_task_by_id',
      }
    }).then(res=>{
      console.log(res);
      if(res.result.success)
      {
        wx.showToast({
          title: '参加成功',
          icon: 'none',
          duration: 2000
        });
        // that.update_users_task('join');
        that.onLoad({_id:record._id});
      }
    })
  },
  // 退出活动
  exit_task:async function(){
    let that = this;
    if(!this.data.user_info)
    {
      // 未登录状态下，请求用户信息
      wx.navigateTo({
        url: '/pages/profile/profile_create/index' // 创建活动画面
      });
      return ;
    }
    let record = this.data.record;
    record.participating_users = record.participating_users.filter(user => user._id !== this.data.user_info._id);
    this.setData({'record.participating_users': record.participating_users})
    this.setData({is_join: false});
    const new_record = {...record }
    delete new_record._id
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        _id: record._id,
        record:new_record,
        type: 'task_update',
        method: 'update_task_record',
      }
    }).then(res=>{
      console.log(res);
      if(res.result.success)
      {
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        });
      }
      // that.update_users_task('exit');
      that.onLoad({_id:record._id});
    })
  },
  update_users_task(option){
    const that = this;
    const record = that.data.user_info;
    const new_record = {...record}
    if (!new_record || !new_record.join_tasks) {
      new_record.join_tasks = [];
    }
    if(option=='join'){
      new_record.join_tasks.push({  task_title:that.data.record.task_title, 
                                    task_id:that.data.record._id})
    }else if (option == 'exit'){
      new_record.join_tasks = new_record.join_tasks.filter(item => item.task_id !== this.data.record._id);
    }
    delete new_record._id;
    wx.cloud.callFunction({
      name: 'snowTeamCloudFunction',
      data: {
        _id: record._id,
        record: new_record,
        type: 'user_update',
        method: 'update_users_task',
      }
    }).then(res=>{
      console.log(res);
    })
  },
  // 点击Qrcode小图
  onQRCodeImageClick() {
    this.setData({
      is_floating_qrcode_image_visible: true
    });
  },
  // 点击Qrcode浮窗隐藏图片
  hideFloatingQRCodeImage() {
    this.setData({
      is_floating_qrcode_image_visible: false,
    });
  },
  // 点击展示图片列表中的图片
  onDisplayImageClick(event) {
    const src = event.currentTarget.dataset.src; // 获取点击图片的路径
    this.setData({
      floating_display_image_src: src,
      is_floating_image_visible: true
    });
  },
  // 点击展示浮窗隐藏图片
  hideFloatingDisplayImage() {
    this.setData({
      is_floating_image_visible: false,
      floating_display_image_src: ''
    });
  },
  //在取得数据后进行时间等其他数据的格式化
  initOtherData:function()
  {
    const start_date = this.formartDateTime(this.data.record.start_date);
    const end_date = this.formartDateTime(this.data.record.end_date);
    const create_time = this.formartDateTime(this.data.record.create_time,'create_time');
    // 画面禁止操作flag
    if(this.data.record.is_active == false || new Date(this.data.record.end_date).getTime() < new Date().getTime()){
      this.setData({isEnding: true})
    }
    this.setData({create_time:create_time,start_date:start_date,end_date:end_date});
  },
  //时间格式化
  formartDateTime:function(time,type){
        //创建时间
        const d = new Date(time);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        let result = `${year}年${month}月${day}日`;
        //包含时分的情况下
        if(type== 'create_time' ){
          const hour = d.getHours().toString().padStart(2, '0');
          const minute = d.getMinutes().toString().padStart(2, '0');
          result = `${year}年${month}月${day}日 ${hour}时 ${minute}分`;
        }
        return result;
  },
  // //WP票用户添加逻辑
  // updateWPUserPosition:async function(event) {
  //   if(!getApp().globalData.user_info)
  //   {
  //     // 未登录状态下，请求用户信息
  //     wx.navigateTo({
  //       url: '/pages/profile_create/index' // 创建活动画面
  //     });
  //   }
  //   const position = event.currentTarget.dataset.position;
  //   const temp_row_list = this.data.record.WP_ScheduleRowList;
  //   for(let i=0; i<temp_row_list.length; i++)
  //   {
  //     for(let j=0; j<temp_row_list[i].length; j++)
  //     {
  //       if(temp_row_list[i][j].position == position)
  //       {
  //         if(temp_row_list[i][j].openId == '')
  //         {
  //           temp_row_list[i][j].openId = getApp().globalData.user_info.openId;
  //           temp_row_list[i][j].iconUrl = getApp().globalData.user_info.UserIcon;
  //         }
  //         else if(temp_row_list[i][j].openId != ''
  //                   && (getApp().globalData.user_info.openId == this.data.record.create_user_id 
  //                         || temp_row_list[i][j].openId == getApp().globalData.user_info.openId)
  //                       )
  //         {
  //           temp_row_list[i][j].openId = '';
  //           temp_row_list[i][j].iconUrl = this.data.defaultScheduleImgSrc;
  //         }
  //       }
  //     }
  //   }
  //   this.setData({'record.WP_ScheduleRowList': temp_row_list});
  // },
  // //非WP票用户添加逻辑
  //  updateUserPosition: async function (event) {
  //   if(!getApp().globalData.user_info)
  //   {
  //     // 未登录状态下，请求用户信息
  //     wx.navigateTo({
  //       url: '/pages/profile/profile_create/index' // 创建活动画面
  //     });
  //   }

  //   const position = event.currentTarget.dataset.position;
  //   const temp_list = this.data.record.ScheduleRowList;
  //   for(let i=0; i<temp_list.length; i++){
  //     if(temp_list[i].position == position)
  //     {
  //       if(temp_list[i].openId == '')
  //       {
  //         temp_list[i].openId = getApp().globalData.user_info.openId;
  //         temp_list[i].iconUrl = getApp().globalData.user_info.UserIcon;
  //       }
  //       else if(temp_list[i].openId != '' && temp_list[i].openId == getApp().globalData.user_info.openId)
  //       {
  //         temp_list[i].openId = '';
  //         temp_list[i].iconUrl = this.data.defaultScheduleImgSrc;
  //       }
  //     }
  //   }
  //   this.setData({'record.ScheduleRowList':temp_list});
  // },
  // 执行刷新操作，例如重新加载数据
  onPullDownRefresh: async function() {
    wx.showLoading({
      title: '刷新中',
    });
    this.onLoad({_id:this.data.task_id});
    // 数据请求完成后，调用 wx.stopPullDownRefresh 停止下拉刷新
    wx.stopPullDownRefresh();
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  },

  delete_task: async function(){
    const task_id = this.data.task_id;
    const updateRecord = {...this.data.record};
    delete updateRecord._id;
    updateRecord.is_active = false;
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '你确定要删除这条记录吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          });
          wx.cloud.callFunction({
            name: 'snowTeamCloudFunction',
            data: {
              _id: task_id,
              record:updateRecord,

              type: 'task_update',
              method: 'update_task_record',
            }
          }).then(res=>{
            console.log(res);
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000
            });
            that.onLoad({_id:that.data.task_id});
          }).catch(e=>{
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            });
            that.onLoad({_id:that.data.task_id});
          })
         
        } else if (res.cancel) {
          console.log('用户点击取消');
          // 用户取消操作，不执行删除
        }
      }
    });
  },
  // 跳转至创建活动画面
  goToCreateActive:function(){
    if(getApp().globalData.user_info != null && getApp().globalData.user_info.NickName) 
    {
      //已登录状态下直接跳转到创建活动画面
      wx.navigateTo({
        url: '/pages/createActivePage/index' // 创建活动画面
      });
    }
    else
    {
      // 未登录状态下，请求用户信息
      wx.navigateTo({
        url: '/pages/createProfile/index' // 创建活动画面
      });
    }
  },
  //画面编辑状态
  editActive(){
    this.setData({is_edit:true});
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  uploadNewImage()
  {
    const that = this
    wx.chooseMedia({
      count: 1, // 默认9，设置为1表示只能选择一张图片
      mediaType: ['image'], // 选择媒体类型为图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表
        that.uploadImage(res.tempFiles[0].tempFilePath);
      }
    });
  },
  uploadImage(filePath) {
    const updateRecord = this.data.record;
    wx.showLoading({
      title: '图片上传中',
    });
    console.log("start upload");
    let match = filePath.match(/\.\w+$/);
    let cloudPath = 'qr_code/' + new Date().getTime().toString() + (match ? match[0] : '');
    console.log(filePath);
    console.log(cloudPath);
    wx.cloud.uploadFile({
      cloudPath: cloudPath, // 设置云存储路径
      filePath: filePath, // 获取文件内容
    })
    .then(res=>{
      updateRecord.qr_code_cloud_src = res.fileID;
      this.setData({'record.qr_code_cloud_src':res.fileID});
      wx.cloud.callFunction({
        name: 'snowTeamCloudFunction',
        data: {
          _id: updateRecord._id,
          record:updateRecord,

          type: 'task_update',
          method: 'update_task_record',
        }
      }).then(res=>{
        console.log(res);
        wx.showToast({
          title: '二维码更新成功',
          icon: 'none',
          duration: 2000
        });
        wx.hideLoading();
      }).catch(e=>{
        wx.showToast({
          title: '二维码更新失败',
          icon: 'none',
          duration: 2000
        });
        wx.hideLoading();
      })
      wx.hideLoading();
    })
  },
  changedescription(e){
    this.setData({'record.description':e.detail.value});
  },
  changetask_title(e){
    this.setData({'record.task_title':e.detail.value});
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 设置 is_share 为 true，隐藏按钮
    this.setData({is_share:true});

    // 在分享完成后恢复按钮显示
    setTimeout(() => {
      this.setData({is_share:false});
    }, 2000); // 延迟恢复按钮显示，确保分享已完成
    return {
      title: this.data.record.task_title,
      path: '/pages/task/task_detail/index?_id='+this.data.task_id, // 分享路径
    };
  },
  Task(_id, name, description, status, create_user, create_user_icon, create_time, start_date, end_date, task_type, participating_users) {
    this._id = _id;
    this.name = name;
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
})