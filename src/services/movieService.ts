import axios, { AxiosError } from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
// Типізую її параметри
interface FetchMoviesParams {
  query: string;
  page: number;
}
interface FetchMoviesResult {
  page: number;
  results: Movie[];
  total_pages: number;
}
export async function fetchMovies({
  query,
  page,
}: FetchMoviesParams): Promise<FetchMoviesResult> {
  try {
    const response = await axios.get<FetchMoviesResult>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query,
          page,
        },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your TMDB token.");
      }
      if (error.response?.status === 404) {
        throw new Error("Movie not found.");
      }
    }
    throw new Error("Failed to fetch movies. Please try again later.");
  }
}
