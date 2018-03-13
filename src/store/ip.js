import {APP_ERROR} from './mutations'
import axios from '@/utils/axios'
import {ADD_WHITE_IP,FOR_CONTROL_LIST,FOR_IP_LIST,REMOVE_WHITE_IP,UPDATE_WHITE_IP,UPDATE_GATEWAY,FOR_GATEWAY} from './api'
const state = {
    currentApi:null
}

const actions = {
    //新增ip
    async [ADD_WHITE_IP]({commit},param){
        const {status, statusText, data} = await axios.post('/config/add',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //控制对象列表
    async [FOR_CONTROL_LIST]({commit},param){
        const {status, statusText, data} = await axios.post('/api/controlTargetList',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //白名单列表
    async [FOR_IP_LIST]({commit},param){
        const {status, statusText, data} = await axios.post('/config/list',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //删除
    async [REMOVE_WHITE_IP]({commit},param){
        const {status, statusText, data} = await axios.post('/config/del',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //修改
    async [UPDATE_WHITE_IP]({commit},param){
        const {status, statusText, data} = await axios.post('/config/edit',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },

    //获取网关配置 
    async [FOR_GATEWAY]({commit},param){
        const {status, statusText, data} = await axios.post('/config/list',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },

    //修改网关配置
    async [UPDATE_GATEWAY]({commit},param){
        const {status, statusText, data} = await axios.post('/config/edit',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
 
}

const mutations = {
    setLogCurrentApi(state,obj){
        state.currentApi = obj
    }
}
export default {
    state,
    actions,
    mutations
}