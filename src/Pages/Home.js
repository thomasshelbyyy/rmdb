import Hero from "../Components/Hero";
import { ButtonGroup, Button } from 'react-bootstrap';
import HomepageCard from "../Components/HomepageCard";
import axios from "axios"
import { useState, useEffect } from "react"

const Home = ()=> {
    const [trendingTime, setTrendingTime] = useState('day')
    const [trendingContent, setTrendingContent] = useState([])

    const [popularContentQuery, setPopularContentQuery] = useState('streaming')
    const [popularContent, setPopularContent] = useState([])

    const [freeToWatchType, setFreeToWatchType] = useState("tv")
    const [freeToWatchContent, setFreeToWatchContent] = useState([])

    const baseURL = 'https://api.themoviedb.org/3';
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'

    useEffect(()=> {
        document.title = "Rizky's Movie Database (RMDB)"
        const fetchTrending = async ()=> {
            try {
                const results = await axios.get(`${baseURL}/trending/all/${trendingTime}?api_key=${apiKey}`)
                setTrendingContent(results.data.results)
            } catch(error) {
                console.log(error)
            }
        }

        fetchTrending()
    }, [trendingTime])

    useEffect(()=> {
        if(popularContentQuery === "streaming") {
            const fetchPopular = async ()=> {
                try {
                    const results = await axios.get(`${baseURL}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_watch_providers=8`)
                    setPopularContent(results.data.results)
                } catch(error) {
                    console.log(error)
                }
            }

            fetchPopular()
        } else if(popularContentQuery === "on-tv") {
            const fetchPopular = async ()=> {
                try {
                    const results = await axios.get(`${baseURL}/tv/popular?api_key=${apiKey}`)
                    setPopularContent(results.data.results)
                } catch (error) {
                    console.log(error)
                }
            }

            fetchPopular()
        } else if(popularContentQuery === "for-rent") {
            const fetchPopular = async ()=> {
                try {
                    const results = await axios.get(`${baseURL}/discover/movie?api_key=${apiKey}&watch/providers=rent`)
                    setPopularContent(results.data.results)
                } catch(error) {
                    console.log(error)
                }
            }

            fetchPopular()
        } else if(popularContentQuery === "in-theathers") {
            const fetchPopular = async ()=> {
                try {
                    const results = await axios.get(`${baseURL}/movie/now_playing?api_key=${apiKey}`)
                    setPopularContent(results.data.results)
                } catch(error) {
                    console.log(error)
                }
            }

            fetchPopular()
        }
    }, [popularContentQuery])

    useEffect(()=> {
        const fetchContent = async ()=> {
            try {
                const results = await axios.get(`${baseURL}/discover/${freeToWatchType}?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_watch_monetization_types=free&api_key=${apiKey}`)
                setFreeToWatchContent(results.data.results)
            } catch (error) {
                console.log(error)
            }
        }

        fetchContent()
    }, [freeToWatchType])
    
    const handleTrendingTime = type => {
        setTrendingTime(type)
    }

    const handlePopularType = type => {
        setPopularContentQuery(type)
    }

    const handleFreeToWatch = type => {
        setFreeToWatchType(type)
    }

    let trendingContentComponent = trendingContent.map(item => {
        let title
        if(item.media_type === "movie") {
            title = item.title
        } else {
            title = item.name
        }
        return (
        <HomepageCard
            title={title}
            id={item.id}
            poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            rating={item.vote_average.toFixed(1)}
            key={item.id}
            type={item.media_type}
        />
    )});

    let popularContentComponent
    if(popularContentQuery === "on-tv") {
        popularContentComponent = popularContent.map(item => (
            <HomepageCard 
                title={item.name}
                id={item.id}
                poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                rating={item.vote_average.toFixed(1)}
                key={item.id}
                type="tv"
            />
        ))
    } else {
        popularContentComponent = popularContent.map(item => (
            <HomepageCard 
                title={item.title}
                id={item.id}
                poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                rating={item.vote_average.toFixed(1)}
                key={item.id}
                type="movie"
            />
        )
    )
    }

    let freeToWatchComponent = freeToWatchContent.map(item => {
        let title
        let type
        if(freeToWatchType === "tv") {
            title = item.name
        } else {
            title = item.title
        }
        return(
            <HomepageCard 
                title={title}
                id={item.id}
                poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                rating={item.vote_average.toFixed(1)}
                key={item.id}
                type={freeToWatchType}
            />
        )
    })

    return(
        <>
            <Hero />
            <main className="pb-4">
                <div className="trending p-4">
                    <div className="d-flex">
                        <p className="h3">Trending</p>
                        <ButtonGroup className="ms-3">
                            <Button 
                            variant={trendingTime === "day" ? "primary" : "outline-primary"} 
                            onClick={()=> handleTrendingTime('day')}>
                                Today
                            </Button>
                            <Button 
                            variant={trendingTime === "week" ? "primary" : "outline-primary"} 
                            onClick={()=> handleTrendingTime('week')}>
                                This Week
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="scroll-container d-flex m-3">
                        {trendingContent && trendingContentComponent}
                    </div>
                </div>

                <div className="popular my-bg text-light p-4">
                    <div className="d-flex">
                        <p className="h3">Popular</p>
                        <ButtonGroup className="ms-3">
                            <Button 
                            variant={popularContentQuery === "streaming" ? "primary" : "outline-primary"} 
                            onClick={()=> handlePopularType("streaming")}>
                                Streaming
                            </Button>
                            <Button 
                            variant={popularContentQuery === "on-tv" ? "primary" : "outline-primary"} 
                            onClick={()=> handlePopularType("on-tv")}>
                                On TV
                            </Button>
                            <Button 
                            variant={popularContentQuery === "for-rent" ? "primary" : "outline-primary"}
                            onClick={()=> handlePopularType("for-rent")}>
                                For Rent
                            </Button>
                            <Button 
                            variant={popularContentQuery === "in-theathers" ? "primary" : "outline-primary"} 
                            onClick={()=> handlePopularType("in-theathers")}>
                                In Theathers
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="scroll-container d-flex m-3">
                        {popularContent && popularContentComponent}
                    </div>
                </div>

                <div className="free-to-watch p-4">
                    <div className="d-flex">
                        <p className="h3">Free to Watch</p>
                        <ButtonGroup className="ms-3">
                            <Button 
                            variant={freeToWatchType === "tv" ? "primary" : "outline-primary"}
                            onClick={()=> handleFreeToWatch("tv")}>
                                TV Shows
                            </Button>
                            <Button 
                            variant={freeToWatchType === "movie" ? "primary" : "outline-primary"}
                            onClick={()=> handleFreeToWatch("movie")}>
                                Movies
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="scroll-container d-flex m-3">
                        {freeToWatchContent && freeToWatchComponent}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home