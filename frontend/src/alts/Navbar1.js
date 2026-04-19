import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import img1 from "../assets/img/bloodbank logo.png"

function Navbar1() {
  return (
    <Navbar bg="black" expand="lg" fixed='top'>
      <Container>
      <img src={img1} alt="Logo" class="d-inline-block align-text-top"/>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link style={{color:'white'}} href="//">Home</Nav.Link>
            <Nav.Link style={{color:'white'}} href="//request">Request</Nav.Link>
            <Nav.Link style={{color:'white'}} href="//donate">Donate</Nav.Link>
            <Nav.Link style={{color:'white'}} href="//about">About Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar1;