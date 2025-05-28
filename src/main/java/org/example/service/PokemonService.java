package org.example.service;

import org.example.dto.*;
import org.example.model.AccessLog;
import org.example.model.Pokemon;
import org.example.repository.AccessLogRepository;
import org.example.repository.PokemonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PokemonService {

    private final RestTemplate restTemplate;
    private final PokemonRepository pokemonRepository;
    private final AccessLogRepository accessLogRepository;

    public Pokemon getPokemonById(Long id, String ipAddress) {
        log.info("Obteniendo Pokémon con ID: {} desde IP: {}", id, ipAddress);

        String url = "https://pokeapi.co/api/v2/pokemon/" + id;
        PokemonApiResponse response = restTemplate.getForObject(url, PokemonApiResponse.class);

        if (response == null) {
            log.error("No se encontró el Pokémon con ID: {}", id);
            throw new RuntimeException("No se encontró el Pokémon");
        }

        Pokemon pokemon = pokemonRepository.findById(id).orElse(
                Pokemon.builder()
                        .id(response.getId())
                        .name(response.getName())
                        .baseExperience(response.getBase_experience().toString())
                        .imageUrl(response.getSprites().getFront_default())
                        .build()
        );
        pokemonRepository.save(pokemon);
        log.info("Pokémon guardado: {}", pokemon.getName());

        AccessLog logEntry = AccessLog.builder()
                .accessTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .pokemon(pokemon)
                .build();
        accessLogRepository.save(logEntry);
        log.info("Log de acceso guardado para Pokémon {}", pokemon.getName());

        return pokemon;
    }

    public List<String> getEvolutionChainById(Long id) {
        log.info("Obteniendo cadena de evolución para Pokémon con ID: {}", id);

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

        log.info("Cadena de evolución obtenida: {}", evolutionNames);
        return evolutionNames;
    }
}


