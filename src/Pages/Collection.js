import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from  "axios"
import {StarFill} from "react-bootstrap-icons"
import CastCard from "../Components/CastCard"
import CrewCard from "../Components/CrewCard"
import {Card} from "react-bootstrap"
import moment from "moment"

const Collection = ()=> {

    const [collection, setCollection] = useState({})
    const [actors, setActors] = useState([])
    const [crew, setCrew] = useState([])
    const [genres, setGenres] = useState([])
    const [revenue, setRevenue] = useState()
    const [voteAverage, setVoteAverage] = useState()

    const {id} = useParams()
    const baseURL = 'https://api.themoviedb.org/3/collection/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'

    useEffect(()=> {
        document.title = `${collection.name} -- Rizky's Movie Database (RMDB)`
        const fetchCollection = async ()=> {
            try {
                const result = await axios.get(`${baseURL}${id}?api_key=${apiKey}`)
                setCollection(result.data)

                // Request To get popular actor and crew
                const castRequestData = []
                const crewRequestData = []
                const movieRevenue = []
                const genres = []
                const votes = []

                await Promise.all(
                    result.data.parts.map(async (item) => {
                        const creditRequest = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}/credits?api_key=${apiKey}`)

                        // To get popular actor
                        const popularActor = creditRequest.data.cast.filter(item => item.popularity > 30.000)
                        popularActor.map(actor => castRequestData.push(actor))

                        // To get Director and writer from crew
                        // console.log(creditRequest.data.crew)
                        const crew = creditRequest.data.crew.filter(item => item.job === "Director" || item.job === "Writer")
                        crew.map(item => crewRequestData.push(item))
                        
                        // Request to get total revenue and genre and vote average
                        const moviesResult = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}`)
                        moviesResult.data.genres.map(item => genres.push(item))
                        movieRevenue.push(moviesResult.data.revenue)
                        votes.push(moviesResult.data.vote_average)
                    })
                )

                const uniqueCastItems = castRequestData.reduce((result, item) => {
                    if(!result.find((i) => i.id === item.id)) {
                        result.push(item)
                    }
                    return result
                }, [])

                const uniqueCrewItems = crewRequestData.reduce((result, item) => {
                    if(!result.find((i) => i.id === item.id)) {
                        result.push(item)
                    }
                    return result
                }, [])

                const uniqueGenres = genres.reduce((result, item) => {
                    if(!result.find((i) => i.id === item.id)) {
                        result.push(item)
                    }
                    return result
                }, [])


                const total = movieRevenue.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                }, 0)

                const totalVotes = votes.reduce((acc, curr) => {
                    return acc + curr
                }, 0)

                setActors(uniqueCastItems)
                setCrew(uniqueCrewItems)
                setGenres(uniqueGenres)
                setRevenue(total)
                setVoteAverage(totalVotes / votes.length)
            } catch(error) {
                console.log(error)
            }
        }

        fetchCollection()
    }, [id])

    // CSS STYLE FOR BACKDROP
    const backdropStyle = {
        backgroundImage: `url(https://image.tmdb.org/t/p/w500${collection.backdrop_path})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }

    const contentStyle = {
        backgroundColor: 'rgba(3,37,65, 0.4)'
    }

    // For money configuration
    const options = {
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: 2,
    };

    return(
        <div>
            <div style={collection.backdrop_path ? backdropStyle : {margin: "0px"}}>
                <div style={contentStyle}>
                    {collection.name && (
                    <div className="container-fluid p-3 row">
                        <div className="col-sm-3">
                            <img src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`} alt={collection.name} className="w-100 rounded" />
                        </div>

                        <div className="col d-flex flex-column justify-content-center text-light">
                            <p className="h1">{collection.name}</p>
                            <p clasName="card-subtitle fs-5">
                                {genres.map((genre, index) => (
                                    <span key={genre.id}>
                                        {genre.name}
                                        {index !== genres.length - 1 && ", "}
                                    </span>
                                ))}
                            </p>
                            <div className="fs-5">
                                <StarFill color="yellow" /> <span>{voteAverage && voteAverage.toFixed(1)}</span>
                            </div>
                            <div>
                                <p className="h4">Overview</p>
                                <p>{collection.overview}</p>
                            </div>
                            <p><span className="fw-bold">Total Movies: </span>{collection.parts.length}</p>
                            <p><span className="fw-bold">Total Revenue: </span>${revenue && revenue.toLocaleString('en-US', options)}</p>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            <div className="container py-3">
                <h1>Cast</h1>
                <div className="row">
                    {actors.length > 0 && actors.map(actor => (
                        <div className="col-sm-2 mb-3" key={actor.credit_id}>
                            <CastCard 
                                profile={actor.profile_path === null ? undefined : `https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                cast={actor.name}
                                character={actor.character}
                                                            
                            />
                        </div>
                    ))}
                </div>
                <hr />
                <h1>Crew</h1>
                <div className="row">
                    {crew.length > 0 && crew.map(item => (
                        <div className="col-sm-2 mb-3" key={item.credit_id}>
                            <CrewCard 
                                name={item.name}
                                job={item.job}
                            />
                        </div>
                    ))}
                </div>
                <hr />
                {collection.parts && collection.parts.map(item => (
                    <Card key={item.id} className="mb-3">
                        <div className="row">
                            <div className="col-2">
                                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="w-100 rounded" />
                            </div>
                            <div className="col d-flex flex-column justify-content-center">
                                <Card.Title>
                                    <Link to={`/detail/movie/${item.id}`}>{item.title}</Link>
                                </Card.Title>
                                <Card.Subtitle>{moment(item.release_date).format('MMMM D, YYYY')}</Card.Subtitle>
                                <Card.Text>{item.overview}</Card.Text>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Collection