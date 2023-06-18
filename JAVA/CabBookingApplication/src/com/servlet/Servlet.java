package com.servlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.exception.CustomException;
import com.httpstatus.HttpStatus;
import com.resource.dao.DataAccessor;
import com.resource.dao.JwtUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import javax.servlet.ServletException;

public class Servlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
			try {
				handleRequest(request, response);
			} catch (Exception e) {
				e.printStackTrace();
			}
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			handleRequest(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			handleRequest(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			handleRequest(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected void handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		

		String path = request.getRequestURI();
		String method = request.getMethod();
				
		if(!path.equals("/CabBookingApplication/v1/sign-in") && !path.equals("/CabBookingApplication/v1/sign-up") && (!path.equals("/CabBookingApplication/v1/locations") && !method.equals("GET"))) {
	
	    String token = request.getHeader("Authorization");
	    if (!new JwtUtil().isValidToken(token , getClassName(path))) {
	        response.setStatus(HttpStatus.UNAUTHORIZED.getStatusCode());
	        response.getWriter().write("Invalid token");
	        response.getWriter().flush();
	        return;
	    }
		}

		String responseJSON = null;

		try {
			Class<?> className = Class.forName("com.resource.dao." + getClassName(path) + "DAO");
			DataAccessor obj = (DataAccessor) className.newInstance();

			switch (method) {
			case "GET":
				responseJSON = obj.select(getResourceId(path));
				break;
			case "POST":
				responseJSON = obj.insert(getRequestBody(request), getResourceId(path));
				break;
			case "PUT":
				responseJSON = obj.update(getRequestBody(request), getResourceId(path));
				break;
			case "DELETE":
				responseJSON = obj.delete(getResourceId(path));
				break;
			}
			response.setStatus(HttpStatus.OK.getStatusCode());
		} catch (CustomException e) {
			response.setStatus(e.getHttpStatus().getStatusCode());
			responseJSON = e.getHttpStatus().getMessage();
		}
		response.setContentType("application/json");
		PrintWriter writer = response.getWriter();
		writer.write(responseJSON);
		writer.flush();
	}

	public String getRequestBody(HttpServletRequest request) throws IOException {

		InputStream inputStream = request.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
		StringBuilder requestBody = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null) {
			requestBody.append(line);
		}
		return requestBody.toString();
	}

	public String getClassName(String uri) {

		String uriPart = uri.substring(uri.lastIndexOf('/') + 1);
		if (uriPart.matches(".*\\d.*")) {
			uriPart = uri.substring(0, uri.lastIndexOf('/'));
			uriPart = uriPart.substring(uriPart.lastIndexOf('/') + 1);
		}
		String[] parts = uriPart.split("-");
		StringBuilder sb = new StringBuilder();
		for (String part : parts) {
			sb.append(part.substring(0, 1).toUpperCase());
			sb.append(part.substring(1).toLowerCase());
		}
		if (sb.charAt(sb.length() - 1) == 's') {
			sb.deleteCharAt(sb.length() - 1);
		}
		String className = sb.toString();
		return className;
	}

	public String[] getResourceId(String uri) {

		String[] parts = uri.split("/");
		String[] newparts = new String[parts.length / 2];
		for (int i = 4, j = 0; i < parts.length; i += 2, j++) {
			newparts[j] = parts[i];
		}
		return newparts;
	}

}
