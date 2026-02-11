package com.denticheck.api.domain.hospital.repository;

import com.denticheck.api.domain.hospital.entity.HospitalEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class HospitalRepositoryIntegrationTest {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Test
    @DisplayName("Find hospitals nearby Seoul Station")
    void findNearbyHospitals() {
        // Given: Seoul Station (37.5547, 126.9707) as center
        double seoulStationLat = 37.5547;
        double seoulStationLon = 126.9707;

        // 1. Hospital at City Hall (Very close, approx 0.8km)
        HospitalEntity cityHallHospital = HospitalEntity.builder()
                .name("City Hall Dental")
                .latitude(37.5663) // Approx
                .longitude(126.9779)
                .build();

        // 2. Hospital at Gangnam (Far, approx 8-9km)
        HospitalEntity gangnamHospital = HospitalEntity.builder()
                .name("Gangnam Dental")
                .latitude(37.4979)
                .longitude(127.0276)
                .build();

        // 3. Hospital at Busan (Very Far, approx 300km+)
        HospitalEntity busanHospital = HospitalEntity.builder()
                .name("Busan Dental")
                .latitude(35.1796)
                .longitude(129.0756)
                .build();

        hospitalRepository.saveAll(List.of(cityHallHospital, gangnamHospital, busanHospital));

        // When: Search within 5km radius
        List<HospitalEntity> nearbyHospitals = hospitalRepository.findNearbyHospitals(seoulStationLat, seoulStationLon,
                5.0);

        // Then
        assertThat(nearbyHospitals).hasSize(1);
        assertThat(nearbyHospitals.get(0).getName()).isEqualTo("City Hall Dental");

        // When: Search within 15km radius
        List<HospitalEntity> withinRegion = hospitalRepository.findNearbyHospitals(seoulStationLat, seoulStationLon,
                15.0);

        // Then
        assertThat(withinRegion).hasSize(2);
        // Sorted by distance: City Hall (closer) -> Gangnam (further)
        assertThat(withinRegion.get(0).getName()).isEqualTo("City Hall Dental");
        assertThat(withinRegion.get(1).getName()).isEqualTo("Gangnam Dental");
    }
}
