import Vue from 'vue';
import Router from 'vue-router';

import Config from '@/pages/config/Config'
import ApiDetail from '@/pages/config/Detail'
import DetailCheck from '@/pages/config/detailCheck'
import Log from '@/pages/log/Log'
import IP from '@/pages/Ip/ip'
import LogDetail from '@/pages/log/LogDetail'
import Gateway from '@/pages/gateway/Gateway'
import store from './store/store'
Vue.use(Router)

const router =  new Router({
    routes:[{
        path:'/',
        redirect:{name:'config'}
    },{
        name:'config',
        path:'/config',
        component:Config,
    },{
        path:'/config/detail',
        component:ApiDetail
    },{
        path:'/config/check',
        component:DetailCheck
    },{
        path:'/log',
        component:Log,
        meta:{
            keepAlive:true
        }
    },{
        path:'/ip',
        component:IP,
        
    },{
        path:'/log/detail',
        component:LogDetail
    },{
        path:'/gateway',
        component:Gateway
    },]
})

// router.beforeEach((to, from, next)=>{
//     console.log(to, from)
//     if(to.path!='/log'||from.path!='/log/detail'){
//         console.log('ss')
//         store.dispatch('FOR_TREE', 'Api')
//     }
//     next()
// })

export default router