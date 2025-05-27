package org.example.dto;

import lombok.Data;
import java.util.List;

@Data
public class EvolutionChainResponse {
    private Chain chain;

    @Data
    public static class Chain {
        private Species species;
        private List<Chain> evolves_to;
    }

    @Data
    public static class Species {
        private String name;
    }
}

