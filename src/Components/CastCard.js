import Card from 'react-bootstrap/Card';
import noProfile from "../assets/no-profile.png"

const CastCard = props => {
    return (
    <Card>
        <Card.Img variant="top" src={props.profile ? props.profile : noProfile} />
        <Card.Body>
          <Card.Title>{props.cast}</Card.Title>
          <Card.Text>{props.character}</Card.Text>
        </Card.Body>
    </Card>
    )
}

export default CastCard