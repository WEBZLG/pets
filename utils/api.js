//封装请求函数
const UTIL = require('./util.js')
const API_BASE_URL = 'https://api-pet.chengyue.online'; //api地址
const IMG_BASE_URL = 'https://images-pet.chengyue.online'; //图片地址
// noToken不传用户token传固定token/noUid不传用户user_id
const request = (url, method, data, noToken, noUid) => {
  //获取登录token 
  let userToken = wx.getStorageSync('loginToken');
  let loginToken = noToken == true ? '$10$Xmd/LvGEoHInQ4ISXisPJOm54ULeCFU82WgDyyM5U2j2WfO3rND2K' : userToken;
  // 获取用户id
  if (noUid == '' || noUid == undefined) {
    let userInfoId = wx.getStorageSync('userInfo').user_id;
    data.user_id = userInfoId
  }
  //获取的当前时间戳（10位）
  data.timestamp = Math.round(new Date().getTime() / 1000).toString();
  //通过md5加密验签
  data.sign = UTIL.getMD5Sign(data, loginToken)
  return new Promise((resolve, reject) => {
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.request({
      url: API_BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        wx.hideToast()
        if (request.statusCode == '200') {
          // wx.hideLoading()
          resolve(request.data)
        } else if (request.statusCode == '401') {
          // wx.hideLoading()
          if (request.data.message == "您当前不是会员或会员已过期，请开通会员后再访问") {
            wx.showModal({
              title: '提示',
              content: '您当前不是会员或会员已过期，是否立即开通会员或续费？',
              success: function (sm) {
                if (sm.confirm) {
                  wx.redirectTo({
                    url: '../vip/vip',
                  })
                } else if (sm.cancel) {
                  wx.navigateBack({
                    delta: 0,
                  })
                }
              }
            })
          } else {
            console.log(request)
            wx.showToast({
              title: request.data.message,
              icon: 'none'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../login/login',
              })
            }, 1500);
          }
        } else {
          console.log(request)
          wx.showToast({
            title: request.statusCode,
            icon: 'none'
          })
        }
      },
      fail(error) {
        wx.hideToast({
          success: (res) => {
            if (error.errMsg) {
              wx.showToast({
                title: error.errMsg,
                icon: 'none'
              })
            } else {
              console.log(error)
              reject(error)
              wx.showToast({
                title: error.errMsg,
                icon: 'none'
              })
            }
          },
        })
        // wx.hideLoading()

      }
    })
  });
}
// 调用
// const API = require('../../utils/api');
// API.gethotsongs({type:7,}).then(res => {})

// 单图上传
const uploadImg = (param, path) => {
  return new Promise((resolve, reject) => {
    //获取的当前时间戳（10位）
    param.timestamp = Math.round(new Date().getTime() / 1000).toString();
    let token = '$10$Xmd/LvGEoHInQ4ISXisPJOm54ULeCFU82WgDyyM5U2j2WfO3rND2K';
    //通过md5加密验签
    param.sign = UTIL.getMD5Sign(param, token)
    //console.log(param)
    wx.uploadFile({
      url: API_BASE_URL + '/upload_img',
      filePath: path,
      name: 'file',
      formData: param,
      success(res) {
        let data = JSON.parse(res.data)
        resolve(data)
        //console.log(data)
      },
      fail(error) {
        reject(error)
        wx.showToast({
          title: error.data.message,
          icon: 'none'
        })
      }
    })
  })
}

//多张图片上传
const uploadImgs = (param, tempFilePaths) => {
  wx.showLoading({
    title: "上传中"
  });
  return new Promise((presolve, preject) => {
    let uploads = []
    //获取的当前时间戳（10位）
    param.timestamp = Math.round(new Date().getTime() / 1000).toString();
    let token = '$10$Xmd/LvGEoHInQ4ISXisPJOm54ULeCFU82WgDyyM5U2j2WfO3rND2K';
    //通过md5加密验签
    param.sign = UTIL.getMD5Sign(param, token)
    tempFilePaths.map((item, i) => {
      uploads[i] = new Promise((resolve, reject) => {
        wx.uploadFile({
          url: API_BASE_URL + '/upload_img',
          filePath: item.path,
          name: "file",
          formData: param,
          success(res) {
            resolve(JSON.parse(res.data))
          },
          fail(err) {
            //console.log(err)
            wx.hideLoading()
          }
        })
      })
    })
    Promise.all(uploads).then(res => {
      //图片上传完成
      presolve(res)
      wx.hideLoading()
    }).catch(err => {
      preject(err)
      wx.hideLoading()
      wx.showToast({
        title: '上传失败请重试',
        icon: 'none'
      })
    })
  })
}

// 获取图片信息
const getImage = (url) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        resolve(res)
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}
const getImageAll = (image_src) => {
  let that = this;
  var all = [];
  image_src.map(function (item) {
    all.push(getImage(item))
  })
  return Promise.all(all)
}
// 保存图片到相册
const savePicture = (tempFilePath,showFun) => {
  let _this = this
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
            showFun()
          }
        },
        fail: function (res) {
          showFun()
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
                      showFun()
                    }, 2000);
                  }
                }
              })
            }
          },
          fail: function (res) {
            showFun()
          }
        })
      } else if (err.errMsg == "saveImageToPhotosAlbum:fail:auth denied") {
        wx.showToast({
          title: '拒绝权限，无法保存图片',
          mask: true,
          icon: "none"
        })
        setTimeout(() => {
          showFun()
        }, 2000);
      }
    }
  })
}
// 结果api
module.exports = {
  IMG_BASE_URL,
  API_BASE_URL,
  getImage,
  getImageAll,
  savePicture,
  // 注册
  regist: (data) => {
    return request('/register', 'post', data, true, true)
  },
  // 登录
  login: (data) => {
    return request('/login', 'post', data, true, true)
  },
  // 重置密码
  resetPwd: (data) => {
    return request('/reset_pass', 'post', data, true, true)
  },
  // 轮播图
  carousel: (data) => {
    return request('/carousel/get', 'post', data, true, true)
  },
  //退出登录
  signOut: (data) => {
    return request('/logout', 'post', data)
  },
  //检验是否登录
  isSignIn: (data, uid) => {
    return request('/check_login/' + uid.uid, 'post', data, true, true)
  },

  //修改密码
  changePwd: (data) => {
    return request('/user/update', 'post', data)
  },
  //修改手机
  changePhone: (data) => {
    return request('/user/update', 'post', data)
  },
  //完善信息
  person: (data) => {
    return request('/user/update', 'post', data)
  },
  // 单图上传
  uploadImg: (param, path) => {
    return uploadImg(param, path)
  },
  // 多图上传
  uploadImgs: (param, data) => {
    return uploadImgs(param, data)
  },
  // 太阳码
  share: (data) => {
    return request('/user/qrcode', 'post', data)
  },
  // 获取我的推荐
  myRecommend: (data) => {
    return request('/user/report', 'post', data)
  },
  // 系统消息
  sysMessage: (data) => {
    return request('/message/get', 'post', data)
  },
  // 系统消息详情
  sysDetail: (data, id) => {
    return request('/message/detail/' + id, 'post', data)
  },
  // 用户协议
  agreement(data, id) {
    return request('/content/detail_by_menu/' + id, 'post', data, true, true)
  },
  // 意见
  opinion(data) {
    return request('/opinion/create', 'post', data)
  }, 
  // 服务项目
  serviceList(data) {
    return request('/service/get', 'post', data, true, true)
  }, 
}