"use client";

import FullCalendar from "@fullcalendar/react";
import { EventResizeDoneArg, EventDragStopArg } from '@fullcalendar/interaction';
import type { DateSelectArg } from '@fullcalendar/core';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr'; // Importer la locale française
import { useRef, useState, useEffect } from "react";
import { getDatesOfWeek, formatHour } from "../lib/utils";
import { setAvailability } from "@/app/lib/data";
import { TrashIcon } from '@heroicons/react/24/outline';
import uuid from 'react-uuid';
import { CalendarProps, CalendarEvent, CalendarEventResize } from "@/app/lib/definitions";

/*
  Renvoyer tous les créneaux de disponibilité de l'intervenant en divisant par semaine
*/

const Calendar = ({id , availability }: CalendarProps) => {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState<{ id: string, title: string, start: string, end: string }[]>([]);

    useEffect(() => {
        console.log('Les events ont changé :', events);
        // Force une logique qui utilise les nouveaux events (si besoin)
    }, [events]);

    const createEvents = (year: number, week: number, slot: { days: string[], from: string, to: string }, isDefault: boolean): void => {
        const weekDates = getDatesOfWeek(year, week);
        const title = isDefault ? 'Defaut' : 'Disponibilité' ;
        const newEvents: { id: string, title: string, start: string, end: string }[] = [];

        if(slot.days.includes('lundi')) {
          newEvents.push({
            id: uuid(),
            title: title,
            start: `${weekDates[1]}T${slot.from}:00`,
            end: `${weekDates[1]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mardi')) {
          newEvents.push({
            id: uuid(),
            title: title,
            start: `${weekDates[2]}T${slot.from}:00`,
            end: `${weekDates[2]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mercredi')) {
          newEvents.push({
            id: uuid(),
            title: title,
            start: `${weekDates[3]}T${slot.from}:00`,
            end: `${weekDates[3]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('jeudi')) {
          newEvents.push({
            id: uuid(),
            title: title,
            start: `${weekDates[4]}T${slot.from}:00`,
            end: `${weekDates[4]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('vendredi')) {
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
      const year = [2024, 2025];
      const processedWeeks = new Set();
      const ignoreWeeks = [27, 28, 29, 30, 31, 32, 33, 34, 35, 52, 1];

      if (availability) {
        for (const field in availability) {
          const week = parseInt(field);
          if(week && !processedWeeks.has(week)){
            processedWeeks.add(week);
            for (const slot of availability[field]) {
              if( 36 <= week && week <= 52){
                createEvents(year[0], week, slot, false);
              }
              else if (1 <= week && week <= 35){
                createEvents(year[1], week, slot, false);
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
                  createEvents(year[0], i, slot, true);
                }
                else if (1 <= i && i <= 35){
                  createEvents(year[1], i, slot, true);
                }
              }
            }
          }
        }
      }
    }, [availability]);

  // Gestion de la création d'un nouvel événement
  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    const newEvent = {
      id: uuid(),
      title: 'Disponibilité', // Titre de l'événement
      start: selectInfo.startStr, // Date de début
      end: selectInfo.endStr, // Date de fin
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    try {
      const res = await setAvailability(id, updatedEvents);
      
      if (!res) {
        console.log('Availability not updated');
      } else {
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }

    selectInfo.view.calendar.unselect(); // Désélectionner après l'ajout
  };

  const handleEventClick = async (clickInfo: CalendarEventResize) => {
      const updatedEvents = events.filter(event => event.id !== clickInfo.event.id);
      setEvents(updatedEvents);
  
      try {
        const res = await setAvailability(id, updatedEvents);

        if (!res) {
          console.log('Availability not updated');
        } 
      } catch (error) {
        console.error('Error updating availability:', error);
      }
  };

  const handleEventResize = async (resizeInfo: EventResizeDoneArg) => {
    const updatedEvents = events.map(event =>
      event.id === resizeInfo.event.id
       ? {
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

  const handleEventDrop = async (dropInfo : EventDragStopArg) => {
    const updatedEvents = events.map(event =>
      event.id === dropInfo.event.id
      ? {
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

  function eventContent(event: CalendarEvent) {
    return (
      <div className="flex justify-between p-1">
        <p className="hidden">{event.title}</p>
        <p>{formatHour(event.startStr) + " - " + formatHour(event.endStr)}</p>
        <button onClick={() => handleEventClick({ event })} className="bg-red-500 h-6 w-6 p-1 rounded-sm"> <TrashIcon/> </button>
      </div>
    );
  }

  useEffect(() => {
      console.log("Events mis à jour :", events);
  }, [events]);

  return (
    <FullCalendar
      ref={calendarRef}
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
      allDaySlot={false}
    />
  );
}

export default Calendar;