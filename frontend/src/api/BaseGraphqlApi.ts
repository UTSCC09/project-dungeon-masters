export class BaseGraphqlApi {

    protected static graphQLCall = async (query: string, variables: {}, endPoint: RequestInfo = "http://localhost:4000/graphql/") => {
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
