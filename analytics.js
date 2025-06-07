// Sistema de Analytics Avançado para AssinaFácil
// Desenvolvido para monitoramento completo de uso e geração de relatórios

class AssinaFacilAnalytics {
    constructor() {
        this.config = {
            userId: this.generateUserId(),
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            email: 'rlambaia2023@gmail.com',
            version: '2.0.0',
            apiEndpoint: 'https://api.assinafacil.com/analytics' // Endpoint fictício para demonstração
        };
        
        this.events = [];
        this.metrics = {
            pageViews: 0,
            contractsGenerated: 0,
            contractsByType: { imovel: 0, veiculo: 0 },
            featuresUsed: {
                pdf: 0,
                word: 0,
                print: 0,
                signature: 0,
                upload: 0
            },
            deviceInfo: this.getDeviceInfo(),
            userAgent: navigator.userAgent,
            location: null
        };
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.getLocationInfo();
        this.startSessionTracking();
        
        // Salvar dados localmente como backup
        this.loadStoredData();
        
        console.log('📊 AssinaFácil Analytics iniciado:', this.config);
    }
    
    generateUserId() {
        let userId = localStorage.getItem('assinafacil_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('assinafacil_user_id', userId);
        }
        return userId;
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    
    getDeviceInfo() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        return {
            type: isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop',
            platform: isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Desktop'),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };
    }
    
    async getLocationInfo() {
        try {
            // Usar API de geolocalização por IP (simulado)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            this.metrics.location = {
                country: data.country_name || 'Brasil',
                region: data.region || 'Desconhecido',
                city: data.city || 'Desconhecido',
                ip: data.ip || 'Desconhecido'
            };
        } catch (error) {
            this.metrics.location = {
                country: 'Brasil',
                region: 'Desconhecido',
                city: 'Desconhecido',
                ip: 'Desconhecido'
            };
        }
    }
    
