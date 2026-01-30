// script.js

/*------------------------------------------*/
/*    MENÚ HAMBURGUESA MÓVIL                */
/*------------------------------------------*/
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menú hamburguesa
if (hamburger && navbar) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('open');
  });
}

// Cerrar menú hamburguesa al hacer clic en un enlace
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbar.classList.remove('open');
  });
});

// Cerrar menú hamburguesa al hacer clic fuera de él
document.addEventListener('click', (e) => {
  if (navbar.classList.contains('open') && 
      !navbar.contains(e.target) && 
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navbar.classList.remove('open');
  }
});

/*------------------------------------------*/
/*    NAVEGACIÓN CON SCROLL SUAVE           */
/*------------------------------------------*/
const smoothScrollLinks = document.querySelectorAll('a.nav-link, a.btn-cta');

smoothScrollLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    
    // Verificar que es un enlace hash interno
    if (hash && hash.startsWith('#')) {
      const target = document.querySelector(hash);
      
      if (target) {
        e.preventDefault();
        
        // Calcular offset del header
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const yOffset = -headerHeight - 6;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        // Scroll suave
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth'
        });
        
        // Actualizar enlace activo
        navLinks.forEach(l => l.classList.remove('active'));
        if (this.classList.contains('nav-link')) {
          this.classList.add('active');
        }
      }
    }
  });
});

/*------------------------------------------*/
/*    SINCRONIZAR MENÚ CON SCROLL           */
/*------------------------------------------*/
const sections = ['#inicio', '#historia', '#organizacion', '#equipo', '#contacto']
  .map(id => document.querySelector(id))
  .filter(section => section !== null);

// Actualizar enlace activo basado en la posición del scroll
function updateActiveNavLink() {
  let currentSection = 0;
  const scrollPosition = window.scrollY + 150;
  
  sections.forEach((section, index) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = index;
    }
  });
  
  navLinks.forEach((link, index) => {
    link.classList.remove('active');
    if (index === currentSection) {
      link.classList.add('active');
    }
  });
}

// Ejecutar al hacer scroll con throttle para mejor rendimiento
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    updateActiveNavLink();
    handleScrollTopButton();
  });
});

/*------------------------------------------*/
/*    BOTÓN SCROLL TO TOP                   */
/*------------------------------------------*/
const scrollBtn = document.getElementById('scrollTopBtn');

// Mostrar/ocultar botón según scroll
function handleScrollTopButton() {
  if (window.scrollY > 500) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
}

// Scroll hacia arriba al hacer clic
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  });
}

/*------------------------------------------*/
/*    VALIDACIÓN DE FORMULARIO              */
/*------------------------------------------*/
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  // Configuración de campos y validaciones
  const fieldValidations = {
    nombre: {
      validate: (value) => value.trim().length >= 3,
      errorMessage: 'Ingresa tu nombre completo (mínimo 3 caracteres).'
    },
    correo: {
      validate: (value) => /^\S+@\S+\.\S+$/.test(value),
      errorMessage: 'Por favor ingresa un correo electrónico válido.'
    },
    telefono: {
      validate: (value) => /^[0-9\s\+\-]{7,}$/.test(value),
      errorMessage: 'Por favor ingresa un teléfono válido (mínimo 7 dígitos).'
    },
    asunto: {
      validate: (value) => value.trim().length > 2,
      errorMessage: 'El asunto es obligatorio.'
    },
    mensaje: {
      validate: (value) => value.trim().length > 5,
      errorMessage: 'El mensaje es obligatorio (mínimo 6 caracteres).'
    }
  };
  
  // Validar un campo individual
  function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const errorSpan = input.nextElementSibling;
    const validation = fieldValidations[fieldName];
    
    if (!validation.validate(input.value)) {
      errorSpan.textContent = validation.errorMessage;
      input.classList.add('invalid');
      return false;
    } else {
      errorSpan.textContent = '';
      input.classList.remove('invalid');
      return true;
    }
  }
  
  // Agregar validación en tiempo real mientras el usuario escribe
  Object.keys(fieldValidations).forEach(fieldName => {
    const input = document.getElementById(fieldName);
    
    // Validar al salir del campo (blur)
    input.addEventListener('blur', () => {
      validateField(fieldName);
    });
    
    // Limpiar error mientras escribe si el campo ya es válido
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        validateField(fieldName);
      }
    });
  });
  
  // Validación al enviar el formulario
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validar todos los campos
    Object.keys(fieldValidations).forEach(fieldName => {
      const fieldIsValid = validateField(fieldName);
      if (!fieldIsValid) {
        isFormValid = false;
      }
    });
    
    const successMessage = document.getElementById('form-success');
    
    if (isFormValid) {
      // Mostrar mensaje de éxito
      successMessage.textContent = '¡Tu mensaje ha sido enviado con éxito!';
      successMessage.style.display = 'block';
      
      // Resetear formulario
      contactForm.reset();
      
      // Ocultar mensaje después de 4 segundos
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 4000);
    } else {
      // Ocultar mensaje de éxito si hay errores
      successMessage.textContent = '';
      successMessage.style.display = 'none';
      
      // Hacer scroll al primer campo con error
      const firstInvalidField = contactForm.querySelector('.invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        firstInvalidField.focus();
      }
    }
  });
}

/*------------------------------------------*/
/*    INICIALIZACIÓN AL CARGAR PÁGINA       */
/*------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  // Actualizar menú activo al cargar la página
  updateActiveNavLink();
  
  // Manejar botón scroll to top
  handleScrollTopButton();
  
  // Agregar animaciones suaves a los elementos cuando entran en viewport
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Aplicar animación a cards y secciones
  const animatedElements = document.querySelectorAll(
    '.service-card, .org-card, .equipo-card, .historia-img, .contacto-info'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
  });
});

/*------------------------------------------*/
/*    PREVENIR ENLACES ROTOS                */
/*------------------------------------------*/
// Agregar comportamiento para enlaces internos que no existen
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#terminos' || targetId === '#privacidad' || targetId === '#cookies') {
      e.preventDefault();
      console.log('Enlace a sección pendiente:', targetId);
      // Aquí se puede agregar un modal o redirección cuando estas páginas estén listas
    }
  });
});