//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()
let videoContext = null; //video实例
let time = null
Page({
  data: {
    // 视频Id
    videoId: 21,
    // 当前swiper所在的位置
    current: 0,
    // 视频列表
    videoList: [],
    // 当前播放视频
    videoParam: {},
    videoAllParam: {},
    // 播放开关 1是暂停 2是播放
    playMark: 1,
    // 第一个item
    oneItemParam: {},
    // 第二个item
    twoItemParam: {},
    // 第一个item
    threeItemParam: {},
    isCollection: false,
    isHeartCount: false,
    hasHeart: {},
    hasCollection: {},
    heartCount: {},
    collectionCount: {},
    evalCount: {},
    desc: {},
    commentsList: [],
    applyFocus: false,
    applyId: null,
    pageIndex: 1,
    pageSize: 20,
    commentInput: '',
    applyCommentInput: '',
    hotCommentsList: [],
    formatDate: util.formatDate,
    showDesc: true,
    rowCount:0
  },
  onLoad: function (e) {
    // 拿到当前视频的实例
    this.videoContext0 = wx.createVideoContext('myVideo0')
    this.videoContext1 = wx.createVideoContext('myVideo1')
    this.videoContext2 = wx.createVideoContext('myVideo2')
    let videoList = this.data.videoList;
    this.setData({
      videoId: e.id,
    });
    console.log('videoId', this.data.videoId)
    newVideoList(this, e);
  },
  changeCurrent(e) {
    console.log('change:', e);
    // 当前视频的数据列表
    let videoList = this.data.videoList
    // 当前视图视频id
    let id = e.detail.currentItemId
    /* 根据当前视图视频id拿到对应的视频列表下标 */
    let videoIndex = videoList.findIndex(v => v.id == id)
    /* 滑动到倒数第二个视频 加载视频列表 */
    if (videoIndex == (videoList.length - 2)) {
      let newList = [...this.data.videoList]
      this.setData({
        videoList: newList
      })
    }
  },
  /**
   *  current 变化时 修改视频容器对应的数据
   */
  changeItem(e) {
    console.log('changeitem:', e);
    // 当前item的位置
    let current = this.data.current
    // swiper滑到的位置
    let swiperIndex = e.detail.current
    // 如果没有切换就不执行其他操作
    if (current == swiperIndex) return;
    // 当前视频的数据列表
    let videoList = this.data.videoList
    // 当前视图视频id
    let id = e.detail.currentItemId
    this.setData({
      videoId: id
    }, () => {
      detailList(this)
    })
    /* 根据当前视图视频id拿到对应的视频列表下标 */
    let videoIndex = videoList.findIndex(v => v.id == id)
    /* 拿到对应视频的数据 */
    this.getVideoParam(videoIndex)
    // 匹配对应数据
    this.tabItem(swiperIndex, videoIndex)
    /* 销毁视频实例 */
    this.stop()
    /* 开始播放视频 */
    this.play(swiperIndex)
  },
  // 根据swiperIndex videoIndex匹配对应数据
  tabItem(swiperIndex, videoIndex) {
    // 当前视频的数据列表
    let videoList = JSON.parse(JSON.stringify(this.data.videoList))
    let next = 0
    let first = 0
    /* 上一个 */
    if (videoIndex == 0) {
      first = videoList.length - 1
    } else {
      first = videoIndex - 1
    }

    /* 下一个 */
    if (videoIndex == videoList.length - 1) {
      next = 0
    } else {
      next = videoIndex + 1
    }

    switch (swiperIndex) {
      case 0:
        this.setData({
          twoItemParam: videoList[next],
          threeItemParam: videoList[first]
        })
        break;
      case 1:
        this.setData({
          oneItemParam: videoList[first],
          threeItemParam: videoList[next]
        })
        break;
      case 2:
        this.setData({
          oneItemParam: videoList[next],
          twoItemParam: videoList[first],
        })
        break;
      default:
    }

    this.setData({
      current: swiperIndex
    })
  },
  // 拿到当前视图的视频数据
  getVideoParam(videoIndex) {
    // 当前视频的数据列表
    var page = this
    let videoList = JSON.parse(JSON.stringify(page.data.videoList))
    this.setData({
      videoParam: videoList[videoIndex]
    })
  },
  // 播放
  play(swiperIndex) {
    let index = parseInt(swiperIndex)
    switch (index) {
      case 0:
        this.videoContext0 && this.videoContext0.play()
        break;
      case 1:
        this.videoContext1 && this.videoContext1.play()
        break;
      case 2:
        this.videoContext2 && this.videoContext2.play()
        break;
      default:
    }
  },
  // 销毁视频 注意 必须在切换之前销毁
  stop() {
    this.videoContext0 && this.videoContext0.pause()
    this.videoContext1 && this.videoContext1.pause()
    this.videoContext2 && this.videoContext2.pause()
  },
  
  // 开始播放 
  eventPlay(e) {
    this.setData({
      playMark: 2
    })
  },
  // eventPause(e){
  //   this.setData({
  //     playMark: 1
  //   })
  // },
  // 点击视频
  tabVideo(e) {
    let swiperIndex = this.data.current
    let playMark = this.data.playMark
    if (playMark == 2) {
      this.videoContext0.pause()
      this.videoContext1.pause()
      this.videoContext2.pause()
    //   this.stop()
      this.setData({
        playMark: 1
      })
    } else {
      this.play(swiperIndex)
      this.setData({
        playMark: 2
      })
    }
  },
  //消息
  setModalStatus: function (e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true,
        //隐藏视频的详情
        showDesc: false
      });
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false,
          //视频的详情
          showDesc: true
        });
      }
    }.bind(this), 200)
  },
  addCollect: function () {
    var token = util.getCache("token")
    var page = this
    const videoId = page.data.videoId
    if (token) {
      var param = {
        token: token,
        id: page.data.videoId,
        type: 'COLLECTION'
      }
      util.post(util.baseUrl, '/video/addStat', param, function (res) {
        if (res.code == 200) {
          if (!page.data.hasCollection[videoId]) {
            page.data.hasCollection[videoId] = !page.data.hasCollection[videoId]
            page.data.collectionCount[videoId] = page.data.collectionCount[videoId] + 1
            util.toast("已收藏")
            page.setData({
              hasCollection: page.data.hasCollection,
              collectionCount: page.data.collectionCount,
            })
            return;
          }
          page.data.hasCollection[videoId] = !page.data.hasCollection[videoId]
          page.data.collectionCount[videoId] = page.data.collectionCount[videoId] - 1
          page.setData({
            hasCollection: page.data.hasCollection,
            collectionCount: page.data.collectionCount
          })
        }
      })
    } else {
      util.goLogin();
    }

  },
  addHeartCount: function () {
    var token = util.getCache("token")
    var page = this
    const videoId = page.data.videoId
    if (token) {
      var param = {
        token: token,
        id: page.data.videoId,
        type: 'HEART'
      }
      util.post(util.baseUrl, '/video/addStat', param, function (res) {
        if (res.code == 200) {
          if (!page.data.hasHeart[videoId]) {
            page.data.hasHeart[videoId] = !page.data.hasHeart[videoId]
            page.data.heartCount[videoId] = page.data.heartCount[videoId] + 1
            util.toast("已点赞")
            page.setData({
              hasHeart: page.data.hasHeart,
              heartCount: page.data.heartCount
            })
            return;
          }
          page.data.hasHeart[videoId] = !page.data.hasHeart[videoId]
          page.data.heartCount[videoId] = page.data.heartCount[videoId] - 1
          page.setData({
            hasHeart: page.data.hasHeart,
            heartCount: page.data.heartCount
          })
        }
      })
    } else {
      util.goLogin();
    }
  },
  sendComment: function (e) {
    let page = this;
    if (util.getCache('token')) {
      let param = {
        type: 'EVAL',
        id: this.data.videoId,
        comment: e.detail.value
      }
      util.post(util.baseUrl, '/video/addStat', param, function (res) {
        if (res.code == 200) {
          page.setData({
            commentInput: ''
          })
          comments(page)
        }
      })
    } else {
      util.goLogin()
    }
  },
  sendApplyComment: function (e) {
    let page = this
    if (!util.getCache('token')) { util.goLogin() };
    let param = {
      type: 'EVAL',
      id: this.data.videoId,
      comment: e.detail.value,
      commentId: this.data.applyId,
    }
    util.post(util.baseUrl, '/video/addStat', param, function (res) {
      if (res.code == 200) {
        page.setData({
          applyCommentInput: ''
        })
        comments(page)
      }
    })

  },
  // 评论
  setEvalHeart: function (e) {
    if (!util.getCache("token")) {
      util.toast('请先登录！')
      return;
    }
    const dataItem = e.currentTarget.dataset.item;
    const commentId = dataItem.id;

    if (this.data.applyFocus) {
      this.setData({
        applyFocus: false,
      }, () => {
        this.setData({
          applyFocus: true,
          applyId: commentId,
          applyCommentInput: '@' + dataItem.fromUserName + ' '
        })
      })
      return;
    }
    this.setData({
      applyFocus: true,
      applyId: commentId,
      applyCommentInput: '@' + dataItem.fromUserName + ' '
    })
  },
  // 评论点赞
  setHeart: function (e) {
    let page = this
    let param = {
      type: 'EVAL_HEART',
      id: this.data.videoId,
      commentId: e.currentTarget.dataset.item.id
    }
    if (!util.getCache("token")) {
      util.toast('请先登录！')
      return;
    }
    util.post(util.baseUrl, '/video/addStat', param, function (res) {
      if (res.code == 200) {
        comments(page)
      }
    })
  },
  onShow: function () {
    doRefresh(this)
    this.setData({
      token: util.getCache("token"),
    })
  },
  //分享转发功能
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    var token = util.getCache("token")
    if (token) {
      var videoId = ops.target.dataset.id
      var coverImageUrl = ops.target.dataset.coverimageurl
      var desc = ops.target.dataset.desc
      return {
        title: desc,
        path: '/pages/videoList/videoList?id=' + videoId,
        imageUrl: coverImageUrl,
        success: function (res) {
          console.log('成功', res)
        }
      }
    } else { }
  },
  goToLogin: function (e) {
    util.goLogin();
  }
})

