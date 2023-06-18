//$Id$
package com.exception;

import com.httpstatus.HttpStatus;

public class CustomException extends Exception {
	
	private static final long serialVersionUID = 8288465631804118197L;
	
    private HttpStatus httpStatus;

    public CustomException(HttpStatus httpStatus) {
        super(httpStatus.getMessage());
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

}


