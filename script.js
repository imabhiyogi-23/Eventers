// ===== Nav toggle (all pages) =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // ===== Mobile sticky action bar (call / whatsapp / book) =====
  const bar = document.createElement('div');
  bar.className = 'mobile-actionbar';
  bar.innerHTML = `
    <a href="tel:+918217686375" class="call">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8 9.7a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z"/></svg>
      Call
    </a>
    <a href="https://wa.me/918217686375" target="_blank" rel="noopener" class="whatsapp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.87 9.87 0 004.62 1.15h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2z"/></svg>
      WhatsApp
    </a>
    <a href="contact.html#bookingForm" class="book" id="mobileBookLink">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z"/></svg>
      Book
    </a>`;
  document.body.appendChild(bar);

  // On the contact page itself, point the bar's Book link at the form instead of reloading the page
  if(document.getElementById('bookingForm')){
    const bookLink = document.getElementById('mobileBookLink');
    if(bookLink) bookLink.setAttribute('href', '#bookingForm');
  }

  // ===== Decor catalog (decor.html) =====
  const decorGrid = document.getElementById('decorGrid');
  if(decorGrid){
    const decorInputs = decorGrid.querySelectorAll('input[type="checkbox"]');
    const decorCount = document.getElementById('decorCount');
    const decorTotal = document.getElementById('decorTotal');
    const filterBtns = document.querySelectorAll('.decor-filters button');

    function formatINR(n){ return '₹' + n.toLocaleString('en-IN'); }

    function updateSummary(){
      const selected = Array.from(decorInputs).filter(i => i.checked);
      if(selected.length === 0){
        decorCount.textContent = 'No decor items selected yet';
        decorTotal.textContent = '';
      } else {
        const total = selected.reduce((sum, i) => sum + Number(i.dataset.price), 0);
        decorCount.textContent = `${selected.length} item${selected.length > 1 ? 's' : ''} selected`;
        decorTotal.textContent = formatINR(total) + ' est.';
      }
      try{
        const names = selected.map(i => i.dataset.name);
        sessionStorage.setItem('utsavDecorSelection', JSON.stringify(names));
      }catch(e){ /* sessionStorage unavailable, ignore */ }
    }
    decorInputs.forEach(i => i.addEventListener('change', updateSummary));

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        decorGrid.querySelectorAll('.decor-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  // ===== Booking form (contact.html) =====
  const form = document.getElementById('bookingForm');
  if(form){
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('date').value;
      const guests = document.getElementById('guests').value;
      const message = document.getElementById('message').value.trim();
      const phases = Array.from(form.querySelectorAll('.check-group input:checked')).map(c => c.value).join(', ') || 'Not specified';

      let decorLine = 'None selected';
      try{
        const stored = sessionStorage.getItem('utsavDecorSelection');
        if(stored){
          const names = JSON.parse(stored);
          if(names.length) decorLine = names.join(', ');
        }
      }catch(e){ /* ignore */ }

      if(!name || !phone){
        status.textContent = 'Please add your name and phone number.';
        status.style.color = '#a3122f';
        return;
      }

      const subject = encodeURIComponent(`Booking enquiry — ${name}`);
      const body = encodeURIComponent(
`Name: ${name}
Phone: ${phone}
Preferred date: ${date || 'Not specified'}
Guest count: ${guests || 'Not specified'}
Phases: ${phases}
Decor selected: ${decorLine}

Notes:
${message || '—'}`
      );
      window.location.href = `mailto:abhiyogi2304@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = 'Opening your email app with these details filled in…';
      status.style.color = 'var(--red)';
    });
  }
});
