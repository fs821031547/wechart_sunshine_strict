const constans = require('util.js')

const formatDate = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const copy = res => {
  if (!res) {
    return
  }
  wx.setClipboardData({
    //准备复制的数据
    data: res,
    success: function (res) {
      wx.showToast({
        title: '复制成功',
      });
    }
  });
}

const toast = res => {
  if (!res) {
    return
  }
  wx.showToast({
    title: res,
    icon: 'none'
  });
}
const alert = (content) => {
  wx.showModal({
    title: "消息",
    content: content,
    showCancel: false
  });
}
const confirm = (title, content, successFn, okText, cancelText) => {
  function resultFn(res) {
    if (res.confirm) {
      successFn()
    }
  }
  wx.showModal({
    title: title,
    content: content,
    confirmText: okText ? okText : '确认',
    cancelText: cancelText ? cancelText : '取消',
    success: (result) => resultFn(result),
  });
}

const getCache = (key) => {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    return null;
  }
}
const setCache = (key, value) => {
  try {
    console.log("setCache:", key, value);
    wx.setStorageSync(key, value)
  } catch (e) { }
}
const removeCache = (key) => {
  try {
    console.log("removeCache:", key);
    wx.removeStorageSync(key)
  } catch (e) { }
}

//发送请求
const get = (baseUrl, secondUrl, param, successFn) => {
  request("GET", baseUrl, secondUrl, param, successFn)
}

const post = (baseUrl, secondUrl, param, successFn) => {
  request("POST", baseUrl, secondUrl, param, successFn)
}


function request(method, baseUrl, secondUrl, param, successFn) {
  var page = this;
  var token = getCache('token');
  if (!param) {
    param = {}
  }
  // 过滤空字段 {a:null}
  var stringParam = JSON.stringify(param, function (k, v) { if (v) { return v } });
  param = JSON.parse(stringParam);
  if (token) {
    param = Object.assign(param, { token: token });
  }
  wx.request({
    url: baseUrl + secondUrl,
    method: method,
    data: param,
    dataType: 'json',
    header: { "content-type": "application/x-www-form-urlencoded" },
    success: function (res) {
      if (res.data.code == 1514) {
        res.data.code = 200;
        res.data.data = null;
      }
      if (res.data.code == 200) {
        if (successFn) {
          successFn(res.data)
        }
      }
      else if (res.data.code === 700 || res.data.code === 702) {
        alert("账号已在其他地方登陆");
        removeCache("token");
        go("person");
      }
      else {
        if(res.data.code=="901"){
          toast('请登录！');
        }else{
          toast(res.data.message);
        }
      }
    },
    fail: function (res) {
    },
    complete: function (res) {
      wx.stopPullDownRefresh();
    }
  });
}
const newpost = (baseUrl, secondUrl, param, successFn) => {
  newRequest("POST", baseUrl, secondUrl, param, successFn)
}

function newRequest(method, baseUrl, secondUrl, param, successFn) {
  var page = this;
  var token = getCache('token');
  if (!param) {
    param = {}
  }
  // 过滤空字段 {a:null}
  var stringParam = JSON.stringify(param, function (k, v) { if (v) { return v } });
  param = JSON.parse(stringParam);
  if (token) {
    param = Object.assign(param, { token: token });
  }
  wx.request({
    url: baseUrl + secondUrl,
    method: method,
    data: param,
    dataType: 'json',
    header: { "content-type": "application/x-www-form-urlencoded" },
    success: function (res) {
      if (res.data.code == 1514) {
        res.data.code = 200;
        res.data.data = null;
      }
      if (res.data.code == 200) {
        if (successFn) {
          successFn(res.data)
        }
      }
      else if (res.data.code === 700 || res.data.code === 702) {
        alert("账号已在其他地方登陆");
        removeCache("token");
        go("person");
      }
      else {
        if (res.data.code == "901") {
          toast('请登录！');
        }else{
          if (successFn) {
            successFn(res.data)
          }
        }
      }
    },
    fail: function (res) {
    },
    complete: function (res) {
      wx.stopPullDownRefresh();
    }
  });
}

const getCity = () => {
  var city = getCache("city")
  return city ? city : "深圳市"
  // return "深圳市"
}
const getCityCode = () => {
  var cityCode = getCache("cityCode")
  return cityCode ? cityCode : "440300"
  // return "440300"
}

const getProvinceCode = () => {
  var provinceCode = getCache("provinceCode")
  return provinceCode ? provinceCode : "440000"
  // return "440300"
}

const getLat = () => {
  var lat = getCache("lat");
  return lat ? lat : "22.52745"
}

