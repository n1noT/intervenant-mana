"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr'; // Importer la locale française
import { useRef, useState, useEffect } from "react";
import { getDatesOfWeek, formatHour, formatDay } from "../lib/utils";
import { setDefaultAvailability } from "@/lib/data";
import { TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import uuid from 'react-uuid';

/*
  Entrer les disponibilités par défaut
*/

const DefaultCalendar = ({ id, availability }) => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);

  const createEvents = (year: number, week: number, slot: { days: string[], from: string, to: string }): void => {
    const weekDates = getDatesOfWeek(year, week);
    const title = 'Defaut';
    const newEvents = [];

    if (slot.days.includes('lundi')) {
      newEvents.push({
        id: uuid(),
        title: title,
        start: `${weekDates[1]}T${slot.from}:00`,
        end: `${weekDates[1]}T${slot.to}:00`
      });
    }
    if (slot.days.includes('mardi')) {
      newEvents.push({
        id: uuid(),
        title: title,
        start: `${weekDates[2]}T${slot.from}:00`,
        end: `${weekDates[2]}T${slot.to}:00`
      });
    }
    if (slot.days.includes('mercredi')) {
      newEvents.push({
        id: uuid(),
        title: title,
        start: `${weekDates[3]}T${slot.from}:00`,
        end: `${weekDates[3]}T${slot.to}:00`
      });
    }
    if (slot.days.includes('jeudi')) {
      newEvents.push({
        id: uuid(),
        title: title,
        start: `${weekDates[4]}T${slot.from}:00`,
        end: `${weekDates[4]}T${slot.to}:00`
      });
    }
    if (slot.days.includes('vendredi')) {
      newEvents.push({
        id: uuid(),
        title: title,
        start: `${weekDates[5]}T${slot.from}:00`,
        end: `${weekDates[5]}T${slot.to}:00`
      });
    }

    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  };

  useEffect(() => {
    if (availability) { // Vérification si les événements ont déjà été créés
      if (availability['default']) {
        for (const slot of availability['default']) {
          createEvents(moment().year(), moment().week(), slot);
        }
      }
    }
  }, [availability]); 

  // Gestion de la création d'un nouvel événement
  const handleDateSelect = async (selectInfo) => {
    const newEvent = {
      id: uuid(),
      title: 'Defaut', // Titre de l'événement
      start: selectInfo.startStr, // Date de début
      end: selectInfo.endStr, // Date de fin
    };

    const updatedEvents = [...events, newEvent];

    try {
      const res = await setDefaultAvailability(id, updatedEvents);

      if (!res) {
        console.log(res);
      } else {
        console.log(res);
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }

    selectInfo.view.calendar.unselect(); // Désélectionner après l'ajout
  };

  const handleEventClick = async (clickInfo) => {
    clickInfo.event.remove();
    const updatedEvents = events.filter(event => event.id !== clickInfo.event.id);

    try {
      const res = await setDefaultAvailability(id, updatedEvents);

      if (!res) {
        console.log('Availability not updated');
      } else {
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleEventResize = async (resizeInfo) => {
    const updatedEvents = events.map(event =>
      event.id === resizeInfo.event.id ? {
        ...event,
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr
      } : event
    );

    setEvents(updatedEvents);

    try {
      const res = await setDefaultAvailability(id, updatedEvents);

      if (!res) {
        console.log('Availability not updated');
      } else {
        console.log('Availability updated');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleEventDrop = async (dropInfo) => {
    const updatedEvents = events.map(event =>
      event.id === dropInfo.event.id ? {
        ...event,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr
      } : event
    );

    setEvents(updatedEvents);

    try {
      const res = await setDefaultAvailability(id, updatedEvents);

      if (!res) {
        console.log('Availability not updated');
      } else {
        console.log('Availability updated');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  function eventContent({ event }) {
    return (
      <div className="flex justify-between p-1">
        <p>{formatHour(event.startStr) + " - " + formatHour(event.endStr)}</p>
        <button onClick={() => handleEventClick({ event })} className="bg-red-500 h-6 w-6 p-1 rounded-sm"> <TrashIcon /> </button>
      </div>
    );
  }

  return (
    <FullCalendar
      innerRef={calendarRef}
      plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
      initialView="timeGridWeek" // Vue par défaut : semaine
      locales={[frLocale]} // Ajouter la locale française
      locale="fr" // Configurer la langue par défaut en français
      headerToolbar={{
        start: '', // Boutons à gauche
        center: 'Disponibilité par défaut', // Titre au centre
        end: ''
      }}
      editable
      selectable
      events={events}
      select={handleDateSelect} // Gérer la sélection
      eventContent={eventContent}
      eventResize={handleEventResize}
      eventDrop={handleEventDrop}
      weekends={false}
      allDaySlot={false} // Enlever l'affichage de toute la journée
    />
  );
}

export default DefaultCalendar;