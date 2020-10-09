// pages/changePwd/changePwd.js
const API = require('../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: '',
    newPwd: '',
    newPwdAgain: ''
  },
  //获取input输入框的值
  getOldValue(e) {
    this.setData({
      oldPwd: e.detail
    })
  },
  getNewValue(e) {
    this.setData({
      newPwd: e.detail
    })
  },
  getNewValueAgain(e) {
    this.setData({
      newPwdAgain: e.detail
    })
  },
  onChange() {
    let _this = this
    if (this.data.oldPwd == "") {
      wx.showToast({
        title: '原始密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.newPwd == '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.newPwdAgain == '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.newPwd != this.data.newPwdAgain) {
      wx.showToast({
        title: '新密码不一致',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      API.changePwd({
          change_type: 'password',
          old_password: _this.data.oldPwd,
          new_password: _this.data.newPwd,
          new_password2: _this.data.newPwdAgain,
        })
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 3000);
        })
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})