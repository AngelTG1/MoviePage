import React, { useCallback } from "react";
import "./App.css";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import { useState, useEffect, useRef } from "react";
import debounce from "just-debounce-it";

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current){
      isFirstInput.current = search == ''
      return
    }
    if(search == '') {
      setError('nose puede buscar una peli vacia')
      return
    }
    if(search.match(/^\d+$/)){
      setError('no se puede buscar una pelicula con numeros')
      return
    }
    if(search.length < 3) {
      setError('la busqueda tiene que tener mas de caracter')
      return
    }

    setError(null)

  }, [search])

  return{ search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const {search, updateSearch, error} = useSearch()
  const { movies,getMovies, loading } = useMovies({ search, sort });

  const debouncedGetMovies = useCallback(
      debounce(search => {
      console.log('search')
      getMovies({search})
    },300)
    ,[getMovies]
  )

  const handlerSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className="pages">
      <header>
        <h1>Buscador de pelicula</h1>
        <form className="form" onSubmit={handlerSubmit}>
          <input style={{border: '1px solid transparent' , borderColor: error ? 'red' : 'transparent'}} onChange={handleChange} value={search} name="query" type="text" placeholder="Avergers, Star Wars, The Matrix..." />
          {/* <input type="checkbox" onChange={handleSort} checked={sort} /> */}
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>

      <main className="hereMovie">
        {
          loading ? <p>Cargando</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  );
}

export default App;
