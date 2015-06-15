package rest;

import java.util.Iterator;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import dao.VocabularyDAO;

@Path("/vocabulary")
public class VocabularyAPI {
	
	static int SUCCESS = 200;
	static int FAIL = 500;
	private static Logger logger = Logger.getLogger(VocabularyAPI.class); 
	
	//add vocabulary
	@Path("/add")
	@POST
	@Consumes({MediaType.APPLICATION_FORM_URLENCODED,MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	public Response addVocabulary(String data) throws Exception {
		
		logger.info( "invoke addVocabulary: " + data );
		String returnString = null;
		JSONObject jsonObject = new JSONObject();
		VocabularyDAO dao = new VocabularyDAO();
		
		try {
			
			JSONObject partsData = new JSONObject(data);
			
			int httpcode = dao.insertVocabulary(partsData.optString("name"), partsData.optString("namespace"), partsData.optString("path"));
			
			if( httpcode == 200 ) {
				jsonObject.put("http_code", "200");
				jsonObject.put("message", "Vocabulary has been added successfully");

				returnString = jsonObject.toString();
			} else {
				return Response.status(500).entity("Unable to enter Item").build();
			}
			
			logger.info( "returnString: " + returnString );
			
		} catch(Exception e) {
			e.printStackTrace();
			return Response.status(500).entity("Server was not able to process your request").build();
		}
		
		return Response.ok(returnString).build();
	}
	
	//get a list of vocabulary name
	@Path("/getAll")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response returnAllVocabulary() throws Exception {
		
		String returnString = null;
		Response rb = null;	
		JSONArray json = new JSONArray();
		JSONObject jsonObject = new JSONObject();
		
		try {
			
			VocabularyDAO dao = new VocabularyDAO();
			
			Map<String, String> retMap = dao.getAllVocabularyName();
			
			Iterator<Map.Entry<String, String>> it = retMap.entrySet().iterator();
			
		    JSONArray jsonArray = new JSONArray();
		    
		    for(Map.Entry<String, String> entry : retMap.entrySet()) {
		        String name = entry.getKey();
		        String namespace = entry.getValue();
		        
		    	JSONObject formDetailsJson = new JSONObject();
		    	
				formDetailsJson.put("name", name);
				formDetailsJson.put("namespace", namespace);
				jsonArray.put(formDetailsJson).toString();
		    }

			jsonObject.put("http_code", "200");
			jsonObject.put("Message", "Get Vocabulary successfully");
			jsonObject.put("result", jsonArray);
			
			returnString = jsonObject.toString();
			
			rb = Response.ok(returnString).build();
			logger.info( "returnString: " + returnString );
			
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		
		return rb;
	}
	
	//search vocabulary based on keyword
	@Path("/search/{keyword}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchVocabulary(
			@PathParam("keyword") String keyword)
			throws Exception {
		
		logger.info( "invoke searchVocabulary: " + keyword );
		String returnString = null;
		JSONArray json = new JSONArray();
		JSONObject jsonObject = new JSONObject();
		
		try {
			VocabularyDAO dao = new VocabularyDAO();
			
			if( keyword.contains(":") ){
				String prefix = keyword.substring(0, keyword.indexOf(":") - 1);
				String name = keyword.substring(keyword.indexOf(":") + 1, keyword.length());
			}
			
			Iterator<String> it = dao.searchVocabulary(keyword);
			
			json = getJsonFromObject(it, true);
			
			jsonObject.put("http_code", "200");
			jsonObject.put("message", "Search sucessful");
			jsonObject.put("result", json);
			
			returnString = jsonObject.toString();
		}
		catch (Exception e) {
			e.printStackTrace();
			return Response.status(500).entity("Server was not able to process your request").build();
		}
		
		return Response.ok(returnString).build();
	}
	
	//delete vocabulary based on vocabulary name
	@Path("/delete")
	@POST
	@Consumes({MediaType.APPLICATION_FORM_URLENCODED,MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteVocabulary(String data) throws Exception {
		logger.info( "invoke deleteVocabulary: " + data );
		int http_code;
		String returnString = null;
		JSONObject jsonObject = new JSONObject();
		VocabularyDAO dao = new VocabularyDAO();
		
		try {	
			JSONObject partsData = new JSONObject(data);
			String name = partsData.optString("name") + "_" + partsData.optString("namespace");
			
			http_code = dao.deleteVocabulary(name);
			
			if(http_code == 200) {
				jsonObject.put("http_code", "200");
				jsonObject.put("message", "Vocabulary has been deleted successfully");
			} else {
				return Response.status(500).entity("Server was not able to process your request").build();
			}
			
			returnString = jsonObject.toString();
			
		} catch(Exception e) {
			e.printStackTrace();
			return Response.status(500).entity("Server was not able to process your request").build();
		}
		return Response.ok(returnString).build();
	}
	
	//update vocabulary with a new uri
	@Path("/update")
	@POST
	@Consumes({MediaType.APPLICATION_FORM_URLENCODED,MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateVocabulary(String data) throws Exception {
		
		logger.info( "invoke updateVocabulary: " + data );
		String returnString = null;
		VocabularyDAO dao = new VocabularyDAO();
		JSONObject jsonObject = new JSONObject();
		
		try {
			logger.info("incomingData: " + data);
			
			JSONObject partsData = new JSONObject(data);
			logger.info( "jsonData: " + partsData.toString() );
			
			int http_code = dao.updataVocabulary(partsData.optString("name"), partsData.optString("namespace"), partsData.optString("path"));
			
			if(http_code == 200) {
				jsonObject.put("http_code", "200");
				jsonObject.put("message", "Vocabulary has been updated successfully");
			} else {
				return Response.status(500).entity("Server was not able to process your request").build();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(500).entity("Server was not able to process your request").build();
		}
		
		return Response.ok(returnString).build();
	}
	
	private JSONArray getJsonFromObject(Iterator<String> it, boolean bSearch) throws JSONException
	{
	    JSONArray jsonArray = new JSONArray();
	    
	    while (it.hasNext()){
	    	String vocabulary = it.next();
	    	JSONObject formDetailsJson = new JSONObject();
	    	
			formDetailsJson.put("value", vocabulary);
			jsonArray.put(formDetailsJson).toString();
	    }
	    
	    return jsonArray;
	}
}


