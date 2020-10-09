const MD5 = require('./md5');
// 时间戳转日期（13位）
const timestampToTime = timestamp => {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  //  var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
  // return Y+M+D+h+m+s;
  return Y + M + D + h + m;
}

//数据加密
const getMD5Sign = (params, token) => {
  if (typeof params == "string") {
    return paramsStrSort(params, token);
  } else if (typeof params == "object") {
    let newData = {};
    Object.keys(params).sort().map(key => {
      newData[key] = params[key]
    })
    let arr = [];
    for (let i in newData) {
      arr.push((i + "=" + newData[i]));
    }
    if (token == undefined) {
      return MD5(arr.join(("&"))).toUpperCase();
    } else {
      let newUrl = arr.join(("&")) + '&token=' + token;
      return MD5(newUrl).toUpperCase();
    }
  }
}

// 加密调用
// var paramsObj = { xid: xid, pageSize: pageSize, type: type, pageNo: pageNo };
// var sign = getMD5Sign(paramsObj, timestamp, token);

// 监察是否登录
const checkLogin = () => {
  let _this = this
  let userInfo = wx.getStorageSync('userInfo');
  //console.log(userInfo)
  if (userInfo == '' || userInfo == undefined) {
    wx.redirectTo({
      url: '../login/login',
    })
  } else {
    API.isSignIn({}, {
        uid: userInfo.user_id
      })
      .then(res => {
        if (res.message == '已登录') {
          wx.setStorageSync('loginToken', res.data.login_token);
          wx.setStorageSync('userInfo', res.data.user);
          let url = e.currentTarget.dataset.url
          wx.navigateTo({
            url: url
          })
        } else {
          wx.showToast({
            title: 'res.message',
            icon: "none"
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../login/login',
            })
          }, 3000);
        }
      })
  }
}
module.exports = {
  formatTime: formatTime,
  timestampToTime: timestampToTime,
  getMD5Sign: getMD5Sign,
  checkLogin: checkLogin
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}