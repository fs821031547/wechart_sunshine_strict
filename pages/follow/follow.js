// pages/follow/follow.js
const util = require('../../utils/util.js')
Page({
  data: {
    title:"阳光学车"
  },
  copy:function(){
    util.copy(this.data.title);
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  }
})