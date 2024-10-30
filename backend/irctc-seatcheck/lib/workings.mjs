import axios from 'axios';
import {wrapper} from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { writeFileSync,readdirSync } from 'node:fs';
import {dirname,join} from "node:path";
import * as cheerio from 'cheerio';
import querystring from 'querystring';
import { execFileSync } from 'node:child_process';
import { URL,fileURLToPath } from 'node:url';
import {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode} from './utils.mjs';
import { psg_input_wait, sleep_for_login, sleep_for_availability_check} from "./time_work.mjs";
import {headers as main_headers} from './browser_headers.mjs';
import {LOG} from './logging.mjs';
import { processImageAndRecognizeText } from './captchabreaker.mjs';
import {https} from 'https';
class IRCTCSeat{
    constructor(){
        wrapper(axios);
        const cookie_jar = new CookieJar();
        const httpsAgent = new https.Agent({ 
            rejectUnauthorized: false // Caution: Use only in development
        });
        this.axios_instance = axios.create({ 
            jar:cookie_jar,
            withCredentials: true,
            httpsAgent
        });
    }
    log_data(data,level="DEBUG"){
        if (this.logging){
            this.log_file.log_function(data,level);
        }
    }
    async load_irctc(){
        let response = await this.axios_instance.get(
            'https://www.irctc.co.in/nget/',
            {
                headers: main_headers.headers_1,
            }
        );
        this.first_csrf = "" + (new Date).getTime();
        const headers = main_headers.headers_2;
        headers.greq = this.first_csrf;
        response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/profile/textToNumber/'+(new Date).getTime(),
            {
                headers: headers,
            }
        );
        this.log_data("IRCTC Loaded Successfully");
        return "IRCTC Loaded Successfully";
    }
    async sign_in(){
        this.log_data("clicking Log in button");
        await this.clicking_sign_button();
        this.log_data("Checking IRCTC Login Response data for any errors in captcha or user credentials");
        await this.getting_token();
        return "Sign In Successfull";
    }
    async clicking_sign_button(){
        let headers = main_headers.headers_3;
        headers.greq = this.first_csrf;
        this.log_data("getting login captcha image");
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha?nlpCaptchaException=true',
            {
                headers: headers,
            }
        );
        this.log_data("Received Captcha Image from IRCTC");
        const captcha_response=response.data;
        this.captchaQuestion=captcha_response.captchaQuestion;
        this.captcha_status=captcha_response.status;
        await this.answer_captcha();
        return "Sign Button Clicked Successfully";
    }
    async answer_captcha(){
        let imagePath = 'captcha.jpg';
        this.log_data("Proceeding for Captcha Answering");
        writeFileSync("./"+imagePath, this.captchaQuestion, 'base64');
        // const stdout = execFileSync(this.binaryPath, [imagePath,"-t"]);
        // console.log(stdout+" \nPlease type the above text and press enter");
        this.captcha_answer = await processImageAndRecognizeText();
        this.log_data("Received Captcha Answer Input");
        await this.send_login();
        return "Captcha Answered Successfully";
    }
    async send_login(){
        this.log_data("sending login data with captcha answer");
        const data = `grant_type=password&username=${this.username}&password=${this.password}&captcha=${this.captcha_answer}&uid=${this.captcha_status}&otpLogin=false&nlpIdentifier=&nlpAnswer=&nlpToken=&lso=&encodedPwd=true`;
        const headers = main_headers.headers_4;
        headers["Content-Length"] = data.length.toString();
        await sleep_for_login(this.params.ticket_time);
        const response = await this.axios_instance.post(
            'https://www.irctc.co.in/authprovider/webtoken',
            data,
            {
                headers: headers,
            }
        );
        this.log_data("Received Login data response from IRCTC");
        this.act = response.data;
        return "Login Data Sent Successfully";
    }
    async getting_token(){
        while ("error" in this.act) {
            if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Invalid Captcha....") {
                await this.clicking_sign_button();
            } else if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Bad credentials") {
                throw new Error("Invalid user and password combination");
            } else {
                throw new Error("Some Unknown error occurred in getting token process");
            }
        };
        if ("access_token" in this.act) {
            this.log_data("Received Access Token from IRCTC");
            this.access_token = "Bearer " + this.act["access_token"];
        } else {
            throw new Error("Some Unknown error occurred in getting token process");
        };
        this.log_data("Validating Access Token with IRCTC that we received previously");
        await this.validate_user();
        return "Token Generated Successfully";
    }
    async validate_user(){
        const headers = main_headers.headers_5;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.first_csrf;
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3',
            {
                headers: headers,
            }
        );
        this.log_data("Received User Token Verification Data from IRCTC");
        this.user_data = response.data;
        this.user_hash = response.data["userIdHash"];
        this.csrf_token = response.headers["csrf-token"];
        return "User Validated Successfully";
    }
    async get_trains(){
        const postdata = {"concessionBooking":false,"srcStn":this.from_stn,"destStn":this.to_stn,"jrnyClass":this.class_type,"jrnyDate":this.journey_date,"quotaCode":this.quota_type,"currentBooking":"false","flexiFlag":false,"handicapFlag":false,"ticketType":"E","loyaltyRedemptionBooking":false,"ftBooking":false};
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_6;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        this.log_data("Checking Running Trains List for the given From and To stations and Journey Date by sending parameters to IRCTC");
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC",
            postdata_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else{
            this.log_data("Received Running Trains List from IRCTC Successfully");
            return "Train List Fetched Successfully";
        };
    }
    async get_class_availability(){
        const postdata = {
            "paymentFlag": "N",
            "concessionBooking": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "ticketType": "E",
            "quotaCode": this.quota_type,
            "moreThanOneDay": true,
            "trainNumber": this.train_number,
            "fromStnCode": this.from_stn,
            "toStnCode": this.to_stn,
            "isLogedinReq": true,
            "journeyDate": this.journey_date,
            "classCode": this.class_type
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_7;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        await sleep_for_availability_check(this.params.ticket_time);
        this.log_data("Fetching seats Availability for the given Train Number, From and To stations, Journey Date and Class Type by sending parameters to IRCTC");
        let response = null;
        const maxRetries = 5;
        let retries = 0;
        const cust_url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${this.train_number}/${this.journey_date}/${this.from_stn}/${this.to_stn}/${this.class_type}/${this.quota_type}/N`;
        while (retries < maxRetries) {
            try{
                response = await this.axios_instance.post(
                    cust_url,
                    postdata_string,
                    {
                        headers: headers,
                    }
                )
                break;
            }
            catch(error){
                if (error.response && error.response.status === 502){
                    console.log("Received Bad Gateway Response, Retrying again");
                    retries++;
                }
                else{
                    throw error;
                }
            }
        }
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else {
            this.log_data("Received Seats Availability from IRCTC Successfully");
            return data;
        }
    }
    async get_boarding_stations(){
        const postdata = {
            "clusterFlag": "N",
            "onwardFlag": "N",
            "cod": "false",
            "reservationMode": "WS_TA_B2C",
            "autoUpgradationSelected": false,
            "gnToCkOpted": false,
            "paymentType": 1,
            "twoPhaseAuthRequired": false,
            "captureAddress": 0,
            "alternateAvlInputDTO": [
                {
                    "trainNo": this.train_number,
                    "destStn": this.to_stn,
                    "srcStn": this.from_stn,
                    "jrnyDate": this.journey_date,
                    "quotaCode": this.quota_type,
                    "jrnyClass": this.class_type,
                    "concessionPassengers": false
                }
            ],
            "passBooking": false,
            "journalistBooking": false
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_8;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        this.log_data("Fetching Boarding Stations List for the given Train Number, From and To stations, Journey Date and Class Type by sending parameters to IRCTC");
        let response = null;
        const maxRetries = 5;
        let retries = 0;
        while (retries < maxRetries) {
            try{
                response = await this.axios_instance.post(
                    "https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq",
                    postdata_string,
                    {
                        headers: headers,
                    }
                )
                break;
            }
            catch(error){
                if (error.response && error.response.status === 502){
                    console.log("Received Bad Gateway Response, Retrying again");
                    retries++;
                }
                else{
                    throw error;
                }
            }
        }
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        } else {
            this.log_data("Received Boarding Stations List from IRCTC Successfully");
            if (data["bkgCfgs"][0]["foodChoiceEnabled"] === true){
                if (this.foodList.includes('')){
                    throw new Error("Food choice is enabled, please provide food choice for all passengers");
                }
                else{
                    let list_B = data["bkgCfgs"][0]["foodDetails"];
                    for (const item of this.foodList) {
                        if (!list_B.includes(item)) {
                            throw new Error("Food choice is enabled, please provide food choice for all passengers");
                        };
                    };
                };
            };
            return "Boarding Stations Fetched Successfully";
        };
    }
    async book(params){
        this.log_file = new LOG(params.log);
        if (params.viu && typeof params.viu === "string"){
            this.binaryPath = params.viu;
        }
        else{
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const path_l = join(__dirname, "..","bin");
            const files = readdirSync(path_l);
            let path_n = "";
            if (files.length === 0) {
                throw new Error("Platform not supported, Request you to manually download the viu binary file from rust standard installation page and then after installing\nOption 1: Place the binary file inside this bin folder located in. "+path_l+"\nOption 2: Give viu binary path location in the params as 'viu':'path/to/viu | path/to/viu.exe'")
            }
            else{
                path_n = files[0];
            }
            this.binaryPath = join(path_l, path_n);
        }
        this.logging = params.log;
        this.params = params;
        await verify_booking_params(this.params);
        initialize_booking_variables(this);
        await this.load_irctc();
        await this.sign_in();
        await this.get_trains();
        const response = await this.get_class_availability();
        return response;
    }
   
};
export {IRCTCSeat as main_class};