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

/** Service-layer class used to load user details. */
@Transactional
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Gets user from db by id and builds user details.
     * @param id user id
     * @return user details object
     * @throws UsernameNotFoundException
     */
    public UserDetailsImpl loadUserById(String id) throws UsernameNotFoundException {
        final User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with such id: " + id));

        return UserDetailsImpl.build(user);
    }

    /**
     * Method used for fetching user by email.
     * @param email user's name
     * @return user details object
     * @throws UsernameNotFoundException
     */
    public UserDetailsImpl loadUserByEmail(String email) throws UsernameNotFoundException {
        final User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with such email: " + email));

        return UserDetailsImpl.build(user);
    }

    /**
     * Default {@code UserDetailsService} method to get user details.
     * This method is not used for fetching user in this app.
     * @param username user's name
     * @return user details object
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetailsImpl loadUserByUsername(String username) throws RuntimeException {
        throw new RuntimeException("This method is not used for fetching user in this app.");
    }

}
