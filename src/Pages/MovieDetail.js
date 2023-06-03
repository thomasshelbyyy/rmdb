import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams } from "react-router-dom"
import moment from "moment"
import { Dot, StarFill } from "react-bootstrap-icons"
import { Button } from "react-bootstrap"
import CastCard from "../Components/CastCard"
import CrewCard from "../Components/CrewCard"
import ISO6391 from 'iso-639-1';
import RecommendationsCard from "../Components/RecommendationsCard"

const MovieDetail = ()=> {
    const [movie, setMovie] = useState({})
    const [recommendations, setRecommendations] = useState([])
    const [cast, setCast] = useState([])
    const [crew, setCrew] = useState([])
    const [rating, setRating] = useState('')
    const [showAllCast, setShowAllCast] = useState(false)

    const baseURL = 'https://api.themoviedb.org/3/movie/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'
    const {id} = useParams()
    useEffect(()=> {
        const fetchMovie = async ()=> {
            try {
                const result = await axios.get(`${baseURL}${id}?api_key=${apiKey}`)
                const result2 = await axios.get(`${baseURL}${id}/credits?api_key=${apiKey}`)
                const releaseDates = await axios.get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`)
                const recomendedRequest = await axios.get(`${baseURL}${id}/recommendations?api_key=${apiKey}`)
                const result3 = releaseDates.data.results
                const usRelease = result3.find(release => release.iso_3166_1 === 'US')
                if(usRelease) {
                    const ratings = usRelease.release_dates.map(date => date.certification)
                    setRating(ratings[ratings.length - 1])
                }
                setMovie(result.data)
                setCast(result2.data.cast)
                setCrew(result2.data.crew)
                setRecommendations(recomendedRequest.data.results)
                document.title = `${result.data.title} Detail -- Rizky's Movie Database`

            } catch(error) {
                console.log(error)
            }
        }

        fetchMovie()

    }, [id])

    const backdropStyle = {
        backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }

    const contentStyle = {
        backgroundColor: 'rgba(3,37,65, 0.4)'
    }

    let collectionBackdropStyle = {}
    if(movie.belongs_to_collection) {
        collectionBackdropStyle = {...backdropStyle, backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.belongs_to_collection.backdrop_path})`}
    }

    const release_date = movie.release_date

    let genres = []
    let hours
    let minutes
    if(movie.genres) {
        movie.genres.map(genre => genres.push(genre.name))
        hours = Math.floor(movie.runtime / 60)
        minutes = movie.runtime % 60
    }

    let mainCrew = []
    if(crew.length > 0) {
        mainCrew = crew.filter(item => item.job === "Director" || item.job === "Writer" || item.job === "Characters")
    }

    // To set visible actors
    const actorLimit = showAllCast ? cast.length : 8;
    let visibleActor
    if(cast.length > 0) {
        visibleActor = cast.slice(0, actorLimit)
    }

    const handleVisibleActor = ()=> {
        setShowAllCast(!showAllCast)
    }

    // For money configuration
    const options = {
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: 2,
    };
    
    return(
        <>
            <div style={movie.backdrop_path ? backdropStyle : {margin: "0px"}}>
                <div  style={contentStyle}>
                        {movie.title && (
                        <div className="container-fluid p-3 row">
                            <div className="col-sm-3">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-100 rounded" />
                            </div>
                            <div className="col d-flex flex-column justify-content-center text-light">
                            <p className="h1">
                                {movie.title} 
                                <span className="fw-light ms-2">({release_date && release_date.split('-')[0]})</span>  
                                </p>
                            <p className="card-subtitle fs-5">
                                <span className="border border-light px-2 fw-bold rounded me-1">{rating}</span>
                                {movie && moment(movie.release_date).format('D/MM/YYYY')}
                                <Dot />
                                {movie.genres && genres.join(', ')}
                                <Dot />
                                {movie.runtime && `${hours}h ${minutes}m`}
                            </p>
                            <div className="fs-5">
                                <StarFill color="yellow" /> <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <p className="fs-4 fst-italic fw-light">{movie.tagline}</p>
                            <div>
                                <p className="h5">Overview</p>
                                <p>{movie.overview}</p>
                            </div>
                            <div className="row">
                                {crew.length > 0 && mainCrew.map(crew => (
                                    <div className="col-sm-4" key={crew.id}>
                                        <p className="fs-6 fw-bold">{crew.name}</p>
                                        <p className="fs-6">{crew.job}</p>
                                    </div>
                                ))}
                            </div>
                            </div>
                        </div>
                        )}
                </div>
            </div>

            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-sm-8">
                        <h1>Cast</h1>
                        <div className="row">
                            {cast.length > 0 && visibleActor.map(cast => (
                                <div className="col-sm-3 mb-3" key={cast.credit_id}>
                                    <CastCard 
                                        profile={cast.profile_path === null ? undefined : `https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                                        cast={cast.name}
                                        character={cast.character}
                                        
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-center">
                            <Button variant="info" onClick={handleVisibleActor}>
                                {showAllCast ? "Show Less" : "Show More"}
                            </Button>
                        </div>
                        <hr />
                        <h1>Crew</h1>
                        <div className="row">
                            {crew.length > 0 && crew.slice(0, 20).map(item => (
                                <div className="col-sm-3 mb-3" key={item.credit_id}>
                                    <CrewCard 
                                        name={item.name}
                                        job={item.job}
                                        
                                    />
                                </div>
                            ))}
                        </div>
                        <hr />
                        {movie.belongs_to_collection && (
                            <div style={collectionBackdropStyle} className="w-100 rounded">
                                <div style={contentStyle} className="text-light p-4">
                                    <h4>This movie is part of {movie.belongs_to_collection.name}</h4>
                                    <Link to={`/collection/${movie.belongs_to_collection.id}`} className="bg-info text-dark rounded-pill mt-5 px-3 py-2 text-decoration-none">Visit Collection</Link>
                                </div>
                            </div>
                        )}
                        <hr />
                        <h3>Recommendations</h3>
                        <div className="scroll-container d-flex m-3">
                            {recommendations.length > 0 && recommendations.map(item => (
                                <RecommendationsCard 
                                    image={item.backdrop_path === null ? undefined : `https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                    title={item.title}
                                    key={item.id}
                                    id={item.id}
                                    type="movie"
                                />
                            ))}
                        </div>
                        
                    </div>
                    <div className="col-sm-4 py-5">
                        <p><span className="fw-bold">Status</span><br />{movie.status}</p>
                        <p><span className="fw-bold">Spoken Language</span><br />{ISO6391.getName(movie.original_language)}</p>
                        <p><span className="fw-bold">Budget</span><br />${movie.title && movie.budget.toLocaleString('en-US', options)}</p>
                        <p><span className="fw-bold">Revenue</span><br />${movie.title && movie.revenue.toLocaleString('en-US', options)}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetail