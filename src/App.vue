<template>
  <div id="app">
    <transition :name="transitionRouter">
      <keep-alive><router-view class="router-view"/></router-view></keep-alive>
      <!-- <router-view class="router-view"/></router-view> -->
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import MyHeader from 'components/lottery/my-header/my-header'
  export default {
    name: 'App',
    data() {
      return {
        transitionRouter: ''
      }
    },
    components: {
      MyHeader,
    },
    watch: {
      '$route' (to, from) {
        if (to.path == '/' || to.path == '/lottery' || to.path == '/lucky') {
          this.transitionRouter = 'router-left'
        } else {
          this.transitionRouter = 'router-right'
        }
        /*console.log(this.transitionRouter)
        console.log(from)  
        console.log(to) */ 
      }
    }
  } 
</script>
  
<style scoped lang="stylus">
#app
  // background: linear-gradient(180deg, #275bcb 0%, #07359a 100%)
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
</style>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  background:linear-gradient(180deg,rgba(22,107,206,1) 0%,rgba(1,132,208,1) 100%);
}
html,body {
  height: 100%;
  width: 100%;
  font-size: 0.22rem;
}

</style>
