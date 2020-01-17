// pages/collection/collection.js
const util = require('../../utils/util.js')
function getData(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    token:util.getCache("token"),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
  };
  util.get(util.baseUrl, "/coach/collectionList", param, function (res) {
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
    if(page.data.list.length==0){
      page.setData({
        errTip:true
      })
    }
  })





  
};
function doRefresh(page) {
  if (!util.getCache("token")){
    util.toast("请先登录")
  } else {
    getData(page);
  }
};
Page({
  data: {
    pageIndex: 1,
    pageSize: 20,
    list: [],
    errTip:false,
    systemHieght: 0,
    systemWidth: 0,
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    util.go("coachDetail", "?id=" + id);
  },
  onShow: function () {
    doRefresh(this);
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
  },
  onLoad: function (options) {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })

  },
})