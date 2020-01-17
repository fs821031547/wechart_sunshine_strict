// pages/myCouple/myCouple.js
//GET /coupon-received-history/list
const util = require('../../utils/util.js')

function couponReceived(page) {
  var param = {
    token: util.getCache("token"),
  }
  util.get(util.baseUrl, "/coupon-received-history/list", param, function (res) {
    var couponReceived = res.data.data;
    for (var i in couponReceived) {
      couponReceived[i].endingEffectiveTime = util.formatDate(new Date(couponReceived[i].endingEffectiveTime), "yyyy-MM-dd")
    }
    page.setData({
      couponReceived: couponReceived,
    })
    if (page.data.couponReceived.length==0){
      page.setData({
        errTip:true
      })
    }
  })
};

Page({
  data: {
    showTipTitle: true,
    couponReceived: [],
    errTip:false,
    systemWidth:0,
    systemHieght:0
  },
  closeTipTitle: function () {
    var that = this
    that.setData({
      showTipTitle: false
    })
  },

  onShow: function () {
    couponReceived(this)
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onLoad: function (options) {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })

  },
})