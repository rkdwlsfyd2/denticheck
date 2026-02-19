package com.denticheck.api.domain.hospital.service;

import com.denticheck.api.domain.dental.entity.DentalEntity;

import java.util.List;

public interface HospitalService {
    List<DentalEntity> getAllHospitals();

    List<DentalEntity> getNearbyHospitals(double latitude, double longitude, double radiusKm);

    List<DentalEntity> getMyFavoriteHospitals(String username);
}
