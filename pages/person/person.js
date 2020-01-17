// pages/person/person.js
const util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
  },
  getUserInfo: function (e) {
    var page = this;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success(res) {
        console.log('success:',res);
        var errMsg = e.detail.errMsg;
        var param = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          code: res.code,
          channel: 1
        }
        if (errMsg.indexOf('fail')>0){
          util.post(util.authUrl + "/yxjl/visitorLogin", "", param, function (res) {
            // console.log('vistor:',res);
            // userType 1 普通用户 2游客
            util.setCache("token", res.data.token);
            util.setCache("userType", res.data.userType);
          })
          return;
        }
        util.post(util.authUrl+"/yxjl/login", "", param, function (res) {
          console.log(res)
          util.setCache("token", res.data)
          util.setCache("name", res.wxData.nickName)
          util.setCache("photo", res.wxData.avatarUrl)
          page.setData({
            token: res.data,
            name: res.wxData.nickName,
            photo: res.wxData.avatarUrl
          })
          util.toast("登录成功");
        })
      }
    })
  },
  onShow:function(){
    this.setData({
      token: util.getCache("token"),
      name: util.getCache("name"),
      photo: util.getCache("photo")
    })
    // 登录
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('jscode', res.code);
        var param = {
          code: res.code
        }
        wx.request({
          url: util.authUrl + "/yxjl/bindSessionkey",
          method: "post",
          data: param,
          dataType: 'json',
          header: { "content-type": "application/x-www-form-urlencoded" },
        });
      }
    })
  },
  goOrder: function () {
    util.go("order");
  },
  goHistory: function () {
    util.go("browseHistory");
  },
  goCollection: function () {
    util.go("collection");
  },
  goFollow: function () {
    util.go("follow");
  },
  toMyCouple:function(){
    if (util.getCache("token")) {
    wx.navigateTo({
      url: '../myCouple/myCouple',
    })}
    else {
      util.goLogin();
    }
  },
  toMyVideoMessage: function () {
    if (util.getCache("token")) {
      wx.navigateTo({
        url: '../myVideoMessage/myVideoMessage',
      })
    }
    else {
      util.goLogin();
    }
  },
  toMyCollectVideo: function () {
    if (util.getCache("token")) {
      wx.navigateTo({
        url: '../myCollectVideo/myCollectVideo',
      })
    }
    else {
      util.goLogin();
    }
  },
  callMe:function(){
    wx.makePhoneCall({
      phoneNumber: '4007786707'
    })
  },
  onShareAppMessage: function (res) {
    
    return {
      title: "阳光学车",
      path: "/pages/home/home",
      success(res) {
        // 转发成功
      },
      fail(res){
       }
    }
    
  }
})