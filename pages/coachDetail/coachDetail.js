
const util = require('../../utils/util.js')
Page({
  data: {
    moreImg: true,
    markers: [{
      id: 0,
      latitude: util.getLat(),
      longitude: util.getLng()
    }, ],
    polyline: [{
      points: [{
        longitude: util.getLat(),
        latitude: util.getLng(),
      }, {
        longitude: util.getLat(),
        latitude: util.getLng(),
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    detailList: {},
    drivingFieldList: {},
    coachImgVideoList: [],
    coachVisitor: [],
    showEllipsis: false,
    showModal: false,
    isCollection: false,
    getCoupleModal: false,
    showfindCoachModal:false,
    showCoachImg:false,
    noMoreImg:false,
    showMoreImg:true,
    systemWidth: 0,
    systemHieght: 0,
    isIos: false,
    isAndroid: false,
    // 模拟器
    devtools: false,
    inputNameGetCou:'',
    inputMobGetCou:'',
    pageNo: 1,
    totalPageCount: 1,
    pageSize:3,
    targettype:'',

  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onShow: function() {
    getCoach(this)
    getDrivingField(this)
    coachVisitor(this)
    doRefresh(this)
    this.setData({
      token:util.getCache('token')
    })
    //记录浏览历史
    var history = util.getCache(util.lskey_history);
    var array;
    if (history) {
      array = JSON.parse(history);
    } else {
      array = new Array();
    }
    array.push(this.data.id)

    //去重
    var obj = new Array();
    for (var i = array.length - 1; i >= 0; i--) {
      var item = array[i];
      var hasItem = false;
      for (var j = 0; j < obj.length; j++) {
        if (obj[j] == item) {
          hasItem = true
          break;
        }
      }
      if (!hasItem) {
        obj.push(item)
      }
    }
    util.setCache(util.lskey_history, JSON.stringify(obj.reverse()));
  },
  onLoad: function(options) {
    var page = this
    page.setData({
      id: options.id,
      targettype: options.targettype,
      photo: util.getCache("photo")
    })
      page.setData({
        systemWidth: wx.getSystemInfoSync().windowWidth,
        systemHieght: wx.getSystemInfoSync().windowHeight
      })
  },
  onLaunch:function(){
    
  },
  moreCoachImg: function(e) {
    console.log('showModal')
    this.setData({
      showModal: true
    })
  },
  closePreview: function(e) {
    this.setData({
      showModal: false
    })
  },
  addCoach: function() {
    var token = util.getCache("token")
    var page = this
    if (token) {
      var url = "/coach/addCollection";
      if (page.data.isCollection) {
        url = "/coach/removeCollection";
      }
      var param = {
        token: token,
        id: page.data.id
      }
      util.post(util.baseUrl, url, param, function(res) {
        if (res.code == 200) {
          if (!page.data.isCollection) {
            util.toast("已收藏")
          }
          page.setData({
            isCollection: !page.data.isCollection
          })
        }
      })
    } else {
      util.goLogin();
    }
  },
 
  goApply: function(e) {
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
      })
    } else {
      util.goLogin();
    }
  },
  formClose:function(e){
    var page =this
    page.setData({
      showfindCoachModal:false
    })
  },
  getCouple: function(e) {
    var couponId=e.target.dataset.id
    var page = this
    if(util.getCache('token')){
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
        couponId: couponId
      })
      console.log('couponId', couponId)
    }else{
      util.goLogin()
    }
  },
  formCloseCar: function(e) {
    this.setData({
      getCoupleModal: false,
      showfindCoachModal: false
    })
  },
  bindNameGetCou: function(e) {
    this.setData({
      inputNameGetCou: e.detail.value
    })
  },
  bindMobGetCou: function(e) {
    this.setData({
      inputMobGetCou: e.detail.value
    })
  },
  submit() {
    formGetCoupleSubmit(this);
    formfindCoachSubmit(this);
  },
  //领取优惠券
  formGetCoupleSubmit: function(e) {
    var page = this
    page.data.detailList.coupons.forEach(item => {
      if (page.data.couponId==item.id)
      page.setData({
        couponId: item.id
      })
    })
    var param = {
      token: util.getCache("token"),
      couponId: page.data.couponId,
      userName: page.data.inputNameGetCou,
      userMobile: page.data.inputMobGetCou,
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
    util.newpost(util.baseUrl, "/coupon-received-history/save", param, function(res) {
      if (res.code == 200) {
        util.alert("领取成功，请在【我的】查看优惠券");
        page.setData({
          getCoupleModal: false
        })
      } else if (res.code == 11601) {
        util.toast("很抱歉，优惠券已被抢完！");
      }else{
        util.toast("很抱歉，优惠券已被抢完！");
      }
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
  formfindCoachSubmit: function (e) {
    var page = this
    var param = {
      name: this.data.inputName,
      mobile: this.data.inputMob,
      coachId:page.data.id,
      province: util.getProvinceCode(),
      city: util.getCityCode(),
    }
    if (!this.data.inputName || !this.data.inputMob) {
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
        page.setData({
          showfindCoachModal: false
        })
      }else{
        util.toast("信息填写错误");
      }
    })
  },
 
  onShareAppMessage:function(ops){ 
    var headImg = ops.target.dataset.headimg
    return{
      title:"严选教练,为你学车精选优质教练",
      imageUrl: headImg
    }
  },
  recommentClick:function(){
    util.goLogin();
  },
  loadMore: function (e) {
    // if (this.data.pageNo == this.data.totalPageCount) {
    //   return;
    // }
    // let pageIndex = this.data.pageNo++;
    // let page = this;

    // this.setData({
    //   pageIndex: pageIndex
    // }, function () {
    //   getCoach(page)
    // })
    if (this.data.coachImgVideoList.length == this.data.coachImgVideoList.length){
      this.setData({
        noMoreImg: true,
        showMoreImg:false
      })
    }
    this.setData({
      coachImgVideoList: this.data.coachImgVideoList,
      showCoachImg:true
    })
    console.log(this.data.coachImgVideoList,'this.data.coachImgVideoList')
  },
  onReachBottom: function () {
    //this.loadMore()
  },
})

function getCoach(page) {
var param = {
    id: page.data.id,
    token: util.getCache("token"),
  };
  util.get(util.baseUrl, "/coach/detail", param, function(res) {
    var detailList = res.data;
    if (res.data.coachImgVideo) {
    //后台规定选择type为98的
      var coachImgVideoList = res.data.coachImgVideo.filter(item => item.type != 98)
    }
    // coachImgVideoList = detailList.coachImgVideo.concat(coachImgVideoList)
    page.setData({
      detailList: detailList,
      coachImgVideoList: coachImgVideoList,
      // pageNo: res.data.pageNo,
      // totalPageCount: res.data.totalPageCount
    })
  })
}



function getDrivingField(page) {
  var param = {
    id: page.data.id,
    city: util.getCityCode(),
    longtitude: util.getLng(),
    latitude: util.getLat()
  }
  util.get(util.baseUrl, "/drivingField/nearBy", param, function(res) {
    var drivingFieldList = res.data
    const markers = page.data.markers
    var latitudeCur = drivingFieldList.locationCenterLatitude
    var longitudeCur = drivingFieldList.locationCenterLongitude
    markers[1] = {}
    markers[1].latitude = latitudeCur
    markers[1].longitude = longitudeCur
    page.setData({
      drivingFieldList: drivingFieldList,
      markers: markers
    })
  })
}

function coachVisitor(page) {
  var param = {
    id: page.data.id,
    token: util.getCache("token")
  }
  util.get(util.baseUrl, "/coach/coachVisitor", param, function(res) {
    var coachVisitor = res.data;
    page.setData({
      coachVisitor: coachVisitor
    })
    if (coachVisitor.length >= 21) {
      page.setData({
        showEllipsis: true
      })
    }
  })
}

function getCollection(page) {
  var token = util.getCache("token");
  if (!token) {
    return
  }
  var param = {
    id: page.data.id,
    token: util.getCache("token"),
  }
  util.get(util.baseUrl, "/coach/ifCollection", param, function(res) {
    if (res.data > 0) {
      page.setData({
        isCollection: true
      })
    }
  })
};

function doRefresh(page) {
  getCollection(page);
  couponSelect(page)
};

function couponSelect(page) {
  var param = {
    city: util.getCityCode(),
    pageIndex: 1,
    pageSize: 20,
    coachId: page.data.id
  }
  util.get(util.baseUrl, "/coupon/selectForCoach", param, function(res) {
    var couponSelect = res.data.data;
    for (var i in couponSelect) {
      couponSelect[i].beginningApplicableMoney = couponSelect[i].beginningApplicableMoney/100;
    }
    console.log("type:",page.data.targettype);
    if ('more' == page.data.targettype){
      page.setData({
        couponSelect: couponSelect,
      }, scrollTopImg)
    }else{
      page.setData({
        couponSelect: couponSelect,
      })
    }
  })
};
function scrollTopImg(){
  let query = wx.createSelectorQuery()
  query.select('.coachPerImg').boundingClientRect(function (rect) {
    console.log("rect", rect)
    wx.pageScrollTo({ scrollTop: rect.top })
  }).exec()
}

