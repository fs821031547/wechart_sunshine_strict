// pages/activity/activity.js
const util = require('../../utils/util.js')

function getActivity(page) {
  var param = {
    // city: page.data.cityCode
    topStatus: 1
  };
  // var url = "/showCase/list";
  var url = "/activity/pageList";
  util.get(util.baseUrl, url, param, function (res) {
    var data = res.data.data
    // data = [{}, {}, {}, {}, {}, {}, {}]; //
    for (var i in data) {
      // data[i].photoUrl = 'http://img.91ygxc.com/2019/04/02/470ddc03-d523-4ab1-ab21-7de3035c18d1_s.jpg';
      // data[i].title = '这是一个标题这是一个标题这是一个标题';
      data[i].desc = '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。';
      data[i].beginningTime = util.formatDate(new Date(data[i].beginningTime), "yyyy-MM-dd")
      data[i].endingTime = util.formatDate(new Date(data[i].endingTime), "yyyy-MM-dd")
    }
    page.setData({
      activity: data
    })
  })
};

function getActivityHistory(page,refresh) {
  let pageIndex = page.data.pageNo;
  let pageSize = page.data.pageSize;
  var param = {
    // city: page.data.cityCode
    pageIndex: pageIndex,
    pageSize: pageSize,
  };
  // var url = "/showCase/list";
  var url = "/activity/pageList";
  util.get(util.baseUrl, url, param, function (res) {
    var data = res.data.data
    // data = [{}, {}, {}, {}, {}, {}, {}]; //
    for (var i in data) {
      // data[i].photoUrl = 'http://img.91ygxc.com/2019/04/02/470ddc03-d523-4ab1-ab21-7de3035c18d1_s.jpg';
      // data[i].title = '这是一个标题这是一个标题这是一个标题';
      data[i].desc = '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。';
      data[i].beginningTime = util.formatDate(new Date(data[i].beginningTime), "yyyy-MM-dd")
      data[i].endingTime = util.formatDate(new Date(data[i].endingTime), "yyyy-MM-dd")
    }
    let activityHistory = page.data.activityHistory;
    if(refresh){
      data = activityHistory;
    }else{
      data = data.concat(activityHistory)
    }
    
    page.setData({
      activityHistory: data,
      pageNo: res.data.pageNo,
      totalPageCount: res.data.totalPageCount
    })
  })
};

function getCoupon(page) {
  var param = {
    // city: page.data.cityCode
    // topStatus:1
  };
  // var url = "/activity/list";
  var url = "/showCase/list";
  util.get(util.baseUrl, url, param, function (res) {
    var data = res.data.data
    // data = [{}, {}, {}, {}, {}, {}, {}]; //
    var couponList = [];
    data.forEach(function (x) {
      if (x.position == 3) {
        couponList[0] = x;
      }
      if (x.position == 4) {
        couponList[1] = x;
      }
      if (x.position == 5) {
        couponList[2] = x;
      }
    })
    page.setData({
      couponList: couponList
    })
  })

};

