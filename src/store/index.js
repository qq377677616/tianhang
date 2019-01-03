import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  myBalance: 0,
  isLoading: false,
  isMusicMuted: false
}
const mutations = {
  updateBalance(state, data) {
    state.myBalance = data.myBalance
  },
  updateIsLoading(state, data) {
    state.isLoading = data
  },
  musicControls(state, data) {
    state.isMusicMuted = data
  }
}

export default new Vuex.Store({
  state,
  mutations
})