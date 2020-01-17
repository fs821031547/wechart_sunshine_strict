// pages/order/order.js
const util = require('../../utils/util.js')
function getData(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    token:util.getCache("token"),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize
  };
  util.get(util.baseUrl, "/preSignUp/myList", param, function (res) {
    var data = res.data.data
    for (var i in data) {
      data[i].createTime = util.formatDate(new Date(data[i].createTime), "yyyy-MM-dd hh:mm")
    }
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
  if (!util.getCache("token")) {
    util.toast("请先登录")
  } else {
    getData(page);
  }
};
Page({
  data: {
    windowHeight: 500,
    pageIndex: 1,
    pageSize: 20,
    list: [],
  },
  onShow: function () {
    doRefresh(this);
    var page = this;
    wx.getSystemInfo({
      success(res) {
        page.setData({
          windowHeight: res.windowHeight * 750 / res.windowWidth
        })
      }
    })
  },
  onPullDownRefresh: function () {
    doRefresh(this);
  },
  //确认成交
  confirm: function (e) {
    var page = this;
    var id = e.currentTarget.dataset.id
    util.confirm("提醒","确认成交吗",function(){
      var param = {
        token: util.getCache("token"),
        id: id
      }
      util.post(util.baseUrl, "/preSignUp/confirm", param, function (res) {
        if (res.code == 200) {
          doRefresh(page);
        }
      })
    });
  },
  //去评价
  goAssess(e) {
    var id = e.currentTarget.dataset.id
    var coachId = e.currentTarget.dataset.coach
    util.go("assess", "?id=" + id + "&coachId=" + coachId)
  },
  //申请退款
  refund: function (e) {
    var page = this;
    var id = e.currentTarget.dataset.id
    util.confirm("提醒", "确认退款吗", function () {
      var param = {
        token: util.getCache("token"),
        id: id
      }
      util.post(util.baseUrl, "/preSignUp/refund", param, function (res) {
        if (res.code == 200) {
          doRefresh(page);
        }
      })
    });
  },
  //取消退款
  cancelRefund: function (e) {
    var page = this;
    var id = e.currentTarget.dataset.id
    util.confirm("提醒", "确认取消退款吗", function () {
      var param = {
        token: util.getCache("token"),
        id: id
      }
      util.post(util.baseUrl, "/preSignUp/cancelRefund", param, function (res) {
        if (res.code == 200) {
          doRefresh(page);
        }
      })
    });
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      getData(this)
    }
  }
})