// pages/coachList/coachList.js

const util = require('../../utils/util.js')

function getCoach(page) {
  var pageIndex = page.data.coachlist ? parseInt(page.data.coachlist.length / page.data.pageSize) + 1 : 1
  var param = {
    city: util.getCityCode(),
    pageIndex: pageIndex,
    pageSize: page.data.pageSize,
    longtitude: util.getLng(),
    latitude: util.getLat()
  };
  if (page.data.selectCar) {
    param.vehicleType = page.data.selectCar
  }
  if (page.data.selectSex) {
    param.sex = page.data.selectSex
  }
  if (page.data.selectIns) {
    param.insId = page.data.selectIns
  }
  util.get(util.baseUrl, "/coach/list", param, function(res) {
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
  })
};
function getInsList(page) {
  var param = {
    city: util.getCityCode()
  };
  util.get(util.baseUrl, "/coach/insList", param, function (res) {
    var insList = [{
      "id": null,
      "text": "不限驾校"}]
    if(res.code == 200){
      for(var i in res.data){
        var item = { "id": res.data[i].id, "text": res.data[i].shortName}
        insList.push(item)
      }
    }
    var array = page.data.selectArray;
    array[2] = insList
    page.setData({
      selectArray: array
    })
  })
};

function doRefresh(page) {
  getCoach(page);
  getInsList(page);
};
Page({
  data: {
    windowHeight: 500,
    pageIndex: 1,
    pageSize: 20,
    coachlist: [],
    selectArray: [
      [{
          "id": null,
          "text": "全部车型"
        },
        {
          "id": 'C1',
          "text": "C1"
        }, {
          "id": 'C2',
          "text": "C2"
        }
      ],
      [{
          "id": null,
          "text": "性别不限"
        },
        {
          "id": 1,
          "text": "男"
        }, {
          "id": 2,
          "text": "女"
        }
      ],
      [{
        "id": null,
        "text": "不限驾校"
      }]
    ],
    selectShow: [false, false, false], //初始option不显示
    isShow: false,
    animationData: [{}, {}, {}], //右边箭头的动画
    currentIndex: -1,
    selectCar: null,
    selectSex: null,
    selectIns: null,
    selectCarName: "全部车型",
    selectSexName: "性别不限",
    selectInsName: "不限驾校"
  },
  onShow: function() {
    if (this.data.insList == null || this.data.insList.length<1
      || this.data.coachlist == null || this.data.coachlist.length < 1){
      doRefresh(this);
    }
    var page = this;
    wx.getSystemInfo({
      success(res) {
        page.setData({
          windowHeight: res.windowHeight * 750 / res.windowWidth
        })
      }
    })
  },
  onPullDownRefresh: function () {
    doRefresh(this);
  },
  //option的显示与否
  selectToggle: function(e) {
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
  setText: function(e) {
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
  clickSelect: function(e) {
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text;
    console.log(e)
    if (this.data.currentIndex == 0) {
      this.setData({
        selectCar: id,
        selectCarName: text
      })
    } else if (this.data.currentIndex == 1) {
      this.setData({
        selectSex: id,
        selectSexName: text
      })
    } else if (this.data.currentIndex == 2) {
      this.setData({
        selectIns: id,
        selectInsName: text
      })
    }
    this.setData({
      currentIndex: -1,
      isShow: false,
      pageIndex:1,
      coachlist:[]
    },function(){
      getCoach(this);
    })
  },
  goDetail: function(e){
    var id = e.currentTarget.dataset.id;
    util.go("coachDetail","?id="+id);
  },
  onShareAppMessage: function () {
    return util.getShareContent()
  },
  loadMore(e) {
    if (this.data.canLoadMore){
      getCoach(this)
    }
  }
})