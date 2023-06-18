//$Id$
package com.resource.dao;

import java.util.List;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.TripDetail;

public class BookingDAO extends DataAccessor {
	
	// view bookings of the user
	public String select(String... fields)throws Exception {
	
		StringBuilder viewBookings = new QueryGenerator().getSelect("trip_bookings","trip_bookings.trip_id",
				"trip_details.driver_id","trip_details.booked_time" ,"driver.phn_num" , "driver.name")
				.addJoin(0, "trip_details", null, "trip_bookings.trip_id", "trip_details.trip_id")
				.addJoin(0, "users", "driver", "trip_details.driver_id", "driver.user_id")
				.addWhere("trip_bookings.user_id", fields[0])
				.addAnd("trip_bookings.status", "1").end().query;
		
		String resultList =  new QueryExecutor().executeQuery(viewBookings.toString(),true);

		return resultList;	
	}
	
	// make booking for the user
	public String insert(String requestBody, String... fields)throws Exception {
		
		Gson gson =  new Gson();
		Boolean isPickup;
		String bookedTime;
		List<Object> result = null;
		try {
   	  	TripDetail detail = gson.fromJson(requestBody, TripDetail.class);
   	  	isPickup = detail.getIsPickup();
   	  	bookedTime = detail.getBookedTime();

		int userId = Integer.parseInt(fields[0]);
		
		String resultList = null;
		
		StringBuilder bookTrip = null;
		
		// query for finding user route
		StringBuilder userRoute = new QueryGenerator().getSelect("users", "stop_sequence.route_id")
				.addJoin(0,"stop_sequence",null,"users.location_id","stop_sequence.current_location")
				.addWhere("users.user_id",Integer.toString(userId)).query;
		
		// check for any trip exists
		StringBuilder existingTripDriver = new QueryGenerator().getSelect("trip_details","trip_details.trip_id",
				"trip_details.driver_id","COUNT(trip_bookings.trip_id)")
				.addJoin(1,"trip_bookings",null,"trip_details.trip_id","trip_bookings.trip_id")
				.addJoin(0,"("+userRoute+")","trip_route","trip_details.route_id","trip_route.route_id")
				.addWhere("trip_details.booked_time",bookedTime)
				.addAnd("trip_details.is_pickup",isPickup.toString()).addGroup("trip_details.trip_id")
				.addHaving("COUNT(trip_bookings.trip_id) < 3")
				.addOrder("RANDOM()").end().query;
		
		resultList = new QueryExecutor().executeQuery(existingTripDriver.toString(),true);
	
		if(resultList.length()==2)
		{	
			// check for driver completed trip in user route
			StringBuilder completedTripDriver = new QueryGenerator().getSelect("trip_details","trip_details.driver_id")
					.addJoin(0,"drivers",null,"trip_details.driver_id","drivers.driver_id")
					.addWhere("drivers.shift",getShift(bookedTime.split(" ")[1]))
					.addAnd("DATE(trip_details.booked_time)", bookedTime.split(" ")[0])
					.addAnd("trip_details.is_pickup", isPickup.toString())
					.addAnd("trip_details.route_id", "("+userRoute+")").addGroup("trip_details.driver_id")
					.addOrder("RANDOM()").end().query;
			
			
			resultList = new QueryExecutor().executeQuery(completedTripDriver.toString(),true);
	
			if(resultList.length()==2) {
				
				// check for driver not started any trip
				StringBuilder firstTripDriver = new QueryGenerator().getSelect("stop_sequence","drivers.driver_id")
						.addJoin(0,"users",null,"users.location_id","stop_sequence.current_location")
						.addJoin(0, "drivers", null , "drivers.driver_id", "users.user_id")
						.addWhere("stop_sequence.route_id","("+userRoute+")")
						.addAnd("drivers.shift",getShift(bookedTime.split(" ")[1]))
						.addOrder("RANDOM()").end().query;

				resultList = new QueryExecutor().executeQuery(firstTripDriver.toString(),true);
			}
		
			
			if(resultList.length() == 2 ) {
				throw new CustomException(HttpStatus.CONFLICT);
			}
			
			JsonArray resultAsJsonArray = new JsonParser().parse(resultList).getAsJsonArray();
			
			JsonObject resultObj = resultAsJsonArray.get(0).getAsJsonObject();
			int driverId = resultObj.get("driverId").getAsInt();
			
			// create trip for queried driver
			StringBuilder createTrip = new QueryGenerator().getInsert("trip_details","driver_id","is_pickup","booked_time","route_id",
					Integer.toString(driverId),isPickup.toString(),bookedTime,"("+userRoute+")")
					.addReturn("trip_id","driver_id","is_pickup","booked_time","route_id").end().query;
			
			result = new QueryExecutor().executeQuery(createTrip.toString());
			
			new Audit().addAudit("1",Integer.toString(userId),"trip_details", gson.toJson(result));

			// get trip id from trip details created
			StringBuilder getTripId = new QueryGenerator().getSelect("trip_details", "trip_id")
					.addWhere("driver_id",Integer.toString(driverId))
					.addAnd("booked_time", bookedTime).query;
			
			// add booking with the trip id
			bookTrip = new QueryGenerator().getInsert("trip_bookings","trip_id","user_id","status",
					"("+getTripId+")",Integer.toString(userId),"1").addReturn("trip_id","user_id","status").end().query;
	
			result = new QueryExecutor().executeQuery(bookTrip.toString());
			
			new Audit().addAudit("1",Integer.toString(userId),"trip_bookings", gson.toJson(result));
		}
		else {
			JsonArray resultAsJsonArray = new JsonParser().parse(resultList).getAsJsonArray();
			JsonObject resultObj = resultAsJsonArray.get(0).getAsJsonObject();

			int tripId = resultObj.get("tripId").getAsInt();
			
			// add booking with the trip id
			bookTrip = new QueryGenerator().getInsert("trip_bookings","trip_id","user_id","status",
					Integer.toString(tripId),Integer.toString(userId),"1").addReturn("trip_id","user_id","status").end().query;
			
			result = new QueryExecutor().executeQuery(bookTrip.toString());
			
			new Audit().addAudit("1",Integer.toString(userId),"trip_bookings", gson.toJson(result));
			
		}	
		if(result.isEmpty() || result == null ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		}
		catch(JsonSyntaxException | NumberFormatException | NullPointerException e) {
			 throw new CustomException(HttpStatus.BAD_REQUEST);
		}

		return select(fields);
	}
	
	public String delete(String... fields)throws CustomException {
		
		Gson gson = new Gson();
		StringBuilder getTripDetails = new QueryGenerator().getSelect("trip_bookings","trip_id","user_id","status")
				.addWhere("trip_id",fields[1]).addAnd("user_id",fields[0]).end().query;
		List<Object> oldData = new QueryExecutor().executeQuery(getTripDetails.toString());
		
		StringBuilder updateTripStatus = new QueryGenerator().getUpdate("trip_bookings","status","0")
   	  			.addWhere("trip_id",fields[1]).addAnd("user_id",fields[0]).addAnd("status !", "0").end().query;
		
   	  	int result  = new QueryExecutor().executeUpdate(updateTripStatus.toString());
		if(result == 0 ) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		List<Object> newData = new QueryExecutor().executeQuery(getTripDetails.toString());
		new Audit().addAudit("2",fields[0], "trip_bookings",fields[1],gson.toJson(oldData),gson.toJson(newData));
		return Integer.toString(result);
	}

	
	// method to get shift from the time passed
	public static String getShift(String bookedTime) {
	    String[] getHours = bookedTime.split(":");
	    int hour = Integer.parseInt(getHours[0]);

	    String value ;
	    if (hour >= 6 && hour < 12) {
	        value = "0";
	    } else if (hour >= 12 && hour < 18) {
	        value = "1";
	    } else if (hour >= 18 && hour < 0) {
	        value = "2";
	    } else {
	        value = "3";
	    }
	    return value;
	}

}
