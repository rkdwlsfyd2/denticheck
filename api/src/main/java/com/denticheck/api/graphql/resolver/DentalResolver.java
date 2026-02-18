package com.denticheck.api.graphql.resolver;

import com.denticheck.api.domain.dental.entity.DentalEntity;
import com.denticheck.api.domain.dental.repository.DentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DentalResolver {

    private final DentalRepository dentalRepository;

    @QueryMapping
    public List<DentalEntity> dentals(
            @Argument("name") String name,
            @Argument("limit") Integer limit) {
        int max = (limit != null && limit > 0 && limit <= 100) ? limit : 50;
        if (name != null && !name.isBlank()) {
            return dentalRepository.findByNameContainingIgnoreCaseOrderByNameAsc(
                    name, org.springframework.data.domain.PageRequest.of(0, max));
        }
        return dentalRepository.findAllByOrderByNameAsc(
                org.springframework.data.domain.PageRequest.of(0, max));
    }
}