//最新发布
function newVideoList(page, e) {
  const videoId = e.id;
  const pageType = e.type;
  // 是否是从我收藏的视频点过来
  var url = pageType == 'collect' ? "/video/collections" : "/video/new/list"
  return util.get(util.baseUrl, url, null, function (res) {
    var videoList = res.data.data
    let videoIndex = videoList.findIndex(v => v.id == videoId)
    console.log('videoList', videoList)
    console.log('videoIndex' + videoIndex)
    let current = videoIndex % 3
    const hasHeart = page.data.hasHeart;
    const hasCollection = page.data.hasCollection;
    const collectionCount = page.data.collectionCount;
    const heartCount = page.data.heartCount;
    const evalCount = page.data.evalCount;
    const desc = page.data.desc;
    videoList.forEach(function (item) {
      if (videoId == item.id && util.getCache('token')) {
        page.setData({
          // videoId: item.id,
          coverImageUrl: item.coverImageUrl,
        })
        console.log('coverImageUrl' + page.data.coverImageUrl)
        return;
      }
      // 如果videoId相同，不需重新赋值，取详情接口的值
      hasHeart[item.id] = item.hasHeart
      hasCollection[item.id] = item.hasCollection
      collectionCount[item.id] = item.collectionCount
      heartCount[item.id] = item.heartCount
      evalCount[item.id] = item.evalCount
      desc[item.id] = item.desc
    })
    const dataObj = {
      videoList: videoList,
      videoIndex: videoIndex,
      hasHeart: hasHeart,
      hasCollection: hasCollection,
      heartCount: heartCount,
      collectionCount: collectionCount,
      evalCount: evalCount,
      desc: desc
    };
    
    if (current === 0) {
      Object.assign(dataObj, { oneItemParam: videoList[videoIndex] })
    }
    if (current === 1) {
      Object.assign(dataObj, { twoItemParam: videoList[videoIndex] })
    }

    if (current === 2) {
      Object.assign(dataObj, { threeItemParam: videoList[videoIndex] })
    }
    console.log('hasHeart:', hasHeart);

    page.setData(dataObj, function () {
      // 匹配对应数据
      page.stop();
      page.getVideoParam(videoIndex);
      page.tabItem(current, videoIndex)
      /* 开始播放视频 */
      page.play(current)
      // page.play(videoIndex)
      // page.tabVideo()
      // detailList(page)
    })
  })
}

