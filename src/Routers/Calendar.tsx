 import { Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import React, { useState } from 'react';
import '../Styles/Calendar.css';
import { useStore } from '../Components/store';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useForm, Controller, set } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface FormData {
    eventTitle: string;
    taskTitle: string;
    taskDescription: string;
}

const Calender = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [openEvent, setOpenEvent] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [viewTask, setViewTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<{ id: number, title: string, description: string } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<{ id: number, title: string} | null>(null);
    const { register, handleSubmit, reset, control, setValue } = useForm<FormData>();
    const addEvent = useStore((state) => state.addEvent);
    const addTask = useStore((state) => state.addTask);
    const updateEvent = useStore((state) => state.updateEvent);
    const updateTask = useStore((state) => state.updateTask);
    const deleteEvent = useStore((state) => state.deleteEvent);
    const deleteTask = useStore((state) => state.deleteTask);
    const events = useStore((state) => state.getEventByDate(selectedDate?.format('YYYY-MM-DD') || ''));
    const tasks = useStore((state) => state.getTaskByDate(selectedDate?.format('YYYY-MM-DD') || ''));

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
    };

    const handleTaskClick = (task: { id:number, title: string, description: string }) => {
        setSelectedTask(task);
        setTaskDialogOpen(true);
        setValue('taskTitle', task.title);
        setValue('taskDescription', task.description);
    };

    const handleEventClick = (event: { id: number, title: string }) => {
        setSelectedEvent(event);
        setEventDialogOpen(true);
        setValue('eventTitle', event.title);

    }

    const onEventSubmit = (data: FormData) => {
        if(selectedEvent) {
            updateEvent({ id: selectedEvent.id, title: data.eventTitle, date: selectedDate?.format('YYYY-MM-DD') || ''});
        }
        else {
            if (selectedDate) {
                addEvent({ id: Math.random(), title: data.eventTitle, date: selectedDate.format('YYYY-MM-DD') });
            }
        }
        reset();
        setOpenEvent(false);
        setEventDialogOpen(false);
        setSelectedEvent(null);
        setValue('eventTitle', '');
    };

    const onTaskSubmit = (data: FormData) => {
        if(selectedTask) {
            updateTask({ id: selectedTask.id, title: data.taskTitle, description: data.taskDescription, date: selectedDate?.format('YYYY-MM-DD') || ''});
        }
        else {
            if (selectedDate) {
                addTask({ id: Math.random(), title: data.taskTitle, description: data.taskDescription, date: selectedDate.format('YYYY-MM-DD') });
            }
        }
        reset();
        setOpenTask(false);
        setTaskDialogOpen(false);
        setSelectedTask(null);
        setValue('taskTitle', '');
        setValue('taskDescription', '');
    };

    const handleDeleteEvent = (id: number) => {
        deleteEvent(id);
    }

    const handleDeleteTask = (id: number) => {
        deleteTask(id);
    }

    const handleEventCancel = () => {
        reset();
        setOpenEvent(false);
        setEventDialogOpen(false);
        setSelectedEvent(null);
        setValue('eventTitle', '');
    }

    const handleTaskCancel = () => {
        reset();
        setOpenTask(false);
        setTaskDialogOpen(false);
        setSelectedTask(null);
    }


    return (
        <div className='total'>
            <Typography variant="h2" className='header'>Calendar</Typography>
            <div className='parts'>
                <div className="part1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar value={selectedDate} onChange={handleDateChange} />
                    </LocalizationProvider>
                </div>
                <div className="part2">
                    <Typography variant="h6" className='header'>Events</Typography>
                    <div className='events'>
                        {events.map((event) => (
                            <div className="event" key={event.id}>
                                <Typography variant='body1'>{event.title}</Typography>
                                <EditOutlinedIcon className='edit' onClick={() => handleEventClick(event)} />
                                <DeleteOutlinedIcon className='delete' onClick={() => handleDeleteEvent(event.id)} />
                            </div>
                        ))}
                    </div>
                    <Button variant="contained" color="primary" className='button' onClick={() => {setOpenEvent(true); setSelectedEvent(null);}}>Add</Button>
                </div>
                <div className="part3">
                    <Typography variant="h6" className='header'>Tasks</Typography>
                    <div className='tasks'>
                        {tasks.map((task) => (
                            <div className="task" key={task.id} >
                                <Typography variant='body1' onClick={() => {setViewTask(true); setSelectedTask(task);}}>{task.title}</Typography>
                                <EditOutlinedIcon className='edit' onClick={() => handleTaskClick(task)} />
                                <DeleteOutlinedIcon className='delete' onClick={() => handleDeleteTask(task.id)} />
                            </div>
                        ))}
                    </div>
                    <Button variant="contained" color="primary" className='button' onClick={() => {setOpenTask(true); setSelectedTask(null);}}>Add</Button>
                </div>
            </div>
            <Dialog open={openEvent || eventDialogOpen} onClose={() => {setOpenEvent(false); setEventDialogOpen(false); }}>
                <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
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
                            <Button onClick={() => handleEventCancel()} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                {selectedEvent ? 'Save' : 'Add'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={openTask || taskDialogOpen} onClose={() =>{ setOpenTask(false); setTaskDialogOpen(false); }}>
                <DialogTitle>{selectedTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
                            <Button onClick={() => handleTaskCancel()} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                {selectedTask ? 'Save' : 'Add'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            {selectedTask && (
                <Dialog open={viewTask} onClose={() => setViewTask(false)}>
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">Description</Typography>
                        <Typography variant="body1">{selectedTask.description}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewTask(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default Calender;