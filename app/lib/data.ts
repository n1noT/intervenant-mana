"use server";

import { formatHour, formatDay } from './utils';
import { db } from '@/app/lib/db';
import { Intervenant } from '@/app/lib/definitions';
import moment from 'moment';
import 'moment-timezone';

const ITEMS_PER_PAGE = 5;

export async function fetchIntervenants(): Promise<Intervenant[]> {
  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.creationdate,
        intervenant.enddate,
      FROM intervenant`);
    client.release();
    return result.rows as Intervenant[];
  } catch (error) {
    throw new Error(`Failed to fetch intervenants: ${error}`);
  }
}

export async function fetchIntervenantsPages(query: string): Promise<number> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT COUNT(*) FROM intervenant');
    client.release();
    return Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    throw new Error(`Failed to fetch intervenants pages: ${error}`);
  }
}

export async function fetchFilteredIntervenants(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await db.connect();
    const queryText = `
      SELECT
        intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.creationdate,
        intervenant.enddate
      FROM intervenant
      WHERE
        intervenant.firstname ILIKE $1 OR
        intervenant.lastname ILIKE $1 OR
        intervenant.email ILIKE $1 OR
        intervenant.key ILIKE $1
      ORDER BY intervenant.firstname ASC
      LIMIT $2 OFFSET $3
    `;
    const queryValues = [`%${query}%`, ITEMS_PER_PAGE, offset];
    const result = await client.query(queryText, queryValues);

    client.release();
    return result.rows as Intervenant[];

  } catch (error) {
    throw new Error('Failed to fetch intervenants.');
  }
}

export async function fetchIntervenantById (id: string) {
  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT intervenant.id,
        intervenant.email,
        intervenant.firstname,
        intervenant.lastname,
        intervenant.key,
        intervenant.enddate
      FROM intervenant
      WHERE intervenant.id = $1`, [id]);
    client.release();
    return result.rows[0] as Intervenant;
  } catch (error) {
    throw new Error(`Failed to fetch intervenant: ${error}`);
  }
}

export async function fetchIntervenantByKey(key: string) {
  try {
    const client = await db.connect();
    const result = await client.query(`SELECT * FROM intervenant WHERE key = $1`, [key]);
    client.release();

    if (result.rows.length > 0) {
      const intervenant = result.rows[0];

      if (intervenant.enddate < new Date()) {
        throw new Error('key expired.');
      } else {
        return intervenant;
      }
    } else {
      throw new Error('Intervenant not found.');
    }
  } catch (error) {
    if(error.message === 'key expired.') {
      throw new Error('expired');
    }
    throw new Error('Database Error: Failed to find intervenant by key.');
  }
}

export async function fetchAvailabilityById(id: string) {
  try {
    const client = await db.connect();
    const result = await client.query(`SELECT intervenant.availability FROM intervenant WHERE intervenant.id = $1`, [id]);
    client.release();

    if (result.rows.length > 0) {
      const intervenant = result.rows[0].availability;

      if (intervenant.enddate < new Date()) {
        throw new Error('key expired.');
      } else {
        return intervenant;
      }
    } else {
      throw new Error('Intervenant not found.');
    }
  } catch (error) {
    if(error.message === 'key expired.') {
      throw new Error('expired');
    }
    throw new Error('Database Error: Failed to find intervenant by key.');
  }
}

