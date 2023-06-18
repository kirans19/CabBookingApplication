//$Id$
package com.model;

import java.sql.Timestamp;

public class User {
	
	 private int userId;
	    private String email;
	    private String password;
	    private String name;
	    private String phnNum;
	    private int locationId;
	    private int userType;
	    public int getUserType() {
			return userType;
		}
		public void setUserType(int userType) {
			this.userType = userType;
		}
		private Timestamp creationTime;
	    private Timestamp modifiedTime;
	    
		public int getUserId() {
			return userId;
		}
		public void setUserId(int userId) {
			this.userId = userId;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getPhnNum() {
			return phnNum;
		}
		public void setPhnNum(String phnNum) {
			this.phnNum = phnNum;
		}
		public int getLocationId() {
			return locationId;
		}
		public void setLocationId(int locationId) {
			this.locationId = locationId;
		}
		public Timestamp getCreationTime() {
			return creationTime;
		}
		public void setCreationTime(Timestamp creationTime) {
			this.creationTime = creationTime;
		}
		public Timestamp getModifiedTime() {
			return modifiedTime;
		}
		public void setModifiedTime(Timestamp modifiedTime) {
			this.modifiedTime = modifiedTime;
		}
		
}
