package hackweek.mizzou.jpnn.backend.model;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class PostMapper implements RowMapper<Post>
{
	@Override
	public Post mapRow(ResultSet rs, int rowNum) throws SQLException 
	{
		Post post = new Post();
		post.setId(rs.getInt("id"));
		post.setAuthorId(rs.getInt("authorId"));
		post.setTitle(rs.getString("title"));
		post.setDescription(rs.getString("description"));
		post.setTimestamp(rs.getString("timestamp"));
		post.setLanguage(rs.getString("language"));
		post.setCode(rs.getString("code"));
		
		return post;
	}

}
