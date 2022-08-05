import axios from 'axios';

const apiUrl = "/api/kipco/attribute/";

const AttributeService = {
    
    async getOne(id) {
        const endpoint = apiUrl + id + "/"
        return axios.get(endpoint)
    },

    async list(){
        const endpoint = apiUrl
        return axios.get(endpoint)
    },

    async delete(id){
        const endpoint = apiUrl + id + "/"
        return axios.delete(endpoint)
    },

    async create(data) {
        const endpoint = apiUrl
        return axios.post(endpoint, data)
    }, 

    async edit(data) {
        const endpoint = apiUrl + data.id + "/"
        return axios.put(endpoint, data)
    },

    async getBadges(id) {
        const endpoint = apiUrl + id + "/badges"
        return axios.get(endpoint)
    },
}

export default AttributeService;