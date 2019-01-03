<template>
  <div :class="['loading', isFull == 1 ? 'full' : '']">
    <img width="24" height="24" src="./loading.gif" v-if="isIcon == 1">
    <p class="desc" v-if="title">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      isFull: {
        type: String,
        default: '0'
      },
      isIcon: {
        type: String,
        default: '0'
      },
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  //@import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    .desc
      line-height: .2rem
      font-size: .12rem
      color: #fff
    &.full
      width: auto
      padding: .1rem
      border-radius: .05rem
      background: rgba(0,0,0,.7)  
</style>
