// pages/home/home.js
const util = require('../../utils/util.js')
const app = getApp()

function getActivity(page) {
  var param = {
    city: page.data.cityCode
  };
  //util.baseUrl
  util.get("https://yxjl.91ygxc.com/wx", "/activity/list", param, function (res) {
    page.setData({
      activity: res.data
    })
  })
};
const coachParam = {
  vehicleType: null,
  sex: null,
  minClassPrice: null,
  maxClassPrice: null
};


function getCoach(page) {
  var pageIndex = page.data.coachlist ? parseInt(page.data.coachlist.length / page.data.pageSize) + 1 : 1

  if (page.data.selectCarName == "C1和C2") {
    var param = {
      city: util.getCityCode(),
      longtitude: util.getLng(),
      latitude: util.getLat(),
      tags: page.data.coachFilterTags.join(),
      vehicleType: null,
      pageSize: page.data.pageSize,
      pageIndex: pageIndex

    }
    
    util.get(util.baseUrl, "/coach/list", param, function (res) {
      var data = res.data.data
      var coachlist = page.data.coachlist;
      var rowCount = page.data.rowCount;
      if (pageIndex == 1 || !coachlist) {
        coachlist = data;
      } else {
        coachlist = coachlist.concat(data);
      }
      if(!rowCount){
        rowCount = res.data.rowCount;
      }
      var canLoadMore = !(!data || data.length < param.pageSize);
      page.setData({
        coachlist: coachlist,
        canLoadMore: canLoadMore
      })
      coachlist.forEach(function (item) {
        page.setData({
          imgsList: item.imgs,
          rowCount: rowCount
        })
      })
    })

  }
  if (page.data.selectCarName == "C1") {
    var pageIndex = page.data.coachlist ? parseInt(page.data.coachlist.length / page.data.pageSize) + 1 : 1
    var param = {
      city: util.getCityCode(),
      longtitude: util.getLng(),
      latitude: util.getLat(),
      tags: page.data.coachFilterTags.join(),
      vehicleType: page.data.selectCarName,
      pageSize: page.data.pageSize,
      pageIndex: pageIndex
    }
    util.get(util.baseUrl, "/coach/list", param, function (res) {
      var data = res.data.data
      var coachlist = page.data.coachlist;
      if (pageIndex == 1 || !coachlist) {
        coachlist = data;
      } else {
        coachlist = coachlist.concat(data);
      }
      var canLoadMore = !(!data || data.length < param.pageSize);
      page.setData({
        coachlist: coachlist,
        canLoadMore: canLoadMore
      })
      coachlist.forEach(function (item) {
        page.setData({
          imgsList: item.imgs,
        })
      })
    })

  }
  if (page.data.selectCarName == "C2") {
    var pageIndex = page.data.coachlist ? parseInt(page.data.coachlist.length / page.data.pageSize) + 1 : 1
    var param = {
      city: util.getCityCode(),
      longtitude: util.getLng(),
      latitude: util.getLat(),
      tags: page.data.coachFilterTags.join(),
      vehicleType: page.data.selectCarName,
      pageSize: page.data.pageSize,
      pageIndex: pageIndex
    }
    util.get(util.baseUrl, "/coach/list", param, function (res) {
      var data = res.data.data
      var coachlist = page.data.coachlist;
      if (pageIndex == 1 || !coachlist) {
        coachlist = data;
      } else {
        coachlist = coachlist.concat(data);
      }
      var canLoadMore = !(!data || data.length < param.pageSize);
      page.setData({
        coachlist: coachlist,
        canLoadMore: canLoadMore
      })
      coachlist.forEach(function (item) {
        page.setData({
          imgsList: item.imgs,
        })
      })
    })
  }
};

function couponSelect(page) {
  var param = {
    city: util.getCityCode(),
    pageIndex: 1,
    pageSize: 1
  }
  util.get(util.baseUrl, "/coupon/select", param, function (res) {
    var couponSelect = res.data.data;
    if (couponSelect) {
      page.setData({
        couponSelect: couponSelect,
      })
    }
  })
}

