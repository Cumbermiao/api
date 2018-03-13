import Vue from 'vue';
import Router from 'vue-router';

import Config from '@/pages/config/Config'
import ApiDetail from '@/pages/config/Detail'
import DetailCheck from '@/pages/config/detailCheck'
import Log from '@/pages/log/Log'
import IP from '@/pages/Ip/ip'
import LogDetail from '@/pages/log/LogDetail'
import Gateway from '@/pages/gateway/Gateway'
Vue.use(Router)

export default new Router({
    routes:[{
        path:'/',
        redirect:'/config'
    },{
        path:'/config',
        component:Config
    },{
        path:'/config/detail',
        component:ApiDetail
    },{
        path:'/config/check',
        component:DetailCheck
    },{
        path:'/log',
        component:Log
    },{
        path:'/ip',
        component:IP
    },{
        path:'/log/detail',
        component:LogDetail
    },{
        path:'/gateway',
        component:Gateway
    },]
})