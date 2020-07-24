package com.todo.config;

import com.todo.security.JwtAuthEntryPoint;
import com.todo.security.JwtAuthFilter;
import com.todo.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

    /** Service to fetch UserDetails*/
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    /**  */
    @Autowired
    private JwtAuthEntryPoint unauthorizedHandler;

    /** */
    @Bean
    public JwtAuthFilter authenticationJwtTokenFilter() {
        return new JwtAuthFilter();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                	.exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
				.and()
                	.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
                	.authorizeRequests()
                    .antMatchers("/api/auth/**", "/api/board/all").permitAll()
                	.anyRequest().authenticated()
                .and()
                	.logout()
                	.invalidateHttpSession(true)
                	.clearAuthentication(true)
                	.permitAll();
        // Add JWT filter before Security to validate the tokens
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }

}
