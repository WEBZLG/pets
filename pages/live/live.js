// pages/live/live.js
const API = require('../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    content:[],
  },
  // 获取直播列表
  getData(){
    API.liveList({}).then(res=>{
      this.setData({
        dataList:res.data.room_info
      })
    })
  },
  // 观看直播
  goTv(e){
    let roomId = e.currentTarget.dataset.roomid
    console.log(roomId)
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 3 })) 
    wx.navigateTo({
        // url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
    })
  },
  // 往期直播列表
  getList(page) {
    let _this = this
    API.teachingList({
      menu_id: 12,
      page: page,
      page_size: 15
    }).then(res => {
      if(page>1){
        if(res.data.total==0){
          wx.showToast({
            title: '无更多数据',
          })
          _this.setData({
            page:_this.data.page-1
          })
        }
        _this.setData({
          content: _this.data.content.concat(res.data.contents) 
        })
      }else{
        _this.setData({
          content: res.data.contents
        })
      }
    })
  },

  // 往期直播详情
  onDetail(e){
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../oldLive/oldLive?id='+id+'&title='+title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    this.getList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    let code =  wx.getStorageSync('userInfo').p_code;
    if(code==undefined){
      code=''
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '名师起名',
      path: '/pages/home/home?p='+code
    }
  },
  onShareTimeline(res){
    let code =  wx.getStorageSync('userInfo').p_code;
    if(code==undefined){
      code=""
    }
    return {
      title: '名师起名',
      query: {
        p: code
      },
    }
  }
})