function getcoachTag(page) {
  var param = {}
  util.get(util.baseUrl, "/coach/coachTags", param, function (res) {
    var data = res.data;
    var coachTag = [];
    data.forEach(function (x) {
      if (x.type == 2) {
        coachTag.push(x);
      }
    });
    page.setData({
      coachTag: coachTag,
    })

  })
}

function doRefresh(page) {
  page.setData({
    coachlist: [],
    activity: [],
    couponSelect: [],
    imgsList: [],
  }, function () {
    getActivity(page);
    getCoach(page);
    couponSelect(page);
    // showCaseList(page);
    showCaseListTab(page);
    getcoachTag(page)
  });
};

function showCaseList(page) {
  var param = {
    position: 2
  }
  util.get(util.baseUrl, "/showCase/list", param, function (res) {
    var showCaseList = res.data.data;
    page.setData({
      showCaseList: showCaseList,
    })
  })
}

function showCaseListTab(page) {
  var param = {
    position: 1
  }
  util.get(util.baseUrl, "/showCase/list", param, function (res) {
    var showCaseListTab = res.data.data;
    if (showCaseListTab.length>1) {
      wx.showTabBar({
        animation: true //是否需要过渡动画
      })
    } else {
      wx.hideTabBar({
        animation: true //是否需要过渡动画
      })
    }
    page.setData({
      showCaseListTab: showCaseListTab,
    })
  })
}

