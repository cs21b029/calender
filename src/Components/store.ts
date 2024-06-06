import { create } from 'zustand';

interface Event{
    id: number;
    title: string;
    date: string;
}

interface Task{
    id: number;
    title: string;
    description: string;
    date: string;
}

interface State{
    events: Event[];
    tasks: Task[];
    addEvent: (event: Event) => void;
    addTask: (task: Task) => void;
    getEventByDate: (date: string) => Event[];
    getTaskByDate: (date: string) => Task[];
}

export const useStore = create<State>((set, get) => ({
    events: [],
    tasks: [],
    addEvent: (event: Event) => set((state) => ({events: [...state.events, event]})),
    addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
    getEventByDate: (date: string) => get().events.filter((event) => event.date === date),
    getTaskByDate: (date: string) => get().tasks.filter((task) => task.date === date)
}))