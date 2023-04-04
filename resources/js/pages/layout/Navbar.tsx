import React, { useEffect } from 'react'
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { APP_PREFIX } from '@/types/configurationType';
import NavLink from '@/components/NavLink';
import { GB, ES } from 'country-flag-icons/react/3x2'
import { useTranslation } from 'react-i18next';
import { i18nInstance as i18nInstanceCrud } from '@sefirosweb/react-crud'

const langs = {
    'en': <GB title='English' style={{ width: '32px' }} />,
    'es': <ES title='English' style={{ width: '32px' }} />,
}

export default () => {
    // useEffect(() => {
    //     i18nInstanceCrud.changeLanguage('es').then((t) => {
    //         console.log('changed')
    //         console.log({ t })
    //     })
    // }, [])
    const { i18n } = useTranslation()

    const handleChangeLang = (lang: string) => {
        i18n.changeLanguage(lang)
        i18nInstanceCrud.changeLanguage(lang)
    }

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
                        <NavDropdown title={langs[i18n.language]} id="nav-dropdown">
                            <NavDropdown.Item eventKey="en" onClick={() => handleChangeLang('en')}>{langs.en} English</NavDropdown.Item>
                            <NavDropdown.Item eventKey="es" onClick={() => handleChangeLang('es')}>{langs.es} Español</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href='/'>Go Main</Nav.Link>
                        <Nav.Link target="_blank" href='https://github.com/sefirosweb/laravel-access-list'>GIT HUB</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}