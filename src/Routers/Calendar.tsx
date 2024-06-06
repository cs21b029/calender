import { Typography, Button } from '@mui/material'
import React from 'react'
import '../Styles/Calendar.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Calender = () => {
  return (
    <div className='total'>
        <Typography variant="h2" className='header'>Calendar</Typography>
        <div className='parts'>
            <div className="part1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar />
                </LocalizationProvider>
            </div>
            <div className="part2">
                <Typography variant="h6" className='header'>Events</Typography>
                <div className='events'>
                    <Typography variant="body1">Event 1</Typography>
                    <Typography variant="body1">Event 2</Typography>
                    <Typography variant="body1">Event 3</Typography>
                    <Typography variant="body1">Event 4</Typography>
                    <Typography variant="body1">Event 5</Typography>
                </div>
                <Button variant="contained" color="primary" className='button'>Add</Button>

            </div>
            <div className="part3">
                <Typography variant="h6" className='header'>Tasks</Typography>
                <div className='tasks'>
                    <Typography variant="body1">Task 1</Typography>
                    <Typography variant="body1">Task 2</Typography>
                    <Typography variant="body1">Task 3</Typography>
                    <Typography variant="body1">Task 4</Typography>
                    <Typography variant="body1">Task 5</Typography>
                </div>
                <Button variant="contained" color="primary" className='button'>Add</Button>

            </div>
        </div>

    </div>
  )
}

export default Calender
