package hackweek.mizzou.jpnn.backend.dao;

import java.math.BigInteger;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import hackweek.mizzou.jpnn.backend.model.Post;
import hackweek.mizzou.jpnn.backend.model.PostMapper;

@Component
public class PostDAOImpl implements PostDAO
{
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Override
	public long savePost(Post post) 
	{
		// insert
		String sql = "INSERT INTO posts (authorId, title, description, language, code, timestamp) VALUES (?, ?, ?, ?, ?, ?)";
		KeyHolder keyHolder = new GeneratedKeyHolder();
	    jdbcTemplate.update(new PreparedStatementCreator() 
	    {
	        public PreparedStatement createPreparedStatement(
	            Connection connection) throws SQLException 
	        {
	                PreparedStatement ps = connection.prepareStatement(
	                    sql, new String[] { "id" });
	                ps.setInt(1, post.getAuthorId());
	                ps.setString(2, post.getTitle());
	                ps.setString(3, post.getDescription());
	                ps.setString(4, post.getLanguage());
	                ps.setString(5, post.getCode());
	                ps.setString(6, post.getTimestamp());
	                return ps;
	            }
	        }, keyHolder);
	    	    
	    return keyHolder.getKey().longValue();
	}

	@Override
	public boolean deletePost(int id) 
	{
		String sql = "DELETE FROM posts WHERE id=?";
		int rows = jdbcTemplate.update(sql, id);
		
		if(rows > 0)
		{
			return true;
		}

		return false;
	}

	@Override
	public Post getPost(int id) 
	{
		String sql = "SELECT * FROM posts WHERE id=" + id;
		Post post;
		try
		{
			post = jdbcTemplate.queryForObject(sql, new PostMapper());
		}
		catch(EmptyResultDataAccessException e)
		{
			return null;
		}
		
		return post;
	}

	@Override
	public List<Post> getAllPosts() 
	{
		String sql = "SELECT * FROM posts";
		List<Post> postsList = jdbcTemplate.query(sql, new PostMapper());
		
		return postsList;
	}

	@Override
	public List<Post> getUserPosts(int id) 
	{
		String sql = "SELECT * FROM posts WHERE authorId=" + id;
		
		List<Post> postsList = jdbcTemplate.query(sql, new PostMapper());
		
		return postsList;
	}

}
