//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
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
        util.post("http://192.168.1.6:28091/yxjl/login", "", param, function (res) {
          console.log(res)
          util.setCache("token",res.data)
        })
      }
    })
  },
  loginS: function () {
    wx.checkSession({
      success() {
        util.toast("success")
        // session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        util.toast("fail")
        // session_key 已经失效，需要重新执行登录流程
        wx.login() // 重新登录
      }
    })
  },
  pay: function () {
    var param = {
      token:util.getCache("token"),
      id:2
    }
    util.post("http://192.168.1.6:28114/apply/wxapply", "", param, function (res) {
      wx.requestPayment({
        timeStamp:res.data.timestamp,
        nonceStr: res.data.noncestr,
        package: "prepay_id=" + res.data.prepayid,
        signType:"MD5",
        paySign: res.data.paySign,
        success : res =>{
          console.log(res)
          util.toast(res)
        },
        fail : res => {
          console.log(res)
          util.toast(res.err_desc)
        }
      })
    })
  }
})
