// SearchableDropdown.js
import React, { useState } from 'react';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap styles

const SearchableDropdown = ({ label, options, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on the search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option) => {
    onChange(option.value); // Update parent state with selected option
    setSearchTerm(''); // Clear search term on select
    setIsOpen(false);
  };

  return (
    <Dropdown onToggle={() => setIsOpen(!isOpen)} show={isOpen}>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="w-100">
        {value ? value : label}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
          />
        </InputGroup>
        {filteredOptions.length > 0 ? (
          filteredOptions.slice(0, 10).map(option => (
            <Dropdown.Item
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No options found</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SearchableDropdown;
