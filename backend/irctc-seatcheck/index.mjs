import {main_class} from "../irctc-seatcheck/lib/workings.mjs"
class IRCTCSeat extends main_class{
    constructor(){
        super();
    }
    async seat(params){
        if (!params){
            throw new Error("You have not set any parameters for booking. Please set the parameters.");
        }
        if (!(params.hasOwnProperty("log") && typeof params["log"] === 'boolean')){
            console.log("You have not set any valid log parameter. Setting log to false.\nIf you need to set up logging, please set log parameter to true.");
            params.log = false;
        }
        return await super.book(params);
    }
    
};
export {IRCTCSeat};