function doRefresh(page,refresh) {
  getActivity(page);
  getActivityHistory(page,refresh);
  getCoupon(page);
};
Page({
  data: {
    activity: [],
    activityHistory: [],
    couponList: [],
    webPageUrl: '',
    activityRowCount: 0, //活动资讯总数量
    pageNo: 1,
    totalPageCount: 1,
    pageSize: 20,
    getHotActiveModal: false
  },


  couponList0(e) {
    var couponId0 = e.currentTarget.dataset.couponid;
    this.setData({
      couponId: couponId0,
    })
    if (couponId0 == 0) {
      var couponList0 = this.data.couponList[e.currentTarget.dataset.index];
      if (couponList0.type == 1) {
        //util.go("web", "?url=" + couponList0.webPageUrl);
        var webPageUrl = couponList0.webPageUrl;
        //console.log('webPageUrl:', webPageUrl);
        if (webPageUrl.indexOf('?') < 0) {
          util.go("web", "?url=" + webPageUrl);
          return;
        }
        //var urlId = webPageUrl.split('=')[1];
        var baseWebUrl = webPageUrl.split('?')[0];
        var param = webPageUrl.split('?')[1];
        var paramName = param.split('=')[0];
        var paramVal = param.split('=')[1];
        this.setData({
          webPageUrl: webPageUrl
        });
        util.go("webview", "?url=" + baseWebUrl + "&" + paramName + '=' + paramVal);
      } else if (couponList0.type == 2) {
        var param = couponList0.param ? param : null
        util.go(couponList0.webPageUrl);
      }
    } else {
      console.log('1')
      var page = this

      if (util.getCache("token")) {
        page.setData({
          getHotActiveModal: true,
        })
      } else {
        util.goLogin();
      }
    }
  },
  couponList1(e) {
    var couponId1 = e.currentTarget.dataset.couponid;
    this.setData({
      couponId: couponId1,
    })
    if (couponId1 == 0) {
      var couponList1 = this.data.couponList[e.currentTarget.dataset.index];
      if (couponList1.type == 1) {
        var webPageUrl = couponList1.webPageUrl;
        //console.log('webPageUrl:', webPageUrl);
        if (webPageUrl.indexOf('?') < 0) {
          util.go("web", "?url=" + webPageUrl);
          return;
        }
        //var urlId = webPageUrl.split('=')[1];
        var baseWebUrl = webPageUrl.split('?')[0];
        var param = webPageUrl.split('?')[1];
        var paramName = param.split('=')[0];
        var paramVal = param.split('=')[1];
        this.setData({
          webPageUrl: webPageUrl
        });
        util.go("webview", "?url=" + baseWebUrl + "&" + paramName + '=' + paramVal);
      } else if (couponList1.type == 2) {
        var param = couponList1.param ? param : null
        util.go(couponList1.webPageUrl);
      }
    } else {
      var page = this
      console.log('2')
      if (util.getCache("token")) {
        page.setData({
          getHotActiveModal: true,
        })
      } else {
        util.goLogin();
      }
    }

  },
  couponList2(e) {
    var couponId2 = e.currentTarget.dataset.couponid;
    this.setData({
      couponId: couponId2,
    })
    if (couponId2 == 0) {
      var couponList2 = this.data.couponList[e.currentTarget.dataset.index];
      if (couponList2.type == 1) {
        //util.go("web", "?url=" + couponList2.webPageUrl);
        // var webPageUrl = couponList2.webPageUrl
        // wx.setClipboardData({
        //   data: webPageUrl,
        //   success(res) {
        //     wx.getClipboardData({
        //       success(res) {
        //         util.toast('链接已复制，请打开浏览器粘贴该链接打开网页');
        //       }
        //     })
        //   }
        // })
        var webPageUrl = couponList2.webPageUrl;
        //console.log('webPageUrl:', webPageUrl);
        if (webPageUrl.indexOf('?') < 0) {
          util.go("web", "?url=" + webPageUrl);
          return;
        }
        //var urlId = webPageUrl.split('=')[1];
        var baseWebUrl = webPageUrl.split('?')[0];
        var param = webPageUrl.split('?')[1];
        var paramName = param.split('=')[0];
        var paramVal = param.split('=')[1];
        this.setData({
          webPageUrl: webPageUrl
        });
        util.go("webview", "?url=" + baseWebUrl + "&" + paramName + '=' + paramVal);
      } else if (couponList2.type == 2) {
        var param = couponList2.param ? param : null
        util.go(couponList2.webPageUrl);
      }
    } else {
      var page = this
      console.log('3')
      if (util.getCache("token")) {
        page.setData({
          getHotActiveModal: true,
        })
      } else {
        util.goLogin();
      }
    }


  },

  bindKeyNameInput: function (e) {
    this.setData({
      inputNameValue: e.detail.value
    })
    console.log(this.data.inputNameValue)
  },
  bindKeyMobInput: function (e) {
    this.setData({
      inputMobValue: e.detail.value
    })
  },
  //点击领取
  formSubmit: function (e) {
    var page = this
    var param = {
      token: util.getCache("token"),
      couponId: page.data.couponId,
      userName: page.data.inputNameValue,
      userMobile: page.data.inputMobValue,
      city: util.getCityCode()
    };
    util.post(util.baseUrl, "/coupon-received-history/save", param, function (res) {
      if (res.code == 200) {
        util.alert("信息提交成功");
        page.setData({
          getHotActiveModal: false,
          showCoach: true,
          getHotActiveModal: false
        })
      } else {
        util.alert("信息提交失败");
        page.setData({
          showCoach: true,
          getHotActiveModal: true
        })
      }
    })
  },
  loadMore: function (e) {
    if (this.data.pageNo == this.data.totalPageCount) {
      return;
    }
    let pageIndex = this.data.pageNo++;
    let page = this;

    this.setData({
      pageIndex: pageIndex
    }, function () {
      getActivityHistory(page)
    })
  },
  formClose: function (e) {
    this.setData({
      getHotActiveModal: false
    })
  },
  clickActivity(e) {
    console.log(e)
    var activity = this.data.activity[e.currentTarget.dataset.index];
    if (activity.type == 1) {
      util.go("web", "?url=" + activity.webPageUrl);
    } else if (activity.type == 2) {
      var param = activity.param ? param : null
      util.go(activity.webPageUrl);
    }
  },
  clickActivityHistory(e) {
    var item = e.currentTarget.dataset.item;
    var webPageUrl = this.data.webPageUrl;
    webPageUrl = item.webPageUrl;
    //console.log('webPageUrl:', webPageUrl);
    if (webPageUrl.indexOf('?')<0){
      util.go("web", "?url=" + webPageUrl);
      return;
    }
    //var urlId = webPageUrl.split('=')[1];
    var baseWebUrl = webPageUrl.split('?')[0];
    var param = webPageUrl.split('?')[1];
    var paramName = param.split('=')[0];
    var paramVal = param.split('=')[1];
    this.setData({
      webPageUrl: webPageUrl
    });
    util.go("webview", "?url=" + baseWebUrl + "&" + paramName +'=' + paramVal);
    // wx.navigateTo({
    //   url: '/pages/webview/webview?url=' + webPageUrl
    // })
    // var item = e.currentTarget.dataset.item;
    // var webPageUrl = item.webPageUrl;
    // wx.setClipboardData({
    //   data: webPageUrl,
    //   success(res) {
    //     wx.getClipboardData({
    //       success(res) {
    //         util.toast('链接已复制，请打开浏览器粘贴该链接打开网页');
    //       }
    //     })
    //   }
    // })
  },
  goCoupon() {
    console.log('con');
    util.go('coupon');
  },
  onShow: function () {
    // this.setData({
    //   city: util.getCity(),
    //   cityCode: util.getCityCode()
    // })
    this.setData({
      activityHistory: [],
      city: util.getCity(),
      cityCode: util.getCityCode()
    }, () => {
      doRefresh(this)
    });
  },
  onPullDownRefresh: function () {
    doRefresh(this,true);
    // this.loadMore()
  },
  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})