import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import ListCard from "../Components/ListCard"
import moment from "moment"
import { Pagination } from "react-bootstrap"

const MovieList = ()=> {
    const navigate = useNavigate()
    const {query} = useParams()

    const [movies, setMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const baseURL = 'https://api.themoviedb.org/3/movie/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'

    useEffect(()=> {
        switch (query) {
            case "popular":
                document.title = "Popular Movies -- Rizky's Movie Database"
                break;
            case "now_playing":
                document.title = "Now Playing Movies -- Rizky's Movie Database"
                break;
            case "upcoming":
                document.title = "Upcoming Movies -- Rizky's Movie Database"
                break;
            case "top_rated":
                document.title = "Top Rated Movies -- Rizky's Movie Database"
                break;
        
            default:
                break;
        }
        const fetchMovies = async ()=> {
            try {
                const results = await axios.get(`${baseURL}${query}?api_key=${apiKey}&page=${currentPage}`)
                setMovies(results.data.results)
                setTotalPages(results.data.total_pages)
            } catch(error) {
                console.log(error)
            }
        }

        fetchMovies()
        navigate(`/movie/${query}?page=${currentPage}`)

    }, [currentPage])

    // to handle change only in query 
        useEffect(()=> {
        const fetchMovies = async ()=> {
            try {
                const results = await axios.get(`${baseURL}${query}?api_key=${apiKey}`)
                setMovies(results.data.results)
                setTotalPages(results.data.total_pages)
                setCurrentPage(1)
            } catch(error) {
                console.log(error)
            }
        }

        fetchMovies()
        navigate(`/movie/${query}?page=${currentPage}`)

    }, [query])


    let movieListComponent = movies.map(movie => {
        const releaseDate = movie.release_date
        return (
        <ListCard 
            title={movie.title}
            id={movie.id}
            key={movie.id}
            release={moment(releaseDate ).format('D MMMM YYYY')}
            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            rating={movie.vote_average.toFixed(1)}
            type="movie"
        />
    )})

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    // To display 3 pages
    let pageNumbers = []
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + 2, totalPages);
    for(let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    let title
    switch (query) {
        case "popular":
            title = "Popular"
            break;
        case "now_playing":
            title = "Now Playing"
            break;
        case "upcoming":
            title = "Upcoming"
            break;
        case "top_rated":
            title = "Top Rated"
            break;
    
        default:
            break;
    }
    return(
        <div className="container">
            <h2 className="p-3">{title} Movies</h2>
            <h3>Page {currentPage}</h3>
            <div className="container d-flex flex-wrap justify-content-around">
                {movies && movieListComponent}
            </div>

            <Pagination>
                <Pagination.First onClick={()=> handlePageChange(1)} disabled={currentPage === 1 } />
                <Pagination.Prev onClick={()=> handlePageChange(currentPage - 1)} disabled={currentPage === 1 } />
                {pageNumbers.map(page => (
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={()=> handlePageChange(page)} 
                    >
                        {page}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={()=> handlePageChange(currentPage + 1)} />
                <Pagination.Last  onClick={()=> handlePageChange(totalPages)}/>
            </Pagination>
        </div>
    )
}

export default MovieList