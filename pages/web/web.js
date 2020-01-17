// pages/web/web.js
Page({
  data: {

  },
  onLoad: function (options) {
    console.log('url:',options);
    this.setData({
      url: options.url
    })
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})