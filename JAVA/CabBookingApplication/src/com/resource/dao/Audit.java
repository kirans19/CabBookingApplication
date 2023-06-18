//$Id$
package com.resource.dao;

import com.database.QueryExecutor;
import com.database.QueryGenerator;
import com.exception.CustomException;

public class Audit {  
	 
	public void addAudit(String operation , String... fields)throws CustomException {
		String[] columns = null;
		switch(operation) {
		case "1" :
			columns = new String[] {"user_id","operation","table_name","new_data",
					fields[0],operation,fields[1],fields[2]}; 
			break;
		case "2":
			columns = new String[] {"user_id","operation","table_name","modified_id","old_data","new_data",
					fields[0],operation,fields[1],fields[2],fields[3],fields[4]}; 
			break;
		case "3":
			columns = new String[] {"user_id","operation","table_name","old_data",
					fields[0],operation,fields[1],fields[2]}; 
			break;
		}
		StringBuilder addAudit = new QueryGenerator().getInsert("audit",columns).end().query;

			new QueryExecutor().executeUpdate(addAudit.toString());

	}
}
