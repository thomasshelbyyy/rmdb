import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";

const HomepageCard = props => {
    return(
        <div className="item">
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={props.poster} />
            <Card.Body>
                <Link to={`/detail/${props.type}/${props.id}`} >
                    <Card.Title className="text-dark text-decoration-none">{props.title}</Card.Title>
                </Link>
                    <Card.Text>
                        <StarFill color="yellow" />
                        {props.rating}/10
                    </Card.Text>
            </Card.Body>
        </Card>
        </div>
    )
}

export default HomepageCard