<template>
  <div class="record">
    <div class="record-list" v-if="isRecord"> 
      <scroll class="scroll-record" ref="scrollRecord" :pulldown="isPullup" @pulldown="pulldown" :pullup="isPullup" @scrollToEnd="myScrollToEnd" :data="recordList">
        <ul>
          <li v-for="(item, index) in recordList">
            <div class="title flex-bet"><div class="h3 flex-ali">{{item.betRule | betRuleSwitch}}<div class="num"><span>{{item.w.join('')}}</span><span>{{item.q.join('')}}</span><span>{{item.b.join('')}}</span><span>{{item.s.join('')}}</span><span>{{item.g.join('')}}</span></div></div><p :class="[item.status == 300 ? 'on' : '']"><span v-if="item.betStatus != 400"><template v-if="item.status == 100">已提交</template><template v-if="item.status == 200">已支付</template><template v-if="item.status == 300">返还{{item.awardAmount}}WLC</template><template v-if="item.status == 310">未中奖</template><template v-if="item.status == 900">购买失败</template></span><span v-if="item.betStatus == 400">{{item.awardLevel | chineseCharacters}}等奖&nbsp;+{{item.winAmount || '****'}}</span></p></div>
            <dl>
              <dd class="stage flex-bet"><div class="flex-ali"><p>{{item.instanceDisplayNum}}期</p><p>共{{item.betItemCount}}注</p><p>{{item.multiple}}倍</p></div><div class="money">投注金额：{{item.amount}}&nbsp;WLC</div></dd>
              <dd class="flex-bet"><p>投注时间：{{item.createdAt}}</p><p>开奖号码：{{item.awardNumber ? item.awardNumber : '--'}}</p></dd>
            </dl>
          </li>
          <li class="loading-container" v-show="recordList.length > 0">
            <loading :title="isMore ? '加载中...' : '没有更多了~'"></loading>
          </li>
        </ul>
      </scroll>
    </div> 
    <div v-show="isLoadingList" class="loading-con flex-cen"><loading is-full="1" is-icon="1"></loading></div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { ERR_Ok, ERR_WAIT, TOAST } from 'api/config'
  import { getBuyRecords } from "api/request"
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
      //this.getBuyRecords()
    },
    activated() {
      //this.isLoadingList = true
      this.getBuyRecords(true)
    },
    methods: {
      getBuyRecords(isReset) {
        this.isRequest = true
        let _data = {
          currentPage: this.currentPage,
          pageSize: 20
        } 
        getBuyRecords(_data).then(res => {
          console.log(res)
          if (res.code === ERR_Ok) {
            if (this.currentPage == 1 && res.data.length == 0) {
              this.isRecord = false
              return
            }
            if (isReset) {
              this.recordList = []
              this.currentPage = 1
            }
            this.recordList = this.recordList.concat(res.data)
            if (res.data.length < 20) {
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
        this.getBuyRecords(true)
      },
      myScrollToEnd() {
        if (!this.isMore || this.isRequest) return
        this.getBuyRecords()
      } 
    },
    filters: {
      betRuleSwitch(val) {
        let _str = '*'
        if (val == 100) {
          _str = '五星直选'
        } else if (val == 200) {
          _str = '三星直选'
        } else if (val == 300) {
          _str = '三星组六'
        } else if (val == 310) {
          _str = '三星组三'
        } else if (val == 400) {
          _str = '二星直选'
        } else if (val == 500) {
          _str = '二星组选'
        } else if (val == 600) {
          _str = '一星直选'
        } else if (val == 700) {
          _str = '大小单双'
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
    background: #136DCE
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
              border-top: 1px solid #2784D9
            .title
              height: h = .2rem
              line-height: h                            
              font-size: .14rem
              font-family: "PingFangSC"
              font-weight: bold
              .num
                margin-left: .14rem
                span
                  padding-right: .12rem
              p
                font-weight: normal
                font-size: .12rem
                &.on
                  color:rgba(255,142,10,1)
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
                &.stage
                  p:not(:last-child)
                    margin-right: .16rem  
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
