// pages/myRecommend/myRecommend.js
const API = require('../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: API.IMG_BASE_URL, //图片路径
    recommendList: [],
    canvasShow: true
  },
  // 我的推荐
  getRecommend(page) {
    let _this = this
    API.myRecommend({
      page: page,
      page_size: 15
    }).then(res => {
      // //console.log(res)
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
          recommendList: _this.data.recommendList.concat(res.data.users) 
        })
      }else{
        _this.setData({
          recommendList: res.data.users
        })
      }
    })
  },
  // 分享
  share() {
    API.share({}).then(res => {
      let that = this
      let codeUrl = API.IMG_BASE_URL + res.data.qrcode
      let backUrl = API.IMG_BASE_URL + res.data.qrcode_base
      wx.showLoading({
        title: '生成海报中',
      })
      API.getImage(codeUrl).then(res => {
        let codePath = res.path
        API.getImage(backUrl).then(res => {
          let backPath = res.path
          API.getImageAll([codePath, backPath]).then((res) => {
            const ctx = wx.createCanvasContext('shareCanvas')
            // 底图
            ctx.drawImage(res[1].path, 0, 0, 250, 400);
            // 小程序码
            ctx.drawImage(res[0].path, 85, 300, 80, 80)
            ctx.stroke()
            ctx.draw()
            wx.hideLoading()
            that.setData({
              canvasShow: false
            })
          })
        })
      })
    })
  },
    // 关闭分享
    oncloseCode(){
      this.setData({
        canvasShow: true
      })
    },
  // 生成图片保存相册
  savePhoto() {
    let that = this
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        wx.hideLoading()
        let tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    canvasShow: true
                  })
                }
              },
              fail: function (res) {
                that.setData({
                  canvasShow: true
                })
              }
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              //console.log("当初用户拒绝，再次发起授权")
              wx.showModal({
                content: '是否打开权限设置？',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingdata) {
                        //console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          wx.showToast({
                            title: '点击保存到相册按钮',
                            mask: true,
                            icon: "none"
                          })
                        } else {
                          wx.showToast({
                            title: '拒绝权限，无法保存图片',
                            mask: true,
                            icon: "none"
                          })
                          setTimeout(() => {
                            that.setData({
                              canvasShow: true
                            })
                          }, 2000);
                        }
                      }
                    })
                  }
                },
                fail: function (res) {
                  that.setData({
                    canvasShow: true
                  })
                }
              })
            } else if (err.errMsg == "saveImageToPhotosAlbum:fail:auth denied") {
              wx.showToast({
                title: '拒绝权限，无法保存图片',
                mask: true,
                icon: "none"
              })
              setTimeout(() => {
                that.setData({
                  canvasShow: true
                })
              }, 2000);
            }
          }
        })
      }
    });
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
    this.getRecommend(1)
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
    this.getRecommend(1)
    this.setData({
      page: 1
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this
    this.setData({
      page: _this.data.page*1+1
    })
    this.getRecommend(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    let code = wx.getStorageSync('userInfo').p_code;
    if (code == undefined) {
      code = ""
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '商云社',
      path: '/pages/home/home?p=' + code
    }
  },
  onShareTimeline(res) {
    let code = wx.getStorageSync('userInfo').p_code;
    if (code == undefined) {
      code = ""
    }
    return {
      title: '商云社',
      query: {
        p: code
      },
    }
  }
})