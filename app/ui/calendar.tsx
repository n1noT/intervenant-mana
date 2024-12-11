"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRef } from "react";
import { getDatesOfWeek } from "../lib/utils";

/*
  Renvoyer tous les créneaux de disponibilité de l'intervenant en divisant par semaine
*/

const Calendar = ({ availability }) => {
    const calendarRef = useRef(null);
    const year = [2024, 2025]

    let events = [];
    // Ignore les vacances d'été et de Noël par défaut
    let ignoreWeeks = [27, 28, 29, 30, 31, 32, 33, 34, 35];


    const createEvents = (year: number, week: number, slot: { days: string[], from: string, to: string }): void => {
        const weekDates = getDatesOfWeek(year, week);
        const title = 'Disponibilité';

        if(slot.days.includes('lundi')) {
          events.push({
            title: title,
            start: `${weekDates[1]}T${slot.from}:00`,
            end: `${weekDates[1]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mardi')) {
          events.push({
            title: title,
            start: `${weekDates[2]}T${slot.from}:00`,
            end: `${weekDates[2]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('mercredi')) {
          events.push({
            title: title,
            start: `${weekDates[3]}T${slot.from}:00`,
            end: `${weekDates[3]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('jeudi')) {
          events.push({
            title: title,
            start: `${weekDates[4]}T${slot.from}:00`,
            end: `${weekDates[4]}T${slot.to}:00`
          });
        }
        if(slot.days.includes('vendredi')) {
          events.push({
            title: title,
            start: `${weekDates[5]}T${slot.from}:00`,
            end: `${weekDates[5]}T${slot.to}:00`
          });
      }
    };

    if (availability) {
      for (let field in availability) {
        let week = parseInt(field);
        if(week){
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
            if(!ignoreWeeks.includes(i)){
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
    };

  return (
    <FullCalendar
    innerRef={calendarRef}
    plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
    initialView="timeGridWeek" // Vue par défaut : semaine
    headerToolbar={{
      start: 'prev,next today', // Boutons à gauche
      center: 'title', // Titre au centre
      end: 'dayGridMonth,timeGridWeek', // Vues disponibles à droite
    }}
    editable
    selectable
    events={events}
    weekNumbers={true}
    weekends={false}
  />
  );
}

export default Calendar;