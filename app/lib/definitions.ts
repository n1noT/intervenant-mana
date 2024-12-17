export type Intervenant = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  key: string;
  creationdate: string;
  enddate: string;
  availability: { [key: string]: CalendarSlot[] };
};

export type IntervenantForm = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  enddate: string;  
};

export type User = {
  id: string;
  email: string;
  password: string;
};

export type Error = {
  code: string;
  message: string;
  details?: string;
};

export type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export type AvailabilitySlot = {
  days: string;
  from: string;
  to: string;
};

export type Availability = {
  [key: string]: AvailabilitySlot[];
};

export type CalendarSlot = {
  days: string[];
  from: string;
  to: string;
};

export type CalendarProps = {
  id: string;
  availability: { [key: string]: CalendarSlot[] };
};

export type CalendarEvent = {
  id: string;
  title: string;
  startStr: string;
  endStr: string;
  view: {
    calendar: {
      unselect: () => void;
    };
  };
};

export type CalendarEventResize = {
  event: CalendarEvent;
};