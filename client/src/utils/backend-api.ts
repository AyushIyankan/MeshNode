import axios from "axios";

// local host
export const base_url = "http://localhost:5000/api/v1";
export const imageurl = "http://localhost:5000/";

//deployed
// export const base_url = "https://kind-bat-handbag.cyclic.app/api/v1";
// export const imageurl = "https://kind-bat-handbag.cyclic.app/";

export const get = async (url: string) => {
    try {
        const response = await axios.get(`${base_url}${url}`);
        return response;
    } catch (err) {
        return err;
    }
};

export const post = async (url: string, body: Object, config: Object) => {
    try {
        const response = await axios.post(`${base_url}${url}`, body, config);
        return response;
    } catch (err) {
        return err;
    }
};