function remove(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 1,
    pageIndex: 1,
    pageSize: 20,
    coachlist: [],
    coachTag: [],
    coachFilterTags: [],
    selectArray: [
      [{
        id: 1,
        text: "综合推荐"
      },
      {
        id: 2,
        text: "距离近"
      }
      ],
      [{
        id: null,
        text: "C1和C2"
      },
      {
        id: 'C1',
        text: "C1"
      }, {
        id: 'C2',
        text: "C2"
      }
      ],
      [{
        id: 0,
        text: "价格",
        minPrice: null,
        maxPrice: null
      },
      {
        id: 1,
        text: "4000元以下",
        minPrice: null,
        maxPrice: 4000 * 100
      }, {
        id: 2,
        text: "4000-5000元",
        minPrice: 4000 * 100,
        maxPrice: 5000 * 100
      }, {
        id: 3,
        text: "5000-7000元",
        minPrice: 5000 * 100,
        maxPrice: 7000 * 100
      }, {
        id: 4,
        text: "7000元以上",
        minPrice: 7000 * 100,
        maxPrice: null
      }
      ]
    ],
    selectShow: [false, false, false], //初始option不显示
    isShow: false,
    animationData: [{}, {}, {}], //右边箭头的动画
    currentIndex: -1,
    selectSort: 1,
    selectCar: null,
    selectPrice: null,
    selectSortName: "综合推荐",
    selectCarName: "C1和C2",
    selectPriceName: "价格",
    animation: '',
    showModal: false,
    showMorePhModal: true,
    showCoach: true,
    showMoreImg: true,
    showGetCoupleModal: false,
    showfindCoachModal: false,
    getCoupleModal: false,
    getFirstCoupleModal: false,
    getCoupleWrap: false,
    rowCount: null,
    searchCoachList: 0,
    showGoTopheight: 0,
    hideGoTop: true,
    imgsList: [],
    showCaseList: [],
    showCaseListTab: [],
    topNum: 0,
    arrowDownStatus: false,
    searchText: null, //选择教练搜索值
    getHotActiveModal: false,
    getPhoneNumber: false,
    navH: '',
    navTop: '',
    navTitleTop: '',
    headerBlank: '',
    searchTop: '',
    systemWidth: 0,
    systemHieght: 0,
    isIos: false,
    isAndroid: false,
    // 模拟器
    devtools: false
  },
  onLoad: function () {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })
    this.setData({
      navH: app.globalData.isIphoneX ? 160 : 112,
      navTop: app.globalData.isIphoneX ? 30 : 8,
      navTitleTop: app.globalData.isIphoneX ? 58 : 16,
      headerBlank: app.globalData.isIphoneX ? 60 : 20,
      searchTop: app.globalData.isIphoneX ? 176 : 113
    })
    page.setData({
      city: util.getCity(),
      cityCode: util.getCityCode(),
      //首页领取优惠券判断是否授权
      token: util.getCache("token"),
      name: util.getCache("name"),
      photo: util.getCache("photo")
    }, function () {
      var refresh = util.getCache(util.lskey_homeRefresh);
      doRefresh(page);
      util.setCache(util.lskey_homeRefresh, false);
    }) 

  },
  onShow: function () {
    var page = this
    page.setData({
      city: util.getCity(),
      cityCode: util.getCityCode(),
      //首页领取优惠券判断是否授权
      token: util.getCache("token"),
      name: util.getCache("name"),
      photo: util.getCache("photo")
    })
    // var page = this;
    // this.setData({
    //   navH: app.globalData.isIphoneX ? 160 : 112,
    //   navTop: app.globalData.isIphoneX ? 30 : 8,
    //   navTitleTop: app.globalData.isIphoneX ? 58 : 16,
    //   headerBlank: app.globalData.isIphoneX ? 60 : 20,
    //   searchTop: app.globalData.isIphoneX ? 176 : 113
    // })
    // page.setData({
    //   city: util.getCity(),
    //   cityCode: util.getCityCode(),
    //   //首页领取优惠券判断是否授权
    //   token: util.getCache("token"),
    //   name: util.getCache("name"),
    //   photo: util.getCache("photo")
    // }, function () {
    //   var refresh = util.getCache(util.lskey_homeRefresh);
    //   doRefresh(page);
    //   util.setCache(util.lskey_homeRefresh, false);
    // })

  },
  search(e) {
    this.setData({
      searchText: e.detail.value
    });
  },
  clickActivity(e) {
    var couponId = e.currentTarget.dataset.couponid;
    this.setData({
      couponId: couponId,
    })
    if (couponId == 0) {
      var activity = this.data.showCaseListTab[e.currentTarget.dataset.index];
      if (activity.type == 1) {
        util.go("web", "?url=" + activity.webPageUrl);
      } else if (activity.type == 2) {
        var param = activity.param ? param : null
        util.go(activity.webPageUrl);
      }
    } else {
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
  clickHotActive(e) {
    var couponId = e.currentTarget.dataset.couponid;
    this.setData({
      couponId: couponId
    })
    if (couponId == 0) {
      var clickHotActiveList = this.data.showCaseList[e.currentTarget.dataset.index];
      if (clickHotActiveList.type == 1) {
        util.go("web", "?url=" + clickHotActiveList.webPageUrl);
      } else if (clickHotActiveList.type == 2) {
        var param = clickHotActiveList.param ? param : null
        util.go(clickHotActiveList.webPageUrl);
      }
    } else {
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
  goCoachList() {
    util.go("coachList");
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('id' + id)
    util.go("coachDetail", "?id=" + id);
  },
  goCity() {
    util.go("city");
  },
  goSearch() {
    util.go("coachSearch");
  },
  onPullDownRefresh: function () {
    console.log('dorefresh');
    doRefresh(this);
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  getTagid(e) {
    var dataId = e.currentTarget.dataset.id;
    var coachTag = this.data.coachTag;
    var coachFilterTags = this.data.coachFilterTags;
    var coatchItem = coachTag.find(function (x) {
      return x.id == dataId
    });
    if (coatchItem.activeStatus) {
      coatchItem.activeStatus = false;
      coachFilterTags = remove(coachFilterTags, dataId);
    } else {
      coatchItem.activeStatus = true;
      coachFilterTags.push(dataId);
    }
    this.setData({
      coachTag: coachTag,
      coachFilterTags: coachFilterTags,
    });
    coachParam.tags = coachFilterTags.join();
    getCoach(this);
  },
  //option的显示与否
  selectToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    var currentIndex = this.data.currentIndex;
    for (var i = 0; i < this.data.selectShow.length; i++) {
      this.closeAnim(this, i);
    }
    if (currentIndex == index) {
      this.setData({
        currentIndex: -1,
        isShow: false
      })
    } else {
      this.openAnim(this, index)
      this.setData({
        currentIndex: index,
        isShow: true
      })
    }
  },
  //箭头关闭动画
  closeAnim(page, index) {
    var animation = wx.createAnimation({
      timingFunction: "ease"
    })
    animation.rotate(0).step();
    var animationData = page.data.animationData
    animationData[index] = animation.export()
    page.setData({
      animationData: animationData
    })
  },
  //箭头打开动画
  openAnim(page, index) {
    var animation = wx.createAnimation({
      timingFunction: "ease"
    })
    animation.rotate(180).step();
    var animationData = page.data.animationData
    animationData[index] = animation.export()
    page.setData({
      animationData: animationData
    })
  },
  //设置内容
  setText: function (e) {
    var nowData = this.data.selectArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
    var nowIdx = e.target.dataset.index; //当前点击的索引
    var nowText = nowData[nowIdx].text; //当前点击的内容
    //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
    this.animation.rotate(0).step();
    this.setData({
      selectShow: false,
      nowText: nowText,
      animationData: this.animation.export()
    })
  },
  clickSelect: function (e) {
    var page = this;
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text;
    if (this.data.currentIndex == 0) {
      this.setData({
        selectSort: id,
        selectSortName: text
      })
    } else if (this.data.currentIndex == 1) {
      coachParam.vehicleType = id;
      this.setData({
        selectCar: id,
        selectCarName: text
      })
      console.log('selectSortName' + page.data.selectCarName)
    } else if (this.data.currentIndex == 2) {
      this.setData({
        selectPrice: id,
        selectPriceName: text
      })
      console.log('selectSortName' + page.data.selectSortName)
    }
    var minPrice = null;
    var maxPrice = null;
    if (this.data.selectArray[this.data.currentIndex] && this.data.selectArray[this.data.currentIndex][id]) {
      minPrice = this.data.selectArray[this.data.currentIndex][id].minPrice;
      maxPrice = this.data.selectArray[this.data.currentIndex][id].maxPrice;
    }
    this.setData({
      currentIndex: -1,
      isShow: false,
      pageIndex: 1,
      coachlist: [],
      minPrice: minPrice,
      maxPrice: maxPrice
    }, function () {
      getCoach(page);
    })
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      getCoach(this);
    }
  },
  moreImg(e) {
    var currentCoachId = e.currentTarget.dataset.id
    this.setData({
      showModal: true,
      //showMorePhModal: false,
      showCoach: false,
      showMoreImg: true,
      currentCoachId: currentCoachId,
      moreimgList: e.currentTarget.dataset.imgslist
    })
    util.go("coachDetail", "?id=" + currentCoachId + "&targettype=more")
  },

  closePreview() {
    this.setData({
      showModal: false,
      showMorePhModal: true,
      showCoach: true,
      showMoreImg: true

    })
  },
  hotSelMore() {
    console.log('activity')
    wx.switchTab({
      url: '/pages/activity/activity'
    })
  },
  arrowDown() {
    var arrowDownStatus = this.data.arrowDownStatus;
    if (arrowDownStatus) {
      arrowDownStatus = false;
    } else {
      arrowDownStatus = true;
    }
    this.setData({
      arrowDownStatus: arrowDownStatus
    });
  },
  onPageScroll: function (e) {
    let that = this;
    console.log('scroll:', e.scrollTop);
    that.setData({
      searchCoachList: e.scrollTop,
      showGoTopheight: e.scrollTop
    });
    console.log('showGoTopheight' + this.data.showGoTopheight)
  },
  scroll: function (e) {
    this.isHideGotop(e)
    this.setSearchCoachPosition(e)
  },
  setSearchCoachPosition: function (e) {
    const scrollTop = e.detail.scrollTop
    const searchCoachList = this.data.searchCoachList
    if (!searchCoachList && scrollTop > 474) {
      this.setData({
        searchCoachList: app.globalData.isIphoneX ? 'topnav iphoneX' : 'topnav'
      })
      return;
    }
    if (searchCoachList && scrollTop < 474) {
      this.setData({
        searchCoachList: ''
      })
    }
  },
  isHideGotop: function (e) {
    const hideGoTop = this.data.hideGoTop;
    if (hideGoTop && e.detail.scrollTop > 504) {
      this.setData({
        hideGoTop: false
      });
      return;
    }
    if (!hideGoTop && e.detail.scrollTop < 504) {
      this.setData({
        hideGoTop: true
      });
    }
  },
  //回到顶部
  goTop: function (e) {
    let page = this;
    console.log('e' + e)
    page.setData({
      topNum: 0
    });
  },
  //点击领取
  // getBtn: function(e) {
  //   var id = e.currentTarget.dataset.id
  //   this.setData({
  //     showGetCoupleModal: true,
  //     showCoach: false,

  //   })
  // },
  formClose: function (e) {
    this.setData({
      showGetCoupleModal: false,
      showCoach: true,
      getHotActiveModal: false
    })
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
  // 找他报名
  bindNameInput: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindMobInput: function (e) {
    this.setData({
      inputMob: e.detail.value
    })
  },
  bindNameGetCou: function (e) {
    this.setData({
      inputNameGetCou: e.detail.value
    })
  },
  bindMobGetCou: function (e) {
    this.setData({
      inputMobGetCou: e.detail.value
    })
  },
  submit() {
    if (!this.data.inputNameValue || !this.data.inputMobValue) {
      util.toast("选项不能为空!")
      return
    }
    formSubmit(this);
  },
  //点击领取
  formSubmit: function (e) {
    var data = e.detail;
    var page = this
    var param = {
      token: util.getCache("token"),
      couponId: page.data.couponId,
      userName: data.name,
      userMobile: data.telephoneNum,
      city: util.getCityCode()
    };
    if (!data.name || !data.telephoneNum) {
      util.toast("信息填写完整，客服才能为您服务哦！");
      return;
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(data.telephoneNum))) {
      util.toast('手机号格式不对');
      return;
    }
    util.newpost(util.baseUrl, "/coupon-received-history/save", param, function (res) {
      if (res.code == 200) {
        util.toast("领取成功，请在【我的】查看优惠券");
        page.setData({
          showGetCoupleModal: false,
          showCoach: true,
          getHotActiveModal: false
        })
      } else if (res.code == 11603) {
        util.toast("很抱歉，优惠券已被抢完！");
        page.setData({
          showCoach: true,
          getHotActiveModal: true
        })
      } else {
        util.toast("很抱歉，优惠券已被抢完！");
        page.setData({
          showCoach: true,
          getHotActiveModal: true
        })
      }
    })
  },
  findCoachLearnCar: function (e) {
    var coachId = e.target.dataset.id
    var page = this
    if (util.getCache("token")) {
      wx.getSystemInfo({
        success: function (res) {
          page.setData({
            systemInfo: res,
          })

          if (res.platform == "devtools") {
            page.setData({
              devtools: true
            })

            console.log(page.data.systemInfo)
          } else if (res.platform == "ios") {
            page.setData({
              isIos: true,
            })
          } else if (res.platform == "android") {
            page.setData({
              isAndroid: true
            })
          }
        }
      })
      this.setData({
        showfindCoachModal: true,
        showCoach: false,
        coachId: coachId
      })
    } else {
      util.goLogin();
    }
  },
  formCloseCar: function (e) {
    this.setData({
      showfindCoachModal: false,
      showCoach: true,
      getCoupleModal: false,
      getFirstCoupleModal: false
    })
  },
  //教练详情领券getCouple
  getCouple: function (e) {
    var coachId = e.currentTarget.dataset.id
    var getCoupleItem = e.currentTarget.dataset.item.coupons
    var page = this
    if (util.getCache("token")) {
      wx.getSystemInfo({
        success: function (res) {
          page.setData({
            systemInfo: res,
          })
          if (res.platform == "devtools") {
            page.setData({
              devtools: true
            })

            console.log(page.data.systemInfo)
          } else if (res.platform == "ios") {
            page.setData({
              isIos: true,
            })
          } else if (res.platform == "android") {
            page.setData({
              isAndroid: true
            })
          }
        }
      })
      page.setData({
        getCoupleModal: true,
        coachId: coachId,
        getCoupleItem,

      })
    } else {
      util.goLogin();
    }
    console.log('coachId' + page.data.coachId)
  },
  formGetCoupleSubmit: function (e) {
    var page = this
    var getFirstCouponId = page.data.getCoupleItem.shift().id
    var param = {
      token: util.getCache("token"),
      couponId: getFirstCouponId,
      userName: this.data.inputNameGetCou,
      userMobile: this.data.inputMobGetCou,
      city: util.getCityCode()
    };
    if (!this.data.inputNameGetCou || !this.data.inputMobGetCou) {
      util.toast("信息填写完整，客服才能为您服务哦！");
      return;
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.inputMobGetCou))) {
      util.toast('手机号格式不对');
      return;
    }
    util.newpost(util.baseUrl, "/coupon-received-history/save", param, function (res) {

      if (res.code == 200) {
        util.toast("领取成功，请在【我的】查看优惠券");
        page.setData({
          getCoupleModal: false
        })
      } else if (res.code == 11605) {
        util.toast("很抱歉，优惠券已被抢完！");
      } else {
        util.toast("很抱歉，优惠券已被抢完！");
      }
    })
  },
  formfindCoachSubmit: function (e) {
    var page = this
    var param = {
      token: util.getCache("token"),
      name: this.data.inputName,
      mobile: this.data.inputMob,
      coachId: page.data.coachId,
      province: util.getProvinceCode(),
      city:util.getCityCode(),
    }
    if (!this.data.inputName || !this.data.inputName) {
      util.toast("信息填写完整，客服才能为您服务哦！");
      return;
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.inputMob))) {
      util.toast('手机号格式不对');
      return;
    }
    util.post(util.baseUrl, "/preSignUp/addSimple", param, function (res) {
      if (res.code == 200) {
        util.toast("提交成功，客服会尽快与您联系哦！");
        page.formCloseCar();
      } else {
        util.toast("信息提交失败");
      }
    })
  },
  formGetBannerCoupleSubmit: function (e) {
    var page = this
    var data = e.detail
    var couponsPlatId = page.data.coachlist[0].coupons.filter(x => {
      if (x.type == 1) {
        return x.id
      }
    })
    var param = {
      token: util.getCache("token"),
      couponId: couponsPlatId[0].id,
      userName: data.name,
      userMobile: data.telephoneNum,
      city: util.getCityCode()
    };
    if (!data.name || !data.telephoneNum) {
      util.toast("信息填写完整，客服才能为您服务哦！");
      return;
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(data.telephoneNum))) {
      util.toast('手机号格式不对');
      return;
    }
    util.newpost(util.baseUrl, "/coupon-received-history/save", param, function (res) {
      if (res.code == 200) {
        util.toast("领取成功，请在【我的】查看优惠券");
        page.setData({
          getFirstCoupleModal: false
        })
      } else if (res.code == 11603) {
        util.toast("很抱歉，优惠券已被抢完！");
      } else {
        util.toast("很抱歉，优惠券已被抢完！");
      }
    })
  },
  getCoupleFirst: function (e) {
    console.log('去组件里面把coachdialog页面里的devtools代码打开')
    var page = this
    if (util.getCache('token')) {
      this.setData({
        getFirstCoupleModal: true,
      })
    } else {
      util.goLogin()
    }
  },
  //关闭弹窗
  closeCoachDialog: function () {
    this.setData({
      getHotActiveModal: false,
      getFirstCoupleModal: false
    })
  },
  //下拉刷新
  loadMore(e) {
    if (this.data.canLoadMore) {
      getCoach(this)
    }
  },
  addCoachListData(e) {
    console.log(e);
    this.loadMore(e);
  }
})