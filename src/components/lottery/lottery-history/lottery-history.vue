<template>
  <!-- <div class="record container"> -->
  <div class="record">
    <div class="first-prize-box" v-if="isLottery">
      <div class="first-prize">
       <img src="../../../assets/lottery/images/record_01.png" alt="" /> 
       <div class="con">
         <p>{{prizeList[0].winAmount}}</p> 
         <h3>获奖者<span>{{prizeList[0].userName}}</span></h3>  
       </div>
      </div>
      <div class="votes flex-bet">
        <p>总票数：<span>{{totalCount}}</span></p>
        <div class="stage flex-cen">
          <span v-for="item in curIssue">{{item}}</span>    
          <!-- <span>8</span>    
           <span>5</span> --> 
          期   
        </div>    
      </div>
      <div class="prize">
        <div class="prize-title flex-cen">
          <p>昵称</p>    
          <p>奖金</p>    
          <p>中奖号码</p>    
        </div>
        <div class="prize-box">
          <scroll class="scroll-prize" ref="scrollPrize" :data="prizeList" :pullup="isPullup">
            <ul>
              <li v-for="(item, index) in prizeList" :class="[item.isOpen ? 'open' : '']" :data-index="index">
                <div class="flex-bet" @click="openCur"><h3 :data-index="index"><span>{{index + 1}}</span>{{item.userName}}</h3><h4 :data-index="index">{{item.winAmount}}</h4><p :data-index="index">{{item.result}}<span></span></p></div>
                <div class="con" v-show="item.isOpen">
                  <div class="con-title flex"><p>名称</p><p>时间</p><p>哈希值</p></div>
                  <dl>
                    <dd v-for="(items, indexs) in item.source" class="flex">
                      <h3>{{items.name || '哈希'}}</h3>
                      <h4>{{items.time ? items.time.split(' ')[1] : '--:--:--'}}</h4>
                      <h5>{{items.hash}}</h5>
                      <p v-if="indexs > 2" v-clipboard:copy="items.hash" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</p>
                      <p v-else class="on" :data-hash="items.hash" @click="showModal">校验</p>
                      <!-- <p :data-type="items.type" :class="[items.type   == 0 ? '' : 'on']" @click="showModal">{{items.type == 0 ? '复制' : '检验'}}</p> -->
                    </dd>    
                  </dl>    
                </div>
              </li>
              <!-- <li class="loading-container">
                     <loading :title="loadingText"></loading>
                   </li> -->     
            </ul>  
          </scroll>
        </div>
      </div>
    </div>
    <div class="no-award" v-if="!isLottery">
      <div class="no-award-box">
        <div class="title flex-bet">
          <p>未开奖</p>
          <div class="stage flex-cen">
            <span v-for="item in curIssue">{{item}}</span>
            期   
          </div>      
        </div>
        <ul class="award-list">
          <li v-for="(item, index) in awardList">
            <h3 v-if="index == 0">一等奖可获得奖金(WLC)</h3>
            <h3 v-if="index == 1">二等奖可获得奖金(WLC)</h3>
            <h3 v-if="index == 2">三等奖可获得奖金(WLC)</h3>
            <h3 v-if="index == 3">四等奖可获得奖金(WLC)</h3>
            <h3 v-if="index == 4">五等奖可获得奖金(WLC)</h3>
            <p>{{item.winAmount}}</p>
          </li>
          <!-- <li><h3>一等奖可获得奖金(WLC)</h3><p>124875.12</p></li>    
             <li><h3>二等奖可获得奖金(WLC)</h3><p>7689.08</p></li>    
             <li><h3>三等奖可获得奖金(WLC)</h3><p>825.76</p></li>    
             <li><h3>四等奖可获得奖金(WLC)</h3><p>187.81</p></li>    
             <li><h3>五等奖可获得奖金(WLC)</h3><p>47.17</p></li>  -->   
        </ul> 
      </div>    
    </div>
    <div v-show="isLoadingList" class="loading-li flex-cen"><loading is-full="1" is-icon="1"></loading></div>
    <div class="prev-next flex-bet">
      <div :class="[isPrev ? '' : 'disabled']" data-type="0" @click="switchPrevNext">上一期</div>    
      <div :class="[isNext ? '' : 'disabled']" data-type="1" @click="switchPrevNext">下一期</div>    
    </div>
    <div class="modal" v-show="isShowModal">
      <div class="fadeShow">
        <div :class="['modal-validate', isShowModal ? 'on' : '']">
          <div class="close" @click="hideModal"></div>
          <h3>奖号验证</h3>
          <div class="top">
            <h4>输入对应的号源</h4> 
            <textarea name="" id="" v-model="sourceNumber"></textarea>  
            <div class="btn">校验</div> 
          </div>  
          <div class="bottom">
            <h4>检验结果</h4>
            <dl>
              <dd class="flex-cen"><span>SHA256转化值</span><p>24dght1231ahdkauhtkwgaijdlqejq…</p></dd>    
              <dd class="flex-cen"><span>取前16位数字</span><p>24dght1231ahdkauhtkwgaijdlqejq…</p></dd>    
              <dd class="flex-cen"><span>10进位转换</span><p>24dght1231ahdkauhtkwgaijdlqejq…</p></dd>    
              <dd class="flex-cen"><span>除以总票数</span><p>24dght1231ahdkauhtkwgaijdlqejq…</p></dd>    
              <dd class="flex-cen"><span>得到开奖号码</span><p>24243566</p></dd>    
            </dl>  
          </div>  
        </div>
      </div>  
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import HeaderRecord from 'components/lottery/header-record/header-record'
  import { ERR_Ok, ERR_WAIT, TOAST } from 'api/config'
  import { getAwardRecord } from 'api/request'
  export default {
    data() {
      return { 
        isCurrentPage: true,
        autoUpdateTime: 10,
        autoUpdateInter: null,
        curIssueNo: 0,
        isLottery: false,
        isPullup: true,
        loadingText: "加载中...",
        tabList: ["开奖历史", "我的记录"],
        curIssue: "----",
        totalCount: 0,
        isPrev: true,
        isNext: false,
        isLoadingList: true,
        prevNextIssueNo: [0, 0],
        awardList: [],
        prizeList: [],
        sourceNumber: '',
        isShowModal: false    
      }    
    },
    created() {
      //this._getAwardRecord(0)
      //console.log(this.$route.params.isLottery)
    },
    activated() {
      this.isCurrentPage = true
      if (this.$route.params.isLottery) {
        this.curIssueNo = 0
        this.isLoadingList = true
      }
      this._getAwardRecord(this.curIssueNo)
    },
    deactivated() {
      this.isCurrentPage = false
      if (this.autoUpdateInter) {
        clearInterval(this.autoUpdateInter)
      }
    },
    computed: {
      /*curIssue() {
        return this.curIssue.split('')
      }*/
    },
    methods: {
      _getAwardRecord(issueNo) {
        if (this.autoUpdateInter) {
          clearInterval(this.autoUpdateInter)
        }
        let _data = {
          issueNo: issueNo,
          currentPage: 1,
          pageSize: 20
        }
        getAwardRecord(_data).then(res => {
          if (res.code === ERR_Ok) {
            this.isLottery = res.data.open
            this.curIssue = res.data.issue
            this.prevNextIssueNo = [res.data.beforeInstanceId, res.data.nextInstanceId]
            this.prevNextIssueNo[1] ? (this.curIssueNo = this.prevNextIssueNo[1] - 1) : (this.curIssueNo = 0)
            if (this.isLottery) {
              this.prizeList = res.data.users 
            } else {
              this.awardList = res.data.users
              if (!this.isCurrentPage) return
              this.autoUpdateInter = setTimeout(() => {
                this._getAwardRecord(this.curIssueNo)
              }, this.autoUpdateTime * 1000)
            }
            if (this.prevNextIssueNo[0] === null) {
              this.isPrev = false
            } else {
              this.isPrev = true
            }
            if (this.prevNextIssueNo[1] === null){
              this.isNext = false
            } else {
              this.isNext = true
            }
          } else if (res.code === ERR_WAIT) {
            this.$toast(TOAST[1])
          }
          setTimeout(() => {this.isLoadingList = false}, 300)
        }).catch(err => {
          this.isLoadingList = false
          this.$toast(TOAST[0])
          this._getAwardRecord(this.curIssueNo)
          console.log("【请求失败】")
          console.log(err)
        })
      },
      /*autoUpdate() {

      },*/
      /*headerSwitch(e) {
        if (e[0].index == 0) {
          this.$router.push('../record')    
        } else if (e[0].index == 1) {
          this.$router.push('../myRecord')    
        }   
      },*/ 
      openCur(e) {
        let _index = e.target.dataset.index
        Vue.set(this.prizeList[_index], "isOpen", !this.prizeList[_index].isOpen)
      },
      onCopy: function (e) {
        //this.copyContent = '55555555555'
        this.$toast('复制成功')
      },
      onError: function (e) {
        console.log('复制失败')
      },
      showModal(e) {
        this.sourceNumber = e.target.dataset.hash
        this.isShowModal = true
      },
      hideModal() {
        this.isShowModal = false
      },
      /*myScrollToEnd() {
        if (this.prizeList.length >= 30) {
          this.loadingText = '没有更多了'
        } else {
          let _prizeList = this.prizeList.concat(this.prizeList)
          this.prizeList = _prizeList
          //this.$refs.scrollRecord.refresh()
        }
      },*/
      switchPrevNext(e) {
        let _type = parseInt(e.target.dataset.type)
        if (!this.prevNextIssueNo[_type]) return
        this.isLoadingList = true
        this._getAwardRecord(this.prevNextIssueNo[_type])
      }
    },
    components: {
      HeaderRecord,
      Scroll,
      Loading    
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
  .record
    background:linear-gradient(180deg,rgba(39,91,203,1) 0%,rgba(7,53,154,1) 100%)
    color: #fff 
    font-size: 0
    height: calc(100% - .44rem)
    box-sizing: border-box
    text-align: left
    .loading-li
      absolute-full(5)
    .first-prize-box
      background: url(../../../assets/lottery/images/bg_02.png) no-repeat center bottom
      background-size: 3.59rem 3.6rem     
      padding-bottom: .12rem
    .first-prize
      margin-top: .35rem
      text-align: center
      position: relative
      img
        width: 86.4%
        position: absolute
        left: 50%
        transform: translateX(-50%) 
        top: 0
        z-index: 1
      .con
        padding-top: 1.22rem 
        position: relative
        z-index: 5  
        p
          font-size: .22rem
          font-family: "DIN"
          font-weight: bold
          height: .27rem
          line-height: .27rem
          color: rgba(255,255,255,1)
          text-shadow: 0px 2px 2px rgba(96,32,11,0.31)  
        h3
          font-size: .13rem
          font-family: "PingFangSC"
          font-weight: bold
          line-height: .18rem
          color: rgba(120,162,253,1) 
          margin-top: .15rem
          span
            font-size: .12rem
            font-family: "PingFangSC"
            height: .17rem
            line-height: .17rem
            color: #fff
            display: block
            padding-top: .04rem
    .votes
      padding-top: .08rem
      p
        font-size:13px
        font-family: "PingFangSC"
        font-weight: bold
        height: .18rem
        line-height: .18rem
        color: rgba(120,162,253,1)
        margin-left: .18rem 
        span
          color: #fff
          padding-left: .03rem   
    .stage
      height: .29rem
      line-height: .29rem
      font-size: .15rem
      color: #fff
      margin-right: .2rem
      span
        width: .18rem
        height: 100%
        background: url(../../../assets/lottery/images/bg_03.png)
        background-size: 100%
        font-size: .16rem
        font-family: "PingFangSC"
        color: rgba(255,216,0,1)
        text-align: center
        &:last-child
          margin-right: .05rem            
    .prize 
      width: 89.333%
      margin: .09rem auto 0
      border-radius: .05rem
      overflow: hidden
      background: #052B7B
      padding-bottom: .2rem
      .prize-title
        height: .32rem
        background: #01246E
        font-size: .13rem
        font-family: "PingFangSC"
        color: rgba(120,162,253,1) 
        p:first-child
          width: 45%
          text-align: center
        p:nth-child(2)
          width: 33%
        p:last-child
          width: 22%
      .prize-box
        font-size: .12rem
        color: #fff
        height: 1.61rem
        //overflow-y: auto
        .scroll-prize
          height: 100%
          overflow: hidden 
          li
            line-height: .17rem  
            padding-top: .14rem
            position: relative
            &:first-child span, &:nth-child(2) span, &:nth-child(3) span
              background: url(../../../assets/lottery/images/icon_06.png) 
              background-size: cover  
              line-height: 0.2rem !important
              color: #fff !important
            &>.flex-bet            
              h3
                width: 45%
                padding-left: .13rem
                box-sizing: border-box
                span
                  display: inline-block
                  vertical-align: top
                  width: h = .17rem
                  height: h
                  line-height: h
                  font-size: .11rem
                  color: rgba(120,162,253,1)
                  font-weight: bold 
                  text-align: center
                  margin-right: .11rem    
              h4
                width: 32%
                font-size: .13rem
                color: #E86B40
              p
                width: 23%
                color: #457DF5
                padding-right: .25rem
                box-sizing: border-box
                background: url(../../../assets/lottery/images/icon_07.png) no-repeat right .11rem center
                background-size: .08rem .04rem
            &.open>.flex-bet
              p
                background-image: url(../../../assets/lottery/images/icon_07s.png)            
            .con
              background: #01246E
              margin-top: .12rem
              padding-bottom: .12rem
              .con-title
                height: h = .26rem
                line-height: h
                font-size: .1rem
                font-family: "PingFangSC"
                color: rgba(69,125,245,1)
                border-bottom: 1px solid #143580
                &>p:first-child~p
                  text-align: center
                p:first-child
                  width: 27%
                  padding-left: .13rem
                  box-sizing: border-box
                p:nth-child(2)
                  width: 16%
                p:last-child
                  width: 38%  
              dd
                height: .14rem
                line-height: .14rem
                font-size: .1rem
                color: rgba(120,162,253,1) 
                margin-top: .12rem 
                color: #78A2FD      
                h3
                  width: 27%
                  padding-left: .13rem
                  box-sizing: border-box
                h4
                  width: 16%
                h5
                  width: 38%
                  margin: 0 .1rem
                p
                  width: 8%
                  color: #fff
                  margin-right: .16rem
                  &.on
                    color: #E86B40 
              h3, h4, h5, p
                white-space: nowrap
                text-overflow: ellipsis
                overflow: hidden 
    .no-award
      padding-top: .26rem   
      .no-award-box  
        width: 95.733%
        margin: 0 auto
        background: url(../../../assets/lottery/images/bg_04.png) no-repeat
        background-size: 100% 100%
        .title
          height: .29rem
          padding-top: .26rem
          p
            font-size: .15rem
            font-family: "PingFangSC"
            font-weight: bold
            color: rgba(100,141,230,1) 
            padding-left: .19rem 
      ul
        height: 3.53rem
        padding: .29rem 0 .45rem
        position: relative
        li:not(.loading-li)
          margin-left: .47rem
          padding-left: .64rem
          background: url(../../../assets/lottery/images/icon_09.png) no-repeat left center
          background-size: .32rem
          &:not(:last-child)
            margin-bottom: .32rem
          h3
            height: h = .2rem
            line-height: h
            font-size: .14rem
            font-family: "PingFangSC"
            color: rgba(120,162,253,1)
          p 
            height: h = .23rem
            line-height: h
            font-size: .18rem
            font-family: "DIN"
            font-weight: bold
            color: rgba(232,107,64,1)
            padding-top: .02rem                                                                        
    .prev-next
      position: absolute
      width: 100%
      left: 0
      bottom: 0
      padding: .12rem
      box-sizing: border-box
      div
        width: 1.7rem
        height: h = .44rem
        line-height: h
        text-align: center
        background: #2A65E3
        border-radius: .04rem 
        font-size: .17rem
        &.disabled
          background:rgba(21,71,178,1)
    .modal
      position: fixed
      width: 100%
      height: 100%
      left: 0
      top: 0 
      background: rgba(0,17,54,.6)       
      z-index: 600
      &>div
        height: 100%
      .modal-validate
        width: 91.46%
        border-radius: .06rem
        background: #fff
        position: absolute
        left: 50%
        top: 55%
        transform: translate(-50%, -50%) 
        padding: .14rem
        box-sizing: border-box
        transition: all .5s
        &.on
          top: 50%
        .close
          width: .26rem
          height: .26rem
          position: absolute
          right: 0
          top: 0
          background: url(../../../assets/lottery/images/icon_08.png) no-repeat left bottom
          background-size: .13rem .13rem
        h3
          font-size: .16rem
          font-family: "PingFangSC"
          font-weight: bold
          height: h = .22rem
          line-height: h
          color: rgba(33,33,33,1)
          padding-top: .02rem
          text-align: center
        .top
          margin-top: .14rem
          textarea
            width: 100%
            height: 1rem
            background:rgba(239,244,255,1)
            border-radius: .03rem
            padding: .08rem
            box-sizing: border-box
            margin:.08rem 0 .1rem
            font-size: .13rem
            font-family: "Helvetica";
            line-height: .16rem
            color: rgba(41,95,211,1)
            border: none 
            resize:none 
            outline:none
          .btn
            height: h = .4rem
            line-height: h
            text-align: center
            background: rgba(42,101,227,1)
            border-radius: .04rem
            font-size: .16rem 
            font-family: "PingFangSC"                                                                                                                                    
        h4
          font-size: .13rem
          font-family: "Helvetica"
          font-weight: bold
          line-height: .16rem
          color: rgba(186,186,186,1)
        .bottom
          margin-top: .16rem
          dl
            margin-top: .08rem
            dd
              height: h = .23rem
              line-height: h
              span
                display: block
                width: .95rem
                font-size: .12rem
                font-family: "Helvetica"
                color: rgba(33,33,33,1)
              p
                flex: 1
                background: #EFF4FF
                height: h = .23rem
                line-height: h
                font-size: .12rem
                color: rgba(41,95,211,1)
                padding-left: .08rem
              &:not(:last-child)
                margin-bottom: .04rem 
  .bottom-top-enter
    transform: translate(0, 100%)
  .bottom-top-leave-active
    transform: translate(0, -100%) 
  @media screen and (min-height: 700px)
    .record .no-award ul
      height: 60vh
      display: flex
      flex-direction: column
      justify-content: center
    .record .no-award .no-award-box .title
      padding-top: 10%
    .record .no-award ul li:not(:last-child)
      margin-bottom: 0.52rem !important
    .record .prev-next
      padding-bottom: 6% 
    .record .prize .prize-box
      height: 32vh
    .record .first-prize-box  
      background-size: 3.59rem 4.66rem
    .record .prize .prize-box .scroll-prize li
      padding-top: 7.5%
    .record .prize .prize-box .scroll-prize li .con dd
      margin-top: 5%
  @media screen and (min-height: 770px)
    .record .prize .prize-box
      height: 38vh
    .record .prize .prize-box .scroll-prize li
      padding-top: 11%
    .record .prize .prize-box .scroll-prize li .con dd
      margin-top: 8%  
    .record .first-prize-box  
      background-size: 3.59rem 5.15rem                                                
</style>
