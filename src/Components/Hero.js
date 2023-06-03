import { useState } from "react"
import { InputGroup, Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const Hero = ()=> {
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('')

    const handleChange = e => {
        setInputValue(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        navigate(`/search?query=${inputValue}`)
    }
    return(
        <section className="hero p-5 text-light">
            <p className="h1">Welcome</p>
            <p className="h3 mb-3">Discover New Content Everyday</p>
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                    placeholder="Search your favorite movies or tv shows"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={handleChange}
                    value={inputValue}
                    />
                    <Button variant="primary" id="button-addon2">
                    Search
                    </Button>
                </InputGroup>
            </Form>
        </section>
    )
}

export default Hero