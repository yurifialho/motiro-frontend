import axios from 'axios';

const apiUrl = "/api/kipco/processgoal/";

const ProcessGoalService = {
    
    async list(){
        let endpoint = apiUrl
        return axios.get(endpoint)
    },

    async delete(id){
        let endpoint = apiUrl + id + "/"
        return axios.delete(endpoint)
    },
}

export default ProcessGoalService;