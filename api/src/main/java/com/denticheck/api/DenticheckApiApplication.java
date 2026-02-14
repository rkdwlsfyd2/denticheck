package com.denticheck.api;

import com.denticheck.api.config.GoogleMobileProperties;
import com.denticheck.api.domain.user.entity.RoleEntity;
import com.denticheck.api.domain.user.entity.SocialProviderType;
import com.denticheck.api.domain.user.entity.UserEntity;
import com.denticheck.api.domain.user.repository.RoleRepository;
import com.denticheck.api.domain.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(GoogleMobileProperties.class)
public class DenticheckApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(DenticheckApiApplication.class, args);
    }

    // TODO: 테스트용 데이터 생성 나중에 삭제(!!!필수!!!)
    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            RoleRepository roleRepository) {
        return args -> {
            if (!userRepository.existsByUsername("TestUser")) {
                RoleEntity userRole = roleRepository.findByName("USER")
                        .orElseGet(() -> roleRepository
                                .save(RoleEntity.builder().name("USER").build()));

                UserEntity testUser = UserEntity
                        .builder()
                        .username("TestUser")
                        .nickname("테스트유저")
                        .email("testuser@example.com")
                        .socialProviderType(SocialProviderType.GOOGLE)
                        .role(userRole)
                        .build();

                userRepository.save(testUser);
                System.out.println("TestUser created with username: TestUser");
            }

            if (!userRepository.existsByUsername("TestAdmin")) {
                RoleEntity adminRole = roleRepository.findByName("ADMIN")
                        .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("ADMIN").build()));

                UserEntity testAdmin = UserEntity.builder()
                        .username("TestAdmin")
                        .nickname("관리자")
                        .email("admin@example.com")
                        .socialProviderType(SocialProviderType.GOOGLE)
                        .role(adminRole)
                        .build();

                userRepository.save(testAdmin);
                System.out.println("TestAdmin created with username: TestAdmin");
            }
        };
    }
}
