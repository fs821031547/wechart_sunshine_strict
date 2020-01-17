// pages/myCollectVideo/myCollectVideo.js
const util = require('../../utils/util.js')
Page({
  data: {
    list: [],
    pageNo: 1,
    pageSize: 10,
    totalPageCount:1,
    systemHieght: 0,
    systemWidth: 0,
    errTip:false
  },

  onLoad: function (options) {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })

  },
  onShow: function () {
    this.setData({
      list: []
    },()=>{
      doRefresh(this)
    })
  },
  onPullDownRefresh: function () {

  },

  myVideo: function (e) {
    var page = this
    var id = e.target.dataset.id;
    var watchCount = e.target.dataset.watchcount
    console.log(id + 'id')
    util.go("videoList", "?id=" + id + '&type=collect');
      var param = {
        token: null,
        id: id,
        type: 'WATCH'
      }
      util.post(util.baseUrl, '/video/addStat', param, function (res) {
        if (res.code == 200) {
          page.setData({
            watchCount: watchCount + 1
          })
        }
      })
  },
  tabVideo: function (e) {
    var page = this
    var id = e.target.dataset.id;
    util.go("videoList", "?id=" + id + '&type=collect');
    var watchCount = e.target.dataset.watchcount
    var token = util.getCache("token")
    if (token) {
      var param = {
        token: token,
        id: id,
        type: 'WATCH'
      }
      util.post(util.baseUrl, '/video/addStat', param, function (res) {
        if (res.code == 200) {
          page.setData({
            watchCount: watchCount + 1
          })
        }
      })
    } else {
      util.goLogin();
    }
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      var pageIndex = this.data.pageNo+1
      if (!(pageIndex > this.data.totalPageCount)){
        getData(this)
      }
    }
  },
  onReachBottom(e) {
    this.loadMore(e);
  }
})

function getData(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    token: util.getCache("token"),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
  };
  util.get(util.baseUrl, "/video/collections", param, function (res) {
    var collectionsList = res.data.data
    var totalPageCount = res.data.totalPageCount
    var list = page.data.list;
    if (pageIndex == 1 || !list) {
      list = collectionsList;
    } else {
      list = list.concat(collectionsList);
    }
    var canLoadMore = !(!collectionsList || collectionsList.length < param.pageSize);
    page.setData({
      list: list,
      canLoadMore: canLoadMore,
      totalPageCount: totalPageCount,
      pageIndex: pageIndex
    })
    if(page.data.list.length==0){
      page.setData({
        errTip:true
      })
    }
  })
}


function doRefresh(page) {
  getData(page)
}

