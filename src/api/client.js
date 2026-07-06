import dbData from '../../db.json';

const BASE_URL = 'http://localhost:5000';

// Check if we are hosted online (e.g. Netlify) where localhost:5000 is unavailable
let useLocalMock = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const initializeLocalStorage = () => {
  if (!localStorage.getItem('erp_leads')) {
    localStorage.setItem('erp_leads', JSON.stringify(dbData.leads || []));
  }
};

const emulateGet = (endpoint, params) => {
  initializeLocalStorage();
  const leads = JSON.parse(localStorage.getItem('erp_leads') || '[]');

  // Check if it's a single lead request (e.g. /leads/1)
  const singleLeadMatch = endpoint.match(/^\/leads\/([a-zA-Z0-9_-]+)$/);
  if (singleLeadMatch) {
    const id = singleLeadMatch[1];
    const lead = leads.find(l => String(l.id) === String(id));
    if (!lead) {
      throw new Error(`Lead with ID ${id} not found`);
    }
    return { data: lead, totalCount: 1 };
  }

  // List request
  let filteredLeads = [...leads];

  // Exact filters
  if (params.status) {
    filteredLeads = filteredLeads.filter(l => l.status === params.status);
  }
  if (params.assignedEmployee) {
    filteredLeads = filteredLeads.filter(l => l.assignedEmployee === params.assignedEmployee);
  }

  // Date filters
  if (params.createdDate_gte) {
    filteredLeads = filteredLeads.filter(l => l.createdDate >= params.createdDate_gte);
  }
  if (params.createdDate_lte) {
    filteredLeads = filteredLeads.filter(l => l.createdDate <= params.createdDate_lte);
  }

  // Full-text search (q)
  if (params.q) {
    const query = params.q.toLowerCase();
    filteredLeads = filteredLeads.filter(l => {
      return (
        (l.name && l.name.toLowerCase().includes(query)) ||
        (l.email && l.email.toLowerCase().includes(query)) ||
        (l.mobile && l.mobile.includes(query)) ||
        (l.address && l.address.toLowerCase().includes(query)) ||
        (l.courseInterested && l.courseInterested.toLowerCase().includes(query)) ||
        (l.leadSource && l.leadSource.toLowerCase().includes(query)) ||
        (l.assignedEmployee && l.assignedEmployee.toLowerCase().includes(query)) ||
        (l.status && l.status.toLowerCase().includes(query))
      );
    });
  }

  const totalCount = filteredLeads.length;

  // Pagination
  if (params._page && params._per_page) {
    const page = parseInt(params._page, 10) || 1;
    const limit = parseInt(params._per_page, 10) || 10;
    const start = (page - 1) * limit;
    filteredLeads = filteredLeads.slice(start, start + limit);
  }

  return { data: filteredLeads, totalCount };
};

const emulatePost = (endpoint, body) => {
  initializeLocalStorage();
  const leads = JSON.parse(localStorage.getItem('erp_leads') || '[]');

  if (endpoint === '/leads') {
    const maxId = leads.reduce((max, l) => Math.max(max, parseInt(l.id, 10) || 0), 0);
    const newId = String(maxId + 1);

    const newLead = {
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      notes: [],
      ...body
    };

    leads.push(newLead);
    localStorage.setItem('erp_leads', JSON.stringify(leads));
    return newLead;
  }
  
  throw new Error(`Endpoint ${endpoint} not supported in local mock POST`);
};

const emulatePatch = (endpoint, body) => {
  initializeLocalStorage();
  const leads = JSON.parse(localStorage.getItem('erp_leads') || '[]');

  const leadIdMatch = endpoint.match(/^\/leads\/([a-zA-Z0-9_-]+)$/);
  if (leadIdMatch) {
    const id = leadIdMatch[1];
    let updatedLead = null;
    const updatedLeads = leads.map(l => {
      if (String(l.id) === String(id)) {
        updatedLead = { ...l, ...body };
        return updatedLead;
      }
      return l;
    });

    if (!updatedLead) {
      throw new Error(`Lead with ID ${id} not found for update`);
    }

    localStorage.setItem('erp_leads', JSON.stringify(updatedLeads));
    return updatedLead;
  }

  throw new Error(`Endpoint ${endpoint} not supported in local mock PATCH`);
};

const emulateDelete = (endpoint) => {
  initializeLocalStorage();
  const leads = JSON.parse(localStorage.getItem('erp_leads') || '[]');

  const leadIdMatch = endpoint.match(/^\/leads\/([a-zA-Z0-9_-]+)$/);
  if (leadIdMatch) {
    const id = leadIdMatch[1];
    const originalLength = leads.length;
    const updatedLeads = leads.filter(l => String(l.id) !== String(id));

    if (updatedLeads.length === originalLength) {
      throw new Error(`Lead with ID ${id} not found for deletion`);
    }

    localStorage.setItem('erp_leads', JSON.stringify(updatedLeads));
    return { success: true };
  }

  throw new Error(`Endpoint ${endpoint} not supported in local mock DELETE`);
};

export const apiClient = {
  get: async (endpoint, params = {}) => {
    if (useLocalMock) {
      return emulateGet(endpoint, params);
    }

    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // json-server v1 beta pagination format: { data: [...], items: total_count }
      if (data.data && typeof data.items === 'number') {
        return { data: data.data, totalCount: data.items };
      }
      
      return { data, totalCount: data.length };
    } catch (error) {
      console.warn('json-server connection failed, falling back to LocalStorage mock database.', error);
      useLocalMock = true;
      return emulateGet(endpoint, params);
    }
  },
  
  post: async (endpoint, body) => {
    if (useLocalMock) {
      return emulatePost(endpoint, body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.warn('json-server connection failed, falling back to LocalStorage mock database.', error);
      useLocalMock = true;
      return emulatePost(endpoint, body);
    }
  },
  
  put: async (endpoint, body) => {
    if (useLocalMock) {
      return emulatePatch(endpoint, body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.warn('json-server connection failed, falling back to LocalStorage mock database.', error);
      useLocalMock = true;
      return emulatePatch(endpoint, body);
    }
  },
  
  patch: async (endpoint, body) => {
    if (useLocalMock) {
      return emulatePatch(endpoint, body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.warn('json-server connection failed, falling back to LocalStorage mock database.', error);
      useLocalMock = true;
      return emulatePatch(endpoint, body);
    }
  },
  
  delete: async (endpoint) => {
    if (useLocalMock) {
      return emulateDelete(endpoint);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.warn('json-server connection failed, falling back to LocalStorage mock database.', error);
      useLocalMock = true;
      return emulateDelete(endpoint);
    }
  }
};

