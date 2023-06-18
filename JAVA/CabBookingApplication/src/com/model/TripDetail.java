//$Id$
package com.model;

public class TripDetail {

	    private int tripId;
	    private int driverId;
	    private Boolean isPickup;
	    private String bookedTime;
	    private int routeId;

	    public int getTripId() {
	        return tripId;
	    }

	    public void setTripId(int tripId) {
	        this.tripId = tripId;
	    }

	    public int getDriverId() {
	        return driverId;
	    }

	    public void setDriverId(int driverId) {
	        this.driverId = driverId;
	    }

	    public Boolean getIsPickup() {
	        return isPickup;
	    }

	    public void setIsPickup(Boolean isPickup) {
	        this.isPickup = isPickup;
	    }

	    public String getBookedTime() {
	        return bookedTime;
	    }

	    public void setBookedTime(String bookedTime) {
	        this.bookedTime = bookedTime;
	    }

	    public int getRouteId() {
	        return routeId;
	    }

	    public void setRouteId(int routeId) {
	        this.routeId = routeId;
	    }
}
