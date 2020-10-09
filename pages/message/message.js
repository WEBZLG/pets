// pages/sysMessage/sysMessage.js
const API = require('../../utils/api');
// const AREA = require('../../utils/area');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    dataList: []
  },
  // 获取列表
  getList() {
    let _this = this
    API.sysMessage({}).then(res => {
      _this.setData({
        dataList: res.data.messages
      })
      // if(page==1){
      //   _this.setData({
      //     dataList:res.data.contents
      //   })
      // }else{
      //   if(res.data.contents.length==0){
      //     _this.setData({
      //       page:_this.data.page-1
      //     })
      //     wx.showToast({
      //       title: '无更多数据了~',
      //       iocn:"none"
      //     })
      //   }else{
      //     _this.setData({
      //       dataList:_this.concat(res.data.contents)
      //     })
      //   }
      // }
    })
  },
  // 查看详情
  onDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sysDetail/sysDetail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let id = options.id
    // this.setData({
    //   id: id
    // })

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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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
    // let id = this.data.id
    // this.setData({
    //   page: 1
    // })
    // this.getList(id, 1)
    this.getList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   let _this = this
  //   let id = this.data.id
  //   this.setData({
  //     page: _this.data.page * 1 + 1
  //   })
  //   this.getList(id, _this.data.page)
  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})