import axios from "axios";
import { BASE_URL } from "@env"
import { ApiRoute } from '../network_utils'

import EncryptedStorage from 'react-native-encrypted-storage';

const instance = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = global.token;
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
            // config.headers["Authorization"] = token; // for Node.js Express back-end
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== `${ApiRoute.USER_LOGIN}` && err.response) {
            // Access Token was expired
            // console.log('err : ',err.response.status)
            // console.log('err fl: ',originalConfig)

            if (err.response.status === 401 && !originalConfig._retry) {


                // console.log(err.response?.data)

                originalConfig._retry = true;

                // console.log(`${ApiRoute.BASE_URL}${ApiRoute.REFRESH_TOKEN}`)

                try {
                    const rs = await instance.put(`${ApiRoute.BASE_URL}${ApiRoute.REFRESH_TOKEN}`, 
                    // {
                    //     "usR_ID": global.userData?.userId_Encrypted,
                    //     "accessToken": global.token,
                    //     "refreshToken": global.refreshToken,
                    // }
                    {
                        "accessToken": global.token,
                        "refreshToken": global.refreshToken,
                        "usR_ID": global.userData?.userId_Encrypted
                      }
                    );
                    // console.log('referesh token response : ', rs)

                    const { accessToken, refreshToken } = rs.data.data;
                    // TokenService.updateLocalAccessToken(accessToken);
                    // console.log('accessToken :', accessToken)
                    // console.log('refreshToken :', refreshToken)
                    global.token = accessToken
                    global.refreshToken = refreshToken
                    storeUserToken(accessToken, refreshToken)
                    return instance(originalConfig);
                } catch (_error) {
                    console.log('_error : ',_error)
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

const storeUserToken = async (token, refreshToken) => {
    try {
        const jsonValueToken = JSON.stringify(token)
        const jsonValueRefToken = JSON.stringify(refreshToken)

        await EncryptedStorage.setItem('user_token', jsonValueToken)
        await EncryptedStorage.setItem('user_refresh_token', jsonValueRefToken)

    } catch (e) {
        console.log('Error : ', e)
    }
}

export default instance;