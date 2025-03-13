import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

const NavLeft = () => {
  const windowSize = useWindowSize();

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'mobile-visible'];
  }

  const dropdownStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '0px 0',
    minWidth: '200px',
    paddingLeft: '10px',
    maxWidth: '200px',
    
  };

  const dropdownItemStyle = {
    color: '#333',
    fontWeight: '500',
    textDecoration: 'none',
    marginTop: '-30px',
    paddingTop: '20px',
    marginBottom: '-10px'
  };


  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={'start'}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Calculator
            </Dropdown.Toggle>
            <Dropdown.Menu style={dropdownStyle}>
              <Dropdown.Item
                as={Link}
                to="/calculator_vertical"
                style={dropdownItemStyle}
                onMouseEnter={e => e.target.style.backgroundColor = dropdownItemHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Vertical Calculator
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/wooden"
                style={dropdownItemStyle}
                onMouseEnter={e => e.target.style.backgroundColor = dropdownItemHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Wooden Calculator
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/length_calculator"
                style={dropdownItemStyle}
                onMouseEnter={e => e.target.style.backgroundColor = dropdownItemHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Length Calculator
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
