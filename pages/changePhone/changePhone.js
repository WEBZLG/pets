// pages/changePhone/changePhone.js
const API = require('../../utils/api');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //old手机号
    code: '', //old验证码
    newPhone: '', //手机号
    newCode: '', //验证码
    codename: '获取验证码',
    newCodename: '获取验证码',
    disabled: false,
    newDisabled: false,
    isCheck: false
  },
  getNewPhone(e){
    this.setData({
      newPhone: e.detail
    })
  },
  getCodeValue(e){
    this.setData({
      code: e.detail
    })
  },
  getNewCodeValue(e){
    this.setData({
      newCode: e.detail
    })
  },
  //获取验证码
  getCode(e) {
    let _this = this;
    let type = e.target.dataset.type
    if (type == '1') {
      API.changePhone({
          change_type: 'mobile',
          mobile_type: 'old',
          mobile: _this.data.phone,
          type: 'get_code'
        })
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          _this.setData({
            disabled: true
          })
          let num = 61;
          let timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })
            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        })
    } else if (type == 2) {
      let myreg = /^(14[0-9]|13[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])\d{8}$$/;
      if (this.data.newPhone == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else if (!myreg.test(this.data.newPhone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else {
        API.changePhone({
          change_type: 'mobile',
          mobile: _this.data.newPhone,
          type: 'get_code'
          })
          .then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
            _this.setData({
              newDisabled: true
            })
            let num = 61;
            let timer = setInterval(function () {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                _this.setData({
                  newCodename: '重新发送',
                  newDisabled: false
                })

              } else {
                _this.setData({
                  newCodename: num + "s"
                })
              }
            }, 1000)
          })
      }
    }

  },
  //提交表单
  onSubmit(e) {
    let _this = this;
    let type = e.target.dataset.type
    if (type == '1') {
      if(_this.data.code==''){
        wx.showToast({
          title: '请输入验证码',
        })
        return false
      }
      API.changePhone({
          change_type: 'mobile',
          mobile_type: 'old',
          mobile: _this.data.phone,
          code:_this.data.code
        })
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          _this.setData({
            isCheck: true
          })
        })
    } else if (type == 2) {
      let myreg = /^(14[0-9]|13[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])\d{8}$$/;
      if (this.data.newPhone == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else if (!myreg.test(this.data.newPhone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else {
        if(_this.data.newCode==''){
          wx.showToast({
            title: '请输入验证码',
          })
          return false
        }
        API.changePhone({
          change_type: 'mobile',
          mobile: _this.data.newPhone,
          code:_this.data.newCode
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
            }, 1500);
          })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      phone: userInfo.mobile
    })
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