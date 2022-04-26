import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [dataFetch,setDataFetch] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  

 const  fetchMovies = useCallback( async() => {
  setIsLoading(true)
  setError(null)
  try{
     const response = await fetch('https://react-http-c2346-default-rtdb.firebaseio.com/movies.json');

     if(!response.ok){
       throw new Error('smth went wrong');
     }
     const data = await response.json();
     const loaded = [];
     for(let key in data){
       loaded.push({
         id: key,
         title: data[key].title,
         openingText: data[key].openingText,
         releaseDate: data[key].releaseDate
       })
     }
   
    setDataFetch(loaded);
   
  }
  catch(error){
      setError(error.message);
  }
   setIsLoading(false);
   },[]);

   useEffect(() =>{
    fetchMovies();
  },[fetchMovies]);

  const addMovieHandeler = async (movie) =>{
   const response = await fetch('https://react-http-c2346-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type' : 'application.json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

   let content = <p>Found no movies</p>
   if(dataFetch.length >0){
     content = <MoviesList movies={dataFetch} />
   }
   if(error){
     <p>{error}</p>
   }
   if(isLoading){
     content = <p>Loading...</p>
   }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandeler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
}

export default App;