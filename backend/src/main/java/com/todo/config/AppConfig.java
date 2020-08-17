package com.todo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {

    /** Configure CORS bean. */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "http://192.168.8.100:3000", "https://tododo-app.netlify.app")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true).maxAge(3600);
            }
        };
    }

}
