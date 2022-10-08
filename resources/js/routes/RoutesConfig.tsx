import toastr from "toastr";
import axios from "axios";
import React, { useLayoutEffect } from "react";
import RoutesPages from "./RoutesPages";
import { BrowserRouter } from "react-router-dom";

export default () => {
    useLayoutEffect(() => {
        toastr.options.preventDuplicates = true;
        toastr.options.timeOut = 10000;
        toastr.options.extendedTimeOut = 6000;
        toastr.options.progressBar = true;
        const interceptor = axios.interceptors.response.use(
            (response) => {
                const message = response.data.message
                    ? response.data.message
                    : null;
                const messageStatus = response.data.messageStatus
                    ? response.data.messageStatus
                    : "info";
                const title = response.data.title ? response.data.title : "";
                if (message) {
                    toastr[messageStatus](message, title);
                }

                return response;
            },
            (error) => {
                const statusCode =
                    typeof error["response"] === "undefined"
                        ? ""
                        : error.response.status;
                switch (statusCode) {
                    case 400:
                        toastr.error(
                            error.response.data.error_description
                                ? error.response.data.error_description
                                : error.response.data.error,
                            "Bad request"
                        );
                        break;
                    case 401:
                        toastr.warning(
                            "Please login again",
                            "Session time out!"
                        );
                        break;
                    case 403:
                        toastr.error(
                            `You don't have permissions for this site`,
                            `Forbidden`
                        );
                        break;
                    case 404:
                        toastr.error(
                            `Your request is not found in the website`,
                            `Not found`
                        );
                        break;
                    case 405:
                        toastr.error(error.response.data, `Method not allowed`);
                        break;
                    case 422:
                        const error_422 = `
                        <div>Error tipo: ${error.response.data.message}</div>
                        <ul>
                        ${Object
                                .keys(error.response.data.errors)
                                .map(
                                    (name) => {
                                        console.log(error.response.data.errors)
                                        return error.response.data.errors[name].map((e: string) => `<li>${e}</li>`).join('')
                                    }
                                )
                                .join('')}
                        </ul>`


                        toastr.warning(error_422, `Unprocessable Entity`);
                        break;

                    default:
                        if (axios.isCancel(error)) {
                            console.log("Request canceled", error.message);
                        } else {
                            toastr.error(error, "Other error found");
                        }
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    return (
        <BrowserRouter>
            <RoutesPages />
        </BrowserRouter>
    );
}