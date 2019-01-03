//时间转换
export function distanceFromCurrent(time) {
  time = time.replace(/-/g, '/')
  let curTime = new Date().getTime()  
  let _time = new Date(time).getTime()
  if (_time - curTime > 0) {
    return (_time - curTime) / 1000
  } else {
    return -1
  }
}
//音效播放
export function musicPlay(ele, pauseTime) {
  let _audio = document.getElementById(ele)
  _audio.currentTime = 0
  _audio.play()
  if (pauseTime) {
    setTimeout(() => {
      _audio.pause()
    }, pauseTime)
  }
}
//js浮点数精度--两数相乘 
export function accMul(num1,num2) {  
  let m = 0,s1 = num1.toString(), s2 = num2.toString()   
  try{ m += s1.split(".")[1].length}catch(e){} 
  try{ m += s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m)
} 
//回到页面顶部
export function backPageTop() {
  document.body.scrollTop = 0    
}
//排列组合
//自定义组合函数(就是数学排列组合里的C)
export function combination(m, n) {
  return factorial(m,n)/factorial(n,n)//就是Cmn(上面是n，下面是m) = Amn(上面是n，下面是m)/Ann(上下都是n)
}
//自定义排列函数(就是数学排列组合里的A)
export function array(m, n) {
  return factorial(m,n)//就是数学里的Amn,上面是n，下面是m
}
//自定义一个阶乘函数，就是有n个数相乘，从m开始，每个数减1，如factorial(5,4)就是5*(5-1)*(5-2)*(5-3),相乘的数有4个
function factorial(m, n) {
  var num = 1
  var count = 0
  for(var i = m; i > 0; i--){
    if (count == n) {//当循环次数等于指定的相乘个数时，即跳出for循环
      break
    }
    num = num * i
    count++
  }
  return num
}
//字符串数组转数字数组
export function stringToNumber(arr) {
  let _arr = []
  if (arr.length == 0) return _arr
  for (let i = 0; i < arr.length; i++) {
    _arr.push(parseFloat(arr[i]))
  }
  return _arr
}
//rem文件适配
export function remAdaptation() {
  var script = document.createElement("script")
  script.type = "text/javascript"
  script.src = "./static/js/lottery.js"
  document.body.appendChild(script)
}