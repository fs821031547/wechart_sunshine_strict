// pages/assess/assess.js
const util = require('../../utils/util.js')
function getOption(page) {
  debugger
  util.get(util.baseUrl, "/comment/optionList", null, function (res) {
    var data = res.data
    page.setData({
      options: data
    })
  })
};
function doRefresh(page) {
  getOption(page);
};
Page({
  data: {
    star:5,
    starStr: ['', '态度差到不能忍', '不爽,让人气愤', '不开心,不满意', '一般,还算满意', '非常好，很满意！']
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      coachId: options.coachId
    })
  },
  clickStar:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      star:index+1
    })
    var options = this.data.options;
    for (var i in options){
      options[i].check = false
    }
    this.setData({
      options
    })
  },
  onShow: function () {
    doRefresh(this);
  },
  clickOption(e){
    var index = e.currentTarget.dataset.index;
    var options = this.data.options;
    options[index].check = !options[index].check
    this.setData({
      options
    })
  },
  inputcomment(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  submit:function(){
    var optionStr;
    var options = this.data.options;
    var comment = this.data.comment;
    for(var i in options){
      if (options[i].check && options[i].star==this.data.star){
        if (!optionStr){
          optionStr = options[i].id+""
        }else{
          optionStr += ","+options[i].id
        }
      }
    }
    if (!comment && !optionStr){
      util.toast("评价和选项必须有一个")
      return;
    }
    var param = {
      token: util.getCache("token"),
      preSignupId: this.data.id,
      coachId: this.data.coachId,
      star:this.data.star
    }
    if (optionStr) {
      param.optionIds = optionStr
    }
    if (comment) {
      param.comment = comment
    }
    util.post(util.baseUrl,"/comment/add",param,function(res){
      util.toast("评价成功"),
      util.goBack();
    })
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})