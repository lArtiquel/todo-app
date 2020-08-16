package com.todo.config;

import com.todo.security.JwtAuthFailureHandler;
import com.todo.security.JwtAuthFilter;
import com.todo.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Spring Security Configuration class extends {@code WebSecurityConfigurerAdapter}
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        // securedEnabled = true,
        // jsr250Enabled = true,
        prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /** Service used to fetch UserDetails */
    private UserDetailsServiceImpl userDetailsService;
    /** Used to commence http request properly */
    private JwtAuthFailureHandler unauthorizedHandler;
    /** Jwt authentication filter */
    private JwtAuthFilter jwtAuthFilter;

    @Value("${app.config.permitAllEndpoints}")
    private String[] permitAllEndpoints;

    @Autowired
    public WebSecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthFailureHandler unauthorizedHandler, JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /** BCrypt password encoder */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure authentication manager.
     * Make it use our user details service with BCrypt password encoder.
     */
    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    /** Create authentication manager bean. */
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /** Configure and create CORS filter bean. */
    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false);
        config.setAllowedOrigins(Arrays.asList("https://tododo-app.netlify.app", "http://localhost:3000"));
        config.setAllowedHeaders(Arrays.asList("*")); // allow all headers
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

//    /** Configure WebSecurity */
//    @Override
//    public void configure(WebSecurity web) throws Exception {
//        // any static resources here
//        web.ignoring().antMatchers(HttpMethod.GET, "/**");
//    }

    /** Configure HttpSecurity */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .addFilterBefore(corsFilter(), CorsFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
            .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
                .authorizeRequests()
                .antMatchers(permitAllEndpoints).permitAll()
                .antMatchers("/api/**").hasAnyRole("USER", "ADMIN");
    }

}
