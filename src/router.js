import Vue from 'vue';
import Router from 'vue-router';

import Config from '@/pages/config/Config'

Vue.use(Router)

export default new Router({
    routes:[{
        path:'/',
        redirect:'/api/config'
    },{
        path:'api/config',
        component:Config
    }]
})