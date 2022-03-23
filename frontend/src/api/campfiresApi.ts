import {BaseGraphqlApi} from "./BaseGraphqlApi";

export class CampfireApi extends BaseGraphqlApi {
    static queryCampfires = async (owned: boolean, follower: boolean, responseFields = ['']) => {
        let query = `query QueryCampfires($owned: Boolean, $follower: Boolean) {
                        campfires(owned: $owned, follower: $follower) {
                          ${CampfireApi.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            owned: owned,
            $follower: follower
        }

        return this.graphQLCall(query, variables);
    }

    static addCampfire = async (campfireData: any, followers: string[], responseFields = ['']) => {
        let query = `mutation AddCampfire($campfireData: CampfireInputObject, $followers: [String]){
                        addCampfire(campfireData: $campfireData, followers: $followers) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            campfireData: campfireData,
            followers: followers
        }

        return this.graphQLCall(query, variables);
    }

    static ModifyCampfireDetails = async (campfireId: string, title: string, description: string, status: string, responseFields = ['']) => {
        let query = `mutation ModifyCampfireDetails($campfireId: String, $campfireData: CampfireInputObject){
                        modifyCampfireDetails(campfireId: $campfireId, campfireData: $campfireData) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            campfireId: campfireId,
            campfireData: {
                title: title,
                description: description,
                status: status
            }
        }

        return this.graphQLCall(query, variables);
    }

    static addFollowers = async (campfireId: string, usernames: string[], responseFields = ['']) => {
        let query = `mutation AddFollowers($campfireId: String, $usernames: [String]){
                        addFollowers(campfireId: $campfireId, usernames: $usernames) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            campfireId: campfireId,
            usernames: usernames
        }

        return this.graphQLCall(query, variables);
    }

    static deleteFollowers = async (campfireId: string, usernames: string[], responseFields = ['']) => {
        let query = `mutation DeleteFollowers($campfireId: String, $usernames: [String]){
                        deleteFollowers(campfireId: $campfireId, usernames: $usernames) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            campfireId: campfireId,
            usernames: usernames
        }

        return this.graphQLCall(query, variables);
    }

    static deleteCampfire = async (campfireId: string, responseFields = ['']) => {
        let query = `mutation DeleteCampfire($campfireId: String){
                        deleteCampfire(campfireId: $campfireId) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`

        let variables = {
            campfireId: campfireId,
        }

        return this.graphQLCall(query, variables);
    }
}

export const CampfireFields = {
    id: '_id',
    ownerUsername: 'ownerUsername',
    title: 'title',
    description: 'description',
    status: 'status',
    private: 'private',
    passcode: 'passcode',
    thumbnail: 'thumbnail',
    soundtrack: 'soundtrack',
    scenes: 'scenes',
    followers: 'followers',
};
