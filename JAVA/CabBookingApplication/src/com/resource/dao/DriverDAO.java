//$Id$
package com.resource.dao;

import java.util.List;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.Driver;

public class DriverDAO extends DataAccessor {
	
	
	public String select(String... fields)throws CustomException {
		
		StringBuilder getDrivers = new QueryGenerator().getSelect("users", "drivers.driver_id" , "users.email" , "users.name" , "users.location_id" ,"location.location_name", "drivers.shift" , "drivers.is_active")
				.addJoin(0, "drivers", null, "users.user_id", "drivers.driver_id")
				.addJoin(1, "location", null, "users.location_id", "location.location_id").end().query;
		
		

		
		String resultList = new QueryExecutor().executeQuery(getDrivers.toString(), true);
		
		return resultList;
		
	}


	// method for updating driver fields
	public String update(String requestBody, String... fields) throws CustomException {

		int updateResult = 0;
		try {
			Gson gson = new Gson();
			Driver driver = gson.fromJson(requestBody, Driver.class);
			String driverId = fields[1];

			StringBuilder updateQuery = null;
			
			if(checkToUpdate(driverId).equals("[]")) {
				throw new CustomException(HttpStatus.BAD_REQUEST);
			}

//			StringBuilder getDriverDetails = new QueryGenerator().getSelect("drivers", "is_active").addWhere("driver_id", driverId).end().query;
//
//			// old data list for audit
//			List<Object> oldData = new QueryExecutor().executeQuery(getDriverDetails.toString());

			
			if(requestBody.contains("shift") && requestBody.contains("locationId")) {
				
				updateQuery = new QueryGenerator().getUpdate("drivers", "shift", Integer.toString(driver.getShift())).addWhere("driver_id", driverId).end().query;
				updateResult = new QueryExecutor().executeUpdate(updateQuery.toString());
				
				updateQuery = new QueryGenerator().getUpdate("users", "location_id", Integer.toString(driver.getLocationId())).addWhere("user_id", driverId).end().query;
				updateResult = new QueryExecutor().executeUpdate(updateQuery.toString());
				
			}
			// check for shift field
			else if (requestBody.contains("shift")) {
				// executing query to update shift
				updateQuery = new QueryGenerator().getUpdate("drivers", "shift", Integer.toString(driver.getShift())).addWhere("driver_id", driverId).end().query;
				updateResult = new QueryExecutor().executeUpdate(updateQuery.toString());
			}
			// check for location field
			else if (requestBody.contains("locationId")) {
				// executing query to update location
				updateQuery = new QueryGenerator().getUpdate("users", "location_id", Integer.toString(driver.getLocationId())).addWhere("user_id", driverId).end().query;
				updateResult = new QueryExecutor().executeUpdate(updateQuery.toString());
			}
			
	
			if (updateResult == 0) {
				throw new CustomException(HttpStatus.CONFLICT);
			}

//			// new data list for audit
//			List<Object> newData = new QueryExecutor().executeQuery(getDriverDetails.toString());
//			// instance to call addAudit method
//			new Audit().addAudit("2", fields[0], "drivers", fields[1], gson.toJson(oldData), gson.toJson(newData));

		} catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
			throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		return Integer.toString(updateResult);
	}
	

	public String checkToUpdate(String driverId) throws CustomException {
		
		StringBuilder isDriverBooked = new QueryGenerator().getSelect("trip_bookings", "trip_details.trip_id")
				.addJoin(0, "trip_details", null,"trip_bookings.trip_id", " trip_details.trip_id")
				.addWhere("trip_details.driver_id", driverId ).addAnd("(trip_bookings.status !","0").addAnd("trip_bookings.status !","4")
				.addAnd("trip_bookings.status !","3)").addGroup("trip_details.trip_id").end().query;
		
		System.out.println(isDriverBooked);
		
		String resultList = new QueryExecutor().executeQuery(isDriverBooked.toString(), true);
		System.out.println(resultList);
		
		return resultList;
		
		
		
	}

	
	
}

