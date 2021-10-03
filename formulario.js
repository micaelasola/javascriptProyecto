
  
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      
      var forms = document.getElementsByClassName('needs-validation');
      
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
  

  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const mdl = document.querySelector('.mdl-container')
  
  open.addEventListener('click', () => {
      mdl.classList.add('show')
  })
  
  close.addEventListener('click', () => {
      mdl.classList.remove('show')
  })