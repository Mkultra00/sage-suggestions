let incidents = [];

// Initialize map (empty, will populate after CSV loads)
const map = L.map('map').setView([40.7128, -74.0060], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);

function renderMap() {
  // Clear old markers
  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) map.removeLayer(layer);
  });
  
  incidents.forEach(incident => {
    L.circleMarker([incident.lat, incident.lng], {
      radius: 8,
      fillColor: incident.type === "Assault" ? "#d32f2f" : "#f57c00",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(incident.type + " - " + incident.location);
  });
}

function renderFeed() {
  const feedDiv = document.getElementById('feed');
  feedDiv.innerHTML = '';
  incidents.forEach(incident => {
    const div = document.createElement('div');
    div.className = 'incident';
    div.onclick = () => openModal(incident);
    
    let mediaHTML = '';
    if (incident.media) {
      const isVideo = incident.media.includes('video') || incident.media.endsWith('.mp4');
      mediaHTML = isVideo 
        ? `<video style="max-width: 100%; border-radius: 4px; margin-top: 10px;" controls src="${incident.media}"></video>`
        : `<img style="max-width: 100%; border-radius: 4px; margin-top: 10px;" src="${incident.media}" />`;
    }
    
    div.innerHTML = `
      <div class="incident-type">${incident.type}</div>
      <div class="incident-location">${incident.location}</div>
      <div class="incident-time">${incident.time}</div>
      <div>${incident.description}</div>
      ${mediaHTML}
    `;
    feedDiv.appendChild(div);
  });
}

// Modal functions
let currentIncident = null;

function openNewIncidentModal() {
  currentIncident = { 
    id: Date.now(), 
    type: '', 
    lat: 40.7128, 
    lng: -74.0060, 
    location: '', 
    time: 'just now', 
    description: '', 
    media: null 
  };
  
  document.getElementById('modal-type').value = '';
  document.getElementById('modal-location').value = '';
  document.getElementById('modal-description').value = '';
  document.getElementById('preview').innerHTML = '';
  document.getElementById('media-input').value = '';
  document.getElementById('modal-title').textContent = 'Report New Incident';
  document.getElementById('modal').classList.add('open');
}

function openModal(incident) {
  currentIncident = incident;
  document.getElementById('modal-type').value = incident.type || '';
  document.getElementById('modal-location').value = incident.location || '';
  document.getElementById('modal-description').value = incident.description || '';
  document.getElementById('preview').innerHTML = '';
  document.getElementById('media-input').value = '';
  document.getElementById('modal-title').textContent = 'Edit Incident';
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  currentIncident = null;
}

document.getElementById('media-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const preview = document.getElementById('preview');
    const isVideo = file.type.startsWith('video');
    
    if (isVideo) {
      preview.innerHTML = `<video controls style="max-width: 100%; border-radius: 4px;" src="${event.target.result}"></video>`;
    } else {
      preview.innerHTML = `<img style="max-width: 100%; border-radius: 4px;" src="${event.target.result}" />`;
    }
    
    currentIncident.media = event.target.result;
  };
  reader.readAsDataURL(file);
});

function submitIncident() {
  const type = document.getElementById('modal-type').value;
  const location = document.getElementById('modal-location').value;
  const description = document.getElementById('modal-description').value;
  
  if (!type || !location || !description) {
    alert('Fill in all fields');
    return;
  }
  
  currentIncident.type = type;
  currentIncident.location = location;
  currentIncident.description = description;
  
  fetch('/api/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentIncident)
  }).then(r => r.json()).then(data => {
    console.log('Submitted:', data);
    renderMap();
    renderFeed();
    closeModal();
  }).catch((err) => {
    console.log('Stored locally (backend not available):', currentIncident);
    localStorage.setItem('incident_' + currentIncident.id, JSON.stringify(currentIncident));
    renderMap();
    renderFeed();
    closeModal();
  });
}

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

// ===== LOAD CSV DATA (runs last) =====
fetch('incidents.csv')
  .then(response => response.text())
  .then(data => {
    Papa.parse(data, {
      header: true,
      complete: function(results) {
        incidents = results.data
          .filter(row => row.latitude && row.longitude)
          .map(row => ({
            id: row.precinct,
            type: row.top_offense || 'Anti-Jewish Incident',
            lat: parseFloat(row.latitude),
            lng: parseFloat(row.longitude),
            location: `${row.precinct}, ${row.patrol_borough}`,
            time: `${row.n_2026_ytd || 0} incidents (2026 YTD)`,
            description: `Felonies: ${row.felonies}, Misdemeanors: ${row.misdemeanors}, Arrests: ${row.with_arrest}`,
            precinct: row.precinct,
            county: row.county,
            total_incidents: row.anti_jewish_incidents_2019_2026,
            media: null
          }));
        
        console.log(`Loaded ${incidents.length} incidents`);
        renderMap();
        renderFeed();
      },
      error: function(err) {
        console.error('CSV parsing error:', err);
      }
    });
  })
  .catch(err => console.error('Error loading CSV:', err));