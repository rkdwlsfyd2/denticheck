package com.denticheck.api.domain.hospital.repository;

import com.denticheck.api.domain.hospital.entity.HospitalEntity;
import com.denticheck.api.domain.hospital.entity.UserHospitalEntity;
import com.denticheck.api.domain.user.entity.UserEntity;
import com.denticheck.api.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserHospitalRepositoryIntegrationTest {

    @Autowired
    private UserHospitalRepository userHospitalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Test
    @DisplayName("Find user's favorite hospitals")
    void findFavorites() {
        // Given
        UserEntity user = UserEntity.builder()
                .username("test_user_fav")
                .nickname("Test User")
                .email("test@example.com")
                .build();
        userRepository.save(user);

        HospitalEntity hospital1 = HospitalEntity.builder().name("Hospital A").build();
        HospitalEntity hospital2 = HospitalEntity.builder().name("Hospital B").build();
        hospitalRepository.saveAll(List.of(hospital1, hospital2));

        UserHospitalEntity fav1 = UserHospitalEntity.builder()
                .user(user)
                .hospital(hospital1)
                .isFavorite(true)
                .build();

        UserHospitalEntity notFav = UserHospitalEntity.builder()
                .user(user)
                .hospital(hospital2)
                .isFavorite(false)
                .build();

        userHospitalRepository.saveAll(List.of(fav1, notFav));

        // When
        List<UserHospitalEntity> favorites = userHospitalRepository.findByUserIdAndIsFavoriteTrue(user.getId());

        // Then
        assertThat(favorites).hasSize(1);
        assertThat(favorites.get(0).getHospital().getName()).isEqualTo("Hospital A");
    }
}
