import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';

interface Character {
  id: string;
  name: string;
  level: number;
  class: 'warrior' | 'mage' | 'ranger' | 'summoner';
  createdAt: string;
}

export function useCharacters(userId: string | undefined) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchCharacters();
    } else {
      setCharacters([]);
      setLoading(false);
    }
  }, [userId]);

  async function fetchCharacters() {
    try {
      const data = await fetchApi(`/characters/${userId}`);
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createCharacter(name: string, characterClass: Character['class']) {
    try {
      await fetchApi('/characters', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          name,
          characterClass,
        }),
      });
      await fetchCharacters();
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  return {
    characters,
    loading,
    refreshCharacters: fetchCharacters,
    createCharacter,
  };
}