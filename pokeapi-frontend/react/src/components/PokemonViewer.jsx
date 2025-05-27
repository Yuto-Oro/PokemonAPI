import React, { useState } from 'react';
import axios from 'axios';

const PokemonViewer = () => {
  const [pokemonId, setPokemonId] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const pokeRes = await axios.get(`http://localhost:8080/api/pokemon/${pokemonId}`, {
        headers: { 'X-Forwarded-For': '127.0.0.1' }
      });
      const evoRes = await axios.get(`http://localhost:8080/api/pokemon/${pokemonId}/evolution`);

      setPokemon(pokeRes.data);
      setEvolution(evoRes.data);
      setError('');
    } catch (err) {
      setError('No se pudo obtener el Pokémon.');
      setPokemon(null);
      setEvolution([]);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Consulta Pokémon</h1>
      <input
        type="number"
        placeholder="ID del Pokémon"
        value={pokemonId}
        onChange={(e) => setPokemonId(e.target.value)}
      />
      <button onClick={fetchData}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.imageUrl} alt={pokemon.name} />
          <p>Experiencia base: {pokemon.baseExperience}</p>
        </div>
      )}

      {evolution.length > 0 && (
        <div>
          <h3>Cadena de evolución</h3>
          <ul>
            {evolution.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonViewer;
