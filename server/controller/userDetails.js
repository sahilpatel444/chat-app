const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")


async function userDetails(request,response){
    try {
        const token = request.cookies.token || ""
        if (!token) {
            return response.status(401).json({
                message: "Unauthorized: No token provided",
                error: true,
            });
        }
        
       
        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message :"user datails",
            data : user
        })
    } catch (error) {
        return response.status(500).json({
            message :error.message || error,
            error : true
        })
        
    }
}

module.exports = userDetails