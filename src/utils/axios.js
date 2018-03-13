import axios from 'axios'

const instance = axios.create({
    // baseURL:'/data-open-web/do'
    baseURL:'/do'
})

instance.defaults.headers = {
    "Content-Type":"application/json"
}
instance.defaults.withCredentials = true
export default instance