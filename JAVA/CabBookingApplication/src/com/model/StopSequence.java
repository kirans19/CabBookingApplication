//$Id$
package com.model;

public class StopSequence{
	
	int routeId;
	int currentLocation;
	int nextLocation;
	public int getRouteId() {
		return routeId;
	}
	public void setRouteId(int routeId) {
		this.routeId = routeId;
	}
	public int getCurrentLocation() {
		return currentLocation;
	}
	public void setCurrentLocation(int currentLocation) {
		this.currentLocation = currentLocation;
	}
	public int getNextLocation() {
		return nextLocation;
	}
	public void setNextLocation(int nextLocation) {
		this.nextLocation = nextLocation;
	}

}
