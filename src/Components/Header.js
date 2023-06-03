import { Navbar, NavDropdown, Container, Button, Collapse, Form, InputGroup } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

function Header() {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const navigate = useNavigate()
    
    const handleCollapse = ()=> {
      setOpen(!open)
    }

    const handleChange = e => {
        setInputValue(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        navigate(`/search?query=${inputValue}`)
    }

    return(
        <>
            <Navbar className="my-bg py-3" expand="lg">
                <Container>
                    <Navbar.Brand href="#home" className="text-light">
                        <img src={logo} alt='RMDB Logo' style={{ width: "50px" }} />
                        <span>RMDB</span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <NavDropdown  className="text-light me-2" title="Movies" id="basic-nav-dropdown">
                            <Link className="dropdown-item" to="/movie/popular">
                                Popular    
                            </Link>
                            <Link className="dropdown-item" to="/movie/now_playing">
                                Now Playing    
                            </Link>
                            <Link className="dropdown-item" to="/movie/upcoming">
                                Upcoming    
                            </Link>
                            <Link className="dropdown-item" to="/movie/top_rated">
                                Top Rated    
                            </Link>
                        </NavDropdown>

                        <NavDropdown  className="text-light me-2" title="TV Shows" id="basic-nav-dropdown">
                            <Link className="dropdown-item" to="/tv/popular">
                                Popular    
                            </Link>
                            <Link className="dropdown-item" to="/tv/airing_today">
                                Airing Today    
                            </Link>
                            <Link className="dropdown-item" to="/tv/on_the_air">
                                On The Air    
                            </Link>
                            <Link className="dropdown-item" to="/tv/top_rated">
                                Top Rated    
                            </Link>
                        </NavDropdown>
                        <Button className="text-light bg-transparent" variant="outline-none" onClick={handleCollapse}>
                        {open ? <X size={20} /> : <Search />}
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Collapse in={open} className="py-2">
                <Container>
                    <Form onSubmit={handleSubmit}>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><Search /></InputGroup.Text>
                        <Form.Control
                            placeholder="Search Movies/Tv Shows"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={handleChange}
                            value={inputValue}
                        />
                    </InputGroup>
                    </Form>
                </Container>
            </Collapse>
        </>
    )
}

export default Header