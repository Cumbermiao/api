import axios from 'axios'

const instance = axios.create({
    baseURL:'/main-data/zsj'
})

instance.defaults.headers = {
    "Content-Type":"application/json"
}
instance.defaults.withCredentials = true
export default instance