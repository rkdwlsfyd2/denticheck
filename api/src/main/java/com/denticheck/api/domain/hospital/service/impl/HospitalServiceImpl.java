package com.denticheck.api.domain.hospital.service.impl;

import com.denticheck.api.domain.hospital.entity.HospitalEntity;
import com.denticheck.api.domain.hospital.repository.HospitalRepository;
import com.denticheck.api.domain.hospital.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final com.denticheck.api.domain.hospital.repository.UserHospitalRepository userHospitalRepository;

    private final com.denticheck.api.domain.user.repository.UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HospitalEntity> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HospitalEntity> getNearbyHospitals(double latitude, double longitude, double radiusKm) {
        return hospitalRepository.findNearbyHospitals(latitude, longitude, radiusKm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HospitalEntity> getMyFavoriteHospitals(String username) {
        com.denticheck.api.domain.user.entity.UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return userHospitalRepository.findByUserIdAndIsFavoriteTrue(user.getId()).stream()
                .map(com.denticheck.api.domain.hospital.entity.UserHospitalEntity::getHospital)
                .collect(java.util.stream.Collectors.toList());
    }
}
