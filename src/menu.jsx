import React from 'react';
import { useSelector } from 'react-redux';  // Assuming you're using Redux for state management
import menuItems from './menu-items';  // Import your menu items

const Menu = () => {
  const currentUserRole = useSelector(state => state.user.role);  // Get the current user's role

  // Function to filter menu items based on the user's role
  const filterMenuItems = (items) => {
    return items
      .map(item => {
        // Check if current user role is allowed for this item
        const isAllowed = item.allowedRoles.includes(currentUserRole);

        // If the item has children, filter them as well
        if (item.children && item.children.length > 0) {
          item.children = filterMenuItems(item.children);  // Recursively filter children
        }

        // Return item if allowed, or null if not
        return isAllowed ? item : null;
      })
      .filter(item => item !== null);  // Remove any null items
  };

  // Apply filtering to the menu items
  const filteredMenuItems = filterMenuItems(menuItems.items);

  console.log("Filtered Menu Items:", filteredMenuItems);  // Check which items are visible for the role

  return (
    <div>
      {filteredMenuItems.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          {item.children && item.children.length > 0 && (
            <div>
              {item.children.map(child => (
                <div key={child.id}>
                  <a href={child.url}>{child.title}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
