import "./App.css";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [movieDB, setMovieDB] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [alreadySuggestedMovies, setAlreadySuggestedMovies] = useState([]);

  //////////// Firebase ////////////////
  // Firebase config & init
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function getMovies(db) {
    const moviesCol = collection(db, "movies");
    const movieSnapshot = await getDocs(moviesCol);
    const movieList = movieSnapshot.docs.map((doc) => doc.data());
    return movieList;
  }

  //////////// Firebase ////////////////
  useEffect(() => {
    // Get a list of movies from your database
    getMovies(db).then((res) => {
      setMovieDB(res[0].titles);
    });
  }, []);

  function getMovie() {
    // random index belirle
    let randomIndex = Math.floor(Math.random() * movieDB.length);
    if (alreadySuggestedMovies.length != movieDB.length) {
      while (
        movieDB[randomIndex] == selectedMovie ||
        alreadySuggestedMovies.includes(movieDB[randomIndex])
      ) {
        randomIndex = Math.floor(Math.random() * movieDB.length);
      }

      setSelectedMovie(movieDB[randomIndex]);
      setAlreadySuggestedMovies((current) => [
        ...current,
        movieDB[randomIndex],
      ]);
    }
  }

  return (
    <div className="App">
      <span>{selectedMovie && <h1>{selectedMovie}</h1>}</span>
      <br />
      <span>
        {alreadySuggestedMovies.length == movieDB.length ? (
          <>
            Önerilecek dizi kalmadı. <br />
          </>
        ) : null}
      </span>
      <button onClick={() => getMovie()}>Get Movie</button>
    </div>
  );
}

export default App;
