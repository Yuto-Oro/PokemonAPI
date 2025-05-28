import React, { useState } from 'react';
import axios from 'axios';

const PokemonViewer = () => {
  const [pokemonId, setPokemonId] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const username = 'admin';
    const password = 'admin123';
    const token = btoa(`${username}:${password}`);
    return {
      'X-Forwarded-For': '127.0.0.1',
      'Authorization': `Basic ${token}`
    };
  };

  const fetchPokemon = async () => {
    try {
      const pokeRes = await axios.get(`http://localhost:8080/api/pokemon/${pokemonId}`, {
        headers: getAuthHeaders()
      });

      const evoRes = await axios.get(`http://localhost:8080/api/pokemon/${pokemonId}/evolution`, {
        headers: getAuthHeaders()
      });

      const evoNames = evoRes.data;

      const evoWithImages = await Promise.all(
        evoNames.map(async (name) => {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return {
            name: name,
            image: res.data.sprites.front_default,
          };
        })
      );

      setPokemon(pokeRes.data);
      setEvolutionData(evoWithImages);
      setError('');
    } catch (err) {
      console.error("Error al obtener el Pokémon:", err);
      setError('No se pudo obtener el Pokémon.');
      setPokemon(null);
      setEvolutionData([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center py-10 px-4">
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

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {pokemon && (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md mb-8">
          <h2 className="text-2xl font-bold capitalize mb-4 text-center">{pokemon.name}</h2>
          <div className="flex justify-center mb-4">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-32 h-32"
            />
          </div>
          <p className="text-center text-sm text-gray-300">Experiencia base: {pokemon.baseExperience}</p>
        </div>
      )}

      {evolutionData.length > 0 && (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Cadena de evolución</h3>
          <ul className="flex flex-col gap-4 items-center">
            {evolutionData.map((evo, index) => (
              <li key={index} className="text-center capitalize">
                <img src={evo.image} alt={evo.name} className="w-20 h-20 mx-auto mb-1" />
                {evo.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonViewer;
