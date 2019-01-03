<template>
  <div class="rule1">
    <div class="nav">
      <img src="../../assets/dice/image/back.png" alt="" class="back" @click='back'>
      <span>玩法规则</span>
    </div>
    <div class="title">玩法规则</div>
    <div class="line">玩家自由选择一个数字区间，来猜测游戏结果，如果猜中则赢取相应的奖金。游戏结果为0-99共100种可能，根据玩家选择数字范围不同，中奖概率和赔率也会相应的变化。</div>
    <div class="section">
      <div class="block">
          <div class="l1">小于</div>
          <div style="width:4.26rem;">结果处于小于选择数则获胜，eg：选择数为50，即<span style="color:#70FF4D;">0&lt;结果&lt;50获胜</span>，否则失败</div>
      </div>
      <div class="block">
          <div class="l1">等于</div>
          <div style="width:4.26rem;">结果处于小于选择数则获胜，eg：选择数为50，即<span style="color:#70FF4D;">结果=50获胜</span>，否则失败</div>
      </div>
      <div class="block">
          <div class="l1">大于</div>
          <div style="width:4.26rem;">结果处于小于选择数则获胜，eg：选择数为50，即<span style="color:#70FF4D;">50&lt;结果&lt;99获胜</span>，否则失败</div>
      </div>
    </div>
    <div class="title">开奖号码</div>
    <div class="line">我们的开奖结果是由下注成功后的第10个随机源的最后二位数字组成，它是一个32字节的随机数，根据一系列非常复杂的加密算法取公开源随机生成，所有的算法公开，随机源可以验证，不受任何一方控制。例如玩家的下注期号时为31000，则开奖期号为31010。</div>
    <div class="title">幸运数字</div>
    <div class="line">
      玩家每下注一次根据用户信息因子产生一个幸运数字额外给玩家一次暴击机会，如果幸运数字与开奖号相同，则从奖池中给用户赔率*10倍<br/>
      即：原来为1.96赔率幸运暴击后赔率为19.6
    </div>
    <div class="title">投注限额</div>
    <div class="line">为避免因单局投注额度过大，导致奖金池迅速被清空，使游戏停摆。因此我们设置了单局游戏的投注限额，单局限额为总奖池的1%</div>
  </div>
</template>
<script>
export default {
  methods:{
    back() {
      this.$router.push('/dice')
    }
  }
}
</script>

<style lang="scss">
.rule1 {
  // width: 100%;
  background: #0C2932;
  text-align: left;
  padding: 0 0.32rem;
  padding-top: 1.5rem;
  min-height: calc(100% - 1.5rem);
  width: calc(100% - 0.64rem)!important;
  .nav {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 0.88rem;
    background: #081F26;
    
    // position: relative;
    span {
      color: #70FF4D;
      font-size: 0.36rem;
      font-weight: bold;
      position: absolute;
      left:50%;
      top: 0.15rem;
      transform: translateX(-50%);
    }
  }
  .section {
    color: #568475;
    margin: 0.58rem 0;
    .block {
      display: flex;
      align-items: center;
    justify-content: space-between;
    margin-bottom: 0.38rem;
      .l1 {
        background-image: url('../../assets/dice/image/bet-action-active.png');
        width: 1.92rem;
        height: 0.72rem;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #70FF4D;
        margin-right: 0.4rem;
      }
    }
  }
  .back {
    height: 0.88rem;
    width: 0.88rem;
  }
  .title {
    font-size: 0.28rem;
    font-weight: bold;
    color: #E0DCBC;
    margin-bottom: 0.2rem;
  }
  .line {
    font-size: 0.26rem;
    color: #568475;
    margin-bottom: 0.6rem;
  }
}
</style>
