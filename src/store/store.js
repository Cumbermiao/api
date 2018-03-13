import Vue from 'vue'
import Vuex from 'vuex'
import config from './config/config'
import log from './log/log'
import ip from './ip'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        config,
        log,
        ip
    }
})

export default store