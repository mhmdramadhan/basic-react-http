import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
// use callback untuk:
// jangan merender ulang sebuah fungsi jika tidak ada perubahan
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fungsi pemanggilan api
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-13702-default-rtdb.firebaseio.com/movies.json'
      );
      // cek data 200 atau tidak
      if (!response.ok) {
        // lempar ke catch
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      // console.log(data);

      // karna response dari firebase itu object bukan langsung array maka harus di konversi dulu
      const loadedMovies = [];
      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

      // // merubah nama object pada json api
      // const transformedMovies = data.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      // // mengambil data results dari json api dan set ke data movies
      // setMovies(transformedMovies);

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // load data saat pertama kali reload
  // [] agar bisa mendefinisikan kapan fungsi useEffect dijalankan
  // jika ada data fetchMoviesHandler di array nya maka setiap kali fungsi fetchMoviesHandler dieksekusi data akan direload / useEffect akan dijalankan
  // jika dalam array kosong [], maka useEffect hanya akan jalan saat pertama kali data dirender
  useEffect(() => {
    fetchMoviesHandler();
  }, []);

  async function addMovieHandler(movie) {
    // api untuk input data
    const response = await fetch(
      'https://react-http-13702-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        // merubah data array to json karna di firebase hanya menerima file json
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
