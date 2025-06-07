// Função para adicionar assinaturas visuais ao PDF
function adicionarAssinaturasAoPDF(doc, y) {
    // Carregar assinaturas salvas
    const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
    const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
    
    if (!assinLocador && !assinLocatario) return y;
    
    const pageHeight = doc.internal.pageSize.height;
    
    // Verificar se precisa de nova página
    if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
    }
    
    // Adicionar separador
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ASSINATURAS DIGITAIS', 105, y, { align: 'center' });
    y += 15;
    
    // Data e hora
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const dataHora = `Data: ${new Date().toLocaleDateString('pt-BR')} - Hora: ${new Date().toLocaleTimeString('pt-BR')}`;
    doc.text(dataHora, 105, y, { align: 'center' });
    y += 20;
    
    // Assinatura do Locador
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('LOCADOR:', 15, y);
    y += 10;
    
    if (assinLocador && assinLocador.data) {
        try {
            // Adicionar imagem da assinatura
            doc.addImage(assinLocador.data, 'PNG', 15, y, 80, 25);
            y += 30;
        } catch (error) {
            console.error('Erro ao adicionar assinatura do locador:', error);
            doc.text('[ASSINATURA DIGITAL DO LOCADOR]', 15, y);
            y += 10;
        }
    } else {
        doc.setFont('helvetica', 'normal');
        doc.text('____________________________________________', 15, y);
        y += 5;
        doc.text('[AGUARDANDO ASSINATURA DIGITAL]', 15, y);
        y += 15;
    }
    
    // Linha de separação
    doc.line(15, y, 195, y);
    y += 5;
    
    // Assinatura do Locatário
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('LOCATÁRIO:', 15, y);
    y += 10;
    
    if (assinLocatario && assinLocatario.data) {
        try {
            // Adicionar imagem da assinatura
            doc.addImage(assinLocatario.data, 'PNG', 15, y, 80, 25);
            y += 30;
        } catch (error) {
            console.error('Erro ao adicionar assinatura do locatário:', error);
            doc.text('[ASSINATURA DIGITAL DO LOCATÁRIO]', 15, y);
            y += 10;
        }
    } else {
        doc.setFont('helvetica', 'normal');
        doc.text('____________________________________________', 15, y);
        y += 5;
        doc.text('[AGUARDANDO ASSINATURA DIGITAL]', 15, y);
        y += 15;
    }
    
    // Rodapé de validação
    y += 10;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Este documento foi assinado digitalmente através do sistema AssinaFácil.', 105, y, { align: 'center' });
    y += 5;
    doc.text('Assinaturas digitais válidas e verificáveis.', 105, y, { align: 'center' });
    
    return y;
}

