//app.js
const util = require('utils/util.js')
App({
  // 全局变量
  globalData: {
    isIphoneX: false,   // 是否 ipx
    navH:''
  },
  onLaunch: function () {
    var app = this;
    //更新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log("hasUpdate:",res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，立即重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    //分享
    wx.showShareMenu({
      withShareTicket: true
    })
    //定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        util.setCache(util.lskey_lat, latitude);
        util.setCache(util.lskey_lng, longitude);
        console.log(res);
        var city = util.getCache(util.lskey_city);
        var cityCode = util.getCache(util.lskey_cityCode);
        var provinceCode = util.getCache('provinceCode');
        if (city && cityCode && provinceCode) {
          return;
        }
        var param = {
          location: latitude + "," + longitude,
          output: "json",
          ak: util.baidu_ak
        }
        wx.request({
          url: "http://api.map.baidu.com/geocoder/v2/",
          data: param,
          method: "GET",
          dataType: 'json',
          success: function (res) {
            var city = res.data.result.addressComponent.city
            var param = {
              city: city
            };
            util.get(util.baseUrl, "/city/cityCode", param, function (res) {
              util.setCache(util.lskey_cityCode, res.data.cityCode);
              util.setCache(util.lskey_city, city);
              util.setCache('provinceCode', res.data.provinceCode);
            })
          }
        });
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('jscode', res.code);
        var param = {
          code: res.code
        }
        wx.request({
          url: util.authUrl+"/yxjl/bindSessionkey",
          method: "post",
          data: param,
          dataType: 'json',
          header: { "content-type": "application/x-www-form-urlencoded" },
        });
      }
    })
  },
  onShow:function(){
    // 判断机型
    util.isIphoneX(this, 'launch')
  }
})