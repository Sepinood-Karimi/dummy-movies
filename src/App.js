import React, {useCallback, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from "./components/AddMovie";

function App() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovieHandler = useCallback(
        async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('https://dummymovies-b1b4b-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json');
                if (!response.ok) {
                    throw new Error('Something Went Wrong!');
                }
                const data = await response.json();

                const loadedMovies = [];
                for (const key in data){
                    loadedMovies.push({
                        id : key,
                        title : data[key].title,
                        openingText: data[key].openingText,
                        releaseDate: data[key].releaseDate
                        }

                    )
                }
                setMovies(loadedMovies);
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false);
        }, []
    )

    useEffect(() => {
        fetchMovieHandler();
    }, [fetchMovieHandler]);

    let content = <p> There is No Movies!</p>

    if (isLoading) {
        content = <p> Is Loading ...</p>
    }
    if (movies.length > 0) {
        content = <MoviesList movies={movies}/>
    }
    if (error) {
        content = <p> {error}</p>
    }

    const addMovieHandler = async (movie) => {
        const response = await fetch('https://dummymovies-b1b4b-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',{
            method:'Post',
            body : JSON.stringify(movie),
            headers : {
                'Content-Type': 'movies/json'
            }
        })
    }

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler}/>
            </section>
            <section>
                <button onClick={fetchMovieHandler}>Fetch Movies</button>
            </section>
            <section>
                {content}
            </section>
        </React.Fragment>
    );
}

export default App;
