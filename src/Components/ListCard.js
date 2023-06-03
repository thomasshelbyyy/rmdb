import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";

const ListCard = props => {
    return(
        <Card style={{ width: '15rem' }} className="mb-3">
            <Card.Img variant="top" src={props.poster} />
            <Card.Body>
                <Link to={`/detail/${props.type}/${props.id}`} className="text-dark text-decoration-none">
                    <Card.Title>{props.title}</Card.Title>
                </Link>
                <Card.Text>
                    <StarFill color="yellow" /> 
                    {props.rating}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{props.release}</Card.Subtitle>
            </Card.Body>
        </Card>
    )
}

export default ListCard