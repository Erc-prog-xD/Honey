import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/css/CustomCalendar.css';

const CustomCalendar = ({ value, onChange, ...props }) => {
    return (
        <div className="custom-calendar-wrapper">
            <Calendar
                onChange={onChange}
                value={value}
                locale="pt-BR"
                className="hf-calendar"
                {...props}
            />
        </div>
    );
};

export default CustomCalendar;
