const util = require('../../utils/util.js')
Page({
  data: {
    currentTab: 0,
    newVideoList: [],
    hostVideoList: [],
    showVideo: false,
    watchHasCount: 0,
    pageSize: 20,
    pageNo: 1,
    list: [],
    listHeight: 4000,
    totalPageCount: 1,
    totalPageHostCount:1,
    totalPageHostCount: 1
  },
  onShow: function () {
  },
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },


  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  onLoad: function (options) {
    this.setData({
      list: []
    }, () => {
      doRefresh(this)
    });
  },

  playVideo: function (e) {
    var page = this
    var id = e.target.dataset.id;
    util.go("videoList", "?id=" + id);
    var watchCount = e.target.dataset.watchcount
    var param = {
      token: null,
      id: id,
      type: 'WATCH'
    }
    util.post(util.baseUrl, '/video/addStatNoToken', param, function (res) {
      if (res.code == 200) {
        page.setData({
          watchCount: watchCount + 1
        })
        console.log('watchCount' + page.data.watchCount)
      }
    })
  },



  myVideo: function (e) {
    this.playVideo(e)
  },
  tabVideo: function (e) {
    this.playVideo(e)
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      var pageIndex = this.data.pageNo + 1
      if (!(pageIndex> this.data.totalPageCount)) { 
        newVideoList(this)}
    }
    if (this.data.canLoadMoreHost) {
      var pageIndex = this.data.pageNo + 1
      if (!(pageIndex > this.data.totalPageHostCount)) {
        hostVideoList(this)
      }
    }
  },
  onPageScroll: function (e) {
    let that = this;
    console.log('scroll:', e);

  },
  onReachBottom(e) {

    console.log('onReachBottom')
    this.loadMore(e);
   
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
  },
  addVideo(e){
    console.log('bindscrolltolower:',e);
    this.loadMore(e);
  },
  // onPullDownRefresh(e) {
  //   // wx.showLoading({
  //   //   title: '玩命加载中',
  //   // })
  //   console.log('onPullDownRefresh')
  //   this.loadMore(e);
  // }
})

function newVideoList(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    pageSize: page.data.pageSize,
    pageIndex: pageIndex
  }
  util.get(util.baseUrl, "/video/new/list", param, function (res) {
    var newVideoList = res.data.data
  
    var totalPageCount = res.data.totalPageCount
    var list = page.data.list;
    if (pageIndex == 1 || !list) {
      list = newVideoList
    } else {
      list = list.concat(newVideoList);
    }
    var canLoadMore = !(!newVideoList || newVideoList.length < param.pageSize);
    page.setData({
      list: list,
      canLoadMore: canLoadMore,
      totalPageCount: totalPageCount,
      pageIndex: pageIndex
    })
    list.forEach(function (item) {
      item.heartCount = util.toThousands(item.heartCount)

    })
  })
}

function doRefresh(page) {
  newVideoList(page)
  hostVideoList(page)
}

function hostVideoList(page) {
  var pageIndex = page.data.list ? parseInt(page.data.list.length / page.data.pageSize) + 1 : 1
  var param = {
    pageSize: page.data.pageSize,
    pageIndex: pageIndex
  }
  util.get(util.baseUrl, "/video/host/list", param, function (res) {
    var hostVideoList = res.data.data

    var totalPageHostCount = res.data.totalPageCount
    var list = page.data.list;
    if (pageIndex == 1 || !list) {
      list = hostVideoList
    } else {
      list = list.concat(hostVideoList);
    }
    var canLoadMoreHost = !(!hostVideoList || hostVideoList.length < param.pageSize);
    list.forEach(function (item) {
      item.heartCount = util.toThousands(item.heartCount)
    })
    page.setData({
      hostVideoList: hostVideoList,
      canLoadMoreHost: canLoadMoreHost,
      pageIndex: pageIndex,
      totalPageHostCount: totalPageHostCount
    })
  })
}