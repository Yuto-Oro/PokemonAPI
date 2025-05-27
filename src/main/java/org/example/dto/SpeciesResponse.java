package org.example.dto;

import lombok.Data;

@Data
public class SpeciesResponse {
    private EvolutionChain evolution_chain;

    @Data
    public static class EvolutionChain {
        private String url;
    }
}
