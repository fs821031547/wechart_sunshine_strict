// pages/about/about.js
Page({
  data: {
    index:0,
    isOpen:[]
  },
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync();
    //1px=scale rpx
    var scale = 750/systemInfo.screenWidth;
    //减去tab高
    this.setData({
      height: systemInfo.windowHeight - 90 / scale
    })
  }, 
  indexChange: function (e) {
    this.setData({
      index: e.detail.current
    })
  },
  changeIndex: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
  },
  callMe: function (e) {
    var photo = e.currentTarget.dataset.photo
    wx.makePhoneCall({
      phoneNumber: photo
    })
  },
  trigger:function(e){
    var index = e.currentTarget.dataset.index;
    var isOpen = this.data.isOpen
    isOpen[index] = !isOpen[index]
    this.setData({
      isOpen: isOpen
    })
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})