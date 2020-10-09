// pages/personal/personal.js
const API = require('../../utils/api');
const AREA = require('../../utils/area');
Array.prototype.delete = function (delIndex) {
  var temArray = [];
  for (var i = 0; i < this.length; i++) {
    if (i != delIndex) {
      temArray.push(this[i]);
    }
  }
  return temArray;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: API.IMG_BASE_URL,
    province: '',
    city: '',
    area: '',
    show: false,
    areaList: AREA.default,
    areaText: '',
    name: '',
    address: '',
    post: '',
    company:''
  },
  //获取input输入框的值
  getNameValue(e) {
    this.setData({
      name: e.detail
    })
  },
  getAddressValue(e) {
    this.setData({
      address: e.detail
    })
  },
  getPostValue(e) {
    this.setData({
      post: e.detail
    })
  },
  getCompanyValue(e) {
    this.setData({
      company: e.detail
    })
  },
  // 提交
  onSubmit() {
    let _this = this
    let name = this.data.name
    let address = this.data.address
    let post = this.data.post
    let province = this.data.province
    let city = this.data.city
    let area = this.data.area
    let company = this.data.company
    if (name == '') {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
    } else if (post == '') {
      wx.showToast({
        title: '请输入您的职位',
        icon: 'none'
      })
    }else if (company == '') {
      wx.showToast({
        title: '请输入您的公司名称',
        icon: 'none'
      })
    } else if (province == '') {
      wx.showToast({
        title: '请输入您所在地区',
        icon: 'none'
      })
    } else if (address == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else {
      API.person({
        change_type:'info',
        real_name:name,
        company:company,
        post:post,
        province:province,
        city:city,
        area:area,
        address:address
      }).then(res=>{
        //console.log(res)
        wx.showToast({
          title: res.message,
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 1000);
      })
    }
  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onConfirm(e) {
    this.setData({
      areaText: e.detail.values[1].name + e.detail.values[2].name,
      province: e.detail.values[0].name,
      city: e.detail.values[1].name,
      area: e.detail.values[2].name
    })
    this.onClose();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let userInfo = wx.getStorageSync('userInfo').info
    if(userInfo){
      this.setData({
        province: userInfo.province,
        city: userInfo.city,
        area: userInfo.area,
        areaText: userInfo.city+userInfo.area,
        name: userInfo.real_name,
        address: userInfo.address,
        post: userInfo.post,
        company:userInfo.company
      })
    }
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