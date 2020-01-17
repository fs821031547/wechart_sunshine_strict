// pages/comment/comment.js
const util = require('../../utils/util.js')
function getComment(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    id: page.data.coachId,
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
  };
  util.get(util.baseUrl, "/comment/list", param, function (res) {
    var data = res.data.data
    for (var i = 0; i < data.length; i++) {
      data[i].createTime = util.formatDate(new Date(data[i].createTime), "yyyy-MM-dd hh:mm")
      if (data[i].options) {
        data[i].options = data[i].options.split(',');
      }
    }
    var list = page.data.list;
    if (pageIndex == 1 || !list) {
      list = data;
    } else {
      list = list.concat(data);
    }
    var canLoadMore = !(!data || data.length < param.pageSize);
    page.setData({
      comment: list,
      canLoadMore: canLoadMore
    })
  })
};
function getOption(page) {
  util.get(util.baseUrl, "/comment/optionList", null, function (res) {
    var data = res.data
    for (var i = 0; i < data.length; i++) {
      data[i].id = data[i].id + ''
    }
    page.setData({
      options: data
    })
  })
};
function doRefresh(page) {
  getComment(page);
  getOption(page);
};
Page({
  data: {
    pageIndex: 1,
    pageSize: 20,
    list: []
  },
  onLoad: function (options) {
    this.setData({
      coachId: options.id
    })
  },
  onShow: function () {
    doRefresh(this);
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  onPullDownRefresh: function () {
    doRefresh(this);
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