// pages/apply/apply.js
const util = require('../../utils/util.js')

function getClassType(page) {
  var param = {
    id: page.data.coachId
  };
  util.get(util.baseUrl, "/classType/listByCoach", param, function(res) {
    page.setData({
      classType: res.data,
      nowText: res.data[0].name,
      classTypeId: res.data[0].id
    })
  })
};
function sendCode(page) {
  var mobile = page.data.mobile
  if(!mobile){
    return;
  }
  var param = {
    mobile: mobile
  }
  util.post(util.baseUrl, "/sendCode", param, function (res) {
    if (res.code == 200) {
      util.toast("验证码发送成功");
      var second = 60;
      var canSend = true;
      var paracont = "重发";
      var timePromise = setInterval(function () {
        var second = page.data.second
        if (second <= 0) {
          if (page.data.timePromise) {
            clearInterval(timePromise);
          }
          second = 60;
          paracont = "重发";
          canSend = true;
        } else {
          second = second ? second : 60;
          paracont = second + "秒重发";
          second--;
          canSend = false;
        }
        page.setData({
          second: second,
          paracont: paracont,
          canSend: canSend
        })
      }, 1000);
      page.setData({
        timePromise: timePromise
      })
    } else {
      page.setData({
        paracont: "重发",
        canSend: true
      })
    }
  })
};
function submit(page,needpay) {
  var param = {
    token:util.getCache("token"),
    name: page.data.name,
    mobile: page.data.mobile,
    checkCode: page.data.code,
    coachId: parseInt(page.data.coachId),
    classTypeId: parseInt(page.data.classTypeId),
    drivingFieldId: parseInt(page.data.drivingFieldId),
    insId: parseInt(page.data.insId),
  }
  var url = "/preSignUp/add"
  if (needpay){
    url = "/preSignUp/addPay"
  }
  util.post(util.baseUrl, url, param, function (res) {
    if (needpay) {
      pay(page, res.data)
    } else {
      util.goHome();
      util.alert("信息提交成功,我们会尽快与您联系");
    }
  })
};
function pay(page,id) {
  var param = {
    token: util.getCache("token"),
    id: id
  }
  util.post(util.payUrl,"/apply/wxapply", param, function (res) {
    wx.requestPayment({
      timeStamp: res.data.timestamp,
      nonceStr: res.data.noncestr,
      package: "prepay_id=" + res.data.prepayid,
      signType: "MD5",
      paySign: res.data.paySign,
      success: res => {
        console.log(res)
        util.goHome();
        util.alert("支付成功,我们会尽快与您联系");
      },
      fail: res => {
        util.goHome();
        util.alert("信息提交成功,我们会尽快与您联系");
      }
    })
  })
};
function doRefresh(page) {
  getClassType(page);
};
Page({
  data: {
    selectShow: false, //初始option不显示
    nowText: "", //初始内容
    animationData: {}, //右边箭头的动画
    paracont: "验证",
    canSend: true
  },
  onLoad: function(options) {
    this.setData({
      coachId: options.id,
      insId: options.insId,
      drivingFieldId: options.drivingFieldId
    })
  },
  onShow: function() {
    doRefresh(this);
  },
  submit() {
    if (!this.data.name || !this.data.mobile || !this.data.code || !this.data.classTypeId
      || !this.data.coachId || !this.data.insId || !this.data.drivingFieldId) {
      util.toast("选项不能为空!")
      return
    }
    submit(this);
  },
  submitPay() {
    if (!this.data.name || !this.data.mobile || !this.data.code || !this.data.classTypeId
      || !this.data.coachId || !this.data.insId || !this.data.drivingFieldId) {
      util.toast("选项不能为空!")
      return
    }
    if(!util.getCache("token")){
      util.toast("请先登录")
      return
    }
    submit(this,true);
  },
  inputname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputmobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputcode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  send:function(e){
    if (!(/^1\d{10}$/.test(this.data.mobile))) {
      util.toast("手机号错误!")
    }
    sendCode(this);
  },

　//option的显示与否
  selectToggle: function() {
    var nowShow = this.data.selectShow; //获取当前option显示的状态
    //创建动画
    var animation = wx.createAnimation({
      timingFunction: "ease"
    })
    this.animation = animation;
    if (nowShow) {
      animation.rotate(0).step();
      this.setData({
        animationData: animation.export()
      })
    } else {
      animation.rotate(180).step();
      this.setData({
        animationData: animation.export()
      })
    }
    this.setData({
      selectShow: !nowShow
    })
  },
  //设置内容
  setText: function(e) {
    var nowIdx = e.target.dataset.index; //当前点击的索引
    var nowText = this.data.classType[nowIdx].name; //当前点击的内容
    //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
    this.animation.rotate(0).step();
    this.setData({
      selectShow: false,
      nowText: nowText,
      classTypeId: this.data.classType[nowIdx].id,
      animationData: this.animation.export()
    })
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})