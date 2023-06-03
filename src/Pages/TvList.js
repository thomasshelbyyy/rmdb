import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import ListCard from "../Components/ListCard"
import moment from "moment"
import { Pagination } from "react-bootstrap"

const TvList = ()=> {
    const {query} = useParams()
    const navigate = useNavigate()

    const [tvShow, setTvShow] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const baseURL = 'https://api.themoviedb.org/3/tv/'
    const apiKey = '0ce7588e8ed49e537c366924cb84ffb1'

    // To handle page changes
    useEffect(()=> {
        switch (query) {
            case "popular":
                document.title = "Popular TV Shows -- Rizky's Movie Database"
                break;
            case "airing_today":
                document.title = "Airing Today TV Shows -- Rizky's Movie Database"
                break;
            case "on_the_air":
                document.title = "On The Air TV Shows -- Rizky's Movie Database"
                break;
            case "top_rated":
                document.title = "Top Rated TV Shows -- Rizky's Movie Database"
                break;
            default:
                break;
        }
        const fetchTvShow = async ()=> {
            try {
                const results = await axios.get(`${baseURL}${query}?api_key=${apiKey}&page=${currentPage}`)
                setTvShow(results.data.results)
                setTotalPages(results.data.total_pages)
            } catch(error) {
                console.log(error)
            }
        }

        fetchTvShow()
        navigate(`/tv/${query}?page=${currentPage}`)
    }, [currentPage])

    // To handle query changes
    useEffect(()=> {
        const fetchTvShow = async ()=> {
            try {
                const results = await axios.get(`${baseURL}${query}?api_key=${apiKey}`)
                setTvShow(results.data.results)
                setTotalPages(results.data.total_pages)
                setCurrentPage(1)
            } catch(error) {
                console.log(error)
            }
        }

        fetchTvShow()
        navigate(`/tv/${query}?page=${currentPage}`)
    }, [query])

    let tvListComponent = tvShow.map(item => {
        const releaseDate = item.first_air_date
        return (
        <ListCard 
            title={item.name}
            id={item.id}
            key={item.id}
            release={moment(releaseDate, 'YYYY-MM-DD').format('D MMMM YYYY')}
            poster={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            rating={item.vote_average.toFixed(1)}
            type="tv"
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
        case "airing_today":
            title = "Airing Today"
            break;
        case "on_the_air":
            title = "On The Air"
            break;
        case "top_rated":
            title = "Top Rated"
            break;
        default:
            break;
    }
    return(
        <div className="container">
            <h2 className="p-3">{title} TV Show</h2>
            <div className="container d-flex flex-wrap justify-content-around">
                {tvShow && tvListComponent}
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

export default TvList