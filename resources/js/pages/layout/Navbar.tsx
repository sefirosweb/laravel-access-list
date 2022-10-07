import React from 'react'
import { Container, Nav, Navbar } from "react-bootstrap";
import { APP_PREFIX } from '@/types/configurationType';
import NavLink from '@/components/NavLink';

export default () => {
    return (
        <Navbar collapseOnSelect expand="sm">
            <Container>
                <Navbar.Brand>Laravel Access List System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to={`/${APP_PREFIX}/view/users`} eventKey="1">Users</Nav.Link>
                        <Nav.Link as={NavLink} to={`/${APP_PREFIX}/view/roles`} eventKey="2">Roles</Nav.Link>
                        <Nav.Link as={NavLink} to={`/${APP_PREFIX}/view/access_list`} eventKey="3">Access List</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Link href='/'>Go Main</Nav.Link>
                        <Nav.Link target="_blank" href='https://github.com/sefirosweb/laravel-access-list'>GIT HUB</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}