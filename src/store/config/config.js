import {APP_ERROR} from '../mutations'
import axios from '@/utils/axios'

import {FOR_TREE,REMOVE_CATAGORY,ADD_CATAGORY,UPDATE_CATAGORY,FOR_CATAGORY_DETAIL,FOR_API,FOR_DATASOURCE,FOR_INOUT_PARAM,ADD_API,
    UPLOAD_API,REMOVE_API,CHANGE_ENABLE,REGISTER,IMPORT_API,UPDATE_API,TEST_API,UNREGISTER} from '../api'

const state= {
    dataSourceList:null,//数据源列表
    currentCataId:null,//当前分类id（树）
    currentApi:null,
}
const actions = {
    //查询树
    async [FOR_TREE]({commit},param){
        const {status, statusText, data} = await axios.post('/common/catalog/queryTree',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },

    //分类
    async [ADD_CATAGORY]({commit},param){
        const {status, statusText, data} = await axios.post('/common/catalog/create',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    async [REMOVE_CATAGORY]({commit},param){
        const {status, statusText, data} = await axios.post('/api/deleteCatalog',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    async [UPDATE_CATAGORY]({commit},param){
        const {status, statusText, data} = await axios.post('/common/catalog/update',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //分类详情
    async [FOR_CATAGORY_DETAIL]({commit},param){
        const {status, statusText, data} = await axios.post('/common/catalog/queryByWid',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },

    //API 
    async [FOR_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/query',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //新增
    async [ADD_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/create',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //删除 
    async [REMOVE_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/deleteByWid',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //修改
    async [UPDATE_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/update',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //启用状态
    async [CHANGE_ENABLE]({commit},param){
        const {status, statusText, data} = await axios.post('/api/startOrStop',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //数据源下拉框 FOR_DATASOURCE
    async [FOR_DATASOURCE]({commit},param){
        const {status, statusText, data} = await axios.post('/metadata/datasource/selectList',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
                commit('getDataSource',data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },

    // 根据sql获取出入参
    async [FOR_INOUT_PARAM]({commit},param){
        const {status, statusText, data} = await axios.post('/api/getInOutParams',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //注册
    async [REGISTER]({commit},param){
        const {status, statusText, data} = await axios.post('/api/register',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //注销
    async [UNREGISTER]({commit},param){
        const {status, statusText, data} = await axios.post('/api/unRegister',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //上传
    async [UPLOAD_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/uploadConfig?catalogWid='+param.catalogWid,param.file,{"headers":{
            "content-type":"multipart/form-data"
        }})
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //导入
    async [IMPORT_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/importConfig',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data.dataSet)
            }else{
                reject(data.errorMsg)
            }
        })
    },
    //调试
    async [TEST_API]({commit},param){
        const {status, statusText, data} = await axios.post('/api/test',param)
        return new Promise((resolve,reject)=>{
            if(data.returnStatus == '1'){
                resolve(data)
            }else{
                reject(data)
            }
        })
    },
    
}
const mutations = {
    getDataSource(state,arr){
        state.dataSourceList=arr
    },
    SetCurrentCataId(state,id){
        state.currentCataId = id
    },
    setCurrentAPI(state,obj){
        state.currentApi = obj
    }

}

export default {
    state,
    actions,
    mutations
}