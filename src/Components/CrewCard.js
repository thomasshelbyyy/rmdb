import Card from "react-bootstrap/Card"

const CrewCard = props => {
    return(
        <Card>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.job}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CrewCard