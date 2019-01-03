<template>
  <div class="rule">
    <headers header-title="玩法说明"></headers>
    <div class="rule-con">
      <scroll class="scroll-rule" ref="scrollRule">
        <ul class="rule-box"> 
          <li class="explain">
            <h3>游戏介绍</h3>
            <p>本“时时彩”采用的为重庆时时彩开奖源，分为“星彩玩法”“大小单双玩法”“二星组选”</p>    
          </li>
          <li>
            <h3>玩法规则</h3>
            <p><span>五星直选：</span>每个位置区域最少选择一个数，位置顺序数字都一样即为中奖，奖金为100000。</p>     
            <p><span>三星直选：</span>后三位每个位置区域最少选择一个数，位置顺序数字都一样即为中奖奖金为：1000。</p>     
            <p><span>三星组三：</span>最少选择2个号码，号码与后三位相同，顺序不限，即为中奖奖金为：320（后三位必须有相同的）</p>     
            <p><span>三星组六：</span>最少选择3个号码，号码与后三位相同，顺序不限，即为中奖奖金为：160（后三位必须不相同）</p>     
            <p><span>二星直选：</span>后二位每个位置区域最少选择一个数，位置顺序数字都一样即为中奖奖金为100。</p>     
            <p><span>二星组选：</span>从0-9中选2个或多个不同的号码对十位、个位投注，位置不限。投注号码与与当期开奖号码相同（位置不限）即中奖。单注投注金额2元。例如：当投注号码“45”时，无论开奖号码后两位是“45”或“54”，都为中奖。</p>     
            <p><span>一星直选：</span>最后一个位置区域最少选择一个数，位置数字都一样即为中奖奖金为10</p>     
            <p><span>大小单双玩法：</span>指猜时时彩“个位”和“十位”这两个位置的“大小、单双”玩法，即把10个自然数按“大”、“小”或“单”、“双”性质分为两组，0-4为小号，5-9为大号，0、2、4、6、8为双号，1、3、5、7、9为单号。投注者可对“个位、十位”的数字进行“大小、单双”的指定投注。投注者投注的号码位置、性质与开奖号码位置、性质相同即中奖。单注投注金额2元，单注中奖金额为4元。</p>     
          </li>
          <li>
            <h3>中奖规则</h3>
            <p>1、一星采用的是开奖号的最后一位（即个位），单注中奖10元；<br/>2、二星采用的是开奖号的后两位（即十位、个位），单注中奖100元；<br/>3、三星采用的是开奖号的后三位（即百位、十位、个位），单注中奖1000元；<br/>4、五星则代表5位全部（即万位、千位、百位、十位、个位）单注中奖100,000元。无论采用几星投注方式，每注彩票的金额均为2元。</p>  
          </li>    
          <li>
            <h3>开奖</h3>
            <p>1、每10分钟开奖一次,开奖通过电子开奖系统进行。<br/>2、中奖号码由电子开奖系统产生。开奖时按个、十、百、千、万位先后产生5个号码组成中奖号码。例如，如依次产生的5个号码分别为：4，0，1，3，5。那么“53104”的数字排列序列称为中奖号码。<br/>3、各期开奖后，立即通过网络向投注终端发布中奖号码和开奖结果。</p>  
          </li> 
        </ul>    
      </scroll>    
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Headers from 'components/lucky/header/header'
import Scroll from 'base/scroll/scroll'
  export default {
    components: {
      Headers,
      Scroll    
    },
    beforeCreate() {

    },
    activated() {
    },
    mounted() {
      this.$refs.scrollRule.refresh()
      //setTimeout(() => {this.$refs.scrollRule.refresh()}, 2000 )
    },
    methods: {
      
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
@import '~common/style/variable'
  .rule
    height: h = 100%
    background: #136DCE
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
          margin-bottom: .26rem    
          h3
            height: h = .2rem
            line-height: h
            font-size: .15rem
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
            color: rgba(137,182,230,1)
            margin-bottom: .08rem
            span
              color: #fff                                               
</style>
