<template>
  <div class="home container"> 
    <my-header rel="myHeader" :my-balance="myBalance | toFixeds" @jumpRecord="jumpRecord" @jumpRule="jumpRule" :style="{top: top}"></my-header>
    <div class="information" @click="showModal">
      <!-- <text-scroll :text-list="textList" :scroll-type="scrollType"></text-scroll>     -->
      <text-scroll :text-list="textList" :scroll-type="scrollType"></text-scroll>    
    </div>  
    <div class="jackpot">  
      <img src="../../../assets/lottery/images/home_03.png" alt="" class="img1"/>    
      <div :class="['con', isPrinting ? 'on' : '']">
        <div class="con-box">
          <h3>{{animatedLottery}}</h3> 
          <p>奖池彩票数</p> 
          <h4>第{{issueNo}}轮奖池已累积</h4>   
          <div class="h5">
            <div class="num-box">
              <div class="flex-cen box">
                <span class="number default"><span class="main"><span>-</span></span></span>
                <span class="number default"><span class="main"><span>-</span></span></span>
                <span class="number default"><span class="main"><span>-</span></span></span>
                <span class="number default"><span class="main"><span>-</span></span></span>
              </div>    
            </div>
            <strong>WLC</strong>
          </div>
        </div>
      </div>
      <div class="loading-box flex-cen" v-show="isPurchase || isLottery"><loading :title="LoadingTitle" is-full="1" is-icon="1"></loading></div>
    </div>
    <div class="timing flex-cen">开奖倒计时：<div :class="['time-box', isLastTimes ? 'swing' : '']"><timing :times="times" ref="timing" @realTime="myRealTime" @timingEnd="myTimingEnd"></timing></div></div>
    <div class="purchase">
      <div class="my">
        <p>我的彩票：<span>{{animatedMyTicket}}</span></p>    
        <p>中奖概率：<span>{{animatedProbability}}%</span></p>    
      </div>      
      <div class="option clearfix">
        <div class="left fl">
          <div class="input"><input type="number" pattern="\d*" v-model="votes" @blur="backPageTop" @input="input"/></div>
          <p>每张售价：<span>{{unitPrice}}&nbsp;WLC</span></p>   
        </div> 
        <div class="right fr flex">
          <div v-for="(item, index) in multiples" :key="index" :class="{'on' : item.isSelect}" :data-index="index" @click="selectMultiple">{{item.mul}}</div>      
        </div>   
      </div>
      <div :class="['btn-box', isPurchase ? 'on' : '']" @click="purchase">
        <img v-show="!isPurchase" src="../../../assets/lottery/images/btn_04.png" alt="" />
        <img v-show="isPurchase" src="../../../assets/lottery/images/btn_04s.png" alt="" />
        <p>购入彩票<span>({{totalSum}}WLC)</span></p>   
      </div>
    </div>
    <div class="modal" v-show="isShowModal">
      <div class="modal-prize">
        <div class="close" @click="hideModal"></div>
        <!-- <img src="../../../assets/lottery/images/effect_01.gif" class="effect" alt="" v-show="isShowModal" />   -->
        <img v-for="(x, index) in ellects[0].num" :key="index" :src="require('../../../assets/lottery/images/effect/effect1/effect1(' + x + ').png')" alt="" class="effect1" v-show="ellects[0].curIndex == x" />
        <!-- <div :class="['light', isShowModal ? 'on' : '']">
          <img src="../../../assets/lottery/images/light_01.png" alt="" />     
          <img src="../../../assets/lottery/images/light_02.png" alt="" />     
        </div> -->
        <div class="con">
          <!-- <img src="../../../assets/lottery/images/record_02.png" alt="" /> -->
          <img v-for="(x, index) in ellects[1].num" :key="index" :src="require('../../../assets/lottery/images/effect/effect2/effect2(' + x + ').png')" alt="" class="effect2" v-show="ellects[1].curIndex == x" />  
          <p>{{firstPrize}}</p>
          <div class="btn" @click="jumpRecord(true)">查看完整榜单</div>    
        </div>  
      </div>    
    </div>
    <!-- <my-loading v-if="!isLoadingOk && !isLoading" ref="MyLoading" @loadingOk="loadingOk"></my-loading> -->
    <my-loading v-if="!isLoadingOk" ref="MyLoading" @loadingOk="loadingOk"></my-loading>
    <div v-if="!isPageData" class="loading-pageData flex-cen"><loading is-full="1" is-icon="1"></loading></div>
    <my-audio></my-audio>  
  </div>
