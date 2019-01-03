<template>
  <div class="rule">
    <headers header-title="玩法说明"></headers>
    <div class="rule-con">
      <scroll class="scroll-rule">
        <ul class="rule-box">
          <li class="explain">
            <h3>彩票玩法说明</h3>
            <p>玩家任意购买数量的彩票，彩票序号即为购买序号，玩家所有的购买资金都放入奖金池中。每24H开奖一次，每次开出5个中奖号码，根据开奖顺序确定中奖名次，中奖者按照中奖名次一次分享奖金池奖金。</p>    
          </li>
          <li class="proportion">
            <h3>中奖名次分配比例</h3>
            <dl>
              <dd><p>中奖名次</p><p>奖池百分比</p><p>说明</p></dd>    
              <dd><p>1</p><p>50%</p><p>根据奖池资金变化</p></dd>    
              <dd><p>2</p><p>25%</p><p>根据奖池资金变化</p></dd>    
              <dd><p>3</p><p>12.5%</p><p>根据奖池资金变化</p></dd>    
              <dd><p>4</p><p>6%</p><p>根据奖池资金变化</p></dd>    
              <dd><p>5</p><p>3%</p><p>根据奖池资金变化</p></dd>    
            </dl>
            <h4>注：每期剩余的3.5%转入下一期</h4>    
          </li>
          <li class="number">
            <h3>开奖号码</h3>
            <p>我们的开奖结果是由本期截止后，依次获取随机源的前16字节转化为10进制A，A除以本期所有的总票数取余的到的值</p> 
            <p>即为中奖号码，如果余数为 0 则中奖号等于总票数数值依次开出5个中奖号，如果后面中奖与前中奖号相同，该开奖号放弃，依次增加名次，直到开出所有 5 个开奖号码它是一个 32字节的随机数，根据一系列非常复杂的加密算法取公开源随机生成，所有的算法公开，随机源可以验证，不受任何一方控制。</p>   
          </li>    
        </ul>    
      </scroll>    
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Headers from 'components/lottery/header/header'
import Scroll from 'base/scroll/scroll'
  export default {
    components: {
      Headers,
      Scroll    
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
@import '~common/style/variable'
  .rule
    height: h = 100%
    background: #1849B4
    text-align: left
    .rule-con
      position: absolute
      width: 100%
      left: 0
      top: $headerHeight
      bottom: 0
      .scroll-rule
        height: 100%
        overflow: hidden
      .rule-box
        padding: .3rem .16rem .1rem
        font-family: "PingFangSC"
        li
          margin-bottom: .3rem    
          h3
            height: h = .2rem
            line-height: h
            font-size: .14rem
            color: #fff
            margin-bottom: .08rem
          h4
            height: h = .17rem
            line-height: h
            font-size: .12rem
            color:rgba(232,107,64,1)
            margin-top: .1rem    
          &>p
            font-size: .12rem
            line-height: .2rem
            color: rgba(120,162,253,1)
          dl
            dd
              height: h = .28rem
              line-height: h
              font-size: .12rem
              color: rgba(120,162,253,1)
              text-align: center
              background: #103FA6
              &:first-child
                background: #052B7B
              &:nth-child(2n)
                background: #09369A        
              p
                display: inline-block
                vertical-align: top
                width: 40% 
                &:first-child
                  width: 20%
              &:first-child~dd p:last-child
                color: rgba(69,125,245,1)
          &.number
            margin-bottom: .1rem   
            p:last-child
              margin-top: .05rem                                               
</style>
