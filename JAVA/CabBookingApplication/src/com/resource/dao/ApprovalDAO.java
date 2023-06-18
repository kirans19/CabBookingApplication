//$Id$
package com.resource.dao;

import java.util.List;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.httpstatus.HttpStatus;

public class ApprovalDAO extends DataAccessor {


	public String select(String... fields) {
		return null;
	}

	public String insert(String requestBody , String... fields) {
		return null;
	}
	
	// approve driver
	public String update(String requestBody , String... fields)throws CustomException {
		Gson gson = new Gson();
		
		
		StringBuilder approveDriverQuery = new QueryGenerator().getUpdate("drivers","is_active","true")
				.addWhere("driver_id",fields[1])
				.addAnd("is_active","false")
				.end().query;

		// executing query to approve driver
		int updateDriverstatus = new QueryExecutor().executeUpdate(approveDriverQuery.toString());
		if(updateDriverstatus == 0 ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		// new data list for audit
//		new Audit().addAudit("2",fields[0],"drivers",fields[1],gson.toJson(oldData),gson.toJson(newData));
		
		return Integer.toString(updateDriverstatus);
	}
	
	// terminate driver 
	public String delete(String... fields)throws Exception {
		Gson gson = new Gson();
		
		if(!new DriverDAO().checkToUpdate(fields[1]).equals("[]")) {
			throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		
		StringBuilder terminateDriverQuery = new QueryGenerator().getUpdate("drivers","is_active","false")
				.addWhere("driver_id",fields[1])
				.addAnd("is_active","true").end().query;

		// executing query to terminate driver
		int updateDriverstatus = new QueryExecutor().executeUpdate(terminateDriverQuery.toString());
		if(updateDriverstatus == 0 ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}

//		new Audit().addAudit("2",fields[0],"drivers",fields[1],"{'isActive' : 'true'}", "{'isActive' : 'false'}");
		
		return Integer.toString(updateDriverstatus);
	}
}
