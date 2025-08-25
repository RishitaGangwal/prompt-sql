package com.promptsql.server.service;

import com.promptsql.server.model.User;
import com.promptsql.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

   public String login(String email, String password){
       User user = userRepository.findById(email).orElseThrow(() -> new RuntimeException("User not found!"));
       if(!user.getPassword().equals(password)){
           throw new RuntimeException("Invalid Credentials");
       }
    return "Login successfull";
   }
}


