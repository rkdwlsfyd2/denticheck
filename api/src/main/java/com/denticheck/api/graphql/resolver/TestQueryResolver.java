package com.denticheck.api.graphql.resolver;

import com.denticheck.api.domain.user.entity.UserEntity;
import com.denticheck.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class TestQueryResolver {

    private final UserRepository userRepository;

    @QueryMapping
    @PreAuthorize("hasRole('USER')")
    public UserEntity me(Authentication authentication) {
        String username = authentication.getName(); // JWTFilter가 setAuthentication 해줘야 함

        UserEntity entity = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        return entity;
    }

}
