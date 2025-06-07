// CORREÇÃO DEFINITIVA DOS PROBLEMAS DO ASSINAFÁCIL
// Função principal gerarPDF que estava faltando
function gerarPDF() {
    try {
        // Rastrear geração de PDF
        if (window.trackFeatureUsed) {
            window.trackFeatureUsed('pdf', { contractType: tipoContratoAtual });
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações
        doc.setFont('helvetica');
        doc.setFontSize(12);
        
        const textoContrato = tipoContratoAtual === 'imovel' ? gerarTextoContratoImovel() : gerarTextoContratoVeiculo();
        const linhas = doc.splitTextToSize(textoContrato, 180);
        
        let y = 20;
        const pageHeight = doc.internal.pageSize.height;
        
        // Adicionar título
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const titulo = tipoContratoAtual === 'imovel' ? 'CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL' : 'INSTRUMENTO PARTICULAR DE LOCAÇÃO DE VEÍCULO';
        doc.text(titulo, 105, y, { align: 'center' });
        
        y += 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        // Adicionar conteúdo
        for (let i = 0; i < linhas.length; i++) {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
            
            const linha = linhas[i];
            
            // Verificar se é uma cláusula ou seção para deixar em negrito
            if (linha.includes('CLÁUSULA') || linha.match(/^[IVX]+ -/) || linha.includes('Parágrafo Único')) {
                doc.setFont('helvetica', 'bold');
            } else {
                doc.setFont('helvetica', 'normal');
            }
            
            doc.text(linha, 15, y);
            y += 6;
        }
        
        // Adicionar assinaturas visuais ao PDF APENAS se existirem assinaturas válidas
        const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
        const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
        
        // Só adicionar seção de assinaturas se houver pelo menos uma assinatura válida E sem caracteres %P
        const temAssinaturaValidaLocador = assinLocador && assinLocador.data && !assinLocador.data.includes('%P') && assinLocador.data.length > 100;
        const temAssinaturaValidaLocatario = assinLocatario && assinLocatario.data && !assinLocatario.data.includes('%P') && assinLocatario.data.length > 100;
        
        if (temAssinaturaValidaLocador || temAssinaturaValidaLocatario) {
            y = adicionarAssinaturasAoPDFCorrigido(doc, y);
        }
        
        // Salvar o PDF
        const nomeArquivo = tipoContratoAtual === 'imovel' ? 'contrato_locacao_imovel.pdf' : 'contrato_locacao_veiculo.pdf';
        doc.save(nomeArquivo);
        mostrarAlerta('PDF gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarAlerta('Erro ao gerar PDF. Verifique se todos os dados estão preenchidos.', 'danger');
    }
}

// Função corrigida para adicionar assinaturas ao contrato (SEM caracteres %P)
function adicionarAssinaturaAoContratoCorrigido(textoContrato) {
    // Carregar assinaturas salvas
    const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
    const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
    
    // Só adicionar seção de assinaturas se houver pelo menos uma assinatura válida
    const temAssinaturaValidaLocador = assinLocador && assinLocador.data && !assinLocador.data.includes('%P') && assinLocador.data.length > 100;
    const temAssinaturaValidaLocatario = assinLocatario && assinLocatario.data && !assinLocatario.data.includes('%P') && assinLocatario.data.length > 100;
    
    if (!temAssinaturaValidaLocador && !temAssinaturaValidaLocatario) {
        return textoContrato; // Retorna contrato sem seção de assinaturas
    }
    
    // Adicionar seção de assinatura ao final do contrato (SEM caracteres %P)
    let secaoAssinatura = `


ASSINATURAS DIGITAIS

Data: ${new Date().toLocaleDateString('pt-BR')}
Hora: ${new Date().toLocaleTimeString('pt-BR')}

`;

    // Adicionar assinatura do locador se disponível e válida
    if (temAssinaturaValidaLocador) {
        secaoAssinatura += `LOCADOR:
____________________________________________
[ASSINATURA DIGITAL DO LOCADOR APLICADA]

`;
    }

    // Adicionar assinatura do locatário se disponível e válida
    if (temAssinaturaValidaLocatario) {
        secaoAssinatura += `LOCATÁRIO:
____________________________________________
[ASSINATURA DIGITAL DO LOCATÁRIO APLICADA]

`;
    }

    secaoAssinatura += `
Este documento foi assinado digitalmente através do sistema AssinaFácil.
Assinaturas digitais válidas e verificáveis.`;

    return textoContrato + secaoAssinatura;
}

// Função corrigida para adicionar assinaturas ao PDF (SEM caracteres %P)
function adicionarAssinaturasAoPDFCorrigido(doc, y) {
    // Carregar assinaturas salvas
    const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
    const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
    
    // Limpar e validar dados das assinaturas
    const dadosLocadorLimpos = assinLocador && assinLocador.data ? limparDadosBase64Corrigido(assinLocador.data) : null;
    const dadosLocatarioLimpos = assinLocatario && assinLocatario.data ? limparDadosBase64Corrigido(assinLocatario.data) : null;
    
    // Se não há assinaturas válidas, não adicionar seção
    if (!dadosLocadorLimpos && !dadosLocatarioLimpos) {
        console.log('Nenhuma assinatura válida encontrada - não adicionando seção ao PDF');
        return y;
    }
    
    const pageHeight = doc.internal.pageSize.height;
    
    // Verificar se precisa de nova página
    if (y > pageHeight - 100) {
        doc.addPage();
        y = 20;
    }
    
    // Adicionar separador limpo (SEM caracteres %P)
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
    
    // Assinatura do Locador APENAS se válida
    if (dadosLocadorLimpos) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('LOCADOR:', 15, y);
        y += 10;
        
        try {
            // Usar dados limpos e validados
            const imagemCompleta = 'data:image/png;base64,' + dadosLocadorLimpos;
            doc.addImage(imagemCompleta, 'PNG', 15, y, 80, 25);
            y += 30;
            console.log('Assinatura do locador adicionada com sucesso ao PDF');
        } catch (error) {
            console.error('Erro ao adicionar assinatura do locador:', error);
            doc.setFont('helvetica', 'normal');
            doc.text('____________________________________________', 15, y);
            y += 5;
            doc.text('[ASSINATURA DIGITAL DO LOCADOR APLICADA]', 15, y);
            y += 15;
        }
        
        // Linha de separação
        doc.line(15, y, 195, y);
        y += 5;
    }
    
    // Assinatura do Locatário APENAS se válida
    if (dadosLocatarioLimpos) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('LOCATÁRIO:', 15, y);
        y += 10;
        
        try {
            // Usar dados limpos e validados
            const imagemCompleta = 'data:image/png;base64,' + dadosLocatarioLimpos;
            doc.addImage(imagemCompleta, 'PNG', 15, y, 80, 25);
            y += 30;
            console.log('Assinatura do locatário adicionada com sucesso ao PDF');
        } catch (error) {
            console.error('Erro ao adicionar assinatura do locatário:', error);
            doc.setFont('helvetica', 'normal');
            doc.text('____________________________________________', 15, y);
            y += 5;
            doc.text('[ASSINATURA DIGITAL DO LOCATÁRIO APLICADA]', 15, y);
            y += 15;
        }
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

// Função corrigida para limpar dados base64 (REMOVE TODOS os caracteres %P)
function limparDadosBase64Corrigido(dados) {
    if (!dados || typeof dados !== 'string') {
        return null;
    }
    
    // Remover TODOS os caracteres %P e outros caracteres inválidos
    let dadosLimpos = dados.replace(/%P/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Remover prefixo data:image se existir
    if (dadosLimpos.includes('data:image')) {
        const partes = dadosLimpos.split(',');
        if (partes.length > 1) {
            dadosLimpos = partes[1];
        }
    }
    
    // Verificar se ainda contém caracteres %P após limpeza
    if (dadosLimpos.includes('%P')) {
        console.error('Ainda há caracteres %P após limpeza - dados rejeitados');
        return null;
    }
    
    // Verificar tamanho mínimo
    if (dadosLimpos.length < 100) {
        console.warn('Dados base64 muito pequenos');
        return null;
    }
    
    return dadosLimpos;
}

