// pages/browseHistory/browseHistory.js
const util = require('../../utils/util.js')
function getData(page) {
  var history = util.getCache(util.lskey_history)
  if (!history){
    page.setData({
        errTip: true
      })
    return
  }
  var array = JSON.parse(history); 
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    ids: array.join(","),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
  };
  util.get(util.baseUrl, "/coach/listByIds", param, function (res) {
    var data = res.data.data
    var list = page.data.list;
    if (pageIndex == 1 || !list) {
      list = data;
    } else {
      list = list.concat(data);
    }
    var canLoadMore = !(!data || data.length < param.pageSize);
    page.setData({
      list: list,
      canLoadMore: canLoadMore
    })
  
  })
};
function doRefresh(page) {
  getData(page);
};
Page({
  data: {
    pageIndex: 1,
    pageSize: 6,
    list: [],
    errTip:false,
    systemHieght:0
  },
  onLoad:function(){
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })
  },
  onShow: function () {
    doRefresh(this);
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    util.go("coachDetail", "?id=" + id);
  },
  onPullDownRefresh: function () {
    doRefresh(this);
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      getData(this)
    }
  },
  onReachBottom(e) {
    this.loadMore(e);
  }
})