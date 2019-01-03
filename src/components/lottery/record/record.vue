<template>
  <div class="record container">
    <header-record :tab-list="tabList" :cur-index="curIndex" @switch="headerSwitch"></header-record>
    <transition :name="transitionRouter">
      <keep-alive><router-view class="router-view" v-swipeleft="swipeleft" v-swiperight="swiperight"/></keep-alive>
    </transition>
  </div>  
</template>  

<script>
  import HeaderRecord from 'components/lottery/header-record/header-record'
  export default {
    data() {
      return {
        tabList: ["开奖历史", "我的记录"], 
        curIndex: 0,
        transitionRouter: ''
      }    
    },
    activated() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "./static/js/lottery.js";
      document.body.appendChild(script);
    },
    methods: {
      headerSwitch(e) { 
        if (e.index == -1) {
          this.curIndex = 0
          this.$router.push('/lottery')
          return
        }
        this.curIndex = e.index
        if (e.index == 0) {
          this.transitionRouter =  "router-left" 
          this.$router.push('../record')    
        } else if (e.index == 1) {
          this.transitionRouter =  "router-right"
          this.$router.push('../record/myRecord')    
        }   
      },
      swipeleft() {
        let _curIndex = 1
        if (this.curIndex == _curIndex) return
        this.curIndex = _curIndex
        this.headerSwitch({index: _curIndex})
      },
      swiperight() {
        let _curIndex = 0
        if (this.curIndex == _curIndex) return
        this.curIndex = _curIndex
        this.headerSwitch({index: _curIndex})
      }, 
    },
    components: {
      HeaderRecord   
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .container
    background:linear-gradient(180deg,rgba(39,91,203,1) 0%,rgba(7,53,154,1) 100%)
    color: #fff 
    font-size: 0
    height: 100vh 
    overflow: hidden
  .router-view
    transition: all .5s cubic-bezier(.55,0,.1,1)
    width: 100%
    position: absolute
 .router-right-enter, .router-left-leave-active
   opacity: 0
   transform: translate(100%, 0)
 .router-right-leave-active, .router-left-enter
   opacity: 0
   transform: translate(-100%, 0)  
  /*.router-view
    transition: all .5s cubic-bezier(.55,0,.1,1)*/
    /*width: 100%*/
   /* position: absolute*/
  /*.bottom-top-enter
    transform: translate(0, 100%)
  .bottom-top-leave-active
    transform: translate(0, -100%)*/   
/*.bottom-top-enter
  opacity: 0
  transform: translate(100%, 0)
.bottom-top-leave-active
  opacity: 0
  transform: translate(-100%, 0) */                        
</style>
