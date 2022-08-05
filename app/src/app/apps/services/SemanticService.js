import axios from 'axios';

const apiUrl = "/api/semantic/";

const SemanticService = {
    
    async sync(id) {
        const endpoint = apiUrl + "sync/"
        return axios.get(endpoint)
    },
}

export default SemanticService;