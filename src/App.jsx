import { useState, useEffect } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("All");
  const [year, setYear] = useState("All");
  const [rating, setRating] = useState("All");
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?s=${search || "movie"}&page=${page}&apikey=dc2c747b`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.Search);
      });
  }, [search, page]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }
  function handleRating(imdbID, star) {
    setUserRatings((prev) => ({
      ...prev,
      [imdbID]: star,
    }));
  }

  const filteredMovies = movies && movies.filter((movie) => {
    const matchYear  = year === "All"  || movie.Year.includes(year);
    const matchGenre = genre === "All" || movie.Type === genre.toLowerCase();
    return matchYear && matchGenre;
  });

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Movie Search</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{ padding: "6px 12px", fontSize: "16px", cursor: "pointer", backgroundColor: "red" }}
          >
            {"<"}
          </button>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            style={{ padding: "6px 12px", fontSize: "16px", cursor: "pointer", backgroundColor: "green" }}
          >
            {">"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Type a movie name..."
          value={search}
          onChange={handleSearch}
          style={{ padding: "8px", fontSize: "16px", width: "300px" }}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option>All</option>
          <option>Movie</option>
          <option>Series</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option>All</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
          <option>2020</option>
          <option>2019</option>
          <option>2018</option>
          <option>2017</option>
          <option>2016</option>
          <option>2015</option>
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option>All</option>
          <option>9+</option>
          <option>8+</option>
          <option>7+</option>
          <option>6+</option>
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredMovies && filteredMovies.map((movie) => (
          <div key={movie.imdbID} style={{ border: "1px solid black", padding: "10px", width: "200px" }}>
            <img src={movie.Poster} alt={movie.Title} width="100%" />
            <h3>{movie.Title}</h3>
            <p>Year: {movie.Year}</p>
            <p>Type: {movie.Type}</p>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(movie.imdbID, star)}
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: userRatings[movie.imdbID] >= star ? "gold" : "gray",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <p>Your Rating: {userRatings[movie.imdbID] ? `${userRatings[movie.imdbID]} / 5` : "Not rated"}</p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;