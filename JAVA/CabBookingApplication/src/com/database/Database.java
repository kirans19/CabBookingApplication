//$Id$
package com.database;

import java.sql.Connection;
import java.sql.DriverManager;

public class Database {
	
	
	private static Connection connection = null;
	
	public static Connection getConnection() {
		
		String url = "jdbc:postgresql://localhost:5432/cab_booking_system";
		
		try {
			if(connection == null) {
				Class.forName("org.postgresql.Driver");
				connection = DriverManager.getConnection(url);
			}
		}
		catch (Exception e) {
			e.printStackTrace();	
		}
		return connection;
	}
	
	public static void closeConnection() {
		try {
			if(connection != null) {
				connection.close();
				connection=null;
			}
		}
		catch (Exception e) {
			System.out.println("Error");
			e.printStackTrace();
		}
	}
	
}
