"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr'; // Importer la locale française
import { useRef, useState, useEffect } from "react";
import { getDatesOfWeek, formatHour, formatDay } from "../lib/utils";
import { setAvailability } from "@/lib/data";
import { TrashIcon } from '@heroicons/react/24/outline';

/*
  Renvoyer tous les créneaux de disponibilité de l'intervenant en divisant par semaine
*/

const Calendar = ({id , availability }) => {
    const calendarRef = useRef(null);
    const year = [2024, 2025];
    const [events, setEvents] = useState([]);
    const processedWeeks = new Set();

    // Ignore les vacances d'été et de Noël par défaut
    let ignoreWeeks = [27, 28, 29, 30, 31, 32, 33, 34, 35, 52, 1];

    const createEvents = (year: number, week: number, slot: { days: string[], from: string, to: string }): void => {
        const weekDates = getDatesOfWeek(year, week);
        const title = 'Disponibilité';
        const newEvents = [];

        if(slot.days.includes('lundi')) {
          newEvents.push({
            title: title,
            start: `${weekDates[1]}T${slot.from}:00`,
            end: `${weekDates[1]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mardi')) {
          newEvents.push({
            title: title,
            start: `${weekDates[2]}T${slot.from}:00`,
            end: `${weekDates[2]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mercredi')) {
          newEvents.push({
            title: title,
            start: `${weekDates[3]}T${slot.from}:00`,
            end: `${weekDates[3]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('jeudi')) {
          newEvents.push({
            title: title,
            start: `${weekDates[4]}T${slot.from}:00`,
            end: `${weekDates[4]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('vendredi')) {
          newEvents.push({
            title: title,
            start: `${weekDates[5]}T${slot.from}:00`,
            end: `${weekDates[5]}T${slot.to}:00`
          });
        }

        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    };

    useEffect(() => {
      if (availability) {
        for (let field in availability) {
          let week = parseInt(field);
          if(week && !processedWeeks.has(week)){
            processedWeeks.add(week);
            for (const slot of availability[field]) {
              if( 36 <= week && week <= 52){
                createEvents(year[0], week, slot);
              }
              else if (1 <= week && week <= 35){
                createEvents(year[1], week, slot);
              }
            }
            
            ignoreWeeks.push(week);
          } 
        }

        if(availability['default']){
          for (const slot of availability['default']) {
            for (let i = 1; i <= 52; i++) {
              if(!ignoreWeeks.includes(i) && !processedWeeks.has(i)){
                processedWeeks.add(i);
                if( 36 <= i && i <= 52){
                  createEvents(year[0], i, slot);
                }
                else if (1 <= i && i <= 35){
                  createEvents(year[1], i, slot);
                }
              }
            }
          }
        }
      }
    }, [availability]);

  // Gestion de la création d'un nouvel événement
  const handleDateSelect = async (selectInfo) => {
    const newEvent = {
      title: 'Disponibilité', // Titre de l'événement
      start: selectInfo.startStr, // Date de début
      end: selectInfo.endStr, // Date de fin
    };

    const updatedEvents = [...events, newEvent];
    
    try {
      const res = await setAvailability(id, updatedEvents);
      
      if (!res) {
        console.log('Availability not updated');
      } else {
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }

    selectInfo.view.calendar.unselect(); // Désélectionner après l'ajout
  };

  const handleEventClick = async (clickInfo) => {
      clickInfo.event.remove();
      const updatedEvents = events.filter(event => event.start !== clickInfo.event.startStr.split('+')[0]);
  
      try {
        const res = await setAvailability(id, updatedEvents);

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
      event.start === resizeInfo.event.startStr.split('+')[0] ? {
        ...event,
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr
      } : event
    );

    setEvents(updatedEvents);

    try {
      const res = await setAvailability(id, updatedEvents);

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
      event.start === dropInfo.oldEvent.startStr.split('+')[0] ? {
        ...event,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr
      } : event
    );

    setEvents(updatedEvents);

    try {
      const res = await setAvailability(id, updatedEvents);

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
        <button onClick={() => handleEventClick({ event })} className="bg-red-500 h-6 w-6 p-1 rounded-sm"> <TrashIcon/> </button>
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
        start: 'prev,next today', // Boutons à gauche
        center: 'title', // Titre au centre
        end: 'dayGridMonth,timeGridWeek', // Vues disponibles à droite
      }}
      editable
      selectable
      events={events}
      select={handleDateSelect} // Gérer la sélection
      eventContent={eventContent}
      eventResize={handleEventResize}
      eventDrop={handleEventDrop}
      weekNumbers={true}
      weekends={false}
    />
  );
}

export default Calendar;