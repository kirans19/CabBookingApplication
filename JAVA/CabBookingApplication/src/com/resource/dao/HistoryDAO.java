//$Id$
package com.resource.dao;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;
import com.model.User;

public class HistoryDAO extends DataAccessor {

	public String select(String... fields) throws CustomException {

		StringBuilder getType = new QueryGenerator().getSelect("users", "user_type").addWhere("user_id", fields[0]).end().query;
		User user = (User) new QueryExecutor().executeQuery(getType.toString()).get(0);

		int type = user.getUserType();

		String columns[] = null;

		StringBuilder elseBlockQuery1 = new QueryGenerator().addElseBlock("trip_details.is_pickup", "location.location_name", "branch.location_name").addAliases("pickup_location").query;

		StringBuilder elseBlockQuery2 = new QueryGenerator().addElseBlock("trip_details.is_pickup", "branch.location_name", "location.location_name").addAliases("drop_location").query;

		if (type == 1) {
			columns = new String[] { "trip_bookings.trip_id", "trip_details.driver_id", "driver.name AS driverName",  "TO_CHAR(trip_details.booked_time, 'YYYY-MM-DD HH24:MI:SS') AS booked_time", "TO_CHAR(trip_bookings.modified_time, 'YYYY-MM-DD HH24:MI:SS') AS modified_time" , elseBlockQuery1.toString(), elseBlockQuery2.toString(), "trip_bookings.status " };
		} else if (type == 2) {
			columns = new String[] { "trip_bookings.trip_id", "trip_bookings.user_id", "users.name  AS userName",  "TO_CHAR(trip_details.booked_time, 'YYYY-MM-DD HH24:MI:SS') AS booked_time", "TO_CHAR(trip_bookings.modified_time, 'YYYY-MM-DD HH24:MI:SS') AS modified_time", elseBlockQuery1.toString(), elseBlockQuery2.toString(), "trip_bookings.status " };
		} else if (type == 3) {
			columns = new String[] { "trip_bookings.trip_id", "trip_details.driver_id", "driver.name AS driverName", "trip_bookings.user_id", "users.name AS userName",  "TO_CHAR(trip_details.booked_time, 'YYYY-MM-DD HH24:MI:SS') AS booked_time", "TO_CHAR(trip_bookings.modified_time, 'YYYY-MM-DD HH24:MI:SS') AS modified_time",elseBlockQuery1.toString(), elseBlockQuery2.toString(), "trip_bookings.status " };
		}

		QueryGenerator getHistoryAsObject = new QueryGenerator().getSelect("trip_bookings", columns).addJoin(0, "users", null, "users.user_id", " trip_bookings.user_id").addJoin(0, "trip_details", null, "trip_bookings.trip_id", "trip_details.trip_id").addJoin(0, "location", null, "users.location_id", "location.location_id").addJoin(0, "user_branch", null, "users.user_id", "user_branch.user_id").addJoin(0, "location", "branch", "branch.location_id", "user_branch.branch_id").addJoin(0, "users", "driver", "driver.user_id", "trip_details.driver_id");

		StringBuilder getHistory = null;

		if (type == 1) {
			getHistory = getHistoryAsObject.addWhere("users.user_id", fields[0]).end().query;
		} else if (type == 2) {
			getHistory = getHistoryAsObject.addWhere("trip_details.driver_id", fields[0]).end().query;
		} else if (type == 3) {
			getHistory = getHistoryAsObject.end().query;
		}

		String resultList = new QueryExecutor().executeQuery(getHistory.toString(), true);

		return resultList;
	}

}
