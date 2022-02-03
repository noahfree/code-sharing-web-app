package hackweek.mizzou.jpnn.backend.model;

import lombok.Data;

@Data
public class Post 
{
	private int id;
	private int authorId;
	private String title;
	private String description;
	private String timestamp;
	private String language;
	private String code;
}