export async function setAvailability(id:int, events) {
  // Initialise le tableau de disponilbilités 
  const formatedEvents = [];

  // Formate les disponibilités pour simplifier le futur tri
  for(let event of events){
    if(event.title !== "Defaut") {
      let formatedEvent = {
        week: 0,
        day: "",
        from: "",
        to: ""
      }

      formatedEvent.week = moment(event.start).week();
      formatedEvent.day = formatDay(event.start);
      formatedEvent.from = formatHour(event.start);
      formatedEvent.to = formatHour(event.end);

      formatedEvents.push(formatedEvent);
    } else {
      let formatedEvent = {
        week: "default",
        day: "",
        from: "",
        to: ""
      }

      formatedEvent.day = formatDay(event.start);
      formatedEvent.from = formatHour(event.start);
      formatedEvent.to = formatHour(event.end);

      formatedEvents.push(formatedEvent);
    }
  }

  // Initialise l'objet availability
  const availability = {};

  // Trie les disponibilités par semaine dans les dispo formatés
  for (let fe of formatedEvents) {
    // Verifie si la semaine exsite déjà dans l'objet availability
    if (!availability[fe.week]) {
      availability[fe.week] = [];
      // Ajoute le premier créneau
      availability[fe.week].push({
        days: fe.day,
        from: fe.from,
        to: fe.to
      });
    } 
    // Si la semaine existe déjà, on vérifie si un créneau similaire mais avec un jour différent existe déjà exitste
    else if (availability[fe.week].some((slot) => slot.from === fe.from && slot.to === fe.to && !slot.days.includes(fe.day))) {
      availability[fe.week].find((slot) => slot.from === fe.from && slot.to === fe.to).days += `, ${fe.day}`;
    } else if (availability[fe.week].some((slot) => slot.from === fe.from && slot.to === fe.to && slot.days.includes(fe.day))) {
      continue;
    }
    // Sinon on ajoute le créneau à la semaine
    else {
      availability[fe.week].push({
        days: fe.day,
        from: fe.from,
        to: fe.to
      });
    }
  }
  
  // Insert availability into the database
  try {
    const json = JSON.stringify(availability);
    const client = await db.connect();
    const result = await client.query(`
      UPDATE intervenant
      SET availability = $1
      WHERE id = $2
    `, [json, id]);
    client.release();

    return true;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Update Intervenant: ' + error,
    };
  }
}

export async function setDefaultAvailability(id:int, events) {
  let availability = {};
  // Insert availability into the database
  try {
    const client = await db.connect();
    const previousAvailability = await client.query(`
      SELECT availability FROM intervenant
      WHERE id = $1
    `, [id]);
    client.release();

    if (previousAvailability.rows.length !== 0 && previousAvailability.rows[0].availability !== null) {
      availability = previousAvailability.rows[0].availability;
    }
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Update Intervenant: ' + error,
    };
  }
  // Initialise le tableau de disponilbilités 
  const formatedEvents = [];

  // Formate les disponibilités pour simplifier le futur tri
  for(let event of events){
    let formatedEvent = {
      week: "default",
      day: "",
      from: "",
      to: ""
    }

    formatedEvent.day = formatDay(event.start);
    formatedEvent.from = formatHour(event.start);
    formatedEvent.to = formatHour(event.end);

    formatedEvents.push(formatedEvent);
  }

  if(availability["default"]){
    availability["default"] = [];
  }

  // Trie les disponibilités par semaine dans les dispo formatés
  for (let fe of formatedEvents) {
    // Verifie si la semaine exsite déjà dans l'objet availability
    if (!availability[fe.week]) {
      availability[fe.week] = [];
      // Ajoute le premier créneau
      availability[fe.week].push({
        days: fe.day,
        from: fe.from,
        to: fe.to
      });
    } 
    // Si la semaine existe déjà, on vérifie si un créneau similaire mais avec un jour différent existe déjà exitste
    else if (availability[fe.week].some((slot) => slot.from === fe.from && slot.to === fe.to && !slot.days.includes(fe.day))) {
      availability[fe.week].find((slot) => slot.from === fe.from && slot.to === fe.to).days += `, ${fe.day}`;
    } else if (availability[fe.week].some((slot) => slot.from === fe.from && slot.to === fe.to && slot.days.includes(fe.day))) {
      continue;
    }
    // Sinon on ajoute le créneau à la semaine
    else {
      availability[fe.week].push({
        days: fe.day,
        from: fe.from,
        to: fe.to
      });
    }
  }
  
  // Insert availability into the database
  try {
    const json = JSON.stringify(availability);
    const client = await db.connect();
    const result = await client.query(`
      UPDATE intervenant
      SET availability = $1
      WHERE id = $2
    `, [json, id]);
    client.release();

    return true;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Update Intervenant: ' + error,
    };
  }
}