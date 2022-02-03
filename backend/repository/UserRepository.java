package hackweek.mizzou.jpnn.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import hackweek.mizzou.jpnn.backend.dao.UserDao;

public interface UserRepository extends JpaRepository<UserDao, Integer> 
{
    UserDao findByUsername(String username);
}