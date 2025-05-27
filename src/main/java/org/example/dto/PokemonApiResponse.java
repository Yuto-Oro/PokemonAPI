package org.example.dto;

import lombok.Data;

@Data
public class PokemonApiResponse {
    private Long id;
    private String name;
    private Integer base_experience;
    private Sprites sprites;

    @Data
    public static class Sprites {
        private String front_default;
    }
}
