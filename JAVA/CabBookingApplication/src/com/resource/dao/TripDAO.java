//$Id$
package com.resource.dao;

import java.util.List;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.TripBooking;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class TripDAO extends DataAccessor {
	
	public String select(String... fields)throws CustomException{
		
		StringBuilder getTrip = null;
		
		
		if(fields[1]!=null) {
			 
			StringBuilder else_block_query1 = new QueryGenerator().addElseBlock("trip_details.is_pickup",
					"location.location_name" ,"branch.location_name").addAliases("pickup_location").query;
					
			StringBuilder else_block_query2 = new QueryGenerator().addElseBlock("trip_details.is_pickup",
					"branch.location_name" ,"location.location_name").addAliases("drop_location").query;	

			String[] columns = new String[] {"trip_bookings.user_id","users.name","trip_details.booked_time",
					else_block_query1.toString(),else_block_query2.toString(),"trip_bookings.status"};
			
			getTrip = new QueryGenerator().getSelect("trip_bookings",columns)
			.addJoin(0, "users" ,null ,"users.user_id", "trip_bookings.user_id")
			.addJoin(0,"trip_details" , null , "trip_bookings.trip_id","trip_details.trip_id")
			.addJoin(0, "location", null, "users.location_id", "location.location_id")
			.addJoin(0, "user_branch" ,null ,"users.user_id", "user_branch.user_id")
			.addJoin(0, "location" ,"branch" ,"branch.location_id", "user_branch.branch_id")
			.addJoin(0, "users" , "driver" ,"driver.user_id", "trip_details.driver_id")
		    .addWhere("trip_details.trip_id",fields[1])
		    .addAnd("(trip_bookings.status","1")
		    .addOr("trip_bookings.status","2)")
		    .end().query;
		}
//		if(fields.length == 2)
		else {
			getTrip = new QueryGenerator().getSelect("trip_details","trip_details.trip_id","trip_details.is_pickup","trip_details.booked_time")
					.addJoin(0, "trip_bookings", null , "trip_details.trip_id", "trip_bookings.trip_id")
					.addWhere("(trip_bookings.status !", "4").addAnd("trip_bookings.status !", "3").addAnd("trip_bookings.status !", "0)")
					.addAnd("trip_details.driver_id", fields[0])
					.addAnd("DATE(trip_details.booked_time)",getCurrDate()).addGroup("trip_details.trip_id")
					.addOrder("trip_details.booked_time").end().query;		
		}

	
		String resultList = new QueryExecutor().executeQuery(getTrip.toString(), true);
		if(resultList == "[]" ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}

		return resultList;
	}
	
public String update(String requestBody, String... fields)throws CustomException {
		
		int result = 0;
		try {
		Gson gson = new Gson();
		
		StringBuilder getTripDetails = new QueryGenerator().getSelect("trip_bookings","trip_id","user_id","status")
				.addWhere("trip_id",fields[1]).addAnd("user_id",fields[0]).end().query;
		List<Object> oldData = new QueryExecutor().executeQuery(getTripDetails.toString());
		
				
   	  	TripBooking trip  = gson.fromJson(requestBody, TripBooking.class);
   	  	
   	  	StringBuilder updateTripStatus = new QueryGenerator().getUpdate("trip_bookings","status",Integer.toString(trip.getStatus()))
   	  			.addWhere("trip_id",fields[1]).addAnd("user_id",fields[0]).addAnd("status !",Integer.toString(trip.getStatus())).end().query;
   	  	
   	  	
   	  	result = new QueryExecutor().executeUpdate(updateTripStatus.toString());
   	  	
		if(result == 0 ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		List<Object> newData = new QueryExecutor().executeQuery(getTripDetails.toString());
		new Audit().addAudit("2",fields[0], "trip_bookings",fields[1],gson.toJson(oldData),gson.toJson(newData));
		}
		catch(JsonSyntaxException | NumberFormatException | NullPointerException e) {
			 throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		return Integer.toString(result);
	}

	
	public String getCurrDate() {
		 LocalDate currentDate = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String formattedDate = currentDate.format(formatter);
	        return formattedDate;
	}

}
