import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';

// Popular Frankfurt locations and areas
const FRANKFURT_LOCATIONS = [
  // Main areas
  'Hauptwache, Frankfurt am Main',
  'Römerberg, Frankfurt am Main',
  'Zeil, Frankfurt am Main',
  'Palmengarten, Frankfurt am Main',
  'Bockenheim, Frankfurt am Main',
  'Sachsenhausen, Frankfurt am Main',
  'Nordend, Frankfurt am Main',
  'Westend, Frankfurt am Main',
  'Ostend, Frankfurt am Main',
  'Bornheim, Frankfurt am Main',
  'Höchst, Frankfurt am Main',
  'Gallus, Frankfurt am Main',
  'Fechenheim, Frankfurt am Main',
  'Niederrad, Frankfurt am Main',
  'Oberrad, Frankfurt am Main',
  
  // Popular streets
  'Kaiserstraße, Frankfurt am Main',
  'Berger Straße, Frankfurt am Main',
  'Schweizer Straße, Frankfurt am Main',
  'Leipziger Straße, Frankfurt am Main',
  'Münchener Straße, Frankfurt am Main',
  'Mainzer Landstraße, Frankfurt am Main',
  'Friedberger Landstraße, Frankfurt am Main',
  'Eschersheimer Landstraße, Frankfurt am Main',
  
  // Landmarks
  'Frankfurt Hauptbahnhof',
  'Frankfurt Airport (FRA)',
  'Messe Frankfurt',
  'Goethe University Frankfurt',
  'Commerzbank Tower, Frankfurt',
  'Main Tower, Frankfurt',
  'Alte Oper, Frankfurt',
  'Städel Museum, Frankfurt',
  'Frankfurt Zoo',
  'Deutsche Bank Park, Frankfurt',
  
  // Shopping centers
  'MyZeil, Frankfurt',
  'Skyline Plaza, Frankfurt',
  'Nordwestzentrum, Frankfurt',
  'Hessen Center, Frankfurt',
  
  // Indian restaurants/areas
  'Kaiserstraße (Little India), Frankfurt',
  'Münchener Straße (Indian Shops), Frankfurt'
];

const AddressAutocomplete = ({ value, onChange, placeholder, required, className }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e);

    if (inputValue.length > 1) {
      // Filter suggestions based on input
      const filtered = FRANKFURT_LOCATIONS.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      // Also add custom suggestion with the input
      if (inputValue.length > 3 && !inputValue.toLowerCase().includes('frankfurt')) {
        filtered.unshift(`${inputValue}, Frankfurt am Main`);
      }
      
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const event = {
      target: {
        value: suggestion,
        name: inputRef.current.name
      }
    };
    onChange(event);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="address"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.length > 1 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          className={className}
          autoComplete="off"
        />
        <FiMapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                index === selectedIndex ? 'bg-gray-50' : ''
              } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <FiMapPin className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion}</span>
            </button>
          ))}
          <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
            Press ↑↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;