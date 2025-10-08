import { useState } from "react";
import { api_handler } from "./hooks/api-handler";

export default () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getData = async () => {
        setLoading(true);
        try{
              
            const res = await api_handler("get", "/api/product/", {});
            return res.results;

        }catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    const getDataById = async (params) => {
        setLoading(true);
        try {
            const res = await api_handler("get", "/api/product/", {
                params: params,
            });

            return res.results;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST Request
    const postData = async (body) => {
        setLoading(true);
        try {
            const res = await api_handler("post", "/api/product/", {
                body: body,
            });

            return res.results;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // PUT Request
    const putData = async (body, params) => {
        setLoading(true);
        try {
            const res = await api_handler("put", "/api/product/", {
                body: body,
                params: params,
            });

            return res.results;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };




    return {
        getData,
        getDataById,
        postData,
        putData,
        loading,
        error,
    };
};