    trackPageView() {
        this.metrics.pageViews++;
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            timestamp: Date.now()
        });
    }
    
    trackEvent(eventName, eventData = {}) {
        const event = {
            id: this.generateEventId(),
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.config.sessionId,
            userId: this.config.userId,
            data: eventData,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.events.push(event);
        this.saveToLocalStorage();
        
        // Log para desenvolvimento
        console.log('📈 Evento rastreado:', eventName, eventData);
        
        // Enviar para servidor (simulado)
        this.sendToServer(event);
    }
    
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    
    // Métodos específicos para tracking de funcionalidades
    trackContractTypeSelected(type) {
        this.trackEvent('contract_type_selected', { type });
    }
    
    trackContractGenerated(type) {
        this.metrics.contractsGenerated++;
        this.metrics.contractsByType[type]++;
        this.trackEvent('contract_generated', { 
            type,
            total: this.metrics.contractsGenerated
        });
    }
    
    trackFeatureUsed(feature, details = {}) {
        if (this.metrics.featuresUsed[feature] !== undefined) {
            this.metrics.featuresUsed[feature]++;
        }
        this.trackEvent('feature_used', { 
            feature,
            count: this.metrics.featuresUsed[feature],
            ...details
        });
    }
    
    trackFormInteraction(formType, fieldName, action = 'focus') {
        this.trackEvent('form_interaction', {
            formType,
            fieldName,
            action
        });
    }
    
    trackError(errorType, errorMessage, context = {}) {
        this.trackEvent('error', {
            type: errorType,
            message: errorMessage,
            context
        });
    }
    
    trackPerformance(action, duration) {
        this.trackEvent('performance', {
            action,
            duration,
            timestamp: Date.now()
        });
    }
    
    // Sistema de relatórios
    generateDailyReport() {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => {
            const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
            return eventDate === today;
        });
        
        return {
            date: today,
            summary: {
                totalEvents: todayEvents.length,
                uniqueUsers: new Set(todayEvents.map(e => e.userId)).size,
                pageViews: todayEvents.filter(e => e.name === 'page_view').length,
                contractsGenerated: todayEvents.filter(e => e.name === 'contract_generated').length
            },
            events: todayEvents,
            metrics: this.metrics
        };
    }
    
    generateWeeklyReport() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const weekEvents = this.events.filter(event => event.timestamp >= oneWeekAgo);
        
        return {
            period: 'last_7_days',
            summary: {
                totalEvents: weekEvents.length,
                uniqueUsers: new Set(weekEvents.map(e => e.userId)).size,
                pageViews: weekEvents.filter(e => e.name === 'page_view').length,
                contractsGenerated: weekEvents.filter(e => e.name === 'contract_generated').length,
                contractsByType: this.calculateContractsByType(weekEvents),
                topFeatures: this.calculateTopFeatures(weekEvents),
                deviceBreakdown: this.calculateDeviceBreakdown(weekEvents)
            },
            events: weekEvents,
            metrics: this.metrics
        };
    }
    
    calculateContractsByType(events) {
        const contractEvents = events.filter(e => e.name === 'contract_generated');
        const breakdown = { imovel: 0, veiculo: 0 };
        
        contractEvents.forEach(event => {
            if (event.data.type) {
                breakdown[event.data.type]++;
            }
        });
        
        return breakdown;
    }
    
    calculateTopFeatures(events) {
        const featureEvents = events.filter(e => e.name === 'feature_used');
        const features = {};
        
        featureEvents.forEach(event => {
            const feature = event.data.feature;
            features[feature] = (features[feature] || 0) + 1;
        });
        
        return Object.entries(features)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([feature, count]) => ({ feature, count }));
    }
    
    calculateDeviceBreakdown(events) {
        const devices = {};
        const uniqueUsers = new Set();
        
        events.forEach(event => {
            if (!uniqueUsers.has(event.userId)) {
                uniqueUsers.add(event.userId);
                // Simular detecção de dispositivo baseada no userAgent
                const isMobile = /Mobile|Android|iPhone/i.test(event.userAgent);
                const deviceType = isMobile ? 'mobile' : 'desktop';
                devices[deviceType] = (devices[deviceType] || 0) + 1;
            }
        });
        
        return devices;
    }
    
    // Envio de relatórios por email (simulado)
    async sendEmailReport(reportType = 'weekly') {
        const report = reportType === 'weekly' ? this.generateWeeklyReport() : this.generateDailyReport();
        
        const emailData = {
            to: this.config.email,
            subject: `AssinaFácil - Relatório ${reportType === 'weekly' ? 'Semanal' : 'Diário'} de Analytics`,
            html: this.generateEmailHTML(report),
            timestamp: Date.now()
        };
        
        try {
            // Simular envio de email
            console.log('📧 Enviando relatório por email:', emailData);
            
            // Em produção, aqui seria feita a chamada para o serviço de email
            // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) });
            
            this.trackEvent('email_report_sent', { 
                type: reportType,
                recipient: this.config.email
            });
            
            return { success: true, message: 'Relatório enviado com sucesso!' };
        } catch (error) {
            this.trackError('email_send_failed', error.message, { reportType });
            return { success: false, error: error.message };
        }
    }
    
    generateEmailHTML(report) {
        const isWeekly = report.period === 'last_7_days';
        const title = isWeekly ? 'Relatório Semanal' : 'Relatório Diário';
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>AssinaFácil - ${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
                .metric-title { font-weight: bold; color: #333; margin-bottom: 5px; }
                .metric-value { font-size: 24px; color: #667eea; font-weight: bold; }
                .section { margin: 20px 0; }
                .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
                .chart { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 AssinaFácil Analytics</h1>
                    <h2>${title}</h2>
                    <p>${isWeekly ? 'Últimos 7 dias' : new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="content">
                    <div class="section">
                        <div class="section-title">📈 Resumo Geral</div>
                        
                        <div class="metric">
                            <div class="metric-title">Total de Eventos</div>
                            <div class="metric-value">${report.summary.totalEvents}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-title">Usuários Únicos</div>
                            <div class="metric-value">${report.summary.uniqueUsers}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-title">Visualizações de Página</div>
                            <div class="metric-value">${report.summary.pageViews}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-title">Contratos Gerados</div>
                            <div class="metric-value">${report.summary.contractsGenerated}</div>
                        </div>
                    </div>
                    
                    ${isWeekly ? `
                    <div class="section">
                        <div class="section-title">🏠🚗 Contratos por Tipo</div>
                        <div class="chart">
                            <p><strong>Imóveis:</strong> ${report.summary.contractsByType.imovel} contratos</p>
                            <p><strong>Veículos:</strong> ${report.summary.contractsByType.veiculo} contratos</p>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">⭐ Funcionalidades Mais Usadas</div>
                        <div class="chart">
                            ${report.summary.topFeatures.map(f => `<p><strong>${f.feature}:</strong> ${f.count} usos</p>`).join('')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">📱💻 Dispositivos</div>
                        <div class="chart">
                            ${Object.entries(report.summary.deviceBreakdown).map(([device, count]) => 
                                `<p><strong>${device === 'mobile' ? 'Mobile' : 'Desktop'}:</strong> ${count} usuários</p>`
                            ).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="section">
                        <div class="section-title">🔧 Informações Técnicas</div>
                        <div class="chart">
                            <p><strong>Versão do Sistema:</strong> ${this.config.version}</p>
                            <p><strong>Período de Análise:</strong> ${isWeekly ? 'Últimos 7 dias' : 'Hoje'}</p>
                            <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Este relatório foi gerado automaticamente pelo sistema AssinaFácil Analytics</p>
                    <p>Para dúvidas ou suporte, entre em contato conosco.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
    
    // Persistência de dados
    saveToLocalStorage() {
        try {
            const data = {
                config: this.config,
                events: this.events,
                metrics: this.metrics,
                lastUpdate: Date.now()
            };
            localStorage.setItem('assinafacil_analytics', JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar analytics:', error);
        }
    }
    
    loadStoredData() {
        try {
            const stored = localStorage.getItem('assinafacil_analytics');
            if (stored) {
                const data = JSON.parse(stored);
                this.events = data.events || [];
                this.metrics = { ...this.metrics, ...data.metrics };
            }
        } catch (error) {
            console.error('Erro ao carregar analytics:', error);
        }
    }
    
    // Envio para servidor (simulado)
    async sendToServer(event) {
        try {
            // Em produção, aqui seria feita a chamada real para o servidor
            // await fetch(this.config.apiEndpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(event)
            // });
            
            console.log('📤 Evento enviado para servidor (simulado):', event.name);
        } catch (error) {
            console.error('Erro ao enviar evento:', error);
        }
    }
    
    // Configuração de listeners para eventos automáticos
    setupEventListeners() {
        // Track clicks em botões importantes
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .btn, a');
            if (target) {
                const buttonText = target.textContent.trim();
                const buttonId = target.id;
                const buttonClass = target.className;
                
                this.trackEvent('button_click', {
                    text: buttonText,
                    id: buttonId,
                    class: buttonClass
                });
            }
        });
        
        // Track mudanças de formulário
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                const fieldName = e.target.name || e.target.id;
                const formType = e.target.closest('form')?.id || 'unknown';
                
                this.trackFormInteraction(formType, fieldName, 'input');
            }
        });
        
        // Track tempo na página
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.config.startTime;
            this.trackPerformance('time_on_page', timeOnPage);
        });
        
        // Track erros JavaScript
        window.addEventListener('error', (e) => {
            this.trackError('javascript_error', e.message, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
    }
    
    startSessionTracking() {
        // Enviar relatório semanal automaticamente (simulado)
        setInterval(() => {
            this.sendEmailReport('weekly');
        }, 7 * 24 * 60 * 60 * 1000); // A cada 7 dias
        
        // Salvar dados a cada 30 segundos
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);
    }
    
    // Método público para gerar relatório manual
    generateManualReport() {
        const report = this.generateWeeklyReport();
        console.log('📊 Relatório Manual Gerado:', report);
        return report;
    }
    
    // Método público para enviar relatório manual
    async sendManualReport() {
        return await this.sendEmailReport('weekly');
    }
}

// Inicializar o sistema de analytics
window.analytics = new AssinaFacilAnalytics();

// Expor métodos globais para uso no sistema
window.trackContractGenerated = (type) => window.analytics.trackContractGenerated(type);
window.trackFeatureUsed = (feature, details) => window.analytics.trackFeatureUsed(feature, details);
window.trackContractTypeSelected = (type) => window.analytics.trackContractTypeSelected(type);
window.generateReport = () => window.analytics.generateManualReport();
window.sendReport = () => window.analytics.sendManualReport();

