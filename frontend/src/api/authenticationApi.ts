import {BaseRESTApi} from "./BaseRESTApi";

export class AuthenticationApi extends BaseRESTApi {
    static signUp = async (username: string, password: string) => {
        return await this.sendRESTCall("POST", {
            username: username,
            password: password
        }, '/signup')
    }

    static signIn = async (username: string, password: string) => {
        return await this.sendRESTCall("POST", {
            username: username,
            password: password
        }, '/signin')
    }

    static signOut = async () => {
        return await this.sendRESTCall("GET", {
        }, '/signout')
    }
}
