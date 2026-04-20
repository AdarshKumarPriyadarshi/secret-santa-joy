import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Axios instance with a sensible timeout so the UI can fail fast when backend is down.
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5s; adjust if your backend is slower to respond
});

/* =====================================================
   SECRET SANTA PAIR GENERATOR
===================================================== */
export async function generatePairs(names: string[]) {
  try {
    const response = await api.post(`/pair`, { names });
    return response.data.pairs;
  } catch (error) {
    console.error("Generate Pairs Error:", error);
    return [];
  }
}

/* =====================================================
   GLOBAL EVENTS (Events Menu)
===================================================== */
export async function fetchEvents() {
  try {
    const response = await api.get(`/events`);
    return response.data; // backend returns array directly
  } catch (error) {
    console.error("Fetch Events Error:", error);
    return [];
  }
}


export async function createEvent(eventData: any) {
  try {
    const response = await api.post(`/events`, eventData);
    return response.data.event;
  } catch (error) {
    console.error("Create Event Error:", error);
    return null;
  }
}

/* =====================================================
   ORGANIZATIONS
===================================================== */
export async function fetchOrganizations() {
  try {
    const response = await api.get(`/organizations`);
    return response.data.organizations ?? [];
  } catch (error) {
    console.error("Fetch Organizations Error:", error);
    return [];
  }
}

export async function createOrganization(orgData: any) {
  try {
    const response = await api.post(`/organizations`, orgData);
    return response.data.organization;
  } catch (error) {
    console.error("Create Organization Error:", error);
    return null;
  }
}

export async function fetchOrganizationById(id: string) {
  try {
    const response = await api.get(`/organizations/${id}`);
    return response.data.organization ?? null;
  } catch (error) {
    console.error("Fetch Organization Error:", error);
    return null;
  }
}

/* =====================================================
   ORGANIZATION MEMBERS
===================================================== */
export async function fetchMembers(orgId: string) {
  try {
    const response = await api.get(`/organizations/${orgId}/members`);
    return response.data.members ?? [];
  } catch (error) {
    console.error("Fetch Members Error:", error);
    return [];
  }
}

export async function addMember(orgId: string, member: any) {
  try {
    const response = await api.post(`/organizations/${orgId}/members`, member);
    return response.data.members ?? [];
  } catch (error) {
    console.error("Add Member Error:", error);
    return null;
  }
}

/* =====================================================
   ORGANIZATION EVENTS
===================================================== */
export async function fetchEventsByOrganization(orgId: string) {
  try {
    const response = await api.get(`/organizations/${orgId}/events`);
    // Backend returns an array directly
    return response.data ?? [];
  } catch (error) {
    console.error("Fetch Org Events Error:", error);
    return [];
  }
}

export async function createEventForOrganization(
  orgId: string,
  payload: {
    name: string;
    date: string;
    participants: number;
  }
) {
  try {
    const res = await axios.post(
      `${API_URL}/organizations/${orgId}/events`, // ✅ THIS IS THE KEY
      payload
    );

    return res.data.event;
  } catch (error: any) {
    console.error("Create Org Event Error:", error?.response?.data || error);
    return null;
  }
}





/* =====================================================
   OPTIONAL — UNIFIED EVENTS (Global + Org)
   (Use only if backend not unified)
===================================================== */
export async function fetchAllEventsUnified() {
  try {
    const globalEvents = await fetchEvents();
    const organizations = await fetchOrganizations();

    const orgEvents: any[] = [];

    for (const org of organizations) {
      const events = await fetchEventsByOrganization(org.id);
      events.forEach((e: any) => {
        orgEvents.push({
          ...e,
          org: org.name,
          status: "active",
        });
      });
    }

    return [...globalEvents, ...orgEvents];
  } catch (error) {
    console.error("Fetch Unified Events Error:", error);
    return [];
  }
}

/* =====================================================
   ASSIGNMENTS
===================================================== */

export async function saveAssignments(eventId: string, pairs: any[]) {
  try {
    const response = await api.post(
      `/events/${eventId}/assignments`,
      pairs
    );
    return response.data;
  } catch (error) {
    console.error("Save Assignments Error:", error);
    return null;
  }
}

export async function fetchMyAssignment(
  eventId: string,
  giverId: string
) {
  try {
    const response = await api.get(
      `/events/${eventId}/assignments/${giverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Fetch Assignment Error:", error);
    return null;
  }
}

export async function fetchEventAssignments(eventId: string) {
  try {
    const response = await api.get(`/events/${eventId}/assignments`);
    return response.data ?? [];
  } catch (error) {
    console.error("Fetch Event Assignments Error:", error);
    return [];
  }
}
