//$Id$
package com.model;

public class Location {
	
	private int locationId;
	private String locationName;
	private Boolean isBranch;
	private Boolean isActive;
	
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public int getLocationId() {
		return locationId;
	}
	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public Boolean getIsBranch() {
		return isBranch;
	}
	public void setIsBranch(Boolean isBranch) {
		this.isBranch = isBranch;
	}

}
