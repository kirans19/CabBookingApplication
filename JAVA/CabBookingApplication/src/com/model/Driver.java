//$Id$
package com.model;

public class Driver extends User {
	
	private int driverId;
	private int shift;
	
	public int getDriverId() {
		return driverId;
	}
	public void setDriverId(int driverId) {
		this.driverId = driverId;
	}
	public int getShift() {
		return shift;
	}
	public void setShift(int shift) {
		this.shift = shift;
	}
    public int getLocationId() {
        return super.getLocationId();
    }
}
