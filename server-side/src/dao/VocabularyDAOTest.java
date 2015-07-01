package dao;

import static org.junit.Assert.*;

import java.util.Iterator;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

public class VocabularyDAOTest {
	
	private static VocabularyDAO dao = new VocabularyDAO();

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testInsertVocabulary() {
		int ret = 500;
		try{
			ret = dao.insertVocabulary("foaf", "http://xmlns.com/foaf/0.1/", "http://xmlns.com/foaf/spec/index.rdf");
		}catch(Exception e){
			
		}
		
		assertEquals(200, ret);
	}
	
	@Test
	public void testAutoComplete() {
		Iterator<String> ret;
		try{
			ret = dao.getAutoComplete();
		}catch(Exception e){
			
		}
	}

	@Test
	public void testDeleteVocabulary() {
		int ret = 500;
		try{
			ret = dao.deleteVocabulary("foaf");
		}catch(Exception e){
			
		}
		
		assertEquals(200, ret);
	}

	@Test
	public void testUpdataVocabulary() {
		int ret = 500;
		try{
			//ret = dao.updataVocabulary("foaf", "http://www.w3.org/2003/01/geo/wgs84_pos");
		}catch(Exception e){
			
		}
		
		assertEquals(200, ret);
	}

	@Test
	public void testSearchVocabulary() {
		try{
			dao.searchVocabulary("f");
		}catch(Exception e){
			
		}
	}

	@Test
	public void testGetAllVocabularyName() {
		try{
			Map<String, String> strArray= dao.getAllVocabularyName();
		}catch(Exception e){
			
		}
	}

}
