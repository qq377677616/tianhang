<template>
  <div class="record">
    <div class="record-list" v-if="isRecord"> 
      <scroll class="scroll-record" ref="scrollRecord" :pulldown="isPullup" @pulldown="pulldown" :pullup="isPullup" @scrollToEnd="myScrollToEnd" :data="recordList">
        <ul>
          <li v-for="(item, index) in recordList" :class="[item.betStatus == 400 ? 'yes' : 'no']">
            <div class="title flex-bet"><h3>{{item.startNo}}~{{item.endNo}}</h3><p><span v-if="item.betStatus != 400">{{item.betStatus == 300 ? '未中奖' : '待开奖' }}</span><span v-if="item.betStatus == 400">{{item.awardLevel | chineseCharacters}}等奖&nbsp;+{{item.winAmount || '****'}}</span></p></div>
            <dl>
              <dd><p>投注期数：{{item.betIssueNo}}</p></dd>
              <dd class="number" v-if="item.betStatus == 400">
                <p>投注号码：
                   <template v-for="(items, indexs) in item.allAwardNumbers">
                     <span :class="[item.awardNo == items ? 'ok' : '']">{{items}}</span>
                     <i>，</i>
                   </template>
                </p>
              </dd>
              <dd class="flex-bet"><p>投注时间：{{item.betTime}}</p><p>投注数量：{{item.betCount}}</p></dd>
            </dl>
          </li>
          <li class="loading-container" v-show="recordList.length > 0">
            <loading :title="isMore ? '加载中...' : '没有更多了~'"></loading>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="not-record flex-cen" v-if="!isRecord">
      <div>
        <img src="../../../assets/lottery/images/icon_10.png" alt="" />
        <p>暂无记录</p>
        <div class="btn" @click="backHome">去购买</div>
      </div>
    </div>
    <div v-show="isLoadingList" class="loading-con flex-cen"><loading is-full="1" is-icon="1"></loading></div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { ERR_Ok, ERR_WAIT, TOAST } from 'api/config'
  import {getRecord} from "api/request"
  export default {
    data() {
      return {
        isLoadingList: true,
        isPullup: true,
        isMore: true,
        isRequest: false,
        loadingText: "加载中...",
        isRecord: true,
        currentPage: 1,
        recordList: []
      }    
    },
    created() {
      this.getRecord()
    },
    activated() {
      //this.isLoadingList = true
      //this.getRecord()
    },
    methods: {
      getRecord(isPulldown) {
        this.isRequest = true
        let _data = {
          currentPage: this.currentPage,
          pageSize: 20
        }
        getRecord(_data).then(res => {
          if (res.code === ERR_Ok) {
            if (this.currentPage == 1 && res.data.data.length == 0) {
              this.isRecord = false
              return
            }
            if (isPulldown) this.recordList = []
            this.recordList = this.recordList.concat(res.data.data)
            if (res.data.data.length < 20) {
              this.isMore = false
            }
            this.currentPage++
          } else if (res.code === ERR_WAIT) {
            this.$toast(TOAST[1])
          }
          this.isRequest = false
          this.isLoadingList = false
        }).catch(err => {
          this.isRequest = false
          this.$toast(TOAST[0])
          console.log(err)
        })
      },
      backHome() {
        this.$router.push('/')
      },
      pulldown() {
        this.isLoadingList = true
        this.currentPage = 1
        this.getRecord(true)
      },
      myScrollToEnd() {
        if (!this.isMore || this.isRequest) return
        this.getRecord()
      } 
    },
    filters: {
      chineseCharacters(val) {
        let _str = '*'
        if (val == 1) {
          _str = '一'
        } else if (val == 2) {
          _str = '二'
        } else if (val == 3) {
          _str = '三'
        } else if (val == 4) {
          _str = '四'
        } else if (val == 5) {
          _str = '五'
        } 
        return _str
      }
    },
    components: {
      Scroll,
      Loading      
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
  .record
    background: #09379C
    height: 100%
    text-align: left
    .loading-con
      absolute-full(5)
    .record-list
      height: calc(100% - .44rem)
      .scroll-record
        height: 100%
        overflow: hidden
        ul
          padding: 0 .14rem
          li
            padding:.16rem 0 .2rem
            &:not(:first-child)
              border-top: 1px solid rgba(39,81,173,1)
            .title
              height: h = .2rem
              line-height: h                            
              font-size: .14rem
              font-family: "PingFangSC"
              font-weight: bold
              p
                font-weight: normal
                font-size: .12rem
            &.yes .title p
              color: #E86B40
            dl
              padding-top:  .16rem
              dd
                line-height: .16rem
                font-size: .11rem
                font-family: "PingFangSC"
                color: rgba(120,162,253,1)
                &:not(:last-child)
                  margin-bottom: .04rem
                &.number
                  max-width: 75%
                  p
                    padding-left: 5em
                    text-indent: -5em
                    span.ok
                      color: #e86b40
                    i
                      font-style: normal
                      color: #fff !important
                      &:last-child
                        display: none
            &.not-more
              padding: .3rem 0 .2rem
              text-align: center
              font-size: .14rem
              color: #fff                 
    .not-record
      height: 100%
      text-align: center
      font-family: "PingFangSC"
      &>div
        margin-top: -25%
        img
          width: 1.21rem
        p
          height: h = 20px
          line-height: h
          font-size: .14rem
          color: rgba(120,162,253,1) 
          margin: .2rem 0 .49rem
        .btn
          width: 1.12rem
          height: h = .44rem
          line-height: h
          border-radius: .04rem
          background: #295FD3
          font-size: .17rem 
          font-weight: bold 
</style>
