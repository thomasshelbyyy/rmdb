import { Pagination } from "react-bootstrap"

const PaginationComponent = props => {
    let pageNumbers = []
    const startPage = Math.max(1, props.currentPage - 1);
    const endPage = Math.min(startPage + 2, props.totalPages);
    for(let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    return(
        <Pagination>
            <Pagination.First onClick={()=> props.handlePageChange(1)} disabled={props.currentPage === 1 } />
            <Pagination.Prev onClick={()=> props.handlePageChange(props.currentPage - 1)} disabled={props.currentPage === 1 } />
            {pageNumbers.map(page => (
                <Pagination.Item
                    key={page}
                    active={page === props.currentPage}
                    onClick={()=> props.handlePageChange(page)} 
                >
                    {page}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={()=> props.handlePageChange(props.currentPage + 1)} />
            <Pagination.Last  onClick={()=> props.handlePageChange(props.totalPages)}/>
        </Pagination>
    )
}

export default PaginationComponent