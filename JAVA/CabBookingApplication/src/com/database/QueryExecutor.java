//$Id$
package com.database;

import java.lang.reflect.InvocationTargetException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.beanutils.PropertyUtils;
import com.exception.CustomException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.httpstatus.HttpStatus;

public class QueryExecutor {
	
	// method to execute select statements
	public List<Object> executeQuery(String query) 
	throws CustomException {
		
		Connection connection = null;
		ResultSet resultSet = null;
        PreparedStatement statement = null;
        List<Object> listOfObj = new ArrayList<>();
        try {
        	
            connection = Database.getConnection();
 
            Pattern pattern = Pattern.compile("(?i)(?:FROM|INTO)\\s+(\\w+)");
            Matcher matcher = pattern.matcher(query);
            String tableName = null;
            if (matcher.find()) {
                tableName = matcher.group(1);
            }
            statement = connection.prepareStatement(query);
          
            resultSet = statement.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            Class<?> className = Class.forName("com.model."+parseClassName(tableName));

            while (resultSet.next()) {
            	Object obj = className.newInstance();
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                	String columnName = metaData.getColumnName(i);
                    int columnType = metaData.getColumnType(i);
                    if (columnType == Types.INTEGER || columnType == Types.SMALLINT) {
                        int value = resultSet.getInt(columnName);
                        PropertyUtils.setProperty(obj, parseColumnName(columnName), value);
                    } else if (columnType == Types.VARCHAR || columnType == Types.CHAR) {
                        String value = resultSet.getString(columnName);
                        PropertyUtils.setProperty(obj, parseColumnName(columnName), value);
                    } else if (columnType == Types.TIMESTAMP) {
                        Timestamp value = resultSet.getTimestamp(columnName);
                        PropertyUtils.setProperty(obj, parseColumnName(columnName), value.toString());
                    }
                    else if (columnType == Types.BIT) {
                        Boolean value = resultSet.getBoolean(columnName);
                        PropertyUtils.setProperty(obj, parseColumnName(columnName), value);
                    }
                }
                listOfObj.add(obj);
            }
            }
        catch(ClassNotFoundException | InstantiationException |IllegalAccessException | InvocationTargetException | NoSuchMethodException | SQLException e) {
        	throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            if (resultSet != null) {
            	try {
					resultSet.close();
				} catch (SQLException e) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
				}
            }
            if (statement != null) {
            	try {
					statement.close();
				} catch (SQLException e) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
				}
            }
            if (connection != null) {
            	Database.closeConnection();
            }
            }
        return listOfObj;
	}
	
	// method to execute select statements with joins in order to avoid instance creation complexity
	public String executeQuery(String query ,Boolean isJoin) 
	throws CustomException {
		
		Connection connection = null;
		ResultSet resultSet = null;
        PreparedStatement statement = null;
        JsonArray jsonArray = new JsonArray();

        try {
        	
            connection = Database.getConnection();
            statement = connection.prepareStatement(query);
            resultSet = statement.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            
            while (resultSet.next()) {
       
            	JsonObject obj = new JsonObject();
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    String columnName = metaData.getColumnName(i);
                    int columnType = metaData.getColumnType(i);
                    if (columnType == Types.INTEGER || columnType == Types.SMALLINT ) {
                        int value = resultSet.getInt(columnName);
                        obj.addProperty( parseColumnName(columnName), value);
                    } else if (columnType == Types.VARCHAR ) {
                        String value = resultSet.getString(columnName);
                        obj.addProperty( parseColumnName(columnName), value);
                    } else if (columnType == Types.TIMESTAMP) {
                        Timestamp value = resultSet.getTimestamp(columnName);
                        obj.addProperty( parseColumnName(columnName), value.toString());
                    } else if (columnType == Types.BIT) {
                        Boolean value = resultSet.getBoolean(columnName);
                        obj.addProperty( parseColumnName(columnName),value);
                    }
                }
                jsonArray.add(obj);
            }
        }
        catch(SQLException e) {
        	throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            if (resultSet != null) {
            	try {
					resultSet.close();
				} catch (SQLException e) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
				}
            }
            if (statement != null) {
            	try {
					statement.close();
				} catch (SQLException e) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
				}
            }
            if (connection != null) {
            	Database.closeConnection();
            }
        }
        return jsonArray.toString();
	}
	
	// method to execute insert , update and delete statements
	public int executeUpdate(String query) throws CustomException{
		
		Connection connection = null;
		int result = 0;
        PreparedStatement statement = null;

        try {
            connection = Database.getConnection();
            statement = connection.prepareStatement(query);
            result = statement.executeUpdate();
        }
        catch(SQLException e) {
        	throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            if (statement != null) {
            	try {
					statement.close();
				} catch (SQLException e) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR);
				}
            }
            if (connection != null) {
            	Database.closeConnection();
            }
        }
        return result;
	}
	
    public String parseColumnName(String columnName) {
        String[] parts = columnName.split("_");
        columnName = parts[0];
        for (int i = 1; i < parts.length; i++) {
            columnName += parts[i].substring(0, 1).toUpperCase() + parts[i].substring(1);
        }
    	return columnName;
    }
    
    public String parseClassName(String className) {
        String[] parts = className.split("_");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            sb.append(part.substring(0, 1).toUpperCase());
            sb.append(part.substring(1).toLowerCase());
        }
    	if(sb.charAt(sb.length()-1)=='s') {
    		sb.deleteCharAt(sb.length()-1);
    	}
        return sb.toString();
    }
	
}
