package hackweek.mizzou.jpnn.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

/*
 * user object to send back in json responses (password removed object)
 */
@Data
@AllArgsConstructor
public class User 
{
    private long id;
    
    private String username;
        
    private String email;
    
    private String bio;
}
