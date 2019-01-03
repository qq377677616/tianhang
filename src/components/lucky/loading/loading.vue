<template>
  <div class="loading flex-cen">
    <!-- <div class="loading-box">
            <div class="loading-icon">
              <img src="../../../assets/lucky/images/loading_01.png" alt="" class="machine"/>   
              <div class="ticket">
                <div class="ticket-box"></div>    
              </div> 
            </div> 
            <div class="progress-num">
              <div class="progress"><div class="progress-box"><div class="progress-bar" :style="{width: progress + '%'}"></div></div></div>
              <div class="num">{{progress}}%</div>      
            </div>   
          </div> -->      
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        progressSpeed: 80,
        progressSpeed2: 90,
        progressSpeed3: 50,
        progress: 0,
        progress1: 34,
        progress2: 70,    
        progress3: 100,
        interval_progressStart: null,
        interval_progressComplete: null
      }    
    },
    created() {
      this.progressStart()    
    },
    methods: {
      progressStart() {
        this.interval_progressStart = setInterval(() => {
          if (this.progress < this.progress2) {
            this.progress++    
            if (this.progress > this.progress1) {
              this.progressSpeed = this.progressSpeed2
            }  
          } else {
            clearInterval(this.interval_progressStart)
          }  
        }, this.progressSpeed)
      },
      progressComplete() {
        if (this.interval_progressStart) {
          clearInterval(this.interval_progressStart)
        }
        this.interval_progressComplete = setInterval(() => {
          if (this.progress < this.progress3) {
            this.progress++     
          } else {
            clearInterval(this.interval_progressComplete)
            this.$emit('loadingOk')
          }  
        }, this.progressSpeed3) 
      }    
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
  .loading
    absolute-full(2000)
       
                                          
</style>
