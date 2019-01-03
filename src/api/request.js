import axios from 'axios'
let REQUESTURL = '/api' //跨域请求代理
let getLocalTimeZone = () => {
  return (new Date().getTimezoneOffset() / 60) * -1
}
axios.defaults.headers.common['user_timezone'] = `${getLocalTimeZone()}`
if (process.env.NODE_ENV == 'development'){
  axios.interceptors.request.use(
    config => { 
      //测试时打开  传到环境时需要注释下面这一条设置token的代码
      config.headers.access_token = 'h5_official_1cd3a7c8-90db-410d-8cbf-da32198c33d5'
      config.headers.device_uuid = 'ce2b347168ec4a9b8d45cefe7c34075e'
      config.headers.lang = 'zh-CHS'
      config.headers.request_uuid = Math.random().toString(36).substr(2) + new Date().getTime() + Math.floor(Math.random() * 100000)
      return config
    },
    error => {
        return Promise.reject(error)
  })
} else {
  REQUESTURL = 'http://allbet-game.wiccdev.org:9090/game'
  axios.interceptors.request.use(
    config => { 
      config.headers.device_uuid = 'ce2b347168ec4a9b8d45cefe7c34075e'
      config.headers.lang = 'zh-CHS'
      config.headers.request_uuid = Math.random().toString(36).substr(2) + new Date().getTime() + Math.floor(Math.random() * 100000)
      return config
    },
    error => {
        return Promise.reject(error)
  })
}

//用户个人信息
export function getUserInfo() {
  let url = `${REQUESTURL}/lotoAccount/info`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//彩票-首页文字轮播
export function getCreateIssue() {
  let url = `${REQUESTURL}/lottery/carousel`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//彩票-当前期
export function getCurrentStage() {
  let url = `${REQUESTURL}/lottery/issue/current`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//彩票-购买彩票
export function purchase(data) {
  let url = `${REQUESTURL}/lottery/purchase`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//彩票-开奖记录
export function getAwardRecord(data) {
  let url = `${REQUESTURL}/lottery/issue/awardRecord`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//彩票-购彩记录
export function getRecord(data) {
  let url = `${REQUESTURL}/lottery/order/record`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//时时彩-是否为新用户
export function getIsNewUser() {
  let url = `${REQUESTURL}/lotoAccount/customer/stats`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//时时彩-获取当前彩期
export function getCurrentInstance() {
  let url = `${REQUESTURL}/ssc/currentInstance`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//时时彩-创建订单、购买彩票
export function ssc_purchase(data) {
  let url = `${REQUESTURL}/ssc/createOrder`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//时时彩-购彩记录
export function getBuyRecords(data) {
  let url = `${REQUESTURL}/ssc/buyRecords`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//时时彩-近期开奖记录
export function getRecentRecord(count) {
  let url = `${REQUESTURL}/ssc/lotoRecords/${count}`
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-首页信息
export function getHome(data) {
  let url = `${REQUESTURL}/dice/homepage`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-开奖记录
export function getDiceRecord(data) {
  let url = `${REQUESTURL}/dice/lottery`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-奖金池数据
export function getDiceJackpot(data) {
  let url = `${REQUESTURL}/dice/jackpot`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子
export function getDiceTopprize(data) {
  let url = `${REQUESTURL}/dice/topprize`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-轮播信息
export function getDiceLoopplay(data) {
  let url = `${REQUESTURL}/dice/loopplay`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-获奖记录
export function getDiceHistory(data) {
  let url = `${REQUESTURL}/dice/queryWinBetHistory`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-下注记录
export function getDiceBetHistory(data) {
  let url = `${REQUESTURL}/dice/queryPersonalBetHistory`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 摇骰子-下注
export function diceBet(data) {
  let url = `${REQUESTURL}/dice/bet`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 3d-投注记录
export function get3dRecord(data) {
  let url = `${REQUESTURL}/threeD/order/record`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 3d-下注
export function threeBet(data) {
  let url = `${REQUESTURL}/threeD/purchase`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 3d-开奖记录
export function threeAwardRecord(data) {
  let url = `${REQUESTURL}/threeD/issue/awardRecord`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// 3d-当前期
export function get3dCurrent(data) {
  let url = `${REQUESTURL}/threeD/issue/current`
  return axios.get(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}