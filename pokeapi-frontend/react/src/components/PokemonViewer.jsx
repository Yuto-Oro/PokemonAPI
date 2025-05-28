import React, { useState } from 'react';
import axios from 'axios';

const PokemonViewer = () => {
  const [pokemonId, setPokemonId] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [error, setError] = useState('');

  const fetchPokemon = async () => {
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
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Consulta Pokémon</h1>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="number"
          className="px-4 py-2 rounded-md border border-gray-700 bg-zinc-800 text-white w-40"
          placeholder="ID del Pokémon"
          value={pokemonId}
          onChange={(e) => setPokemonId(e.target.value)}
        />
        <button
          onClick={fetchPokemon}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {pokemon && (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md mb-8">
          <h2 className="text-2xl font-bold capitalize mb-4 text-center">{pokemon.name}</h2>
          <img src={pokemon.imageUrl} alt={pokemon.name} className="mx-auto w-32 h-32 mb-4" />
          <p className="text-center text-sm text-gray-300">Experiencia base: {pokemon.baseExperience}</p>
        </div>
      )}

      {evolution.length > 0 && (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-3 text-center">Cadena de evolución</h3>
          <ul className="list-disc list-inside space-y-1 text-center">
            {evolution.map((name, index) => (
              <li key={index} className="capitalize">{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonViewer;
