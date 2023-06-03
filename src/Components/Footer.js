import { Navbar, Container } from 'react-bootstrap';

const Footer = ()=> {
    return(
        <Navbar className="my-bg" variant="dark">
            <Container>
            <Navbar.Text className="text-center">
                &copy; {new Date().getFullYear()} My Website. All rights reserved.
            </Navbar.Text>
            </Container>
        </Navbar>
    )
}

export default Footer