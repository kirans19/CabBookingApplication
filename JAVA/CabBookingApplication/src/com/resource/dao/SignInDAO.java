//$Id$
package com.resource.dao;


import java.util.List;
import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.User;
import com.google.gson.JsonObject;



public class SignInDAO extends DataAccessor {
    public String insert(String requestBody, String... fields) throws CustomException {
        Gson gson = new Gson();
        StringBuilder signInQuery;
        try {
            User user = gson.fromJson(requestBody, User.class);

            signInQuery = new QueryGenerator().getSelect("users", "user_id", "user_type")
                    .addWhere("email", user.getEmail()).addAnd("password", user.getPassword()).end().query;
        } catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
            throw new CustomException(HttpStatus.BAD_REQUEST);
        }
        
        List<Object> resultList = new QueryExecutor().executeQuery(signInQuery.toString());
        
        if (resultList == null || resultList.isEmpty()) {
            throw new CustomException(HttpStatus.BAD_REQUEST);
        }
        
        
        User user = (User) resultList.get(0); 
        String userId = String.valueOf(user.getUserId()); 
        String userType = String.valueOf(user.getUserType());
        

        // Generate a JWT token
        String token = JwtUtil.generateToken(userId, userType);


        // Construct the response JSON with the token, user ID, and user type
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("userId", userId);
        responseJson.addProperty("userType", userType);
        responseJson.addProperty("token", token);

        return gson.toJson(responseJson);
    }
}


