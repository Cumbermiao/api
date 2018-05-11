import {APP_ERROR} from '../mutations'
import axios from '@/utils/axios'
import {FOR_LOG_LIST,FOR_LOG_DETAIL} from '../api'
const state = {
    currentApi:null,
    currentLogId:null
}

const actions = {
    //日志列表
    async [FOR_LOG_LIST]({commit},param){
        const {status, statusText, data} = await axios.post('/apiCallLog/listStatic',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //调用详情
    async [FOR_LOG_DETAIL]({commit},param){
        const {status, statusText, data} = await axios.post('/apiCallLog/listDetail',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
}

const mutations = {
    setLogCurrentApi(state,obj){
        state.currentApi = obj
    },
    SetCurrentLogId(state,id){
        state.currentLogId = id
    }
}
export default {
    state,
    actions,
    mutations
}