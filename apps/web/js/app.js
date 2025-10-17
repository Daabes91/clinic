(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html':'home',
    'services.html':'services',
    'doctors.html':'doctors',
    'appointments.html':'appointments',
    'dashboard.html':'dashboard'
  };
  const key = map[path];
  if(key){
    document.querySelectorAll(`[data-nav="${key}"]`).forEach(el => el.classList.add('text-blue-700'));
  }

  function syncAuth(){
    const user = JSON.parse(localStorage.getItem('user')||'null');
    const login = document.querySelectorAll('[data-auth="login"]');
    const signup = document.querySelectorAll('[data-auth="signup"]');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    if(user){
      login.forEach(e=> e.classList.add('hidden'));
      signup.forEach(e=> e.classList.add('hidden'));
      if(logoutBtn) logoutBtn.classList.remove('hidden');
      if(logoutBtnMobile) logoutBtnMobile.classList.remove('hidden');
    } else {
      login.forEach(e=> e.classList.remove('hidden'));
      signup.forEach(e=> e.classList.remove('hidden'));
      if(logoutBtn) logoutBtn.classList.add('hidden');
      if(logoutBtnMobile) logoutBtnMobile.classList.add('hidden');
    }
  }
  syncAuth();
  const logout = () => { localStorage.removeItem('user'); location.reload(); };
  const lb = document.getElementById('logoutBtn'); if(lb) lb.onclick = logout;
  const lbm = document.getElementById('logoutBtnMobile'); if(lbm) lbm.onclick = logout;
})();