</template>

<script type="text/ecmascript-6">
import MyHeader from 'components/lottery/my-header/my-header'
import TextScroll from 'components/lottery/text-scroll/text-scroll'
import Timing from 'components/lottery/timing/timing'
import MyLoading from 'components/lottery/loading/loading'
import MyAudio from 'components/lottery/audio/audio'
import Loading from 'base/loading/loading'
import { distanceFromCurrent, accMul, musicPlay, backPageTop } from 'common/js/util'
import { ERR_Ok, TOAST } from 'api/config'
import { TweenMax, Power2, TimelineLite } from "gsap"
import { mapState, mapMutations } from 'vuex'
import { getCreateIssue, getCurrentStage, purchase, getAwardRecord } from "api/request"
  export default {
    name: 'App',
    data() {
      return {
        top: 0,
        isLoadingOk: false,
        isPageData: false,
        isCurrentPage: true,
        isInitData: false,
        updateTime_homeData: 20,
        updateTime_current: null,
        totalLottery: 0,
        totalLotterys: 0,
        jackpot: -1,
        myTicket: 0,
        myTickets: 0,
        //probability: 0,
        probabilitys: 0,
        issueNo: '----',
        curIssueNoId: null,
        ellects: [
          {name: '彩带爆炸', num: 57, speed: 70, loop: false, curIndex: 0, interval: null},  
          {name: '奖杯光效', num: 28, speed: 70, loop: 3, curIndex: 0, interval: null}  
        ],
        interval_ellects1: null,
        interval_ellects2: null,
        effect1Index: 0,
        effect2Index: 0,
        times: "",
        lastTime: 3600,
        isLastTimes: false,
        autoSwing: null,
        textList: [],
        updateTime_textScroll: 30,
        updateTime_carousel: null,
        scrollType: 'scroll-up',
        multiples: [{mul: "1/2", isSelect: false}, {mul: "2X", isSelect: false}, {mul: "MAX", isSelect: false}],
        multiplesIndex: -1,
        votes: 10000,
        unitPrice: '0.00',
        MinVotes: 1000,
        MaxVotes: 10240000,
        isPurchaseLoading: false,
        isPurchase: false,
        isPrinting: false,
        printingTime: 3,
        isShowModal: false,
        firstPrize: "*****",
        isLottery: false,
        LoadingTitle: '购入中...'   
      }    
    },
    beforeCreate() {

    },
    created() {  
      console.log(377677616)
      console.log(377677616)
      console.log(377677616)
    },
    activated() {
      /*if (!this.isInitData) {
        this.isPageData = false
      }
      this.isPrinting = true
      this.isCurrentPage = true
      this.getCreateIssue()  
      this.getCurrentStage()*/
    },
    beforeMount() {
      // console.log(3333 + '---->beforeMount')
    },
    mounted() {
      // console.log(4444 + '---->mounted')
      if (this.$refs.MyLoading) {
        this.$refs.MyLoading.progressComplete()
      }
      //this.numAddAnimate()    
    },
    // beforeUpdate(){console.log(5555)},
    // updated(){console.log(6666)},
    computed: {
      ...mapState({
        isLoading: 'isLoading',
        myBalance: 'myBalance',
        isMusicMuted: 'isMusicMuted'    
      }),
      probability() {
        return this.myTicket / this.totalLottery * 100
      },    
      totalSum() {
        return accMul(this.votes, this.unitPrice)
      },
      animatedLottery() {
        return this.totalLotterys.toFixed(0)
      },  
      animatedMyTicket() {
        return this.myTickets.toFixed(0)
      },
      animatedProbability() {
        return this.probabilitys.toFixed(2)
      },
    },
    methods: {
      //页面数据初始化
      pageDataInit() {
        if (!this.isInitData) {
          this.isPageData = false
        }
        this.isPrinting = true
        this.isCurrentPage = true
        this.getCreateIssue()  
        this.getCurrentStage()
      },
      getCurrentStage(isPurchase) {
        if (!this.isCurrentPage) return
        getCurrentStage().then(res => {
          if (res.code === ERR_Ok) {
            this.isInitData = true
            this.updateBalance({myBalance: res.data.availableAmount})
            this.totalLottery = res.data.ticketAmount
            this.myTicket = res.data.betCount
            this.jackpot = Math.floor(res.data.poolAmount)
            if (isPurchase) return
            this.issueNo = res.data.issueNo
            this.curIssueNoId = res.data.issueId
            this.unitPrice = 1 / res.data.rate
              if (distanceFromCurrent(res.data.awardDate) != -1) {
                this.$refs.timing.start(distanceFromCurrent(res.data.awardDate))    
              }   
          } else {
            if (!isPageData) {
              this.$toast(TOAST[0])
            }
          }  
          this.isPageData = true
          if (!this.isLottery) {
            this.updateTime_current = setTimeout(() => { this.getCurrentStage() }, this.updateTime_homeData * 1000)
          }
          /*console.log(`首页数据：（每隔${this.updateTime_homeData}秒自动更新一次）`) 
          console.log(res) */   
        }).catch(err => {
          console.log(err)
          this.isPageData = true
          this.$toast(TOAST[0])  
          if (!this.isLottery) {
            this.updateTime_current = setTimeout(() => { this.getCurrentStage() }, this.updateTime_homeData * 1000)
          }  
        })    
      }, 
      getCreateIssue() {
        if (!this.isCurrentPage) return
        getCreateIssue().then(res => {
          if (res.code === ERR_Ok) {
            this.textList = res.data.carousels
            this.updateTime_carousel = setTimeout(() => { this.getCreateIssue() }, this.updateTime_textScroll * 1000)
          } else {
            this.$toast(TOAST[0])
          }  
          // console.log(`文字轮播数据（每隔${this.updateTime_textScroll}秒自动更新一次）：`)
          // console.log(res)    
        })    
      }, 
      lottery() {
        this.LoadingTitle = '开奖中...'
        this.isLottery = true
        let _data = {
          issueNo: this.curIssueNoId,
          currentPage: 1,
          pageSize: 20
        }
        getAwardRecord(_data).then(res => {
          if (res.code === ERR_Ok) {
            this.firstPrize = res.data.users[0].winAmount
            setTimeout(() => {
              if (!this.isMusicMuted) musicPlay("music-lottery", 5000)
              this.isLottery = false
              clearInterval(this.updateTime_current)
              this.getCurrentStage()
              this.isShowModal = true
              this.effectPlay(this.ellects[0])
              this.effectPlay(this.ellects[1])
            }, 500)
          } else {
            this.isLottery = false
            this.$toast(TOAST[2])
          }
        }).catch(err => {
          this.isLottery = false
          this.$toast(TOAST[0])
          console.log("【请求失败】")
          console.log(err)
        })
      },  
      /*数值位增加动画*/
      numAddAnimate(newValue){
        /*前言：为了效果不得不用jq，含泪引jq.....*/
        if ($(".num-box .box .default").length != 0) {
          let _initNum = String(this.jackpot)
          $(".num-box .box").html('')
          for (let i = 0; i < _initNum.length; i++) {
            let _newSpan = '<span class="number">'+
                              '<span class="main last">'+
                                '<span>'+_initNum[i]+'</span>'+
                              '</span>'+    
                            '</span>'
            $(".num-box .box").append(_newSpan) 
          }  
        }  
        //let autoAdd = () => {
          if (this.isPurchase) return  
          let Original = 0//用于保存原来的数字
          for (let k = 0; k < $(".num-box span.main").length; k++){
            Original += $(".num-box span.main span").eq(k).html()
          }
          Original = parseInt(Original)
          // console.log("增加前原来的数字：" + Original)
          //let random = Math.floor(Math.random() * 1000)//随机产生一个要增加的数字 
          // console.log("增加了：" + random)
          //let newOriginal = Original + random//增加后的新数值
          let newOriginal = newValue
          // console.log("增加后最新的数字：" + newOriginal)
          newOriginal = String(newOriginal).split("")//将新的数值转为数组
          Original = String(Original).split("")//将原来的数值转为数组
          for (let i = 0; i < newOriginal.length - Original.length; i++) {
            let _newSpan = '<span class="number">'+
                              '<span class="main last">'+
                                '<span>'+newOriginal[Original.length + i]+'</span>'+
                              '</span>'+    
                            '</span>'
            $(".num-box .box").append(_newSpan)
          }
          /*循环每位数*/
          for (let j = 0; j < $(".num-box span.number").length; j++) {
            let m_t = parseInt($($(".num-box span.main")[j]).css("marginTop")) || 0//原来每位数字盒子的margin-top值    
            let s_t = parseInt($($(".num-box span.main")[j]).find("span").css("top")) || 0//原来每位数字的top值 
            let spans = ""//用于保存新产生的N个<span></span>
            let index = parseInt(newOriginal[j])//从新数值数组中取出每一位数
            if (index != Original[j]) {//判断当前位数值是否有变化，有变化才有动画增加
              let _h = $(".num-box span.number span.main span").height()
              let newMargin = -_h * (index+1) + m_t//当前位数字盒子的margin-top值
              $($(".num-box span.main")[j]).find("span").addClass("temporary")//  将之前的所有的数值加上一个class标记用于remove删除
              for (let i = 0; i <= index; i++) {//根据当前位最新的数值多少循环产生<span></span>
                let spanTop = 40 * (i + 1) + s_t//临时产生的数值<span></span>的不同top值  
                if (i != index) {//除最后一个产生的<span></span>都添加一个class标记
                  spans += '<span class="temporary" style="top:'+spanTop+'px">'+i+'</span>'
                } else {//最后一个产生的<span></span>将不添加class标记
                  spans += '<span style="top:'+-newMargin+'px">'+i+'</span>'
                }
              }
              $($(".num-box span.main")[j]).append(spans)//将临时产生的<span></span>添加到当前位进行动画 
              $($(".num-box span.main")[j]).css("marginTop",newMargin)//给当前位数值盒子添加最新的margin-top值
            }
            let removeDom = () => {
              $('.num-box span.main span[class]').remove()
            }    
            setTimeout(removeDom, 1000)//动画完成后清除临时产生的<span></span>  和之前的<span></span>
          }
        //}
        //let autoJoin=setInterval(autoAdd, 2000)//定时进行动画递增
      },
      jumpRecord(isLottery) {
        if (isLottery) {
          this.isShowModal = false
          this.$router.push({ name: 'lotteryHistory', params: { isLottery: true } })
        } else {
          this.$router.push("../record")
        }
            
      }, 
      jumpRule() {
        this.$router.push("/rule") 
      }, 
      purchase() {
        if (this.isPurchase) {
          return false   
        }
        if (this.votes % 1000 != 0) {
          this.$toast("购彩张数需要是1000的整数倍")
          return false
        }
        if (!this.votes) {
          this.$toast("您输入的购入数无效")
          return false
        }
        if (!this.isMusicMuted) musicPlay("music-purchase", 1000)
        this.LoadingTitle = '购入中...'
        this.isPurchase = true
        let _data = {
          count: parseInt(this.votes)    
        }
        purchase(_data).then(res => {
          if (res.code === ERR_Ok) {
            this.$toast("购入成功")
            this.isPurchase = false
            if (!this.isMusicMuted) musicPlay("music-printing", this.printingTime * 1000 + 300)
            this.getCurrentStage(true)
            //clearInterval(this.innterval_autoAddNum)
            //this.myTicket = this.myTicket + parseInt(this.votes)
            this.isPrinting = false
            setTimeout(() => {
              this.isPrinting = true
            }, 50)
            setTimeout(() => {
              //this.autoAddNum()
              this.isPurchase = false
              this.votes = 10000
            }, this.printingTime * 1000)
          } else {
            this.$toast(res.msg)
            this.isPurchase = false
          }    
        }).catch(err => {
          console.log(err)
          this.$toast(TOAST[0])
          this.isPurchase = false
        })
      },
      selectMultiple(e) {
        let _curIndex = e.target.dataset.index
        let _votes = parseInt(this.votes)
        this.multiples[_curIndex].isSelect = true
        if (_curIndex == 0) {
          if (_votes < this.MinVotes) {
            this.$toast(`最小输入${this.MinVotes}`)
          } else {
            this.votes = Math.ceil(_votes / 2)
          }  
        } else if (_curIndex == 1) {
          if (_votes >= this.MaxVotes) {
            this.$toast(`最大输入${this.MaxVotes}`)  
          } else {
            this.votes = _votes * 2 >= this.MaxVotes ? this.MaxVotes : _votes * 2 
          }   
        } else if (_curIndex == 2) {
          if (_votes >= this.MaxVotes) {
            this.$toast(`最大输入${this.MaxVotes}`)      
          } else {
            this.votes = this.MaxVotes   
          }  
        }
        setTimeout(() => {
          this.multiples[_curIndex].isSelect = false
        }, 50)
      },
      showModal() {
        this.lottery()
      },
      hideModal() {
        this.isShowModal = false
      },
      effectPlay(ellects) {
        let _start = () => {
          if (ellects.interval) {
            clearInterval(ellects.interval)
            ellects.curIndex = 1    
          }  
          let i = 1
          ellects.interval = setInterval(() => {
            if (i <= ellects.num) {
              ellects.curIndex = i++     
            } else {
              clearInterval(ellects.interval)
              if (ellects.loop) {
                setTimeout(() => { _start() }, ellects.loop * 1000)    
              }
            }  
          }, ellects.speed)
        }
        _start()
      },
      myRealTime(res){
        if (res.curSeconds < this.lastTime && !this.autoSwing) {
          this.autoSwing = setInterval(() => {
            this.isLastTimes = !this.isLastTimes  
          }, 500)
        }
        if (res.curSeconds == 0 && this.autoSwing) {
          if (this.isLastTimes) { this.isLastTimes = false }  
          clearInterval(this.autoSwing)    
        }
      },
      myTimingEnd() {
        console.log("开奖时间到")
        this.lottery()
      },
      input(e) {
        let _votes = this.votes
        if (_votes >= this.MaxVotes) {
          this.votes = this.MaxVotes
          this.$toast(`最大输入${this.MaxVotes}`)  
        }
        /*if (_votes < this.MinVotes) {
          this.votes = this.MinVotes
          this.$toast(`最小输入${this.MinVotes}`)
        }*/
      },
      backPageTop() {
        this.votes = parseInt(this.votes)
        let _votes = this.votes
        if (!_votes || _votes < this.MinVotes) {
          this.$toast(`最小输入${this.MinVotes}`)
          this.votes = this.MinVotes
        }
        backPageTop()
      },
      loadingOk() {
        setTimeout(() => {
          this.pageDataInit()
          this.isLoadingOk = true
          this.updateIsLoading(true)
          if (!this.isMusicMuted) musicPlay("music-back")
        }, 800)
      },
      ...mapMutations({
        updateIsLoading: 'updateIsLoading',
        updateBalance: 'updateBalance'
      })    
    },
    filters: {
      toFixeds(val) {
        let _num = String(val)
        let _index = _num.indexOf('.')
        if (_index == - 1) { return _num + '.00' }
        if (_num.length - _index == 2) {
          return _num + '0'
        } else if (_num.length - _index == 3) {
          return _num
        } else  if (_num.length - _index > 3) {
          return _num.slice(0, _index + 3)
        }
      }   
    },
    watch: {
      jackpot(newValue) {
        this.numAddAnimate(newValue)          
      },  
      totalLottery(newValue) {
        TweenLite.to(this.$data, 0.5, { totalLotterys: newValue })    
      },  
      /*jackpot(newValue) {
        TweenLite.to(this.$data, 0.5, { jackpots: newValue })    
      }, */
      myTicket(newValue) {
        TweenLite.to(this.$data, 0.5, { myTickets: newValue })    
      }, 
      probability(newValue) {
        TweenLite.to(this.$data, 0.5, { probabilitys: newValue })    
      },  
    },
    components: { 
      MyHeader,
      TextScroll,
      Timing,
      MyLoading,
      MyAudio,
      Loading
    },
    beforeDestroy() {
      // console.log(7777 + '---->beforeDestroy')
    },
    destroyed() {
      clearInterval(this.updateTime_carousel)
      clearInterval(this.updateTime_current)
      // console.log(8888 + '---->destroyed')
    },
    deactivated() {
      this.isCurrentPage = false
      clearInterval(this.updateTime_carousel)
      clearInterval(this.updateTime_current)
      // console.log('八八八八' + '---->deactivated')
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
  .container
    background:linear-gradient(180deg,rgba(39,91,203,1) 0%,rgba(7,53,154,1) 100%)  
    color: #fff 
    font-size: 0
    min-height: 100vh
    text-align: left 
    &>div
      margin: 0 auto
    .loading-pageData
      absolute-full(500)      
    .information
      margin-top: .08rem
      width: 91.4666% 
      // height: .26rem
      // line-height: .26rem
      background: rgba(62,117,235,1)
      border-radius: .03rem  
      // font-size: .11rem 
      padding-left: .25rem
      box-sizing: border-box
      position: relative
      &::before
        content: ""
        display: block
        width: .09rem
        height: 100%
        background: url(../../../assets/lottery/images/icon_05.png) no-repeat center
        background-size: 100%
        position: absolute
        left: .09rem 
        top: 0 
    .jackpot
      width: 93.866%  
      height: 2.27rem
      margin-top: .06rem
      position: relative
      .loading-box
        absolute-full(5) 
        padding-top: 8%     
      img
        width: 100%  
      .con
        width: 2.93rem
        // height: 2.05rem
        height: 0
        position: absolute
        left: 50%
        transform: translateX(-50%) 
        top: .22rem   
        text-align: center
        overflow: hidden
        &.on
          height: 2.05rem  
          transition: all 3s linear
        .con-box
          position: absolute
          width: 100%
          height: 2.05rem
          left: 0
          bottom: 0    
          background: url(../../../assets/lottery/images/home_01.png) no-repeat center
          background-size: 100%  
        h3
          font-size: .24rem
          font-family: "DIN"
          font-weight: bold
          line-height: .3rem
          color: rgba(255,255,255,1)
          text-shadow: 0px 2px 2px rgba(96,32,11,0.31)
          padding: .09rem 0 .02rem 
        p
          font-size: .13rem
          font-family: "Helvetica"
          font-weight: bold
          height: .18rem
          line-height: .16rem
          color: rgba(160,70,39,1)  
        h4
          font-size: .13rem
          font-family: "Helvetica"
          height: .18rem
          line-height: .16rem
          color: rgba(137,137,137,1)
          padding: .22rem 0 .2rem
        .h5
          color: rgba(232,107,64,1)  
          .num-box
            display: inline-block
            overflow: hidden
            vertical-align: bottom         
        strong
          font-size: .14rem
          font-family: "Helvetica" 
          padding-left: .02rem
          position: relative
          top: -.07rem 
    .timing
      width: 100%
      height: .31rem
      margin-top: .08rem    
      font-size: .13rem
      color:rgba(185,200,231,1) 
      text-align: center 
      position: absolute
      left: 0
      top: 48.5%
      .time-box
        margin-left: .09rem
        color:rgba(255,216,0,1)
        &.swing
          color: #E86B40
    .purchase
      width: 100%
      height: 2.86rem
      background: url(../../../assets/lottery/images/home_02.png) no-repeat center
      background-size: 108% 103%
      position: absolute
      left:0
      bottom: 0  
      text-align: left
      .my
        padding: .5rem 0 0 .45rem  
        p
          font-size: .13rem
          font-family: "Helvetica"
          height: .18rem
          line-height: .18rem
          color: rgba(208,222,253,1)
          display: inline-block
          vertical-align: top
          &:last-child
            margin-left: .3rem  
          span
            font-size: .14rem
            color: #fff
            display: inline-block
            vertical-align: top
            width: .6rem
      .option
        padding-top: .48rem  
        .left
          .input
            height: .18rem
            line-height: .18rem                                         
            font-size: .18rem
            font-family: "Helvetica"
            font-weight: bold
            padding: .12rem 0 .13rem .38rem
            input
              width: 1.1rem
              background: none
              color: #fff
              text-align: center
          p
            padding-left: .27rem   
            height: .17rem
            line-height: .17rem
            font-size: .12rem
            font-family: "Helvetica"
            color: rgba(141,180,255,1) 
            span
              color: #fff
        .right
          padding-right: .33rem  
          div
            width: .49rem
            height: .37rem  
            line-height: .32rem 
            background: url(../../../assets/lottery/images/btn_01.png) no-repeat center
            background-size: 100% 100%  
            font-size: .13rem
            text-align: center
            &.on
              line-height: .35rem     
            &:nth-child(1).on
              background-image: url(../../../assets/lottery/images/btn_01s.png)  
            &:nth-child(2)
              background-image: url(../../../assets/lottery/images/btn_02.png)  
              margin: 0 .02rem              
            &:nth-child(2).on
              background-image: url(../../../assets/lottery/images/btn_02s.png)   
            &:nth-child(3)
              background-image: url(../../../assets/lottery/images/btn_03.png)  
            &:nth-child(3).on
              background-image: url(../../../assets/lottery/images/btn_03s.png)  
      .btn-box
        width: 91.73%
        margin: .05rem auto 0
        height: .7rem 
        position: relative
        //background: url(../../../assets/lottery/images/btn_04.png) no-repeat center
        background-size: 100%
        &.on
          height: .63rem  
          margin-top: .12rem
          //background-image: url(../../../assets/lottery/images/btn_04s.png)  
          p
            padding-top: .03rem         
        img
          width: 100%
        p
          font-size: .17rem
          font-family: "Helvetica"
          font-weight: bold
          height: .24rem
          line-height: .24rem
          text-shadow:0px 1px 1px rgba(198,93,55,1)
          position: absolute
          left: 0 
          top: .03rem
          text-align: center
          width: 100%
          span
            display: block  
            height: .18rem
            font-size: .13rem
            font-family: "Helvetica"
            line-height: .16rem
            color: rgba(249,194,162,1)  
    .modal   
      position: fixed
      width: 100%
      height: 100%
      background: rgba(0,17,54,.8)
      left: 0
      top: 0
      text-align: center
      .modal-prize
        margin-top: 35%
        position: relative
        .close
          width: .24rem
          height: .24rem    
          background: url(../../../assets/lottery/images/icon_11.png) no-repeat 
          background-size: cover
          position: absolute
          right: 10%
          top: 8%
          z-index: 10
        img.effect1
          width: 100%
          position: absolute
          left: 0
          top: -40%
        .light.on
          position: absolute
          width: 100%
          top: -35%
          left: 0
          img
            width: 2rem
            position: absolute
            left: .2rem
            top: 0
            transform-origin: left top
            animation: shake2 2s infinite alternate
            &:last-child
              left: auto
              right: .1rem
              transform-origin: right top
              animation: shake3 2s infinite alternate            
        .con
          img
            width: 3.65rem   
          p
            height: h = .27rem
            line-height: h
            font-size: .22rem
            font-family: "DIN"
            font-weight: bold
            color: #fff
            text-shadow: 0px 2px 2px rgba(96,32,11,0.31)
            margin-top: -.9rem 
          .btn
            width: 1.38rem
            height: h = .4rem
            line-height: h
            background: url(../../../assets/lottery/images/btn_05.png) no-repeat 
            background-size: cover   
            font-size: .17rem
            font-family: "PingFangSC" 
            font-weight: bold 
            margin: .31rem auto 0
            position: relative
            z-index: 200 
  @media screen and (min-height: 700px)
    .container .information
    .container .jackpot  
      margin-top: 6%  
    .container .timing
      top: 50%
  @media screen and (min-height: 770px)
    .container .timing
      top: 45%    
    .container .purchase
      height: 45vh
    .container .purchase .my
      padding-top: 17.5%
    .container .purchase .option
      padding-top: 18.5%
    .container .purchase .option .left .input
      padding-bottom: 20%
    .container .purchase .btn-box
      margin-top: .1rem
    .container .purchase .option .right div
      height: .43rem
      line-height: .4rem
    .container .purchase .option .right div.on
      line-height: .43rem                                                        
</style>
 