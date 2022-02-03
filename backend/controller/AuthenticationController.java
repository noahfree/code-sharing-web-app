package hackweek.mizzou.jpnn.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import hackweek.mizzou.jpnn.backend.dao.UserDao;
import hackweek.mizzou.jpnn.backend.model.JwtRequest;
import hackweek.mizzou.jpnn.backend.model.JwtResponse;
import hackweek.mizzou.jpnn.backend.model.User;
import hackweek.mizzou.jpnn.backend.security.JwtTokenUtil;
import hackweek.mizzou.jpnn.backend.service.JwtUserDetailsService;

@RestController
@RequestMapping("authentication")
public class AuthenticationController 
{
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JwtUserDetailsService userDetailsService;

	@CrossOrigin
	@RequestMapping(value = "/generateToken", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception 
	{

		try
		{
			authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
		} 
		catch(Exception e)
		{
			return new ResponseEntity(HttpStatus.CONFLICT);
		}

		final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());

		final String token = jwtTokenUtil.generateToken(userDetails);

		return ResponseEntity.ok(new JwtResponse(token));
	}
	
	private void authenticate(String username, String password) throws Exception 
	{
		try 
		{
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} 
		catch (DisabledException e) 
		{
			throw new Exception("USER_DISABLED", e);
		} 
		catch (BadCredentialsException e) 
		{
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}
}
