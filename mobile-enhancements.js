// Melhorias específicas para dispositivos móveis iOS e Android

// Detectar tipo de dispositivo
function detectDevice() {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return {
        isIOS,
        isAndroid,
        isMobile,
        hasTouch,
        isTablet: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent),
        isPhone: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)
    };
}

// Configurações específicas para iOS
function setupIOSOptimizations() {
    // Prevenir zoom em inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name="viewport"]').setAttribute(
                    'content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                );
            }
        });
        
        input.addEventListener('blur', function() {
            document.querySelector('meta[name="viewport"]').setAttribute(
                'content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        });
    });
    
    // Melhorar scroll em iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Configurar PWA para iOS
    if (window.navigator.standalone) {
        document.body.classList.add('ios-standalone');
    }
    
    // Otimizar canvas para iOS
    const canvas = document.getElementById('signaturePad');
    if (canvas) {
        // Melhorar qualidade do canvas em dispositivos Retina
        const ctx = canvas.getContext('2d');
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        if (devicePixelRatio > 1) {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
        }
    }
}

// Configurações específicas para Android
function setupAndroidOptimizations() {
    // Melhorar performance em Android
    if (window.innerWidth < 768) {
        // Reduzir animações para melhor performance
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Otimizar teclado virtual
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll para o input quando o teclado aparecer
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Melhorar touch events para Android
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
}

// Otimizações gerais para dispositivos móveis
function setupMobileOptimizations() {
    const device = detectDevice();
    
    // Adicionar classes CSS baseadas no dispositivo
    document.body.classList.add(
        device.isMobile ? 'mobile-device' : 'desktop-device',
        device.isIOS ? 'ios-device' : '',
        device.isAndroid ? 'android-device' : '',
        device.hasTouch ? 'touch-device' : 'no-touch-device'
    );
    
    // Configurações específicas por dispositivo
    if (device.isIOS) {
        setupIOSOptimizations();
    }
    
    if (device.isAndroid) {
        setupAndroidOptimizations();
    }
    
    // Otimizações gerais para mobile
    if (device.isMobile) {
        // Melhorar performance removendo hover effects em mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                *:hover {
                    background-color: initial !important;
                    color: initial !important;
                    transform: initial !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Otimizar formulários para mobile
        setupMobileForms();
        
        // Otimizar assinatura digital para mobile
        setupMobileSignature();
    }
}

// Otimizações específicas para formulários em mobile
function setupMobileForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Prevenir submit duplo em mobile
        let isSubmitting = false;
        form.addEventListener('submit', function(e) {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
            isSubmitting = true;
            setTimeout(() => { isSubmitting = false; }, 2000);
        });
    });
    
    // Melhorar inputs para mobile
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Adicionar atributos específicos para mobile
        if (input.type === 'email') {
            input.setAttribute('autocomplete', 'email');
            input.setAttribute('inputmode', 'email');
        }
        
        if (input.type === 'tel') {
            input.setAttribute('autocomplete', 'tel');
            input.setAttribute('inputmode', 'tel');
        }
        
        if (input.type === 'number') {
            input.setAttribute('inputmode', 'numeric');
        }
        
        // Melhorar acessibilidade
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');
    });
}

// Otimizações específicas para assinatura digital em mobile
function setupMobileSignature() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;
    
    // Melhorar responsividade do canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Ajustar tamanho baseado no container
        const maxWidth = Math.min(rect.width - 40, 500);
        const height = Math.min(200, window.innerHeight * 0.3);
        
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = height + 'px';
        
        // Ajustar resolução para dispositivos de alta densidade
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = maxWidth * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    
    // Redimensionar canvas quando necessário
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });
    
    // Melhorar touch events para assinatura
    let isDrawing = false;
    let lastPoint = null;
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastPoint = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!isDrawing || !lastPoint) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const currentPoint = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        
        lastPoint = currentPoint;
    }, { passive: false });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        isDrawing = false;
        lastPoint = null;
    }, { passive: false });
}

// Otimizações para PWA
function setupPWAOptimizations() {
    // Registrar Service Worker se disponível
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Service Worker seria registrado aqui se implementado
            console.log('PWA: Service Worker support detected');
        });
    }
    
    // Configurar prompt de instalação
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botão de instalação personalizado se necessário
        const installButton = document.getElementById('install-button');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA: User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
}

// Otimizações para performance em mobile
function setupPerformanceOptimizations() {
    // Lazy loading para imagens
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Otimizar scroll performance
    let ticking = false;
    function updateScrollPosition() {
        // Otimizações de scroll aqui
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true });
}

// Inicializar todas as otimizações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupMobileOptimizations();
    setupPWAOptimizations();
    setupPerformanceOptimizations();
    
    console.log('Mobile optimizations loaded for AssinaFácil');
});

// Exportar funções para uso global
window.AssinaFacilMobile = {
    detectDevice,
    setupMobileOptimizations,
    setupIOSOptimizations,
    setupAndroidOptimizations
};

