// pages/certification/certification.js
const API = require('../../utils/api');
const UTIL = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeText: ['标准', '边框缺失', '边框缺失', '闪光强烈'],
    nameValue: '',
    idcardValue: '',
    faceImg: '',
    backImg: '',
    card_pic1: '',
    card_pic2: ''
  },
  //获取input输入框的值
  nameValue(e) {
    this.setData({
      nameValue: e.detail
    })
  },
  idcardValue(e) {
    this.setData({
      idcardValue: e.detail
    })
  },
  // 选择图片
  onChoose(e) {
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        ////console.log(res)
        if (e.target.dataset.type == '1') {
          _this.setData({
            faceImg: res.tempFiles[0].path,
            card_pic1: res.tempFiles[0].path
          })
        } else {
          _this.setData({
            backImg: res.tempFiles[0].path,
            card_pic2: res.tempFiles[0].path
          })
        }
      }
    })
  },
  // 删除图片
  onDelete(e) {
    let _this = this
    if (e.target.dataset.type == '1') {
      _this.setData({
        faceImg: ''
      })
    } else {
      _this.setData({
        backImg: ''
      })
    }
  },
  // 提交
  onSubmit() {
    let _this = this
    let param = {
      real_name: _this.data.nameValue,
      card_id: _this.data.idcardValue,
      card_pic1: _this.data.card_pic1,
      card_pic2: _this.data.card_pic2
    }
    let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (param.real_name == '') {
      wx.showToast({
        title: '请填写真实姓名',
      })
    } else if (param.card_id == '') {
      wx.showToast({
        title: '请填写身份证号',
      })
    } else if (!reg.test(param.card_id)) {
      wx.showToast({
        title: '身份证号有误',
      })
    } else if (param.card_pic1 == '') {
      wx.showToast({
        title: '请上传身份证正面照片',
      })
    } else if (param.card_pic2 == '') {
      wx.showToast({
        title: '请上传身份证反面照片',
      })
    } else {
      API.uploadImg({
        'file_name': 'card_pic1'
      }, param.card_pic1).then(res => {
        ////console.log(res)
        _this.setData({
          card_pic1: res.data.path
        })
        API.uploadImg({
          'file_name': 'card_pic2'
        }, param.card_pic2).then(res => {
          _this.setData({
            card_pic2: res.data.path
          })
          param = {
            real_name: _this.data.nameValue,
            card_id: _this.data.idcardValue,
            card_pic1: _this.data.card_pic1,
            card_pic2: _this.data.card_pic2
          }
          API.certification(param)
            .then(res => {
              ////console.log(res)
              wx.showToast({
                title: res.message,
                icon:'none'
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 0,
                })
              }, 1500);
            })
        })
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