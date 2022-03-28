export class BaseGraphqlApi {

    protected static graphQLCall = async (query: string, variables: {}, endPoint: RequestInfo = process.env.REACT_APP_BACKENDURL + "/graphql/") => {
        return fetch(endPoint, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
                query: query,
                variables: variables
            }),
        })
    }

    protected static generateResponseFields = (rawResponseFields: string[]) => {
        return rawResponseFields.toString().replace(',', ' ');
    }
}