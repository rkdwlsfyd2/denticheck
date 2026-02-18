package com.denticheck.api.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductInputDTO {
    private String category;
    private String name;
    private int price;
    private String manufacturer;
    private String imageUrl;
}
