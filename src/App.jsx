import { useEffect, useState } from 'react'
import axios from 'axios';
import { PokeAbility, PokeEggGroups, PokeEvoChain, PokePolygonStat, PokeRangeStat, PokeType } from './components/PokeInfo';
import { RevolvingDot } from 'react-loader-spinner';
import { PokeButton, ShinyButton } from './components/Button';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shiny, setShiny] = useState(false);
  const [id, setId] = useState(133);
  const [description, setDescription] = useState('');

  useEffect(() => {

    let abortController = new AbortController();

    const loadPokemon = async () => {
      try {
        setLoading(true);

        await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`, {
          signal: abortController.signal
        }).then(response => setPokemon(response.data));

        await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
          signal: abortController.signal
        }).then(response => setSpecies(response.data));

      } catch (error) {
        if (!axios.isCancel(error)) {
            console.error("Something went wrong, ", error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();

    return () => abortController.abort();

  }, [id]);

  useEffect(() => {
    if (species) {
      let flavor = species.flavor_text_entries.filter(entry => entry.language.name === "en");
      setDescription(flavor[flavor.length - 1].flavor_text);
    }
  }, [species]);

  return (
    <div className='min-h-screen flex gap-6 justify-center items-center'>
      { id > 1 ? (
        <PokeButton type="previous" currentId={id} onClick={() => setId(id - 1)} />
      ) : (
        <div className="w-24"></div>
      )}
      <div className='flex gap-5 items-center justify-center'>
        <div className='flex flex-col'>
          <div className={`h-[30rem] w-[30rem] relative border-2 bg-neutral-700 border-neutral-600 rounded-xl`}>
            <div className='w-full h-full absolute flex items-center justify-center'>
              {loading ? (
                <RevolvingDot
                radius="70"
                color="#ff0000"
                secondaryColor=''
                ariaLabel="revolving-dot-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                />
                ) : (
                  <>
                    <img
                      className='w-[90%] h-[90%] z-10'
                      src={!shiny ? pokemon?.sprites.other.home.front_default : pokemon?.sprites.other.home.front_shiny}
                      alt={pokemon?.name}
                    />
                    <div className='absolute bottom-0 w-[80%] h-[20%] bg-gradient-radial opacity-40 rounded-[100%]'></div>
                  </>
                )}
            </div>
            <ShinyButton isShiny={shiny} onClick={() => setShiny(!shiny)} className="absolute right-0 bottom-0" />
          </div>
          <div className='h-[19rem] mt-[1rem] bg-neutral-700 border-2 border-neutral-600 rounded-xl'>
            <div className='flex flex-col px-5 h-full gap-5'>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline justify-center gap-2">
                    <div className='text-[3rem] text-neutral-50 font-semibold capitalize drop-shadow-lg'>{pokemon?.name}</div>
                    <div className='text-[2rem] font-semibold text-neutral-400 drop-shadow-lg'>#{pokemon?.id.toString().padStart(3, '0')}</div>
                  </div>
                  <div>
                    <div>
                      <span className='text-xs text-neutral-400 font-semibold'>Height: </span>
                      <span className='text-xs text-neutral-300'>{pokemon?.height / 10} m</span>
                    </div>
                    <div>
                      <span className='text-xs text-neutral-400 font-semibold'>Weight: </span>
                      <span className='text-xs text-neutral-300'>{pokemon?.weight / 10} kg</span>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 items-center mt-1 mb-2'>
                  {pokemon?.types.map((type, index) => (
                    <PokeType key={index} poketype={type.type.name} />
                  ))}
                </div>
                <div className='bg-neutral-700 text-sm text-neutral-300 font-semibold ml-1 capitalize'>{species?.genera[7].genus}</div>
              </div>
              <fieldset className='min-h-[6.25rem] border-[1px] border-neutral-500 rounded-lg'>
                <legend className='text-sm text-neutral-400 font-semibold px-1 ml-1'>Description</legend>
                <div className='text-sm text-neutral-300 font-semibold text-center whitespace-pre-wrap mb-4'>{description}</div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className='h-[50rem] w-[60rem] flex flex-col border-2 bg-neutral-700 border-neutral-600 rounded-xl overflow-hidden'>
          <div className='px-3 py-1 bg-red-700 flex items-center gap-2'>
            <div className='text-[1.5rem] text-neutral-50 capitalize'>
              {pokemon?.name}
              <span className='text-sm font-semibold text-neutral-400'> #{pokemon?.id.toString().padStart(3, '0')}</span>
            </div>
          </div>
          <div className='p-3 flex flex-col gap-3 overflow-y-auto'>
            <div className='flex gap-6'>
              <div className='flex-1'>
                <PokeAbility abilities={pokemon?.abilities} />
              </div>
              <div className='flex-1'>
                <PokeEggGroups eggGroups={species?.egg_groups} />
              </div>
            </div>
            <fieldset className='h-72 border-[1px] border-neutral-500 rounded-lg flex justify-evenly items-center'>
              <legend className='text-sm text-neutral-400 font-semibold px-1 ml-1'>Base Stats</legend>
              <PokePolygonStat
                pokeType={pokemon?.types[0].type.name}
                stat={{
                  hp: pokemon?.stats[0].base_stat,
                  atk: pokemon?.stats[1].base_stat,
                  def: pokemon?.stats[2].base_stat,
                  satk: pokemon?.stats[3].base_stat,
                  sdef: pokemon?.stats[4].base_stat,
                  spd: pokemon?.stats[5].base_stat,
                }}
              />
              <PokeRangeStat
                pokeType={pokemon?.types[0].type.name}
                stat={{
                  hp: pokemon?.stats[0].base_stat,
                  atk: pokemon?.stats[1].base_stat,
                  def: pokemon?.stats[2].base_stat,
                  satk: pokemon?.stats[3].base_stat,
                  sdef: pokemon?.stats[4].base_stat,
                  spd: pokemon?.stats[5].base_stat,
                }}
              />
            </fieldset>
            <PokeEvoChain species={species} />
          </div>
        </div>
      </div>
      { id < 905 ? (
        <PokeButton type="next" currentId={id} onClick={() => setId(id + 1)} />
      ) : (
        <div className="w-24"></div>
      )}
    </div>
  )
}

export default App