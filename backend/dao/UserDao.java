package hackweek.mizzou.jpnn.backend.dao;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "user")
public class UserDao 
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(unique = true)
    private String username;
    
    @Column
    private String password;
    
    @Column
    private String email;
    
    @Column
    private String bio;
}

