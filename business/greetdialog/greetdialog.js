Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgcUrl: String,
    scene: {
      type: String,
      value: 'common',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    systemWidth: 0,
    systemHieght: 0,
    isIos: false,
    isAndroid: false,
    // 模拟器
    devtools: true,
    telephoneNum: '',
    name: '',
    bgcUrl: '/image/findCoachLearnCar.png',
    bgcUrlSceneMap: {
      common: '/image/findCoachLearnCar.png',
      scene2: '/image/findCoachLearnCar.png',
      scene3: '/image/findCoachLearnCar.png'
    }
  },
  attached() {
    var self = this;
    this.setData({
      systemWidth: wx.getSystemInfoSync().windowWidth,
      systemHieght: wx.getSystemInfoSync().windowHeight
    })

    this.setData({
      bgcUrl: this.data.bgcUrlSceneMap[this.properties.scene || 'common']
    })

    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          systemInfo: res,
        })
        if (res.platform == "devtools") {
          self.setData({
            devtools: true
          })
        } else if (res.platform == "ios") {
          self.setData({
            isIos: true,
          })
        } else if (res.platform == "android") {
          self.setData({
            isAndroid: true
          })
        }
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindNameInput(e) {
      this.setData({
        name: e.detail.value,
      })
    },
    bindMobInput(e){
      this.setData({
        telephoneNum: e.detail.value,
      })
    },
    formfindCoachSubmit(){
      this.triggerEvent('confirm', {
        telephoneNum: this.data.telephoneNum,
        name: this.data.name,
      });
    },
    formCloseCar() {
      this.triggerEvent('close')
    }
  }
})
