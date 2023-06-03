import noImages from "../assets/no-image.png"
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom"

const RecommendationsCard = props => {
    return(
        <div className="item">
            <Card style={{ width: '10rem' }}>
                {props.image ? <Card.Img variant="top" src={props.image} /> : <Card.Img variant="top" src={noImages} />}
                <Card.Body>
                    <Link to={`/detail/${props.type}/${props.id}`} className="text-dark text-decoration-none">
                        <Card.Text>
                            {props.title}
                        </Card.Text>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default RecommendationsCard