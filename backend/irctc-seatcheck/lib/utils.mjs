import readline from 'readline';
import {start_before_3_minutes} from "./time_work.mjs";
import { stations_list } from './stations.mjs';
async function verify_booking_params(params) {
    let stationsList = stations_list;
    if (!params.quota || !params.class || !params.train_number || !params.journey_date || !params.from || !params.to || !params.userID || !params.password ) {
        throw new Error("Missing parameters\nThe required parameters are quota, class, train_number, journey_date, from, to, userID, password, passengers, UPI, mobile_number");
    }
    if (typeof params.quota !== "string" || params.quota.length !== 2 || !["GN","TQ","PT"].includes(params.quota)){
        throw new Error("Invalid quota parameter");
    }
    if (typeof params.class !== "string" || params.class.length !== 2 || !["1A","2A","3A","3E","EC","CC","FC","SL","2S"].includes(params.class)){
        throw new Error("Invalid class parameter");
    }
    if (typeof params.train_number !== "string" || params.train_number.length !== 5){
        throw new Error("Invalid train_number parameter");
    }
    if (typeof params.journey_date !== "string" || params.journey_date.length !== 8){
        throw new Error("Invalid journey_date parameter");
    }
    if (typeof params.from !== "string" || params.from.length < 2 || params.from.length > 4 || !stationsList.includes(params.from)){
        throw new Error("Invalid from parameter");
    }
    if (typeof params.to !== "string" || params.to.length < 2 || params.to.length > 4 || !stationsList.includes(params.to)){
        throw new Error("Invalid to parameter");
    }
    if (typeof params.userID !== "string" || params.userID.length === 0){
        throw new Error("Invalid userID parameter");
    }
    if (typeof params.password !== "string" || params.password.length === 0){
        throw new Error("Invalid password parameter");
    }
}

async function initialize_booking_variables(params){
    params.class_type = params.params.class;
    params.train_number = params.params.train_number;
    params.journey_date = params.params.journey_date;
    params.from_stn = params.params.from;
    params.to_stn = params.params.to;
    params.username = params.params.userID;
    params.password = btoa(params.params.password);
    params.quota_type = params.params.quota;
}
function input(prompt) {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
function base64DecodeUnicode(e) {
    for (var o = atob(e).split(""), a = 0; a < o.length; a++)
        o[a] = "%" + ("00" + o[a].charCodeAt(0).toString(16)).slice(-2);
    return decodeURIComponent(o.join(""))
}

export {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode}