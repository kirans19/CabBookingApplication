//$Id$
package com.resource.dao;

import java.util.List;
import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.User;

public class SignUpDAO extends DataAccessor {

	public String insert(String requestBody, String... fields) throws CustomException {

		Gson gson = new Gson();
		StringBuilder signUpQuery;
		StringBuilder insertBranch;

		List<Object> result = null;
		try {
		
	        JsonObject jsonObject = gson.fromJson(requestBody, JsonObject.class);

	        JsonObject userDetails = jsonObject.getAsJsonObject("userDetails");
	        String email = userDetails.get("email").getAsString();
	        String password = userDetails.get("password").getAsString();
	        String name = userDetails.get("name").getAsString();
	        String phnNum = userDetails.get("phnNum").getAsString();
	        String userType = userDetails.get("userType").getAsString();
	        
	        JsonObject isUser = jsonObject.getAsJsonObject("locationDetails");
	        String branchId ;
			String locationId;
			
			String[] columns;

			if (userType.equals("1") ){
				locationId =  isUser.get("locationId").getAsString();
				columns = new String[] { "email", "password", "name", "phn_num", "user_type", "location_id", email, password, name, phnNum,userType,locationId };
			} else  {
				columns = new String[] { "email", "password", "name", "phn_num", "user_type", email, password, name, phnNum, userType };
			}
			signUpQuery = new QueryGenerator().getInsert("users", columns).addReturn("user_id", "email", "name", "phn_num", "user_type").end().query;
			result = new QueryExecutor().executeQuery(signUpQuery.toString());

			if (result.isEmpty() || result == null) {
				throw new CustomException(HttpStatus.CONFLICT);
			}

			int id = (int) ((User) result.get(0)).getUserId();
			if (userType.equals("1") ) {
				branchId =  isUser.get("branchId").getAsString();
				insertBranch = new QueryGenerator().getInsert("user_branch", "user_id","branch_id",Integer.toString(id),branchId).end().query;
				int addUserBranch = new QueryExecutor().executeUpdate(insertBranch.toString());
			}
//			new Audit().addAudit("1", Integer.toString(id), "users", gson.toJson(result));

		} catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
			throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		return gson.toJson(result);
	}



}
