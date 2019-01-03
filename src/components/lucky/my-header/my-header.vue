<template>
  <div class="my-header flex-bet">
    <div class="left flex-cen" @click="goBack">
      <div class="back" ></div>
      <div class="balance flex-cen">
        <img src="../../../assets/lucky/images/icon_02.png" alt="" />
        <div class="num">{{myBalance}}</div>
        <span>WLC</span>
      </div>
    </div>     
    <div class="right flex-cen">
      <div class="record" @click="jumpRecord"></div>
      <div class="rule" @click="jumpRule"></div>
    </div>
  </div>      
</template>

<script>
import bridge from '@/tools/bridge.js'
  export default {
    props: {
      myBalance: {
        type: String,
        default: 0
      } 
    },
    methods: {
      jumpRecord() {
        this.$emit("jumpRecord")
      },
      jumpRule() {
        this.$emit("jumpRule")
      },
      goBack(){
        if (typeof wayki != 'undefined') {
          wayki.finishActivity()
        } else {
            bridge.callhandler("notifyAppPop")
        }
      }
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .my-header
    //position: fixed
    width: 100%
    padding: .08rem 0 .04rem
    left: 0
    top: 0
    // background:linear-gradient(180deg,rgba(22,107,206,1) 0%,rgba(1,132,208,1) 100%)
    // box-shadow:0px 3px 4px rgba(16,62,162,1)
    z-index: 500
    .left
      color: #fff
      .back
        width: .28rem
        height: .28rem
        background: url(../../../assets/lucky/images/icon_01.png) no-repeat center  
        background-size: 100%
        margin-left: .04rem
      .balance
        margin-left: .14rem
        img
          widht: .16rem
          height: .17rem
          margin-right: .04rem
        .num
          font-size: .13rem  
          //width: 1.08rem
          padding:0 .2rem
          height: .24rem
          line-height: .24rem
          background: #1450B9
          border-radius: .24rem
          text-align: center
        span
          font-size: .12rem   
          padding-left: .06rem
          color: #96B8FF   
    .right
      div
        width: .28rem
        height: .28rem  
        background: url(../../../assets/lucky/images/icon_03.png) no-repeat center 
        background-size: 100%   
      .rule
        background-image: url(../../../assets/lucky/images/icon_04.png)   
        margin: 0 .11rem 0 .19rem 
</style>
