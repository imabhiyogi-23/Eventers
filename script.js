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
