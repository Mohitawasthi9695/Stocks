import React, { useState, useEffect } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowUpCircle } from 'lucide-react';
import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

const NavLeft = () => {
  const windowSize = useWindowSize();
  const [isVisible, setIsVisible] = useState(false);

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'mobile-visible'];
  }

  // Ensure the page is scrollable
  useEffect(() => {
    document.body.style.minHeight = "200vh"; // Make sure the page has enough height to scroll
  }, []);

  // Show/hide Scroll to Top button (for both mobile & desktop)
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      console.log("Scroll position:", scrollTop); // Debugging for mobile
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={'start'}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Calculator
            </Dropdown.Toggle>
            <Dropdown.Menu style={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '5px 0',
              minWidth: '200px'
            }}>
              <Dropdown.Item as={Link} to="/calculator_vertical">
                Vertical Calculator
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/wooden">
                Wooden Calculator
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/length_calculator">
                Length Calculator
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "3vh", // Adjusted for better mobile view
            right: "3vw", // Adjusted for better mobile view
            padding: "12px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            zIndex: 99999, // Ensure it's always on top
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Scroll to Top"
        >
          <ArrowUpCircle size={30} />
        </button>
      )}
    </>
  );
};

export default NavLeft;



// import React, { useState, useEffect } from 'react';
// import { ListGroup, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { ArrowUpCircle } from "react-bootstrap-icons";
// import useWindowSize from '../../../../hooks/useWindowSize';
// import NavSearch from './NavSearch';

// const NavLeft = () => {
//   const windowSize = useWindowSize();
//   let navItemClass = ['nav-item'];
//   if (windowSize.width <= 575) {
//     navItemClass = [...navItemClass, 'mobile-visible'];
//   }

//   const dropdownStyle = {
//     backgroundColor: '#fff',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     padding: '0px 0',
//     minWidth: '200px',
//     paddingLeft: '10px',
//     maxWidth: '200px',
//   };

//   const dropdownItemStyle = {
//     color: '#333',
//     fontWeight: '500',
//     textDecoration: 'none',
//     marginTop: '-30px',
//     paddingTop: '20px',
//     marginBottom: '-10px',
//   };

//   const dropdownItemHover = {
//     backgroundColor: '#f0f0f0'
//   };

//   // Scroll to top logic
//   const [isVisible, setIsVisible] = useState(false);
//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.scrollY > 300) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };

//     window.addEventListener('scroll', toggleVisibility);
//     return () => window.removeEventListener('scroll', toggleVisibility);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
//         <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
//           <Dropdown align={'start'}>
//             <Dropdown.Toggle variant={'link'} id="dropdown-basic">
//               Calculator
//             </Dropdown.Toggle>
//             <Dropdown.Menu style={dropdownStyle}>
//               <Dropdown.Item
//                 as={Link}
//                 to="/calculator_vertical"
//                 style={dropdownItemStyle}
//                 onMouseEnter={e => (e.target.style.backgroundColor = dropdownItemHover.backgroundColor)}
//                 onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
//               >
//                 Vertical Calculator
//               </Dropdown.Item>
//               <Dropdown.Item
//                 as={Link}
//                 to="/wooden"
//                 style={dropdownItemStyle}
//                 onMouseEnter={e => (e.target.style.backgroundColor = dropdownItemHover.backgroundColor)}
//                 onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
//               >
//                 Wooden Calculator
//               </Dropdown.Item>
//               <Dropdown.Item
//                 as={Link}
//                 to="/length_calculator"
//                 style={dropdownItemStyle}
//                 onMouseEnter={e => (e.target.style.backgroundColor = dropdownItemHover.backgroundColor)}
//                 onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
//               >
//                 Length Calculator
//               </Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </ListGroup.Item>
//         <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
//           <NavSearch windowWidth={windowSize.width} />
//         </ListGroup.Item>
//       </ListGroup>

//       <button
//         onClick={scrollToTop}
//         className={`fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-opacity ${
//           isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         aria-label="Scroll to Top"
//       >
//         <ArrowUpCircle size={30} />
//       </button>
//     </React.Fragment>
//   );
// };

// export default NavLeft;
