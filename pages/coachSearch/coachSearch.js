// pages/coachSearch/coachSearch.js
const util = require('../../utils/util.js')

function getCoach(page) {
  var pageIndex = page.data.coachlist ? parseInt(page.data.coachlist.length / page.data.pageSize) + 1 : 1
  var param = {
    city: util.getCityCode(),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
    longtitude: util.getLng(),
    latitude: util.getLat(),
    searchText: page.data.searchText
  };

  util.get(util.baseUrl, "/coach/list", param, function(res) {
    var data = res.data.data
    var coachlist = page.data.coachlist;
    if (pageIndex == 1 || !coachlist) {
      coachlist = data;
    } else {
      coachlist = coachlist.concat(data);
    }
    var canLoadMore = !(!data || data.length < param.pageSize);
    var noData = !data || data.length < 1;
    var imgsList = [];
    coachlist.forEach(function(item) {
      imgsList.push(...item.imgs);
    })
    page.setData({
      coachlist: coachlist,
      imgsList: imgsList,
      canLoadMore: canLoadMore,
      noData: noData
    })
  })
};
Page({
  data: {
    pageIndex: 1,
    pageSize: 20,
    noData: false,
    coachlist: [],
    showModal: false,
    showMorePhModal: true,
    showCoach: true,
    showMoreImg: true,
    showGetCoupleModal: false,
    showfindCoachModal: false,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    systemWidth:0,
    systemHieght: 0,
    selectCoachId: null,
    isIos:false,
    isAndroid:false,
    devtools:false
  },
  onLoad: function(options) {
    var page = this
    page.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })
  },
  onShow: function() {
    var page = this;
    this.setData({
      searchText: null
    })
    wx.getSystemInfo({
      success(res) {
        page.setData({
          windowHeight: res.windowHeight * 750 / res.windowWidth
        })
      }
    })
  },
  onEnterPress: function(e) {
    this.setData({
      coachlist: [],
      scrollTop: 0
    })
    getCoach(this);
  },
  inputText(e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    util.go("coachDetail", "?id=" + id);
  },
  loadMore(e) {
    if (this.data.canLoadMore) {
      getCoach(this)
    }
  },
  onShareAppMessage: function() {
    return util.getShareContent()
  },
  moreImg(e) {
    this.setData({
      showModal: true,
      showMorePhModal: false,
      showCoach: false,
      showMoreImg: false,
      moreimgList: e.currentTarget.dataset.imgslist
    })
  },

  closePreview() {
    this.setData({
      showModal: false,
      showMorePhModal: true,
      showCoach: true,
      showMoreImg: true

    })
  },
  findCoachLearnCar: function(e) {
    var coachId=e.target.dataset.id
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
        showfindCoachModal: true,
        showCoach: false,
        selectCoachId: coachId
      })
    } else {
      util.goLogin();
    }
    
  },
  formCloseCar: function(e) {
    this.setData({
      showfindCoachModal: false,
      showCoach: true,
      getCoupleModal: false,
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
  formSubmit: function(e) {
    var page = this
    this.data.couponSelect.forEach(item => {
      page.setData({
        couponId: item.id
      })
    })
    var param = {
      token: util.getCache("token"),
      couponId: this.data.couponId,
      userName: this.data.inputNameValue,
      userMobile: this.data.inputMobValue,
      city: util.getCityCode()
    };
    util.post(util.baseUrl, "/coupon-received-history/save", param, function(res) {
      if (res.code == 200) {
        util.alert("信息提交成功");
        page.setData({
          showGetCoupleModal: false,
          showCoach: true,
        })
      } else {
        util.alert("信息提交失败");
        page.setData({
          showCoach: true,
        })
      }
    })
  },
  // 找他报名
  bindNameInput: function(e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindMobInput: function(e) {
    this.setData({
      inputMob: e.detail.value
    })
  },
  formfindCoachSubmit: function(e) {
    var page = this
    var coachId = this.data.selectCoachId
    var param = {
      token: util.getCache("token"),
      name: this.data.inputName,
      mobile: this.data.inputMob,
      coachId: coachId,
      province: util.getProvinceCode(),
      city: util.getCityCode(),
    }
    if (!this.data.inputName || !this.data.inputName) {
      util.toast("信息填写完整，客服才能为您服务哦！");
      return;
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.inputMob))) {
      util.toast('手机号格式不对');
      return;
    }
    
    util.post(util.baseUrl, "/preSignUp/addSimple", param, function(res) {
      if (res.code == 200) {
        util.toast("信息提交成功");
        page.setData({
          showfindCoachModal: false
        })
      } else {
        util.alert("信息提交失败");
      }
    })
  },
  //领取优惠券
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
  getCouple:function(e){
    var page = this
    var coachId = e.currentTarget.dataset.id
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
        coachId:coachId
      })
    } else {
      util.goLogin();
    }
  },
  formGetCoupleSubmit: function (e) {
    var page = this
    page.data.coachlist.forEach(item => {
      if (page.data.coachId == item.id) {
        item.coupons.forEach(i => {
          page.setData({
            couponId: i.id
          })
        })
      }
    })

    var param = {
      token: util.getCache("token"),
      couponId: this.data.couponId,
      userName: this.data.inputNameGetCou,
      userMobile: this.data.inputMobGetCou,
      city: util.getCityCode()
    };
    util.newpost(util.baseUrl, "/coupon-received-history/save", param, function (res) {
      if (res.code == 200) {
        util.toast("领取成功，请在【我的】查看优惠券");
        page.setData({
          getCoupleModal: false,
        })
      } else if (res.code == 11603) {
        util.toast("很抱歉，优惠券已被抢完！");
        getCoupleModal: false
      } else {
        util.toast("很抱歉，优惠券已被抢完！");
        getCoupleModal: false
      }
    })
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('搜索页面跳转到每个教练得详细页面id' + id)
    util.go("coachDetail", "?id=" + id);
  }
})