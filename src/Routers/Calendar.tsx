import { Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'
import React, { useState } from 'react'
import '../Styles/Calendar.css'
import { useStore } from '../Components/store';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useForm, Controller } from 'react-hook-form';
import dayjs, {Dayjs} from 'dayjs';

interface FormData{
    eventTitle: string;
    taskTitle: string;
    taskDescription: string;
}

const Calender = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [openEvent, setOpenEvent] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [taskDialogOpen, setTaskDialopOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<{title: string, description: string} | null>(null);
    const {register, handleSubmit, reset, control} = useForm<FormData>();
    const addEvent = useStore((state) => state.addEvent);
    const addTask = useStore((state) => state.addTask);
    const events = useStore((state) => state.getEventByDate(selectedDate?.format('YYYY-MM-DD') || ''));
    const tasks = useStore((state) => state.getTaskByDate(selectedDate?.format('YYYY-MM-DD') || ''));

    const handleTaskClick = (task: {title: string, description: string}) => {
        setSelectedTask(task);
        setTaskDialopOpen(true);
    }

    const onEventSubmit = (data: FormData) => {
        if(selectedDate){
            addEvent({id: Math.random(), title: data.eventTitle, date: selectedDate.format('YYYY-MM-DD')});
        }
        reset();
        setOpenEvent(false);
    }

    const onTaskSubmit = (data: FormData) => {
        if(selectedDate){
            addTask({id: Math.random(), title: data.taskTitle, description: data.taskDescription, date: selectedDate.format('YYYY-MM-DD')});
        }
        reset();
        setOpenTask(false);
    }

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
                    {events.map((event) => (
                        <Typography variant='body1'>{event.title}</Typography>
                    ))}
                </div>
                <Button variant="contained" color="primary" className='button' onClick={() => setOpenEvent(true)}>Add</Button>
            </div>
            <div className="part3">
                <Typography variant="h6" className='header'>Tasks</Typography>
                <div className='tasks'>
                    {tasks.map((task) => (
                        <Typography variant='body1' key={task.id} onClick={() => handleTaskClick(task)}>{task.title}</Typography>
                    ))}
                </div>
                <Button variant="contained" color="primary" className='button' onClick={() => setOpenTask(true)}>Add</Button>
            </div>
        </div>
        <Dialog open={openEvent} onClose={() => setOpenEvent(false)}>
            <DialogTitle>Add Event/Task</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onEventSubmit)}>
                    <Controller
                        name="eventTitle"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                            {...field}
                            margin="dense"
                            label="Event Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            />
                        )}
                    />
                    <DialogActions>
                        <Button onClick={() => setOpenEvent(false)} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
        <Dialog open={openTask} onClose={() => setOpenTask(false)}>
            <DialogTitle>Add Task</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onTaskSubmit)}>
                    <Controller
                        name="taskTitle"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                            {...field}
                            margin="dense"
                            label="Task Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            />
                        )}
                    />
                    <Controller
                        name="taskDescription"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                            {...field}
                            margin="dense"
                            label="Task Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            />
                        )}
                    />
                    <DialogActions>
                        <Button onClick={() => setOpenTask(false)} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
        {selectedTask && (
            <Dialog open={taskDialogOpen} onClose={() => setTaskDialopOpen(false)}>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{selectedTask.description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTaskDialopOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )}
    </div>
  )
}

export default Calender
