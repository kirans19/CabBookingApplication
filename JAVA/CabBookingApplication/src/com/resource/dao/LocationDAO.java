//$Id$
package com.resource.dao;

import com.model.Location;
import com.model.TripBooking;
import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.httpstatus.HttpStatus;

import java.util.List;

public class LocationDAO extends DataAccessor {

	public String select(String... fields) throws Exception {
		Gson gson = new Gson();
		
		StringBuilder getLocations = null;
		
		if(fields[0]==null) {
			getLocations = new QueryGenerator().getSelect("location", "location_id", "location_name", "is_branch","is_active").end().query;
		}
		else {
			getLocations = new QueryGenerator().getSelect("location" ,"location.location_name")
					.addJoin(0, "stop_sequence" , null, "location.location_id", "stop_sequence.current_location")
					.addWhere("stop_sequence.route_id", fields[0]).addAnd("location.is_active", "true").end().query;
		}

		List<Object> resultList = new QueryExecutor().executeQuery(getLocations.toString());
		return gson.toJson(resultList);
		
		
	}

	public String insert(String requestBody, String... fields) throws Exception {
		
		Gson gson = new Gson();
		List<Object> result = null;
		try {
		
			Location location = gson.fromJson(requestBody, Location.class);
			String[] columns = new String[] { "location_name", "is_branch", "is_active", location.getLocationName(), location.getIsBranch().toString(), "true" };
			StringBuilder addLocations = new QueryGenerator().getInsert("location", columns).addReturn("location_id", "location_name", "is_branch").end().query;
			result = new QueryExecutor().executeQuery(addLocations.toString());
			new Audit().addAudit("1", fields[0], "location", gson.toJson(result));
		
		} catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
			throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		if (result.isEmpty() || result == null) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		Location location = (Location) result.get(0);
		return gson.toJson(location.getLocationId());
	}

	public String update(String requestBody, String... fields) throws Exception {

		Gson gson = new Gson();
		StringBuilder getLocationDetails = new QueryGenerator().getSelect("location", "location_id", "location_name", "is_branch")
				.addWhere("location_id", fields[1]).end().query;
		List<Object> oldData = new QueryExecutor().executeQuery(getLocationDetails.toString());

		StringBuilder updateLocation = new QueryGenerator().getUpdate("location", "is_active", "true")
				.addWhere("location_id", fields[1]).addAnd("is_active !", "true").end().query;
		int result = new QueryExecutor().executeUpdate(updateLocation.toString());
		if (result == 0) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		List<Object> newData = new QueryExecutor().executeQuery(getLocationDetails.toString());
		new Audit().addAudit("2", fields[0], "location", fields[1], gson.toJson(oldData), gson.toJson(newData));

		return Integer.toString(result);
	}

	public String delete(String... fields) throws Exception {

		Gson gson = new Gson();
		StringBuilder getLocationDetails = new QueryGenerator().getSelect("location", "location_id", "location_name", "is_branch")
				.addWhere("location_id", fields[1]).end().query;
		List<Object> oldData = new QueryExecutor().executeQuery(getLocationDetails.toString());

		StringBuilder usersCountOnLocation = new QueryGenerator().getSelect("users", "COUNT(*)").addWhere("location_id", fields[1]).query;

		StringBuilder deleteLocation = new QueryGenerator().getUpdate("location", "is_active", "false").addWhere("location_id", fields[1])
				.addAnd("is_active !", "false").addAnd("(" + usersCountOnLocation + ")", "0").end().query;
		int result = new QueryExecutor().executeUpdate(deleteLocation.toString());
		if (result == 0) {
			throw new CustomException(HttpStatus.CONFLICT);
		}
		List<Object> newData = new QueryExecutor().executeQuery(getLocationDetails.toString());
		new Audit().addAudit("2", fields[0], "location", fields[1], gson.toJson(oldData), gson.toJson(newData));

		return Integer.toString(result);
	}
}
