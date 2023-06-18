//$Id$
package com.resource.dao;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public enum UserRole {
	
	USER("Booking" , "History"),
    DRIVER("Trip" , "History"),
    ADMIN("History" , "Location" , "Driver" , "Route" , "Approval");

    private final Set<String> allowedResources;

    UserRole(String... allowedResources) {
        this.allowedResources = new HashSet<>(Arrays.asList(allowedResources));
    }

    public boolean canAccessResource(String resource) {
    
        return allowedResources.contains(resource);
    }

}
