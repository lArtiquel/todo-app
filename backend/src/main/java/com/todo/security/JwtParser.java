package com.todo.security;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

/** Used to fetch jwt tokens from the header and cookies. */
@Component
public class JwtParser {

    public String getJwtFromHeader(HttpServletRequest request, String headerName) {
        // fetch jwt from request header
        String jwt = request.getHeader(headerName);

        // jwt token if it is in header should start with Bearer word
        if (StringUtils.hasText(jwt) && jwt.startsWith("Bearer ")) {
            return jwt.substring("Bearer ".length());
        }

        return null;
    }

    public String getJwtFromCookies(HttpServletRequest request, String cookieName) {
        // fetch cookies from request
        final Cookie[] cookies = request.getCookies();

        // search cookie with specified name
        for(Cookie cookie: cookies){
            if(cookie.getName().equals(cookieName)) return cookie.getValue();
        }

        return null;
    }

}
