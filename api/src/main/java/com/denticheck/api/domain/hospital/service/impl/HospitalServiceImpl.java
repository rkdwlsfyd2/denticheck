package com.denticheck.api.domain.hospital.service.impl;

import com.denticheck.api.domain.hospital.entity.HospitalEntity;
import com.denticheck.api.domain.hospital.entity.UserHospitalEntity;
import com.denticheck.api.domain.hospital.repository.HospitalRepository;
import com.denticheck.api.domain.hospital.repository.UserHospitalRepository;
import com.denticheck.api.domain.hospital.service.HospitalService;
import com.denticheck.api.domain.user.entity.UserEntity;
import com.denticheck.api.domain.user.repository.UserRepository;
import com.denticheck.api.common.exception.user.UserException;
import com.denticheck.api.common.exception.user.UserErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final UserHospitalRepository userHospitalRepository;
    private final UserRepository userRepository;

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
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        return userHospitalRepository.findByUserIdAndIsFavoriteTrue(user.getId()).stream()
                .map(UserHospitalEntity::getHospital)
                .collect(Collectors.toList());
    }
}
