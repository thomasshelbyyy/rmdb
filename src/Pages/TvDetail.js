import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Dot, StarFill } from "react-bootstrap-icons"
import { Button, Card } from "react-bootstrap"
import CastCard from "../Components/CastCard"
import CrewCard from "../Components/CrewCard"
import RecommendationsCard from "../Components/RecommendationsCard"
import ISO6391 from 'iso-639-1';

const TvDetail = ()=> {
    const [tv, setTv] = useState({})
    const [ageRating, setAgeRating] = useState("")
    const [cast, setCast] = useState([])
    const [crew, setCrew] = useState([])
    const [showAllCast, setShowAllCast] = useState(false)
    const [recommendations, setRecommendations] = useState([])

    const {id} = useParams()

    const baseURL = 'https://api.themoviedb.org/3/tv/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'
    useEffect(()=> {
        const fetchTv = async ()=> {
            try {
                // Request for tv data
                const result = await axios.get(`${baseURL}${id}?api_key=${apiKey}`)
                setTv(result.data)
                document.title = `${result.data.name} Detail -- Rizky's Movie Database`
                // Request for tv cast and crew
                const result2 = await axios.get(`${baseURL}${id}/credits?api_key=${apiKey}`)
                setCast(result2.data.cast)
                setCrew(result2.data.crew)
                // Request for age rating
                const releaseDate = await axios.get(`${baseURL}${id}/content_ratings?api_key=${apiKey}`)
                const rating = releaseDate.data.results.find(item => item.iso_3166_1 === "US")
                if(rating) {
                    setAgeRating(rating.rating)
                }
                // Request for recommendations
                const result3 = await axios.get(`${baseURL}${id}/recommendations?api_key=${apiKey}`)
                setRecommendations(result3.data.results)
            } catch(error) {
                console.log(error)
            }
        }

        fetchTv()
    }, [id])

    // CSS STYLE FOR BACKDROP
    const backdropStyle = {
        backgroundImage: `url(https://image.tmdb.org/t/p/w500${tv.backdrop_path})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }

    const contentStyle = {
        backgroundColor: 'rgba(3,37,65, 0.4)'
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
    
    return(
        <>
            <div style={tv.backdrop_path ? backdropStyle : {margin: "0px"}}>
                <div  style={contentStyle}>
                        {tv.name && (
                        <div className="container-fluid p-3 row">
                            <div className="col-sm-3">
                            <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.name} className="w-100 rounded" />
                            </div>
                            <div className="col d-flex flex-column justify-content-center text-light">
                            <p className="h1">
                                {tv.name} 
                                <span className="fw-light ms-2">({tv.first_air_date.split('-')[0]})</span>  
                                </p>
                            <p className="card-subtitle fs-5">
                                <span className="border border-light px-2 fw-bold rounded me-1">{ageRating}</span>
                                <Dot />
                                {tv.genres.map((genre, index) => (
                                    <span key={genre.id}>
                                        {genre.name}
                                        {index !== tv.genres.length - 1 && ", "}
                                    </span>
                                ))}
                            </p>
                            <div className="fs-5">
                                <StarFill color="yellow" /> <span>{tv.vote_average.toFixed(1)}</span>
                            </div>
                            <p className="fs-4 fst-italic fw-light">{tv.tagline}</p>
                            <div>
                                <p className="h5">Overview</p>
                                <p>{tv.overview}</p>
                            </div>
                            <div className="row">
                                {tv.created_by.map(crew => (
                                    <div className="col-sm-4" key={crew.id}>
                                        <p className="fs-6">
                                            <span className="fw-bold">{crew.name}</span> <br />
                                            Creator
                                        </p>
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
                        {tv.seasons && (
                            <div>
                                <h3>Latest Season</h3>
                                <Card>
                                    <div className="row">
                                        <div className="col-3">
                                            <Card.Img src={`https://image.tmdb.org/t/p/w500${tv.seasons[tv.seasons.length - 1].poster_path}`} className="w-100 rounded-left" />
                                        </div>
                                        <div className="col-9 py-3">
                                            <p className="h5">
                                                {tv.seasons[tv.seasons.length - 1].name} <br />
                                                <span className="h6">{tv.seasons[tv.seasons.length -1].air_date.split('-')[0]} | {tv.seasons[tv.seasons.length - 1].episode_count} Episodes</span>
                                            </p>
                                            <p>{tv.seasons[tv.seasons.length - 1].overview}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                        {recommendations.length > 0 && (
                            <div>
                                <hr />
                                <h3>Recommendations</h3>
                                <div className="scroll-container d-flex m-3">
                                    {recommendations.map(item => (
                                        <RecommendationsCard 
                                            image={item.backdrop_path === null ? undefined : `https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                            title={item.name}
                                            key={item.id}
                                            id={item.id}
                                            type="tv"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-sm-4 py-5">
                        <p><span className="fw-bold">Status</span><br />{tv.status}</p>
                        <p><span className="fw-bold">Network</span><br />
                        {tv.networks && <img src={`https://image.tmdb.org/t/p/w500${tv.networks[0].logo_path}`} className="w-25" alt="alt" />}
                        </p>
                        <p><span className="fw-bold">Type</span><br />{tv.type}</p>
                        <p><span className="fw-bold">Spoken Language</span><br />{ISO6391.getName(tv.original_language)}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TvDetail