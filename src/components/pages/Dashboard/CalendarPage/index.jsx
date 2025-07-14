import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '@/services/api/axios';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Gọi API lấy tasks dạng calendar
    api.get('/tasks/my-tasks/calendar').then(res => setEvents(res.data.data));
  }, []);

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events.map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
          resource: task,
          allDay: true,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        eventPropGetter={event => ({
          style: { backgroundColor: event.resource.color }
        })}
        // Thêm các props khác cho popup, tooltip, v.v.
      />
    </div>
  );
}
