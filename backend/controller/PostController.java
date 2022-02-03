package hackweek.mizzou.jpnn.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hackweek.mizzou.jpnn.backend.model.Post;
import hackweek.mizzou.jpnn.backend.repository.UserRepository;
import hackweek.mizzou.jpnn.backend.security.JwtTokenUtil;
import hackweek.mizzou.jpnn.backend.service.PostService;

@RestController
@RequestMapping("posts")
public class PostController 
{
	@Autowired
	private PostService postService;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
	@Autowired
	private UserRepository userDao;
	
	@Autowired
	private UserController userController;
	
	@CrossOrigin
    @GetMapping(value = "/getPosts")
    public List<Post> getPosts() 
    {
    	List<Post> posts = postService.getAllPosts();
    	
    	return posts;
    }
    
    @CrossOrigin
    @GetMapping(value = "/getPost")
    public ResponseEntity<Post> getPost(@RequestParam int id)
    {
    	Post post = postService.getPost(id);
    	
    	if(post == null)
    	{
    		return new ResponseEntity(null, HttpStatus.NOT_FOUND);
    	}
    	
    	return ResponseEntity.ok(post);
    }
    
    @CrossOrigin
    @GetMapping(value = "/getPostsByUserId")
    public List<Post> getPostsByUserId(@RequestParam int id)
    {
    	List<Post> posts = postService.getUserPosts(id);
    	
    	return posts;
    }
    
    @CrossOrigin
    @DeleteMapping(value = "/deletePost")
    public boolean deletePost(@RequestParam int id)
    {
    	boolean deleted = postService.deletePost(id);
    	
    	return deleted;
    }
    
    @CrossOrigin
    @PostMapping(value = "savePost")
    public ResponseEntity<Post> savePost(@RequestBody Post post, @RequestHeader (name="Authorization") String token)
    {
    	String author = jwtTokenUtil.getUsernameFromToken(token);
    	
    	int id = userDao.findByUsername(author).getId();
    	post.setAuthorId(id);
    	
    	Post savedPost = postService.savePost(post);
    	
    	return ResponseEntity.ok(savedPost);
      }
}
