package com.todo.service;

import com.todo.model.User;
import com.todo.security.UserDetailsImpl;
import com.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service class used to load user details. */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Gets user from db by id and builds user details.
     * @param id user id
     * @return user details object
     * @throws UsernameNotFoundException
     */
    @Transactional
    public UserDetails loadUserById(String id) throws UsernameNotFoundException {
        final User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with such id: " + id));

        return UserDetailsImpl.build(user);
    }

    /**
     * Default {@code UserDetailsService} method to get user details.
     * Gets user from db by username and builds user details.
     * This is default service method of fetching user.
     * No needed in this app, cause username field is not used here.
     * @param username user's name
     * @return user details object
     * @throws UsernameNotFoundException
     */
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with such username: " + username));

        return UserDetailsImpl.build(user);
    }

}
