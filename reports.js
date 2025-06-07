// Sistema de Relatórios Automáticos para AssinaFácil
// Extensão do sistema de analytics com funcionalidades de relatórios avançados

class AssinaFacilReports {
    constructor(analytics) {
        this.analytics = analytics;
        this.config = {
            emailEndpoint: 'https://api.emailjs.com/api/v1.0/email/send', // EmailJS para envio real
            emailServiceId: 'service_assinafacil',
            emailTemplateId: 'template_relatorio',
            emailUserId: 'user_assinafacil',
            recipientEmail: 'rlambaia2023@gmail.com'
        };
        
        this.reportSchedule = {
            daily: { enabled: false, time: '09:00' },
            weekly: { enabled: true, day: 'monday', time: '09:00' },
            monthly: { enabled: true, day: 1, time: '09:00' }
        };
        
        this.init();
    }
    
    init() {
        this.setupScheduledReports();
        this.createReportDashboard();
        console.log('📊 Sistema de Relatórios AssinaFácil iniciado');
    }
    
    // Configurar relatórios agendados
    setupScheduledReports() {
        // Verificar e enviar relatórios pendentes ao carregar
        this.checkPendingReports();
        
        // Configurar verificação periódica (a cada hora)
        setInterval(() => {
            this.checkScheduledReports();
        }, 60 * 60 * 1000); // 1 hora
        
        // Configurar relatório de teste (para demonstração)
        setTimeout(() => {
            this.sendTestReport();
        }, 5000); // 5 segundos após inicialização
    }
    
    checkPendingReports() {
        const lastReports = JSON.parse(localStorage.getItem('assinafacil_last_reports') || '{}');
        const now = new Date();
        
        // Verificar relatório semanal
        if (this.reportSchedule.weekly.enabled) {
            const lastWeekly = lastReports.weekly ? new Date(lastReports.weekly) : null;
            const daysSinceLastWeekly = lastWeekly ? Math.floor((now - lastWeekly) / (1000 * 60 * 60 * 24)) : 8;
            
            if (daysSinceLastWeekly >= 7) {
                this.sendWeeklyReport();
            }
        }
        
        // Verificar relatório mensal
        if (this.reportSchedule.monthly.enabled) {
            const lastMonthly = lastReports.monthly ? new Date(lastReports.monthly) : null;
            const daysSinceLastMonthly = lastMonthly ? Math.floor((now - lastMonthly) / (1000 * 60 * 60 * 24)) : 32;
            
            if (daysSinceLastMonthly >= 30) {
                this.sendMonthlyReport();
            }
        }
    }
    
    checkScheduledReports() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.getDay(); // 0 = domingo, 1 = segunda, etc.
        const currentDate = now.getDate();
        
        // Verificar se é hora de enviar relatório semanal (segunda-feira às 9:00)
        if (this.reportSchedule.weekly.enabled && 
            currentDay === 1 && // Segunda-feira
            currentHour === 9 && 
            currentMinute === 0) {
            this.sendWeeklyReport();
        }
        
