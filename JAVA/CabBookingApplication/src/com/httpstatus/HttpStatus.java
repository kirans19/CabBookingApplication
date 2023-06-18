//$Id$
package com.httpstatus;

public enum HttpStatus {
	
    OK(200, "Success"),
    NO_CONTENT(204 , "No Content"),
    BAD_REQUEST(400, "Bad Request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Not Found"),
    CONFLICT(409," Already Exists"),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error");

	
    private final int statusCode;
    private final String message;

	HttpStatus(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public String getMessage() {
		return message;
	}
}
