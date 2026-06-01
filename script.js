// ===== DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function toggleMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
}

hamburger.addEventListener('click', toggleMenu);

// ===== FECHAR MENU AO CLICAR EM LINK =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// ===== FECHAR MENU CLICANDO FORA =====
document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// ===== NAVBAR STICKY COM DEBOUNCE =====
const handleScroll = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== SMOOTH SCROLL BUTTON =====
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    const sobreSection = document.getElementById('sobre');
    sobreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== P5.JS FUNCTIONS =====
const btnAbrirP5 = document.getElementById('btnAbrirP5');
const btnEditarP5 = document.getElementById('btnEditarP5');
const resultado = document.getElementById('resultado');

const P5_FULL_URL = 'https://editor.p5js.org/izaque.sampaio/full/0VDlKHQNW';
const P5_EDIT_URL = 'https://editor.p5js.org/izaque.sampaio/sketches/0VDlKHQNW';

function abrirP5js() {
    try {
        window.open(P5_FULL_URL, '_blank', 'noopener,noreferrer');
        mostrarResultado('✅ Projeto p5.js aberto em nova aba!');
    } catch (error) {
        console.error('Erro ao abrir p5.js:', error);
        mostrarResultado('❌ Erro ao abrir projeto');
    }
}

function editarP5js() {
    try {
        window.open(P5_EDIT_URL, '_blank', 'noopener,noreferrer');
        mostrarResultado('✏️ Editor p5.js aberto!');
    } catch (error) {
        console.error('Erro ao abrir editor:', error);
        mostrarResultado('❌ Erro ao abrir editor');
    }
}

function mostrarResultado(mensagem) {
    resultado.textContent = mensagem;
    setTimeout(() => {
        resultado.textContent = '';
    }, 3000);
}

btnAbrirP5.addEventListener('click', abrirP5js);
btnEditarP5.addEventListener('click', editarP5js);

// ===== LAZY LOADING IMAGES (FUTURE USE) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ANALYTICS (OPCIONAL) =====
// Descomente para adicionar Google Analytics
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'GA_MEASUREMENT_ID');

// ===== PERFORMANCE MONITORING =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Performance - Tempo de carregamento:', pageLoadTime + 'ms');
        }, 0);
    });
}

// ===== PREFETCH DNS PARA RECURSOS EXTERNOS =====
const links = [
    { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
    { rel: 'dns-prefetch', href: '//editor.p5js.org' },
    { rel: 'dns-prefetch', href: '//github.com' }
];

links.forEach(linkData => {
    const link = document.createElement('link');
    link.rel = linkData.rel;
    link.href = linkData.href;
    document.head.appendChild(link);
});

// ===== SERVICE WORKER PARA PWA (OPCIONAL) =====
if ('serviceWorker' in navigator) {
    // Descomente para ativar PWA
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('sw.js');
    // });
}

console.log('✅ Scripts carregados com sucesso!');