function doRefresh(page) {
  detailList(page)
  comments(page)
};

function detailList(page) {
  var param = {
    id: page.data.videoId
  }
  var token = util.getCache("token")
  if (!token) {
    return;
  }
  const videoId = page.data.videoId
  const hasHeart = page.data.hasHeart;
  const hasCollection = page.data.hasCollection;
  const collectionCount = page.data.collectionCount;
  const heartCount = page.data.heartCount;
  const evalCount = page.data.evalCount;
  const desc = page.data.desc;
  console.log('hasHeart:1', hasHeart);
  util.baseUrl = 'http://192.168.3.15:28120'
  util.get(util.baseUrl, "/video/detail", param, function (res) {
    var detailList = res.data
    hasHeart[videoId] = detailList.hasHeart
    hasCollection[videoId] = detailList.hasCollection
    heartCount[videoId] = detailList.heartCount
    collectionCount[videoId] = detailList.collectionCount
    evalCount[videoId] = detailList.evalCount
    desc[videoId] = detailList.desc
    console.log('detailList:', detailList);
    page.setData({
      detailList: detailList,
      hasHeart: hasHeart,
      hasCollection: hasCollection,
      heartCount: heartCount,
      collectionCount: collectionCount,
      evalCount: evalCount,
      desc: desc,
    })
    console.log('heartCount' + page.data.heartCount)

  })
  comments(page)
}

