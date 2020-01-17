const util = require('../../utils/util.js')
Page({
  data: {
    coupon: [],
    couponType: {
      1: '平台券',
      2: '驾校券',
      3: '教练券'
    },
    showfindCoachModal: false,
    insCoachModal:false
  },
  onShow() {
    this.getData();
  },
  getData() {
    this.getCoupon(this);
  },
  getCoupon(page) {
    var param = {
      city: '440300',
      province: '440000',
    };
    var url = "/coupon/select";
    util.get(util.baseUrl, url, param, function (res) {
      var data = res.data.data;
      data.forEach(function (x) {
        x.endingEffectiveTime = util.formatDate(new Date(x.endingEffectiveTime), "yyyy-MM-dd")
      })
      page.setData({
        coupon: data
      })
    })
  },
  formCloseCar: function (e) {
    this.setData({
      showfindCoachModal: false,
      showCoach: true,
      getCoupleModal: false,
    })
  },
  getCouple: function (e) {
    var couponType=e.target.dataset.type
    var couponId = e.target.dataset.id
    var page = this
    if (couponType==1){
      page.setData({
        //平台券
        showfindCoachModal: true,
        couponId: couponId
      })
    }else{
      //驾校 教练
      page.setData({
      insCoachModal:true,
        couponId: couponId
      })
    }
  },
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
          getCoupleModal: false,
          insCoachModal:false
        })
      } else if (res.code == 11601){
        util.toast("很抱歉，优惠券已被抢完！");
      }else{
        util.toast("很抱歉，优惠券已被抢完！")
      }
    })
  },
  //关闭弹窗
  closeCoachDialog: function () {
    this.setData({
      showfindCoachModal: false,
      insCoachModal:false
    })
  }
})
