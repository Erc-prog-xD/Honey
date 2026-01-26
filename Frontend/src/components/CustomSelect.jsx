import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/CustomSelect.css';

const CustomSelect = ({ options, value, onChange, placeholder = "Selecione uma opção" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Encontrar a label da opção selecionada
    const selectedOption = options.find(opt => opt.value === value);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-container" ref={selectRef}>
            <div className={`custom-select-trigger ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <div className="custom-select-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="custom-select-dropdown">
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className={`custom-option ${value === option.value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
