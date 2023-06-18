//$Id$
package com.resource.dao;

import java.util.ArrayList;
import java.util.List;
import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.httpstatus.HttpStatus;
import com.model.Location;
import com.model.Route;
import com.model.StopSequence;

public class RouteDAO extends DataAccessor {

	public String select(String... fields) throws Exception {
		Gson gson = new Gson();
		StringBuilder getRoutes = new QueryGenerator().getSelect("route", "route_id", "route_name").end().query;
		List<Object> resultList = new QueryExecutor().executeQuery(getRoutes.toString());
		return gson.toJson(resultList);
	}

//	public String insert(String requestBody, String... fields) throws Exception {
//
//		List<Object> result = null;
//		try {
//			Gson gson = new GsonBuilder().create();
//			JsonArray requestBodyAsJsonArray = gson.fromJson(requestBody, JsonArray.class);
//			JsonObject routeObj = requestBodyAsJsonArray.get(0).getAsJsonObject();
//			
//			Route route = gson.fromJson(routeObj, Route.class);
//			String routeName = route.getRouteName();
//			StringBuilder addRoute = new QueryGenerator().getInsert("route", "route_name", routeName).addReturn("route_id", "route_name").end().query;
//
//			result = new QueryExecutor().executeQuery(addRoute.toString());
//			new Audit().addAudit("1", fields[0], "route", gson.toJson(result));
//
//			int routeId = (int) ((Route) result.get(0)).getRouteId();
//
//			List<StopSequence> stopSequences = new ArrayList<>();
//			for (int i = 1; i < requestBodyAsJsonArray.size(); i++) {
//				JsonObject requestBodyAsJsonObject = requestBodyAsJsonArray.get(i).getAsJsonObject();
//				StopSequence stop = gson.fromJson(requestBodyAsJsonObject, StopSequence.class);
//				stopSequences.add(stop);
//			}
//			for (StopSequence stop : stopSequences) {
//				StringBuilder addStops = new QueryGenerator().getInsert("stop_sequence", "route_id", "current_location", "next_location", Integer.toString(routeId), Integer.toString(stop.getCurrentLocation()), Integer.toString(stop.getNextLocation())).addReturn("route_id", "current_location", "next_location").end().query;
//
//				result = new QueryExecutor().executeQuery(addStops.toString());
//				new Audit().addAudit("1", fields[0], "stop_sequence", gson.toJson(result));
//			}
//		} catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
//			throw new CustomException(HttpStatus.BAD_REQUEST);
//		}
//		if (result.isEmpty() || result == null) {
//			throw new CustomException(HttpStatus.NO_CONTENT);
//		}
//		return "Success";
//	}
	
	public String insert(String requestBody, String... fields) throws Exception {
		
	    Gson gson = new Gson();
	    List<Object> result = null;
	    int routeId =0;
	    try {
	     
	        JsonObject requestBodyAsJsonObject = gson.fromJson(requestBody, JsonObject.class);

	        // Extract routeName
	        String routeName = requestBodyAsJsonObject.get("routeName").getAsString();
	        StringBuilder addRoute = new QueryGenerator().getInsert("route", "route_name", routeName).addReturn("route_id", "route_name").end().query;

	        result = new QueryExecutor().executeQuery(addRoute.toString());
	        new Audit().addAudit("1", fields[0], "route", gson.toJson(result));

	        routeId = (int) ((Route) result.get(0)).getRouteId();

	        // Extract locations
	        JsonArray locationArray = requestBodyAsJsonObject.getAsJsonArray("location");
	        List<StopSequence> stopSequences = new ArrayList<>();

	        // Iterate over each location
	        for (JsonElement locationElement : locationArray) {
	            JsonObject locationObject = locationElement.getAsJsonObject();
	            String currentLocation = locationObject.get("currentLocation").getAsString();
	            String nextLocation = locationObject.get("nextLocation").getAsString();

	            // Create StopSequence object and add it to the list
	            StopSequence stop = new StopSequence();
	            stop.setCurrentLocation(Integer.parseInt(currentLocation));
	            stop.setNextLocation(Integer.parseInt(nextLocation));
	            stopSequences.add(stop);
	        }

	        // Insert stop sequences
	        for (StopSequence stop : stopSequences) {
	            StringBuilder addStops = new QueryGenerator().getInsert("stop_sequence", "route_id", "current_location", "next_location", Integer.toString(routeId), Integer.toString(stop.getCurrentLocation()), Integer.toString(stop.getNextLocation())).addReturn("route_id", "current_location", "next_location").end().query;

	            result = new QueryExecutor().executeQuery(addStops.toString());
	            new Audit().addAudit("1", fields[0], "stop_sequence", gson.toJson(result));
	        }
	    } catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
	        throw new CustomException(HttpStatus.BAD_REQUEST);
	    }
	    if (result.isEmpty() || result == null) {
	        throw new CustomException(HttpStatus.CONFLICT);
	    }
	  
		return Integer.toString(routeId);
	}


	public String update(String requestBody, String... fields) throws Exception {
		int result = 0;
		try {
			Gson gson = new Gson();
			String routeId = fields[1];

			StringBuilder getRouteDetails = new QueryGenerator().getSelect("stop_sequence", "route_id", "current_location", "next_location").addWhere("route_id", routeId).end().query;

			List<Object> oldData = new QueryExecutor().executeQuery(getRouteDetails.toString());

			StopSequence stop = gson.fromJson(requestBody, StopSequence.class);

			int prevCurrentLocation = stop.getCurrentLocation();
			int newCurrentLocation = stop.getNextLocation();

			StringBuilder getNextLocation = new QueryGenerator().getSelect("stop_sequence", "next_location").addWhere("route_id", routeId).addAnd("current_location", Integer.toString(prevCurrentLocation)).query;

			String[] columns = new String[] { "route_id", "current_location", "next_location", routeId, Integer.toString(newCurrentLocation), "(" + getNextLocation + ")" };

			StringBuilder addRouteStop = new QueryGenerator().getInsert("stop_sequence", columns).end().query;
			StringBuilder updateRouteStop = new QueryGenerator().getUpdate("stop_sequence", "next_location", Integer.toString(newCurrentLocation)).addWhere("route_id", routeId).addAnd("current_location", Integer.toString(prevCurrentLocation)).end().query;

			result = new QueryExecutor().executeUpdate(addRouteStop.toString());
			result = new QueryExecutor().executeUpdate(updateRouteStop.toString());

			List<Object> newData = new QueryExecutor().executeQuery(getRouteDetails.toString());
			new Audit().addAudit("2", fields[0], "stop_sequence", fields[1], gson.toJson(oldData), gson.toJson(newData));
		} catch (JsonSyntaxException | NumberFormatException | NullPointerException e) {
			throw new CustomException(HttpStatus.BAD_REQUEST);
		}
		if (result == 0) {
			throw new CustomException(HttpStatus.NO_CONTENT);
		}

		return Integer.toString(result);
	}

}