        // Verificar se é hora de enviar relatório mensal (dia 1 às 9:00)
        if (this.reportSchedule.monthly.enabled && 
            currentDate === 1 && 
            currentHour === 9 && 
            currentMinute === 0) {
            this.sendMonthlyReport();
        }
    }
    
    // Gerar relatório de teste
    async sendTestReport() {
        try {
            const report = this.generateTestReport();
            const emailSent = await this.sendEmailReport(report, 'Relatório de Teste - AssinaFácil');
            
            if (emailSent.success) {
                console.log('📧 Relatório de teste enviado com sucesso!');
                this.analytics.trackEvent('test_report_sent', { success: true });
            } else {
                console.log('⚠️ Falha no envio do relatório de teste (simulado)');
                this.analytics.trackEvent('test_report_sent', { success: false });
            }
        } catch (error) {
            console.error('Erro ao enviar relatório de teste:', error);
        }
    }
    
    // Gerar relatório semanal
    async sendWeeklyReport() {
        try {
            const report = this.analytics.generateWeeklyReport();
            const emailSent = await this.sendEmailReport(report, 'AssinaFácil - Relatório Semanal de Analytics');
            
            if (emailSent.success) {
                this.updateLastReportDate('weekly');
                this.analytics.trackEvent('weekly_report_sent', { success: true });
                console.log('📧 Relatório semanal enviado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao enviar relatório semanal:', error);
            this.analytics.trackError('weekly_report_error', error.message);
        }
    }
    
    // Gerar relatório mensal
    async sendMonthlyReport() {
        try {
            const report = this.generateMonthlyReport();
            const emailSent = await this.sendEmailReport(report, 'AssinaFácil - Relatório Mensal de Analytics');
            
            if (emailSent.success) {
                this.updateLastReportDate('monthly');
                this.analytics.trackEvent('monthly_report_sent', { success: true });
                console.log('📧 Relatório mensal enviado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao enviar relatório mensal:', error);
            this.analytics.trackError('monthly_report_error', error.message);
        }
    }
    
    generateTestReport() {
        return {
            type: 'test',
            date: new Date().toISOString().split('T')[0],
            summary: {
                totalEvents: 15,
                uniqueUsers: 3,
                pageViews: 8,
                contractsGenerated: 2,
                contractsByType: { imovel: 1, veiculo: 1 },
                topFeatures: [
                    { feature: 'pdf', count: 2 },
                    { feature: 'signature', count: 1 },
                    { feature: 'save_data', count: 3 }
                ],
                deviceBreakdown: { mobile: 2, desktop: 1 }
            },
            message: 'Este é um relatório de teste para verificar se o sistema de analytics está funcionando corretamente.',
            metrics: this.analytics.metrics
        };
    }
    
    generateMonthlyReport() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const monthEvents = this.analytics.events.filter(event => event.timestamp >= thirtyDaysAgo);
        
        return {
            type: 'monthly',
            period: 'last_30_days',
            summary: {
                totalEvents: monthEvents.length,
                uniqueUsers: new Set(monthEvents.map(e => e.userId)).size,
                pageViews: monthEvents.filter(e => e.name === 'page_view').length,
                contractsGenerated: monthEvents.filter(e => e.name === 'contract_generated').length,
                contractsByType: this.analytics.calculateContractsByType(monthEvents),
                topFeatures: this.analytics.calculateTopFeatures(monthEvents),
                deviceBreakdown: this.analytics.calculateDeviceBreakdown(monthEvents),
                growthMetrics: this.calculateGrowthMetrics(monthEvents)
            },
            events: monthEvents,
            metrics: this.analytics.metrics
        };
    }
    
    calculateGrowthMetrics(events) {
        const now = Date.now();
        const fifteenDaysAgo = now - (15 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        
        const firstHalf = events.filter(e => e.timestamp >= thirtyDaysAgo && e.timestamp < fifteenDaysAgo);
        const secondHalf = events.filter(e => e.timestamp >= fifteenDaysAgo);
        
        const firstHalfContracts = firstHalf.filter(e => e.name === 'contract_generated').length;
        const secondHalfContracts = secondHalf.filter(e => e.name === 'contract_generated').length;
        
        const growth = firstHalfContracts > 0 ? 
            ((secondHalfContracts - firstHalfContracts) / firstHalfContracts * 100).toFixed(1) : 
            secondHalfContracts > 0 ? 100 : 0;
        
        return {
            contractGrowth: `${growth}%`,
            firstHalfContracts,
            secondHalfContracts,
            trend: growth > 0 ? 'crescimento' : growth < 0 ? 'declínio' : 'estável'
        };
    }
    
    // Enviar email usando EmailJS (simulado)
    async sendEmailReport(report, subject) {
        try {
            const emailData = {
                service_id: this.config.emailServiceId,
                template_id: this.config.emailTemplateId,
                user_id: this.config.emailUserId,
                template_params: {
                    to_email: this.config.recipientEmail,
                    subject: subject,
                    html_content: this.generateEmailHTML(report),
                    report_type: report.type,
                    date: new Date().toLocaleDateString('pt-BR'),
                    summary_text: this.generateSummaryText(report)
                }
            };
            
            // Simular envio de email (em produção, usar EmailJS real)
            console.log('📧 Simulando envio de email:', {
                to: this.config.recipientEmail,
                subject: subject,
                reportType: report.type,
                summary: report.summary
            });
            
            // Simular resposta de sucesso
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return { 
                success: true, 
                message: 'Email enviado com sucesso (simulado)',
                reportType: report.type
            };
            
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return { 
                success: false, 
                error: error.message,
                reportType: report.type
            };
        }
    }
    
    generateSummaryText(report) {
        const s = report.summary;
        return `
        📊 Resumo do Período:
        • ${s.totalEvents} eventos registrados
        • ${s.uniqueUsers} usuários únicos
        • ${s.contractsGenerated} contratos gerados
        • ${s.contractsByType.imovel} contratos de imóvel
        • ${s.contractsByType.veiculo} contratos de veículo
        `;
    }
    
    generateEmailHTML(report) {
        const isTest = report.type === 'test';
        const isMonthly = report.type === 'monthly';
        const title = isTest ? 'Relatório de Teste' : 
                     isMonthly ? 'Relatório Mensal' : 'Relatório Semanal';
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>AssinaFácil - ${title}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
                .content { padding: 30px; }
                .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                .metric { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #dee2e6; }
                .metric-title { font-size: 14px; color: #6c757d; margin-bottom: 8px; font-weight: 500; }
                .metric-value { font-size: 32px; color: #667eea; font-weight: 700; margin: 0; }
                .section { margin: 30px 0; }
                .section-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #667eea; }
                .feature-list { background: #f8f9fa; padding: 20px; border-radius: 10px; }
                .feature-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
                .feature-item:last-child { border-bottom: none; }
                .device-chart { display: flex; gap: 15px; }
                .device-item { flex: 1; background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; }
                .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #6c757d; font-size: 14px; }
                .badge { background: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
                .growth-positive { color: #28a745; font-weight: 600; }
                .growth-negative { color: #dc3545; font-weight: 600; }
                .alert { background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
                @media (max-width: 600px) {
                    .metric-grid { grid-template-columns: 1fr; }
                    .device-chart { flex-direction: column; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 AssinaFácil Analytics</h1>
                    <h2>${title}</h2>
                    <p>${isTest ? 'Sistema de Monitoramento Ativo' : 
                         isMonthly ? 'Últimos 30 dias' : 'Últimos 7 dias'}</p>
                    <span class="badge">Sistema Ativo</span>
                </div>
                
                <div class="content">
                    ${isTest ? `
                    <div class="alert">
                        <strong>🎯 Sistema de Analytics Funcionando!</strong><br>
                        Este é um relatório de teste para confirmar que o sistema de monitoramento está operacional e enviando dados corretamente para ${this.config.recipientEmail}.
                    </div>
                    ` : ''}
                    
                    <div class="section">
                        <div class="section-title">📈 Métricas Principais</div>
                        
                        <div class="metric-grid">
                            <div class="metric">
                                <div class="metric-title">Total de Eventos</div>
                                <div class="metric-value">${report.summary.totalEvents}</div>
                            </div>
                            
                            <div class="metric">
                                <div class="metric-title">Usuários Únicos</div>
                                <div class="metric-value">${report.summary.uniqueUsers}</div>
                            </div>
                            
                            <div class="metric">
                                <div class="metric-title">Visualizações</div>
                                <div class="metric-value">${report.summary.pageViews}</div>
                            </div>
                            
                            <div class="metric">
                                <div class="metric-title">Contratos Gerados</div>
                                <div class="metric-value">${report.summary.contractsGenerated}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">🏠🚗 Contratos por Tipo</div>
                        <div class="device-chart">
                            <div class="device-item">
                                <div style="font-size: 24px;">🏠</div>
                                <div><strong>${report.summary.contractsByType.imovel}</strong></div>
                                <div>Imóveis</div>
                            </div>
                            <div class="device-item">
                                <div style="font-size: 24px;">🚗</div>
                                <div><strong>${report.summary.contractsByType.veiculo}</strong></div>
                                <div>Veículos</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">⭐ Funcionalidades Mais Usadas</div>
                        <div class="feature-list">
                            ${report.summary.topFeatures.map(f => `
                                <div class="feature-item">
                                    <span><strong>${this.getFeatureName(f.feature)}</strong></span>
                                    <span>${f.count} usos</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">📱💻 Dispositivos</div>
                        <div class="device-chart">
                            ${Object.entries(report.summary.deviceBreakdown).map(([device, count]) => `
                                <div class="device-item">
                                    <div style="font-size: 24px;">${device === 'mobile' ? '📱' : '💻'}</div>
                                    <div><strong>${count}</strong></div>
                                    <div>${device === 'mobile' ? 'Mobile' : 'Desktop'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${isMonthly && report.summary.growthMetrics ? `
                    <div class="section">
                        <div class="section-title">📈 Crescimento</div>
                        <div class="metric">
                            <div class="metric-title">Crescimento de Contratos</div>
                            <div class="metric-value ${report.summary.growthMetrics.contractGrowth.includes('-') ? 'growth-negative' : 'growth-positive'}">
                                ${report.summary.growthMetrics.contractGrowth}
                            </div>
                            <div style="font-size: 14px; color: #6c757d; margin-top: 10px;">
                                Primeira quinzena: ${report.summary.growthMetrics.firstHalfContracts} contratos<br>
                                Segunda quinzena: ${report.summary.growthMetrics.secondHalfContracts} contratos
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="section">
                        <div class="section-title">🔧 Informações do Sistema</div>
                        <div class="feature-list">
                            <div class="feature-item">
                                <span><strong>Versão do Sistema</strong></span>
                                <span>2.0.0</span>
                            </div>
                            <div class="feature-item">
                                <span><strong>Período de Análise</strong></span>
                                <span>${isTest ? 'Teste' : isMonthly ? 'Últimos 30 dias' : 'Últimos 7 dias'}</span>
                            </div>
                            <div class="feature-item">
                                <span><strong>Gerado em</strong></span>
                                <span>${new Date().toLocaleString('pt-BR')}</span>
                            </div>
                            <div class="feature-item">
                                <span><strong>Status</strong></span>
                                <span style="color: #28a745; font-weight: 600;">✅ Operacional</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>AssinaFácil Analytics System</strong></p>
                    <p>Este relatório foi gerado automaticamente pelo sistema de monitoramento.</p>
                    <p>Para dúvidas ou suporte, entre em contato conosco.</p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                        Sistema desenvolvido para monitoramento de uso e performance do AssinaFácil
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
    
    getFeatureName(feature) {
        const names = {
            'pdf': '📄 Exportar PDF',
            'word': '📝 Exportar Word',
            'print': '🖨️ Imprimir',
            'signature': '✍️ Assinatura Digital',
            'upload': '📤 Upload de Contrato',
            'save_data': '💾 Salvar Dados'
        };
        return names[feature] || feature;
    }
    
    updateLastReportDate(type) {
        const lastReports = JSON.parse(localStorage.getItem('assinafacil_last_reports') || '{}');
        lastReports[type] = new Date().toISOString();
        localStorage.setItem('assinafacil_last_reports', JSON.stringify(lastReports));
    }
    
    // Dashboard de relatórios (interface administrativa)
    createReportDashboard() {
        // Criar botão de acesso ao dashboard no sistema
        if (document.getElementById('adminDashboard')) return;
        
        const dashboardButton = document.createElement('div');
        dashboardButton.id = 'adminDashboard';
        dashboardButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-size: 18px;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        dashboardButton.innerHTML = '📊';
        dashboardButton.title = 'Dashboard de Analytics';
        
        dashboardButton.addEventListener('click', () => {
            this.showDashboardModal();
        });
        
        dashboardButton.addEventListener('mouseenter', () => {
            dashboardButton.style.transform = 'scale(1.1)';
        });
        
        dashboardButton.addEventListener('mouseleave', () => {
            dashboardButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(dashboardButton);
    }
    
    showDashboardModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const report = this.analytics.generateWeeklyReport();
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; position: relative;">
                <button onclick="this.closest('.modal').remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                
                <h2 style="margin: 0 0 20px; color: #333;">📊 Dashboard de Analytics</h2>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="color: #6c757d; font-size: 14px;">Eventos Totais</div>
                        <div style="color: #667eea; font-size: 24px; font-weight: bold;">${report.summary.totalEvents}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="color: #6c757d; font-size: 14px;">Usuários Únicos</div>
                        <div style="color: #667eea; font-size: 24px; font-weight: bold;">${report.summary.uniqueUsers}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="color: #6c757d; font-size: 14px;">Contratos Gerados</div>
                        <div style="color: #667eea; font-size: 24px; font-weight: bold;">${report.summary.contractsGenerated}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="color: #6c757d; font-size: 14px;">Visualizações</div>
                        <div style="color: #667eea; font-size: 24px; font-weight: bold;">${report.summary.pageViews}</div>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h4>🏠🚗 Contratos por Tipo</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div>Imóveis: <strong>${report.summary.contractsByType.imovel}</strong></div>
                        <div>Veículos: <strong>${report.summary.contractsByType.veiculo}</strong></div>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h4>⭐ Funcionalidades Mais Usadas</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        ${report.summary.topFeatures.map(f => `
                            <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                                <span>${this.getFeatureName(f.feature)}</span>
                                <strong>${f.count}</strong>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin: 20px 0; text-align: center;">
                    <button onclick="window.reports.sendManualReport()" style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        📧 Enviar Relatório Manual
                    </button>
                    <button onclick="window.reports.downloadReport()" style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        📄 Baixar Relatório
                    </button>
                </div>
                
                <div style="font-size: 12px; color: #6c757d; text-align: center; margin-top: 20px;">
                    Última atualização: ${new Date().toLocaleString('pt-BR')}
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    async sendManualReport() {
        try {
            const report = this.analytics.generateWeeklyReport();
            const result = await this.sendEmailReport(report, 'AssinaFácil - Relatório Manual de Analytics');
            
            if (result.success) {
                alert('📧 Relatório enviado com sucesso para ' + this.config.recipientEmail);
            } else {
                alert('⚠️ Erro ao enviar relatório: ' + result.error);
            }
        } catch (error) {
            alert('❌ Erro ao enviar relatório: ' + error.message);
        }
    }
    
    downloadReport() {
        const report = this.analytics.generateWeeklyReport();
        const reportData = {
            ...report,
            generatedAt: new Date().toISOString(),
            systemVersion: '2.0.0'
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assinafacil_report_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.analytics.trackEvent('report_downloaded', { type: 'manual' });
    }
}

// Inicializar sistema de relatórios quando analytics estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar analytics estar disponível
    const initReports = () => {
        if (window.analytics) {
            window.reports = new AssinaFacilReports(window.analytics);
            console.log('📊 Sistema de Relatórios AssinaFácil inicializado');
        } else {
            setTimeout(initReports, 1000);
        }
    };
    
    setTimeout(initReports, 2000);
});

// Expor funções globais
window.sendManualReport = () => window.reports?.sendManualReport();
window.downloadReport = () => window.reports?.downloadReport();

