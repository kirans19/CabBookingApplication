//$Id$
package com.database;

import java.util.Arrays;

public class QueryGenerator {

	public StringBuilder query = null;
	
	// method to generate an insert query
    public QueryGenerator getInsert(String table , String...columns) {
	   this.query = new StringBuilder();
	   int midpoint = columns.length / 2;
	    String columnField = String.join(",", Arrays.copyOfRange(columns, 0, midpoint));
	    String[] columnValues = Arrays.copyOfRange(columns, midpoint, columns.length);
	    StringBuilder columnValueBuilder = new StringBuilder();
	    for (int i = 0; i < columnValues.length; i++) {
	        String columnValue = columnValues[i];
	        if (columnValue.startsWith("(") && columnValue.endsWith(")")) {
	            columnValueBuilder.append(columnValue);
	        } else {
	            columnValueBuilder.append("'");
	            columnValueBuilder.append(columnValue);
	            columnValueBuilder.append("'");
	        }
	        if (i < columnValues.length - 1) {
	            columnValueBuilder.append(",");
	        }
	    }
	    String columnValue = columnValueBuilder.toString();
	    query.append("INSERT INTO ");
	    query.append(table + "(");
	    query.append(columnField);
	    query.append(" ) VALUES (");
	    query.append(columnValue);
	    query.append(" )");
	    return this;
    }

    // method to add returning 
    public QueryGenerator addReturn(String... column) {
    	StringBuilder arrToStringGenerator = new StringBuilder();
    	for(int i = 0 ;i < column.length ;i++) {
    		arrToStringGenerator.append(column[i]).append(",");
    	}
      	arrToStringGenerator.deleteCharAt(arrToStringGenerator.length()-1);
    	this.query.append("RETURNING " + arrToStringGenerator.toString());
    	return this;
    }
    
    // method to generate select query with single column
    public QueryGenerator getSelect(String table, String... column ) {
    	this.query = new StringBuilder();
    	StringBuilder arrToStringGenerator = new StringBuilder();
    	
    	for(int i = 0 ;i < column.length ;i++) {
    		arrToStringGenerator.append(column[i]).append(",");
    	}
    	arrToStringGenerator.deleteCharAt(arrToStringGenerator.length()-1);
    	this.query.append("SELECT " + arrToStringGenerator.toString() + " FROM " + table );
    	
        return this;
    }
    
    // method to generate update query
    public QueryGenerator getUpdate(String table_name ,String...columns) {
    	this.query = new StringBuilder();
    	this.query.append("UPDATE "+table_name+" SET ");
    	int entryCount = 0;
    	for(int i=0 ; i<columns.length ; i+=2) {
    		entryCount+=2;
    		this.query.append(columns[i] +" = '"+columns[i+1]+"'");
            if (entryCount != columns.length) {
            	this.query.append(" , ");
            }
    	}
    	return this;
    }
    
    // method to add specific join type
    public QueryGenerator addJoin(int joinType ,String table_name, String aliases ,String column1 ,String column2) {
    	String[] joins = new String [] {"INNER" , "LEFT" , "RIGHT" , "FULL"};
    	this.query.append(" "+joins[joinType] +" JOIN "+table_name);
    	if(aliases != null) {
    		this.query.append(" AS "+aliases+" ");
    	}
    	this.query.append(" ON ");
    	this.query.append(column1+" = "+column2);
    	return this;
    }
    
    // method to add when then else block
    public QueryGenerator addElseBlock(String when_condition , String then_condition , String else_condition) {
    	this.query = new StringBuilder();
    	this.query.append("CASE  WHEN ");
    	this.query.append(when_condition);
    	this.query.append(" THEN "+then_condition);
    	this.query.append(" ELSE "+else_condition+" END");
    	
    	return this;
    }
    
    // method to add aliases
    public QueryGenerator addAliases(String val) {
    	this.query.append(" AS "+val);
    	return this;
    }
    
    // method to add where statement
    public QueryGenerator addWhere(String condition ,String value) {
    	this.query.append(" WHERE ");
    	
    	
    	if(value.startsWith("(") && value.endsWith(")")) {
    	this.query.append(condition +"="+ value);
    	}
    	else {
        this.query.append(condition +"= '"+ value +"'");	
    	}
    	return this;
    }
    
    // method to add group by statement
    public QueryGenerator addGroup(String... columns) {
    	this.query.append(" GROUP BY ");
    	String columnFields = String.join(",", Arrays.copyOfRange(columns, 0, columns.length));
    	this.query.append(columnFields);
    	return this;
    }
    
    // method to add having statement
	public QueryGenerator addHaving(String value) {
		this.query.append(" HAVING ");
		this.query.append(value);
		return this;
	}
    // method to add order by statement
    public QueryGenerator addOrder(String... columns) {
    	this.query.append(" ORDER BY ");
    	String columnFields = String.join(",", Arrays.copyOfRange(columns, 0, columns.length));
    	this.query.append(columnFields);
    	return this;
    }
    
    //method to add and conditions
    public QueryGenerator addAnd(String condition, String value) {
        this.query.append(" AND ");
    	if(value.startsWith("(")) {
    	this.query.append(condition +"="+ value);
    	}
    	else if( value.endsWith(")")) {
        	this.query.append(condition +"="+ value);
        	}
    	else {
        this.query.append(condition +"= '"+ value +"'");	
    	}
        return this;
    }
    
    // method to add or conditions
     public QueryGenerator addOr(String condition, String value) {
            this.query.append(" OR ");
            this.query.append(condition + " = " + value );
        return this;
    } 
    
    // method to terminate
    public QueryGenerator end() {
    	
    	this.query.append(";");
    	return this;
    }
}
