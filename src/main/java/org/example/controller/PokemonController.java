package org.example.controller;

import org.example.model.Pokemon;
import org.example.service.PokemonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
@RequiredArgsConstructor
public class PokemonController {

    private final PokemonService pokemonService;

    @GetMapping("/{id}")
    public Pokemon getPokemon(@PathVariable Long id, @RequestHeader("X-Forwarded-For") String ip) {
        return pokemonService.getPokemonById(id, ip);
    }

    @GetMapping("/{id}/evolution")
    public List<String> getEvolution(@PathVariable Long id) {
        return pokemonService.getEvolutionChainById(id);
    }
}

