import axios from "axios"
import { getUserDetails } from "./ApiRoutes.js"
import { toast } from "react-toastify";

export const verifyPilotAuth = async ({ ...props }) => {
    try {
        // props.setPageLoader(true);
        const res = await axios.get(getUserDetails,{
            headers:{
                'Authorization':`Bearer ${props.token}`
            }
        })
        props.setCurrentUser(res.data);
        // props.setPageLoader(false);

        return res.data;
    }
    catch (err) {
        console.log(err)
        // props.setPageLoader(false);
        return 'error';

    }
}