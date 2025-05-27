package org.example.service;

import org.example.dto.*;
import org.example.model.AccessLog;
import org.example.model.Pokemon;
import org.example.repository.AccessLogRepository;
import org.example.repository.PokemonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PokemonService {

    private final RestTemplate restTemplate;
    private final PokemonRepository pokemonRepository;
    private final AccessLogRepository accessLogRepository;

    public Pokemon getPokemonById(Long id, String ipAddress) {
        String url = "https://pokeapi.co/api/v2/pokemon/" + id;
        PokemonApiResponse response = restTemplate.getForObject(url, PokemonApiResponse.class);

        if (response == null) throw new RuntimeException("No se encontró el Pokémon");

        Pokemon pokemon = pokemonRepository.findById(id).orElse(
                Pokemon.builder()
                        .id(response.getId())
                        .name(response.getName())
                        .baseExperience(response.getBase_experience().toString())
                        .imageUrl(response.getSprites().getFront_default())
                        .build()
        );
        pokemonRepository.save(pokemon);

        AccessLog log = AccessLog.builder()
                .accessTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .pokemon(pokemon)
                .build();
        accessLogRepository.save(log);

        return pokemon;
    }

    public List<String> getEvolutionChainById(Long id) {
        String speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/" + id;
        SpeciesResponse species = restTemplate.getForObject(speciesUrl, SpeciesResponse.class);
        String evoUrl = species.getEvolution_chain().getUrl();

        EvolutionChainResponse chain = restTemplate.getForObject(evoUrl, EvolutionChainResponse.class);

        List<String> evolutionNames = new ArrayList<>();
        EvolutionChainResponse.Chain current = chain.getChain();
        while (current != null) {
            evolutionNames.add(current.getSpecies().getName());
            if (current.getEvolves_to().isEmpty()) break;
            current = current.getEvolves_to().get(0);
        }

        return evolutionNames;
    }
}

