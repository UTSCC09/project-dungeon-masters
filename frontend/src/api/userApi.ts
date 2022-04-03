import {BaseGraphqlApi} from "./BaseGraphqlApi";

export class UserApi extends BaseGraphqlApi {

    static signUp = async (username: string, password: string, responseFields = ['']) => {
        let query = `mutation signUp($username: String, $password: String) {
                        signUp(username: $username, password: $password) {
                            ${this.generateResponseFields(responseFields)}
                        }
                    }`;

        let variables = {
            username: username,
            password: password
        }

        return this.graphQLCall(query, variables);
    }

    static signIn = async (username: string, password: string, responseFields = ['']) => {
        let query = `mutation signIn($username: String, $password: String) {
                        signIn(username: $username, password: $password) {
                            ${this.generateResponseFields(responseFields)}
                        }
                    }`

        let variables = {
            username: username,
            password: password
        }

        return this.graphQLCall(query, variables);
    }

    static signOut = async (responseFields = ['username']) => {
        let query = `mutation SignOut {
                        signOut {
                            ${this.generateResponseFields(responseFields)}
                        }
                    }`

        let variables = {}

        return this.graphQLCall(query, variables);
    }

    static modifyUser = async (description: string, twitter: string, instagram: string, responseFields = ['']) => {
        let query = `mutation ModifyUser($userData: UserInputObject) {
                      modifyUser(userData: $userData) {
                        ${this.generateResponseFields(responseFields)}
                      }
                    }`

        let variables = {
            userData: {
                description: description,
                socialMedia: {
                    twitter: twitter,
                    instagram: instagram,
                },
            }
        }

        return this.graphQLCall(query, variables);
    }

    static queryUsers = async (responseFields = ['']) => {
        let query = `query QueryUsers {
                      users {
                        ${this.generateResponseFields(responseFields)}
                      }
                    }
                `

        let variables = {}

        return this.graphQLCall(query, variables);
    }

    static deleteUsers = async (responseFields = ['']) => {
        let query = `mutation DeleteUsers {
                      deleteUser {
                        ${this.generateResponseFields(responseFields)}
                      }
                    }
                `

        let variables = {}

        return this.graphQLCall(query, variables);
    }
}

export const UserFields = {
    _id: '_id',
    username: 'username',
    profilePicture: 'profilePicture',
    description: 'description',
    socialMedia: 'socialMedia {twitter instagram}',
    date: 'date'
};