const getLng = () => {
  var lng = getCache("lng");
  return lng ? lng : "113.944367"
}

const go = (page, param) => {
  var url = '/pages/' + page + '/' + page;
  if (param) {
    url = url + param;
  }
  wx.navigateTo({
    url: url,
  });
}
const goHome = () => {
  wx.switchTab({
    url: "/pages/home/home",
  });
}
const goBack = () => {
  wx.navigateBack({
  });
}
const goLogin = () => {
  wx.navigateTo({
    url: "/pages/login/login",
  });
}
const errPage = () => {
  wx.navigateTo({
    url: "/pages/errPage/errPage",
  });
}
const getShareContent = () => {
  return {
    title: "严选教练,为你学车精选优质教练",
    imageUrl: "/image/Special/share.png"
  }
}

/**
 * 判断设备类型
 *
 * @param {Obeject} context 当前页面指针
 * @param {String} stage 当前生命周期
 */
const isIphoneX = (context, stage) => {
  var isIphoneX = wx.getStorageSync('isIphoneX')

  // iphone X 适配
  if (stage === 'launch') {
    wx.getSystemInfo({
      success: res => {
        const {
          windowWidth,
          windowHeight
        } = res
        let ipxReg = /iPhone X/ig

        if (ipxReg.test(res.model)) {
          context.globalData.isIphoneX = true
          wx.setStorageSync('isIphoneX', 'true')
        } else {
          wx.setStorageSync('isIphoneX', 'false')
        }

        let screen = {
          width: windowWidth,
          height: windowHeight
        }

        context.globalData.screen = screen
      }
    })
  } else {
    isIphoneX = isIphoneX === 'true' && true

    return new Promise((resolve) => {
      let _data = {}

      if (isIphoneX) {
        _data = {
          navH: 220,
          isIphoneX: true
        }
      } else {
        _data = {
          navH: 140,
          isIphoneX: false
        }
      }

      context.setData({
        ..._data
      }, function () {
        resolve(_data)
      })
    })
  }
}



//数字千位符格式化（金额每3个数字加一逗号）
function  toThousands(num)  {
    var  result  =  '',  counter  =  0;
    var  dot  =  String(num).indexOf(".");
    if  (dot  !=  -1)  {
        // alert("有小数点");
        // 获取小数点后面的数字(indexOf和substring都不支持数字，所以要先转字符串才可以用)
        var  dotCnt  =  String(num).substring(dot  +  1,  num.length);

        // 获取小数点前面的数字
        num  =  String(num).split('.')[0]
        num  =  (num  ||  0).toString();
        for  (var  i  =  num.length  -  1;  i  >=  0;  i--)  {
            counter++;
            result  =  num.charAt(i)  +  result;
            if  (!(counter  %  3)  &&  i  !=  0)  {  result  =  ','  +  result;  }
        }
        result  =  result  +  '.'  +  dotCnt;
        return  result;

    }  else  {
        // alert("没有小数点");
        return  (num  ||  0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,  '$1,');
    }
}


module.exports = {
  formatDate: formatDate,
  copy: copy,
  get: get,
  post: post,
  newpost: newpost,
  toast: toast,
  alert: alert,
  confirm: confirm,
  getCache: getCache,
  setCache: setCache,
  getCity: getCity,
  getProvinceCode: getProvinceCode,
  getCityCode: getCityCode,
  getLat: getLat,
  getLng: getLng,
  removeCache: removeCache,
  go: go,
  goBack: goBack,
  goLogin: goLogin,
  errPage:errPage,
  goHome: goHome,
  getShareContent: getShareContent,

  baseUrl: "https://yxjl.91ygxc.com/wx",      //基础接口
  authUrl: "https://yxjl.91ygxc.com/auth",      //登录接口
  payUrl: "https://yxjl.91ygxc.com/pay",      //支付接口
  // baseUrl: "http://192.168.1.6:28120",      //基础接口
  // authUrl: "http://192.168.1.6:28091",      //登录接口
  // payUrl: "http://192.168.1.6:28114",      //支付接口
  // baseUrl: "http://localhost:28120",      //基础接口
  // authUrl: "http://localhost:28091",      //登录接口
  // payUrl: "http://localhost:28114",      //支付接口
  baidu_ak: "4O6x7Ox8vHvQeQgnMAPOolXiYkudOdZr",
  lskey_lat: "lat",
  lskey_lng: "lng",
  lskey_city: "city",
  lskey_cityCode: "cityCode",
  lskey_history: "coachHistory",
  lskey_homeRefresh: "homeRefresh",
  isIphoneX: isIphoneX,
  toThousands:  toThousands
}