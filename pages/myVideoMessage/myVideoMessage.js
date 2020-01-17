// pages/myVideoMessage/myVideoMessage.js
const util = require('../../utils/util.js')
Page({
  data: {
    currentTab: 0,
    errTip: false,
    systemHieght: 0,
    systemWidth: 0,
    myheartList: [],
    mycommentsList: []


  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
    showErrTip(that)
  },
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    showErrTip(page)
  },
  onLoad: function(options) {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })

  },

  onShow: function() {
    doRefresh(this)
  },
})

function doRefresh(page) {
  myheartList(page)
  mycommentsList(page)
};

function myheartList(page) {
  util.get(util.baseUrl, "/video/myheart", null, function(res) {
    var myheartList = res.data.data
    for (var i in myheartList) {
      myheartList[i].createTime = util.formatDate(new Date(myheartList[i].createTime), "yyyy/MM/dd")
    }
    page.setData({
      myheartList: myheartList
    })
    showErrTip(page)
  })
}

function mycommentsList(page) {
  util.get(util.baseUrl, "/video/mycomments", null, function(res) {
    var mycommentsList = res.data.data
    for (var i in mycommentsList) {
      mycommentsList[i].submitTime = util.formatDate(new Date(mycommentsList[i].submitTime), "yyyy/MM/dd")
    }
    page.setData({
      mycommentsList: mycommentsList
    })
    showErrTip(page)
  })
}

function showErrTip(page) {
  page.setData({
    errTip: (page.data.currentTab == 0 && !page.data.myheartList.length) || (page.data.currentTab == 1 && !page.data.mycommentsList.length)
  })
}