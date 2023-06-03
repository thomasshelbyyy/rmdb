import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, Link }from "react-router-dom"
import { Card, Badge, ListGroup } from "react-bootstrap"
import moment from "moment"
import PaginationComponent from "../Components/PaginationComponent"

const Search = ()=> {
    const location = useLocation()

    const [query, setQuery] = useState('')
    const [totalMovieResult, setTotalMovieResult] = useState()
    const [totalTvResult, setTotalTvResult] = useState()
    const [totalCollectionResult, setTotalCollectionResult] = useState()

    const [movieResult, setMovieResult] = useState([])
    const [totalMoviePages, setTotalMoviePages] = useState(0)
    
    const [tvResult, setTvResult] = useState([])
    const [totalTvPages, setTotalTvPages] = useState(0)

    const [collectionResult, setCollectionResult] = useState([])
    const [totalCollectionPages, setTotalCollectionPages] = useState(0)
    
    const [currentPage, setCurrentPage] = useState(1)

    const [activeSearch, setActiveSearch] = useState("movie")

    const baseURL = 'https://api.themoviedb.org/3/search/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'

    useEffect(()=> {
        const searchParams = new URLSearchParams(location.search)
        const newQuery = searchParams.get('query')
        setQuery(newQuery)
        document.title = `${newQuery} search -- Rizky's Movie Database`

        const fetchData = async ()=> {
            try {
                // Request for Movies
                const result1 = await axios.get(`${baseURL}movie?query=${newQuery}&api_key=${apiKey}&page=${currentPage}`)
                setTotalMovieResult(result1.data.total_results)
                setTotalMoviePages(result1.data.total_pages)
                setMovieResult(result1.data.results)

                // Request for TV
                const result2 = await axios.get(`${baseURL}tv?query=${newQuery}&api_key=${apiKey}&page=${currentPage}`)
                setTotalTvResult(result2.data.total_results)
                setTotalTvPages(result2.data.total_pages)
                setTvResult(result2.data.results)

                // Request for Collection
                const result3 = await axios.get(`${baseURL}collection?query=${newQuery}&api_key=${apiKey}&page=${currentPage}`)
                setTotalCollectionResult(result3.data.total_results)
                setTotalCollectionPages(result3.data.total_pages)
                setCollectionResult(result3.data.results)
            } catch(error) {
                console.log(error)
            }
        }

        fetchData()
    }, [location.search, currentPage])


    const handleSearchChange = (type) => {
        setActiveSearch(type)
        setCurrentPage(1)
    }

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    let searchResultComponent

    if(activeSearch === "movie") {
        if(movieResult.length > 0) {
            searchResultComponent = movieResult.map(movie => (
                <Card key={movie.id} className="mb-3">
                    <div className="row">
                        <div className="col-2">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-100 rounded" />
                        </div>
                        <div className="col d-flex flex-column justify-content-center">
                            <Card.Title>
                                <Link to={`/detail/movie/${movie.id}`}>{movie.title}</Link>
                            </Card.Title>
                            <Card.Subtitle>{moment(movie.release_date).format('D MMMM YYYY')}</Card.Subtitle>
                            <Card.Text>{movie.overview}</Card.Text>
                        </div>
                    </div>
                </Card>
            ))
        } else {
            searchResultComponent =  <p className="fw-light text-center">Oops... no results found for <span className="fw-bold">{query}</span> search in Movies</p>
        }
    } else if(activeSearch === "tv") {
        if(tvResult.length > 0) {
            searchResultComponent = tvResult.map(tv => (
                <Card key={tv.id} className="mb-3">
                    <div className="row">
                        <div className="col-2">
                            <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.name} className="w-100 rounded" />
                        </div>
                        <div className="col d-flex flex-column justify-content-center">
                            <Card.Title>
                                <Link to={`/detail/tv/${tv.id}`}>{tv.name}</Link>
                            </Card.Title>
                            <Card.Subtitle>{moment(tv.first_air_date).format('D MMMM YYYY')}</Card.Subtitle>
                            <Card.Text>{tv.overview}</Card.Text>
                        </div>
                    </div>
                </Card>

            ))
        } else {
            searchResultComponent =  <p className="fw-light text-center">Oops... no results found for <span className="fw-bold">{query}</span> search in Tv Show</p>
        }
    } else {
        if(collectionResult.length > 0) {
            searchResultComponent = collectionResult.map(collection => (
                <Card key={collection.id} className="mb-3">
                    <div className="row">
                        <div className="col-2">
                            <img src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`} alt={collection.name} className="w-100 rounded" />
                        </div>
                        <div className="col d-flex flex-column justify-content-center">
                            <Card.Title>
                                <Link to={`/detail/collection/${collection.id}`}>{collection.name}</Link>
                            </Card.Title>
                            <Card.Text>{collection.overview}</Card.Text>
                        </div>
                    </div>
                </Card>
            ))
        } else {
            searchResultComponent =  <p className="fw-light text-center">Oops... no results found for <span className="fw-bold">{query}</span> search in Collections</p>
        }
    }

    return(
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-sm mt-3">
                    <Card>
                        <Card.Header className="bg-primary text-light">
                            <Card.Title>Search Results</Card.Title>
                        </Card.Header>

                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex justify-content-between" style={{ backgroundColor: activeSearch === "movie" ? "#EBEBEB" : "#fff" }}>
                                <span 
                                    style={{ cursor: "pointer" }}
                                    onClick={()=> handleSearchChange("movie")}
                                >
                                    Movies
                                </span>
                                <span><Badge pill bg="secondary">{totalMovieResult}</Badge></span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between" style={{ backgroundColor: activeSearch === "tv" ? "#EBEBEB" : "#fff" }}>
                                <span 
                                    style={{ cursor: "pointer" }}
                                    onClick={()=> handleSearchChange("tv")}
                                >
                                    TV Shows
                                </span>
                                <span><Badge pill bg="secondary">{totalTvResult}</Badge></span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between" style={{ backgroundColor: activeSearch === "collection" ? "#EBEBEB" : "#fff" }}>
                                <span 
                                    style={{ cursor: "pointer" }}
                                    onClick={()=> handleSearchChange("collection")}
                                >
                                    Collections
                                </span>
                                <span><Badge pill bg="secondary">{totalCollectionResult}</Badge></span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>

                <div className="col-sm-9 mt-3 justify-content-center">
                    {searchResultComponent}
                    {/* Pagination */}
                    {activeSearch === "movie" && (
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalMoviePages}
                            handlePageChange={handlePageChange}
                        />
                    )}
                    {activeSearch === "tv" && (
                        <PaginationComponent 
                            currentPage={currentPage}
                            totalPages={totalTvPages}
                            handlePageChange={handlePageChange}
                        />
                    )}
                    {activeSearch === "collection" && (
                        <PaginationComponent 
                            currentPage={currentPage}
                            totalPages={totalCollectionPages}
                            handlePageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search