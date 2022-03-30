import { BaseGraphqlApi } from "./BaseGraphqlApi";

export class CampfireApi extends BaseGraphqlApi {
    static queryCampfires = async (
        owned: boolean,
        follower: boolean,
        responseFields = [""]
    ) => {
        let query = `query QueryCampfires($owned: Boolean, $follower: Boolean) {
                        campfires(owned: $owned, follower: $follower) {
                          ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            owned: owned,
            follower: follower,
        };

        return this.graphQLCall(query, variables);
    };

    static addCampfire = async (
        campfireData: any,
        responseFields = [""]
    ) => {
        let query = `mutation AddCampfire($campfireData: CampfireInputObject){
                        addCampfire(campfireData: $campfireData) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            campfireData: campfireData,
        };

        return this.graphQLCall(query, variables);
    };

    static ModifyCampfireDetails = async (
        campfireId: string,
        title: string,
        description: string,
        status: string,
        responseFields = [""]
    ) => {
        let query = `mutation ModifyCampfireDetails($campfireId: String, $campfireData: CampfireInputObject){
                        modifyCampfireDetails(campfireId: $campfireId, campfireData: $campfireData) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            campfireId: campfireId,
            campfireData: {
                title: title,
                description: description,
                status: status,
            },
        };

        return this.graphQLCall(query, variables);
    };

    static addFollowers = async (
        campfireId: string,
        usernames: string[],
        responseFields = [""]
    ) => {
        let query = `mutation AddFollowers($campfireId: String, $usernames: [String]){
                        addFollowers(campfireId: $campfireId, usernames: $usernames) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            campfireId: campfireId,
            usernames: usernames,
        };

        return this.graphQLCall(query, variables);
    };

    static deleteFollowers = async (
        campfireId: string,
        usernames: string[],
        responseFields = [""]
    ) => {
        let query = `mutation DeleteFollowers($campfireId: String, $usernames: [String]){
                        deleteFollowers(campfireId: $campfireId, usernames: $usernames) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            campfireId: campfireId,
            usernames: usernames,
        };

        return this.graphQLCall(query, variables);
    };

    static deleteCampfire = async (
        campfireId: string,
        responseFields = [""]
    ) => {
        let query = `mutation DeleteCampfire($campfireId: String){
                        deleteCampfire(campfireId: $campfireId) {
                           ${this.generateResponseFields(responseFields)}
                        }
                      }`;

        let variables = {
            campfireId: campfireId,
        };

        return this.graphQLCall(query, variables);
    };

    /**
     *
     * @param campfireId The id of the campfire.
     * @returns owner, follower, none
     */
    static getCampfireRole = async (campfireId: string) => {
        let query = `query GetCampfireRole($campfireId: String) {
                        getCampfireRole(campfireId: $campfireId) 
                      }`;
        let variables = {
            campfireId,
        };

        return this.graphQLCall(query, variables);
    };

    /**
     *
     * @param campfireId The id of the campfire.
     * @param responseFields
     * @returns The status of the campfire (preparing, telling, talking, ending).
     *          A list of background images.
     *          A list of listener ids.
     * Sample response:
     * {
     *   data: {
     *     campfires: [
     *       {
     *         followers: ["userid1", "userid2"],
     *         scenes: [
     *           "http://.../pic1.jpg",
     *           "http://.../pic2.jpg",
     *         ],
     *         status: "talking"
     *       }
     *     ]
     *   }
     * }
     */
    static getCampfireStatusAndAssets = async (
        campfireId: string,
        responseFields = [
            CampfireFields.status,
            CampfireFields.scenes,
            CampfireFields.followers,
        ]
    ) => {
        let query = `query QueryCampfires($campfireId: String) {
                        campfires(campfireId: $campfireId) {
                          ${CampfireApi.generateResponseFields(responseFields)}
                        }
                      }`;
        let variables = {
            campfireId,
        };

        return this.graphQLCall(query, variables);
    };
}

export const CampfireFields = {
    id: "_id",
    ownerUsername: "ownerUsername",
    title: "title",
    description: "description",
    status: "status",
    private: "private",
    passcode: "passcode",
    thumbnail: "thumbnail",
    soundtrack: "soundtrack",
    scenes: "scenes",
    followers: "followers {socketId username}",
};
