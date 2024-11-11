import {getCookie} from "cookies-next"

export function cookiesGetClient(){
    const token = getCookie("session");

    return token;
}