function comments(page) {
  var token = util.getCache("token")
  if (token) {
    var commentsUrl = '/video/comments'
    var hostCommentsUrl = '/video/host/comments'
  } else {
    var commentsUrl = '/video/comments/tourist'
    var hostCommentsUrl = '/video/host/comments/tourist'
  }
  var param = {
    videoId: page.data.videoId,
    id: page.data.videoId,
    pageIndex: page.data.pageIndex,
    pageSize: page.data.pageSize
  }

  util.get(util.baseUrl, commentsUrl, param, function (res) {
    var commentsList = res.data.data
    var rowCount = res.data.rowCount
    commentsList.forEach(item => {
      item.submitTime = util.formatDate(new Date(item.submitTime), 'yyyy-MM-ddd')
    })
    page.setData({
      commentsList: commentsList,
    //  hotCommentsList: commentsList.slice(0, 5),
      rowCount: rowCount
    })
  })
  util.get(util.baseUrl, hostCommentsUrl, param, function (res) {
    var hotCommentsList = res.data
    hotCommentsList.forEach(item => {
      item.submitTime = util.formatDate(new Date(item.submitTime), 'yyyy-MM-ddd')
    })
    page.setData({
      hotCommentsList: hotCommentsList
    })
    console.log('hotCommentsList',page.data.hotCommentsList)
  })
}