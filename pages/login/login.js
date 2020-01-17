// pages/login/login.js
const util = require('../../utils/util.js')
Page({
  data: {
    systemHieght:0
  },
  getUserInfo: function (e) {
    console.log(e)
    var page = this;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success(res) {
        var param = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          code: res.code,
          channel: 1
        }
        util.post(util.authUrl + "/yxjl/login", "", param, function (res) {
          console.log(res)
          util.setCache("token", res.data)
          util.setCache("name", res.wxData.nickName)
          util.setCache("photo", res.wxData.avatarUrl)
          page.setData({
            token: res.data,
            name: res.wxData.nickName,
            photo: res.wxData.avatarUrl
          })
          util.goBack();
          util.toast("登录成功");
        })
      }
    })
  },
  onLoad: function (options) {
  
    this.setData({
      token: util.getCache("token"),
      name: util.getCache("name"),
      photo: util.getCache("photo"),
      systemHieght: wx.getSystemInfoSync().windowHeight
    })
  },
  onShow: function () {
    util.toast("请先登录")
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  goToHome() {
   wx.switchTab({
     url: '../home/home',
   })
  },
})