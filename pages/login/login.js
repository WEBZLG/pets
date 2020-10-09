// pages/login.js
const API = require('../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //手机号
    password: '', //密码
  },
  //获取input输入框的值
  getPwdValue(e) {
    this.setData({
      password: e.detail
    })
  },
  getPhoneValue(e) {
    this.setData({
      phone: e.detail
    })
  },
  // 登录
  onSingIn() {
    let myreg = /^(14[0-9]|13[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    let _this = this
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            API.login({
                mobile: _this.data.phone,
                password: _this.data.password,
                wechat_code: res.code
              })
              .then(res => {
                //console.log(res)
                wx.showToast({
                  title: res.message,
                  icon: 'none'
                })
                wx.setStorageSync('loginToken', res.data.login_token);
                wx.setStorageSync('userInfo', res.data.user);
                wx.reLaunch({
                  url: '../home/home',
                })
              })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  // 跳转注册
  onRegist() {
    wx.navigateTo({
      url: '../regist/regist',
    })
  },
  // 跳转重置密码
  onResetPwd() {
    wx.navigateTo({
      url: '../resetPwd/resetPwd',
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