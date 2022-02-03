package hackweek.mizzou.jpnn.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hackweek.mizzou.jpnn.backend.dao.UserDao;
import hackweek.mizzou.jpnn.backend.model.User;
import hackweek.mizzou.jpnn.backend.repository.UserRepository;
import hackweek.mizzou.jpnn.backend.service.JwtUserDetailsService;

@RestController
@RequestMapping("users")
public class UserController 
{
	@Autowired
	private UserRepository userDao;
	
	@Autowired
	private JwtUserDetailsService userDetailsService;
	
	@CrossOrigin
	@RequestMapping(value = "/createUser", method = RequestMethod.POST)
	public ResponseEntity<?> saveUser(@RequestBody UserDao user) throws Exception 
	{
		UserDao u = userDao.findByUsername(user.getUsername());
		
		if(u == null)
		{
			userDetailsService.save(user);
			u = userDao.findByUsername(user.getUsername());
			User u2 = new User(u.getId(), u.getUsername(), u.getEmail(), u.getBio());
			return ResponseEntity.ok(u2);
		}
		
		return new ResponseEntity(null, HttpStatus.CONFLICT);
	}

	@CrossOrigin
    @GetMapping(value = "/getUserByName")
    public ResponseEntity<User> getUserByName(@RequestParam String username) 
    {
    	UserDao user = userDao.findByUsername(username);
    	if(user == null)
    	{
    		return new ResponseEntity(null, HttpStatus.NOT_FOUND);
    	}
    	
    	User u = new User(user.getId(), user.getUsername(), user.getEmail(), user.getBio());
    	
    	return ResponseEntity.ok(u);
    }
    
	@CrossOrigin
    @GetMapping(value = "/getUserById")
    public ResponseEntity<User> getUserByName(@RequestParam int id) 
    {
    	Optional<UserDao> userO = userDao.findById(id);
    	if(!userO.isPresent())
    	{
    		return new ResponseEntity(null, HttpStatus.NOT_FOUND);
    	}
    	
    	UserDao user = userO.get();
    	
    	User u = new User(user.getId(), user.getUsername(), user.getEmail(), user.getBio());
    	
    	return ResponseEntity.ok(u);
    }

}
