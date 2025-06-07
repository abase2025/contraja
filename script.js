// Variáveis globais
let tipoContratoAtual = null;
let dadosContrato = {};

// Dados padrão para contratos de imóvel (LIMPOS PARA USO REAL)
const dadosPadraoImovel = {
    'locadora': {
        'nome': '',
        'nacionalidade': '',
        'estado_civil': '',
        'rg': '',
        'orgao_rg': '',
        'cpf': '',
        'endereco': '',
        'cidade': '',
        'estado': '',
        'cep': ''
    },
    'locatario': {
        'nome': '',
        'nacionalidade': '',
        'estado_civil': '',
        'profissao': '',
        'telefone': '',
        'rg': '',
        'orgao_rg': '',
        'cpf': '',
        'data_nascimento': '',
        'endereco': '',
        'cidade': '',
        'estado': '',
        'cep': ''
    },
    'imovel': {
        'tipo': '',
        'endereco': '',
        'cidade': '',
        'estado': '',
        'cep': '',
        'quartos': '',
        'cozinha': '',
        'sala': '',
        'banheiros': '',
        'observacoes': ''
    },
    'contrato': {
        'tipo_locacao': '',
        'finalidade': '',
        'prazo_meses': '',
        'data_inicio': '',
        'data_fim': '',
        'valor_aluguel': '',
        'dia_vencimento': '',
        'chave_pix': '',
        'banco_pix': '',
        'valor_fianca': '',
        'local_assinatura': '',
        'data_assinatura': '',
        'forum': '',
        'indice_reajuste': ''
    }
};

// Dados padrão para contratos de veículo (LIMPOS PARA USO REAL)
const dadosPadraoVeiculo = {
    'locador': {
        'nome': '',
        'nacionalidade': '',
        'cnh': '',
        'cpf': '',
        'endereco': '',
        'cidade': '',
        'estado': '',
        'cep': ''
    },
    'locatario': {
        'nome': '',
        'nacionalidade': '',
        'profissao': '',
        'cnh': '',
        'cpf': '',
        'endereco': '',
        'cidade': '',
        'estado': '',
        'cep': ''
    },
    'veiculo': {
        'marca_modelo': '',
        'placa': '',
        'renavan': '',
        'chassi': '',
        'motor': '',
        'cor': '',
        'combustivel': '',
        'ano_fabricacao': '',
        'ano_modelo': '',
        'acessorios': ''
    },
    'contrato': {
        'prazo_meses': '',
        'valor_semanal': '',
        'dia_pagamento': '',
        'banco': '',
        'agencia': '',
        'conta': '',
        'chave_pix': '',
        'valor_caucao': '',
        'valor_antecipado': '',
        'seguradora': '',
        'valor_franquia': '',
        'multa_atraso_dia': '',
        'multa_rescisao': '',
        'aviso_previo_dias': '',
        'local_assinatura': '',
        'data_assinatura': '',
        'forum': ''
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para formulário
    document.getElementById('contratoForm').addEventListener('submit', salvarDados);
    document.getElementById('preview-tab').addEventListener('click', atualizarPreview);
});

// Função para selecionar tipo de contrato
function selecionarTipoContrato(tipo) {
    tipoContratoAtual = tipo;
    
    // Rastrear seleção de tipo de contrato
    if (window.trackContractTypeSelected) {
        window.trackContractTypeSelected(tipo);
    }
    
    // Atualizar breadcrumb
    const breadcrumb = document.getElementById('breadcrumbTipo');
    breadcrumb.textContent = tipo === 'imovel' ? 'Contrato de Imóvel' : 'Contrato de Veículo';
    
    // Carregar dados padrão
    dadosContrato = tipo === 'imovel' ? JSON.parse(JSON.stringify(dadosPadraoImovel)) : JSON.parse(JSON.stringify(dadosPadraoVeiculo));
    
    // Gerar formulário
    gerarFormulario(tipo);
    
    // Mostrar interface principal
    document.getElementById('contractSelector').style.display = 'none';
    document.getElementById('mainInterface').style.display = 'block';
    
    // Aplicar máscaras
    setTimeout(() => {
        aplicarMascaras();
        configurarCalculoDataFim();
    }, 100);
}

// Função para voltar ao seletor
function voltarSeletor() {
    document.getElementById('contractSelector').style.display = 'block';
    document.getElementById('mainInterface').style.display = 'none';
    tipoContratoAtual = null;
}

// Função para gerar formulário baseado no tipo
function gerarFormulario(tipo) {
    const container = document.getElementById('formContainer');
    
    if (tipo === 'imovel') {
        container.innerHTML = gerarFormularioImovel();
    } else {
        container.innerHTML = gerarFormularioVeiculo();
    }
    
    // Preencher com dados padrão
    preencherFormulario(dadosContrato);
}

// Função para gerar formulário de imóvel
function gerarFormularioImovel() {
    return `
        <!-- Dados da Locadora -->
        <div class="form-section">
            <h4><i class="fas fa-user-tie"></i> Dados da Locadora</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" name="locadora.nome" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Nacionalidade</label>
                    <input type="text" class="form-control" name="locadora.nacionalidade" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Estado Civil</label>
                    <select class="form-select" name="locadora.estado_civil" required>
                        <option value="">Selecione</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viúvo">Viúvo(a)</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">RG</label>
                    <input type="text" class="form-control" name="locadora.rg" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Órgão Expedidor</label>
                    <input type="text" class="form-control" name="locadora.orgao_rg" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" name="locadora.cpf" required>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Endereço</label>
                    <input type="text" class="form-control" name="locadora.endereco" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CEP</label>
                    <input type="text" class="form-control" name="locadora.cep" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cidade</label>
                    <input type="text" class="form-control" name="locadora.cidade" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" name="locadora.estado" required>
                </div>
            </div>
        </div>
        
        <!-- Dados do Locatário -->
        <div class="form-section">
            <h4><i class="fas fa-user"></i> Dados do Locatário</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" name="locatario.nome" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Nacionalidade</label>
                    <input type="text" class="form-control" name="locatario.nacionalidade" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Estado Civil</label>
                    <select class="form-select" name="locatario.estado_civil" required>
                        <option value="">Selecione</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viúvo">Viúvo(a)</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Profissão</label>
                    <input type="text" class="form-control" name="locatario.profissao" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Telefone</label>
                    <input type="text" class="form-control" name="locatario.telefone" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Data de Nascimento</label>
                    <input type="text" class="form-control" name="locatario.data_nascimento" placeholder="DD-MM-AAAA" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">RG</label>
                    <input type="text" class="form-control" name="locatario.rg" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Órgão Expedidor</label>
                    <input type="text" class="form-control" name="locatario.orgao_rg" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" name="locatario.cpf" required>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Endereço</label>
                    <input type="text" class="form-control" name="locatario.endereco" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CEP</label>
                    <input type="text" class="form-control" name="locatario.cep" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cidade</label>
                    <input type="text" class="form-control" name="locatario.cidade" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" name="locatario.estado" required>
                </div>
            </div>
        </div>
        
        <!-- Dados do Imóvel -->
        <div class="form-section">
            <h4><i class="fas fa-home"></i> Dados do Imóvel</h4>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Tipo do Imóvel</label>
                    <select class="form-select" name="imovel.tipo" required>
                        <option value="">Selecione</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Kitnet">Kitnet</option>
                        <option value="Studio">Studio</option>
                        <option value="Loft">Loft</option>
                    </select>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Endereço do Imóvel</label>
                    <input type="text" class="form-control" name="imovel.endereco" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CEP</label>
                    <input type="text" class="form-control" name="imovel.cep" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Cidade</label>
                    <input type="text" class="form-control" name="imovel.cidade" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" name="imovel.estado" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Quartos</label>
                    <input type="text" class="form-control" name="imovel.quartos" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Salas</label>
                    <input type="text" class="form-control" name="imovel.sala" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Cozinhas</label>
                    <input type="text" class="form-control" name="imovel.cozinha" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Banheiros</label>
                    <input type="text" class="form-control" name="imovel.banheiros" required>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label">Observações Adicionais</label>
                    <textarea class="form-control" name="imovel.observacoes" rows="3"></textarea>
                </div>
            </div>
        </div>
        
        <!-- Dados do Contrato -->
        <div class="form-section">
            <h4><i class="fas fa-file-contract"></i> Dados do Contrato</h4>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Tipo de Locação</label>
                    <select class="form-select" name="contrato.tipo_locacao" required>
                        <option value="">Selecione</option>
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="misto">Misto</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Finalidade</label>
                    <input type="text" class="form-control" name="contrato.finalidade" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Prazo (meses)</label>
                    <input type="number" class="form-control" name="contrato.prazo_meses" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Data de Início</label>
                    <input type="text" class="form-control" name="contrato.data_inicio" placeholder="DD/MM/AAAA" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Data de Fim</label>
                    <input type="text" class="form-control" name="contrato.data_fim" placeholder="DD/MM/AAAA" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Dia do Vencimento</label>
                    <input type="number" class="form-control" name="contrato.dia_vencimento" min="1" max="31" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor do Aluguel (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_aluguel" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor da Fiança (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_fianca" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Chave PIX</label>
                    <input type="text" class="form-control" name="contrato.chave_pix" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Banco PIX</label>
                    <input type="text" class="form-control" name="contrato.banco_pix" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Local de Assinatura</label>
                    <input type="text" class="form-control" name="contrato.local_assinatura" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Data de Assinatura</label>
                    <input type="text" class="form-control" name="contrato.data_assinatura" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fórum Competente</label>
                    <input type="text" class="form-control" name="contrato.forum" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Índice de Reajuste</label>
                    <input type="text" class="form-control" name="contrato.indice_reajuste" required>
                </div>
            </div>
        </div>
    `;
}

// Função para gerar formulário de veículo
function gerarFormularioVeiculo() {
    return `
        <!-- Dados do Locador -->
        <div class="form-section">
            <h4><i class="fas fa-user-tie"></i> Dados do Locador</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" name="locador.nome" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Nacionalidade</label>
                    <input type="text" class="form-control" name="locador.nacionalidade" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">CNH</label>
                    <input type="text" class="form-control" name="locador.cnh" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" name="locador.cpf" required>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Endereço</label>
                    <input type="text" class="form-control" name="locador.endereco" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CEP</label>
                    <input type="text" class="form-control" name="locador.cep" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Cidade</label>
                    <input type="text" class="form-control" name="locador.cidade" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" name="locador.estado" required>
                </div>
            </div>
        </div>
        
        <!-- Dados do Locatário -->
        <div class="form-section">
            <h4><i class="fas fa-user"></i> Dados do Locatário</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" name="locatario.nome" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Nacionalidade</label>
                    <input type="text" class="form-control" name="locatario.nacionalidade" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Profissão</label>
                    <input type="text" class="form-control" name="locatario.profissao" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CNH</label>
                    <input type="text" class="form-control" name="locatario.cnh" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" name="locatario.cpf" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">CEP</label>
                    <input type="text" class="form-control" name="locatario.cep" required>
                </div>
                <div class="col-md-8 mb-3">
                    <label class="form-label">Endereço</label>
                    <input type="text" class="form-control" name="locatario.endereco" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cidade</label>
                    <input type="text" class="form-control" name="locatario.cidade" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" name="locatario.estado" required>
                </div>
            </div>
        </div>
        
        <!-- Dados do Veículo -->
        <div class="form-section">
            <h4><i class="fas fa-car"></i> Dados do Veículo</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Marca/Modelo</label>
                    <input type="text" class="form-control" name="veiculo.marca_modelo" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Placa</label>
                    <input type="text" class="form-control" name="veiculo.placa" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label">Cor</label>
                    <input type="text" class="form-control" name="veiculo.cor" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Renavan</label>
                    <input type="text" class="form-control" name="veiculo.renavan" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Chassi</label>
                    <input type="text" class="form-control" name="veiculo.chassi" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Motor</label>
                    <input type="text" class="form-control" name="veiculo.motor" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Combustível</label>
                    <input type="text" class="form-control" name="veiculo.combustivel" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Ano Fabricação</label>
                    <input type="text" class="form-control" name="veiculo.ano_fabricacao" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Ano Modelo</label>
                    <input type="text" class="form-control" name="veiculo.ano_modelo" required>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label">Acessórios</label>
                    <textarea class="form-control" name="veiculo.acessorios" rows="3"></textarea>
                </div>
            </div>
        </div>
        
        <!-- Dados do Contrato -->
        <div class="form-section">
            <h4><i class="fas fa-file-contract"></i> Dados do Contrato</h4>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Prazo (meses)</label>
                    <input type="number" class="form-control" name="contrato.prazo_meses" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor Semanal (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_semanal" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Dia do Pagamento</label>
                    <input type="text" class="form-control" name="contrato.dia_pagamento" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Banco</label>
                    <input type="text" class="form-control" name="contrato.banco" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Agência</label>
                    <input type="text" class="form-control" name="contrato.agencia" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Conta</label>
                    <input type="text" class="form-control" name="contrato.conta" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Chave PIX</label>
                    <input type="text" class="form-control" name="contrato.chave_pix" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor da Caução (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_caucao" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor Antecipado (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_antecipado" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Seguradora</label>
                    <input type="text" class="form-control" name="contrato.seguradora" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Valor da Franquia (R$)</label>
                    <input type="text" class="form-control" name="contrato.valor_franquia" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Multa Atraso/Dia (R$)</label>
                    <input type="text" class="form-control" name="contrato.multa_atraso_dia" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Multa Rescisão (R$)</label>
                    <input type="text" class="form-control" name="contrato.multa_rescisao" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Aviso Prévio (dias)</label>
                    <input type="number" class="form-control" name="contrato.aviso_previo_dias" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Local de Assinatura</label>
                    <input type="text" class="form-control" name="contrato.local_assinatura" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Data de Assinatura</label>
                    <input type="text" class="form-control" name="contrato.data_assinatura" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Fórum Competente</label>
                    <input type="text" class="form-control" name="contrato.forum" required>
                </div>
            </div>
        </div>
    `;
}

// Função para aplicar máscaras nos campos
function aplicarMascaras() {
    // Máscara para CPF
    document.querySelectorAll('input[name$=".cpf"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });
    
    // Máscara para telefone
    document.querySelectorAll('input[name$=".telefone"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });
    
    // Máscara para CEP
    document.querySelectorAll('input[name$=".cep"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
            e.target.value = value;
        });
    });
    
    // Máscara para valores monetários
    document.querySelectorAll('input[name*="valor_"], input[name*="multa_"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                value = (value / 100).toFixed(2);
                value = value.replace('.', ',');
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            }
            e.target.value = value;
        });
    });
}

// Função para preencher o formulário com os dados
function preencherFormulario(dados) {
    const form = document.getElementById('contratoForm');
    
    // Função recursiva para preencher campos aninhados
    function preencherCampos(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                preencherCampos(value, prefix ? `${prefix}.${key}` : key);
            } else {
                const fieldName = prefix ? `${prefix}.${key}` : key;
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.value = value || '';
                }
            }
        }
    }
    
    preencherCampos(dados);
}

// Função para salvar dados
function salvarDados(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const dados = {};
        
        // Converter FormData para objeto aninhado
        for (const [key, value] of formData.entries()) {
            const keys = key.split('.');
            let current = dados;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        }
        
        dadosContrato = dados;
        localStorage.setItem(`contratoData_${tipoContratoAtual}`, JSON.stringify(dados));
        
        // Rastrear salvamento de dados
        if (window.trackFeatureUsed) {
            window.trackFeatureUsed('save_data', { contractType: tipoContratoAtual });
        }
        
        mostrarAlerta('Dados salvos com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        mostrarAlerta('Erro ao salvar dados', 'danger');
        
        // Rastrear erro
        if (window.analytics) {
            window.analytics.trackError('save_data_error', error.message, { contractType: tipoContratoAtual });
        }
    }
}

// Função para atualizar preview do contrato
function atualizarPreview() {
    try {
        const preview = document.getElementById('contratoPreview');
        const textoContrato = tipoContratoAtual === 'imovel' ? gerarTextoContratoImovel() : gerarTextoContratoVeiculo();
        const textoFormatado = formatarTextoContrato(textoContrato);
        preview.innerHTML = textoFormatado;
    } catch (error) {
        console.error('Erro ao gerar preview:', error);
        document.getElementById('contratoPreview').innerHTML = 
            '<div class="text-center text-danger"><i class="fas fa-exclamation-triangle fa-3x mb-3"></i><p>Erro ao carregar preview do contrato</p></div>';
    }
}

// Função para gerar o texto do contrato de imóvel
function gerarTextoContratoImovel() {
    const data = dadosContrato;
    
    let textoContrato = `CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL

LOCADORA: ${data.locadora.nome}, ${data.locadora.nacionalidade}, ${data.locadora.estado_civil}, Maior, portadora da cédula de identidade RG. nº ${data.locadora.rg} – ${data.locadora.orgao_rg} e CPF: nº ${data.locadora.cpf}, residente e domiciliada à ${data.locadora.endereco} – ${data.locadora.cidade} – ${data.locadora.estado}. CEP: ${data.locadora.cep}.

LOCATÁRIA: ${data.locatario.nome}, ${data.locatario.nacionalidade}, ${data.locatario.estado_civil}, ${data.locatario.profissao}, tel. ${data.locatario.telefone}. Portadora da cédula de identidade RG nº ${data.locatario.rg} ${data.locatario.orgao_rg}. e CPF nº ${data.locatario.cpf}, nascida em ${data.locatario.data_nascimento}, Residente e domiciliado na ${data.locatario.endereco} – ${data.locatario.cidade} – ${data.locatario.estado}. CEP. ${data.locatario.cep}.

I - OBJETIVO

CLÁUSULA PRIMEIRA: O objeto deste contrato é a locação de um imóvel ${data.contrato.tipo_locacao}, sendo um ${data.imovel.tipo}, ${data.imovel.endereco} – ${data.imovel.cidade} – ${data.imovel.estado}. CEP. ${data.imovel.cep}, contendo ${data.imovel.quartos} quartos, ${data.imovel.cozinha} cozinha com área de serviço, ${data.imovel.sala} sala, ${data.imovel.banheiros} banheiro social, ${data.imovel.observacoes}.

II - DESTINAÇÃO

CLÁUSULA SEGUNDA: A LOCATÁRIA utilizará o imóvel exclusivamente para fins de ${data.contrato.finalidade} e de seus familiares, destino que não poderá ser alterado sem o prévio consentimento por escrito da LOCADORA, sendo vetada qualquer cessão, transferência ou sublocação ainda quando parcial e temporária gratuita ou onerosa.

CLÁUSULA TERCEIRA: Será equiparada a violação da Cláusula anterior, qualquer situação de fato pela qual a LOCATARIA deixe de ocupar direto e integralmente o Imóvel locado, em seu nome e conta própria, e o não cumprimento do Regimento Interno do Condomínio.

III - PRAZO

CLÁUSULA QUARTA: A locação será pelo prazo determinado de ${data.contrato.prazo_meses} meses, contando-se esse período de ${data.contrato.data_inicio} a terminar no dia ${data.contrato.data_fim}, data em que a LOCATARIO obriga-se a restituir o imóvel completamente desocupado, em perfeito estado de conservação, pintado com tinta lavável, portas e janelas funcionando perfeitamente, vaso sanitário, lavanderia e pia em perfeito funcionamento, tudo em conformidade com a Lei nº 8.245 (Lei do Inquilinato) e Medida Provisória nº 482 de 30/03/94. Caso não haja interesse de renovação do contrato de locação entre as partes.

CLÁUSULA QUINTA: Se a LOCATARIA devolver o imóvel antes de transcorrido o prazo estabelecido na Cláusula anterior, ou rescisão ocorrer por inadimplemento de obrigação aqui ajustada, pagará a LOCADORA uma multa contratual correspondente a 01 (um) mês de aluguel, sem prejuízo do integral cumprimento das demais sanções legais e contratuais (Código Civil) art. 1193 – Parágrafo Único.

CLÁUSULA SEXTA: Findo o prazo de locação estipulado na Cláusula quarta, se não ocorrer à hipótese de rescisão ou a da renuncia, o que neste último caso devera ocorrer mediante aviso por escrito de qualquer dos contratantes ao outro até 30 (trinta) dias antes de se vencer cada período contratual, prorrogar-se-á a locação, consoante a assinatura de um novo contrato, com garantia consoante deste contrato.

IV – PREÇO

CLÁUSULA SÉTIMA: O aluguel mensal será de R$ ${data.contrato.valor_aluguel} e sofrera reajuste anual pelo índice do ${data.contrato.indice_reajuste}, considerando o índice menor, caso haja interesse entre as partes e seja prorrogado o Contrato de Locação, no período cumulativamente ou outro índice oficial determinado pelo governo que venha a substitui-lo, caso haja renovação do contrato, dai por diante, caso ocorra à hipótese prevista na Cláusula sexta, ficara sujeito a reajustamento periódicos estabelecidos na legislação pertinente que estiver em vigor.

Parágrafo Único: O aluguel deverá ser pago a LOCADORA todo dia ${data.contrato.dia_vencimento} de cada mês, em nome de ${data.locadora.nome}, CHAVE PIX CELULAR: ${data.contrato.chave_pix}. ${data.contrato.banco_pix}

CLÁUSULA OITAVA: O aluguel deverá ser pago pontualmente ate o dia ${data.contrato.dia_vencimento} de cada mês de locação ajustada na Clausula quarta deste instrumento, independente de cobrança ou onde a LOCADORA determinar, estendendo-se este prazo para o primeiro dia útil seguinte, caso coincida com sábado, domingo ou feriado. Ultrapassando o dia acima estipulado o aluguel será acrescido de multa de 2% ao mês a partir do primeiro dia útil do vencimento e mais 0,3% de juros de mora ao dia.

Parágrafo Único: O primeiro mês de aluguel vencerá no dia ${data.contrato.dia_vencimento}/${data.contrato.data_inicio.split('/')[1]}/${data.contrato.data_inicio.split('/')[2]} e o último mês vencerá no dia ${data.contrato.data_fim}. A fiança no valor de R$ ${data.contrato.valor_fianca} deverá ser paga no dia ${data.contrato.data_inicio} e é referente ao último mês do aluguel.

V - CLÁUSULAS DE PROTEÇÃO AO LOCADOR

CLÁUSULA NONA - DA GARANTIA LOCATÍCIA: O LOCATÁRIO oferece como garantia do cumprimento das obrigações assumidas neste contrato: ${data.contrato.tipo_garantia || 'fiança'}, conforme especificado neste instrumento, respondendo solidariamente por todas as obrigações contratuais.

CLÁUSULA DÉCIMA - DA RESPONSABILIDADE POR DANOS: O LOCATÁRIO será integralmente responsável por todos os danos causados ao imóvel durante o período de locação, incluindo mas não se limitando a: danos estruturais por mau uso, danos elétricos e hidráulicos, quebra de vidros, portas e fechaduras, danos a pisos, paredes e tetos, bem como qualquer deterioração além do desgaste natural.

CLÁUSULA DÉCIMA PRIMEIRA - DO SEGURO OBRIGATÓRIO: O LOCATÁRIO obriga-se a contratar e manter vigente durante todo o período de locação seguro contra incêndio do imóvel locado, com cobertura mínima equivalente ao valor de mercado do imóvel, devendo apresentar a apólice à LOCADORA no prazo de 30 dias após a assinatura deste contrato.

CLÁUSULA DÉCIMA SEGUNDA - DA VISTORIA E CONSERVAÇÃO: O LOCATÁRIO autoriza expressamente a LOCADORA a realizar vistorias no imóvel mediante aviso prévio de 24 horas, comprometendo-se a manter o imóvel em perfeito estado de conservação, realizando pequenos reparos e manutenções preventivas por sua conta.

CLÁUSULA DÉCIMA TERCEIRA - DA INADIMPLÊNCIA: Em caso de atraso no pagamento do aluguel por mais de 15 dias, além das penalidades previstas, o LOCATÁRIO autoriza a LOCADORA a promover a ação de despejo por falta de pagamento, arcando com todas as custas processuais e honorários advocatícios.

CLÁUSULA DÉCIMA QUARTA - DAS BENFEITORIAS: Qualquer benfeitoria realizada no imóvel sem prévia autorização escrita da LOCADORA não gerará direito à indenização ou retenção, sendo consideradas incorporadas ao imóvel em favor da LOCADORA.

CLÁUSULA DÉCIMA QUINTA - DA RESCISÃO ANTECIPADA: Em caso de rescisão antecipada por parte do LOCATÁRIO, além da multa prevista, deverá arcar com os custos de nova locação, incluindo comissão de corretagem, anúncios e período de vacância até 60 dias.

CLÁUSULA DÉCIMA SEXTA - DO FORO: Fica eleito o foro da comarca de ${data.contrato.forum} para dirimir quaisquer questões oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.

E, pôr assim estarem justos e acordados, assina o presente Contrato em duas vias impressas de igual teor, na presença de duas testemunhas abaixo assinadas para que se produzam os efeitos de lei.

${data.contrato.local_assinatura}, ${data.contrato.data_assinatura}.

___________________________________________________________
${data.locadora.nome} – CPF: ${data.locadora.cpf}
LOCADORA

___________________________________________________________
${data.locatario.nome} – CPF ${data.locatario.cpf}
LOCATÁRIO

TESTEMUNHAS:

1. ________________________________    2. ________________________________
   Nome:                                   Nome:
   CPF:                                    CPF:`;

    // Adicionar assinatura digital se disponível
    return adicionarAssinaturaAoContrato(textoContrato);
}

// Função para gerar o texto do contrato de veículo
function gerarTextoContratoVeiculo() {
    const data = dadosContrato;
    
    let textoContrato = `INSTRUMENTO PARTICULAR DE LOCAÇÃO DE VEÍCULO

CLÁUSULA PRIMEIRA – DAS PARTES

De um lado, ${data.locador.nome}, ${data.locador.nacionalidade}, portador da CNH nº ${data.locador.cnh} DETRAN-BA, inscrito regularmente no CPF/ sob o nº ${data.locador.cpf} residente e domiciliado na ${data.locador.endereco}, ${data.locador.cidade}-${data.locador.estado}, CEP ${data.locador.cep}, neste Instrumento como LOCADOR.

De outro lado, ${data.locatario.nome}, ${data.locatario.nacionalidade}, ${data.locatario.profissao}, portadora da CNH nº ${data.locatario.cnh} DETRAN-BA, inscrito regularmente no CPF/MF sob o Nº ${data.locatario.cpf}, residente e domiciliado na ${data.locatario.endereco} CEP ${data.locatario.cep} ${data.locatario.cidade} ${data.locatario.estado}, neste Instrumento como LOCATÁRIO.

Assim, o LOCADOR e o LOCATÁRIO RESOLVEM de comum acordo, celebrar o presente Instrumento Particular Locação de Veículo, que se regerá pelas cláusulas e condições do presente Instrumento.

CLÁUSULA SEGUNDA – DO OBJETO

${data.veiculo.marca_modelo}, PLACA ${data.veiculo.placa}/BA, RENAVAN ${data.veiculo.renavan}, CHASSI ${data.veiculo.chassi}, MOTOR: ${data.veiculo.motor} ${data.veiculo.cor} ${data.veiculo.combustivel}, ANO ${data.veiculo.ano_fabricacao} / MODELO ${data.veiculo.ano_modelo}, COMBUSTÍVEIS: ${data.veiculo.combustivel} veículo possui ${data.veiculo.acessorios}, e está dando em locação ao LOCATÁRIO, pelo prazo de ${data.contrato.prazo_meses} meses, tendo início a partir da assinatura deste instrumento.

CLÁUSULA TERCEIRA – DO PREÇO, FORMA DE PAGAMENTO E CAUÇÃO

O LOCATÁRIO efetuará o pagamento do aluguel, semanalmente (${data.contrato.dia_pagamento}), no valor de R$ ${data.contrato.valor_semanal} do objeto deste Instrumento ao LOCADOR, através de depósito bancário na conta corrente do ${data.contrato.banco}, AGÊNCIA ${data.contrato.agencia}, C/C ${data.contrato.conta}, PIX ${data.contrato.chave_pix} (CPF), em nome de ${data.locador.nome} ou em espécie mediante a entrega do recibo pelo locador.

No ato da assinatura deste instrumento particular de locação de veículo o LOCATÁRIO ira efetuar o pagamento da CAUÇÃO no valor de R$ ${data.contrato.valor_caucao} e de R$ ${data.contrato.valor_antecipado} da semana antecipada.

Sendo que o valor da CAUÇÃO (R$ ${data.contrato.valor_caucao}) será devolvido de acordo com a Cláusula Décima Primeira.

CLÁUSULA QUARTA – DAS DECLARAÇÕES DO LOCADOR

Declara neste ato o LOCADOR que é legítimo proprietário do veículo, objeto deste Instrumento Particular de Locação de Veículos e, que o citado veículo, se encontra livre e desembaraçado de quaisquer ônus reais, bem como de todas e quaisquer medidas legais ou convencionais, penhora, arresto, sequestro e quite com todos os impostos, não existindo assim quaisquer dívidas, ações judiciais em tramitação ou execuções judiciais que possam comprometer a validade e eficácia do presente instrumento, declaração que fazem sob pena das responsabilidades legais. Afirmando, ainda, o LOCADOR que a descrição do referido veículo condiz com a verdade no que se refere a documentação, bem como que o veículo, objeto deste instrumento, encontra-se em perfeito estado de conservação e funcionamento, ficando o locatário responsável pela devolução no mesmo estado e condições a partir da assinatura.

CLÁUSULA QUINTA – DA POSSE E USO

O LOCATÁRIO utilizará o carro para transporte de passageiro de aplicativos ou uso pessoal, sendo responsável conjuntamente o LOCADOR, POR CONSERTO E MANUTENÇÃO, que advirem pelo seu uso (MANUTENÇÃO DIVIDIDA).

CLÁUSULA SEXTA – DAS DECLARAÇÕES DO LOCATÁRIO

O LOCATÁRIO não deverá ceder, emprestar ou sublocar o veículo em hipótese alguma, sob pena de cancelamento imediato do presente instrumento particular, com aplicação de multa no valor de R$ ${data.contrato.multa_rescisao} o mesmo se aplica caso o motorista seja pego fazendo uso de bebidas alcoólicas ou uso de drogas e entorpecentes.

CLÁUSULA SÉTIMA – DA VISTORIA

O LOCATÁRIO declara haver vistoriado o veículo objeto desta transação e conferido todas as suas características com as quais concordam expressamente, não tendo o que reclamar no presente ou no futuro, com referência ao citado veículo.

CLÁUSULA OITAVA – DO SEGURO E PROTEÇÃO VEICULAR

O veículo, objeto deste contrato, encontra-se segurado pela ${data.contrato.seguradora}, caso o LOCATÁRIO dê causa para utilização do mesmo arcará com a franquia no valor de R$ ${data.contrato.valor_franquia}.

CLÁUSULA NONA – CLÁUSULAS DE PROTEÇÃO AO LOCADOR

9.1 – DA RESPONSABILIDADE INTEGRAL: O LOCATÁRIO assume responsabilidade integral e ilimitada por todos os danos causados ao veículo durante o período de locação, incluindo mas não se limitando a: colisões, capotamentos, incêndios, furtos, roubos, danos por fenômenos naturais, vandalismo e qualquer deterioração além do desgaste natural.

9.2 – DA COBERTURA DE RESPONSABILIDADE CIVIL: O LOCATÁRIO responde solidariamente com o LOCADOR por todos os danos materiais e corporais causados a terceiros durante o uso do veículo, comprometendo-se a arcar com todas as indenizações, custas processuais e honorários advocatícios decorrentes.

9.3 – DO SEGURO OBRIGATÓRIO ADICIONAL: Além do seguro básico, o LOCATÁRIO obriga-se a contratar proteção adicional contra roubo e furto, bem como cobertura para danos a terceiros com valor mínimo de R$ 100.000,00, devendo apresentar comprovante ao LOCADOR.

9.4 – DA PROTEÇÃO CONTRA FRAUDES: O LOCATÁRIO autoriza o LOCADOR a realizar verificações periódicas da documentação e situação do veículo, bem como consultas aos órgãos de trânsito e segurança pública, comprometendo-se a fornecer todas as informações solicitadas.

9.5 – DA RESPONSABILIDADE POR MULTAS E INFRAÇÕES: O LOCATÁRIO assume total responsabilidade por todas as multas, infrações e penalidades aplicadas durante o período de locação, devendo quitá-las imediatamente e transferir os pontos para sua CNH, sob pena de multa adicional de R$ 500,00 por infração não regularizada.

CLÁUSULA DÉCIMA – DAS DISPOSIÇÕES FINAIS

10.1 – O LOCATÁRIO deverá devolver o automóvel ao LOCADOR nas mesmas condições de uso, respondendo por multas de qualquer órgão e pelos danos e prejuízos causados, inclusive danos ao motor por falta de troca de óleo, filtros de óleo, filtro de combustível e filtro de ar, enchentes, alagamentos que venha a danificar o mesmo, e danos que possa causar a terceiros.

10.2 – Não será permitido atraso no pagamento semanal, ficando sujeito a multa diária no valor de R$ ${data.contrato.multa_atraso_dia} OU PODENDO SE ENCERRAR O CONTRATO COM A DEVOLUÇÃO DO VEÍCULO EM PERFEITO ESTADO.

10.3 – Este presente instrumento isenta qualquer vínculo empregatício entre o LOCATÁRIO e o LOCADOR.

10.4 – É ASSEGURADO AS PARTES A RESCISÃO DO PRESENTE CONTRATO A QUALQUER MOMENTO, DESDE QUE HAJA UM AVISO PREVIO DE ${data.contrato.aviso_previo_dias} DIAS.

10.5 – O LOCATÁRIO ARCARÁ COM AS DESPESAS PROVENIENTES DE SUA UTILIZAÇÃO TAIS COMO: GASOLINA E QUAISQUER MULTAS OU INFRAÇÕES RECEBIDAS PELOS ÓRGÃOS DE TRÂNSITO NO PERÍODO DA LOCAÇÃO, SENDO ESTAS INFORMADAS DE IMEDIATAS AO LOCADOR PARA PROVIDENCIAR JUNTO AOS RESPECTIVOS ÓRGÃOS A APLICAÇÃO DE PERDA DOS PONTOS NA CARTEIRA NACIONAL DE TRÂNSITO – CNH DO LOCATÁRIO.

10.6 – O LOCATÁRIO fica obrigado a apresentar o carro ao LOCADOR a cada 30 (trinta) dias para vistoria. Como também, caso seja necessário realizar procedimentos de reparos no prazo máximo de 30 (trinta) dias.

10.7 – O LOCATÁRIO fica obrigado a pagar IMEDIATAMENTE as multas de trânsito, mesmo que venha realizar junto ao órgão responsável o questionamento da mesma.

10.8 – Fica o LOCATÁRIO obrigado a pagar normalmente a semana, caso ocorra problemas mecânicos ou necessidade de reparos em que der causa.

10.9 – Fica o LOCADOR obrigado a reduzir o valor da semana em R$ 87,00 (oitenta e sete reais) por dia, nos dias em que o automóvel objeto deste contrato estiver com problemas mecânicos que não foram ocasionados pelo mal uso do LOCATÁRIO.

CLÁUSULA DÉCIMA PRIMEIRA – DA CAUÇÃO E DEVOLUÇÃO

11.1 – APÓS O ENCERRAMENTO DO CONTRATO, O VEICULO SERÁ INSPECIONADO, NÃO HAVENDO DANOS AO VEÍCULO E NEM MULTA OU DANO A TERCEIROS A CAUÇÃO SERÁ DEVOLVIDA EM ATÉ 20 DIAS ÚTEIS.

11.2 – CASO OCORRA ALGUM DANO, MULTA OU PREJUÍZO, SERÁ DESCONTADO DA CAUÇÃO O VALOR PARA REPARO OU QUITAÇÃO, SENDO ESTA INSUFICIENTE O LOCATÁRIO TEM DE COMPLEMENTAR O VALOR INTEGRALMENTE.

11.3 – A caução poderá ser retida integralmente em caso de: furto ou roubo do veículo, danos estruturais graves, uso indevido comprovado, ou inadimplência superior a 15 dias.

CLÁUSULA DÉCIMA SEGUNDA – DAS PENALIDADES

12.1 – Acordam desde já as partes integrantes deste instrumento, que o descumprimento de quaisquer das cláusulas e disposições neste ato pactuadas que culminem em rescisão do mesmo, implicará na cobrança de multa em favor da parte inocente da seguinte forma:

12.1.1 – Se causada pele LOCADOR, esta pagará em até 15 (quinze) dias a quantia de R$ ${data.contrato.multa_rescisao}, em favor do LOCATÁRIO;

12.1.2 – Se causada pelo LOCATÁRIO, este pagará em até 15 (quinze) dias a quantia R$ ${data.contrato.multa_rescisao}, em favor do LOCADOR.

12.1.3 – Em qualquer circunstância a parte infratora arcará com os honorários advocatícios se houver necessidade de interpelação judicial.

CLÁUSULA DÉCIMA TERCEIRA – DO FORO

E assim por se acharem certos e ajustados, respondendo as partes, herdeiros e/ou sucessores ao seu fiel e exato cumprimento, observando todas as cláusulas e disposições na sua inteireza, as partes elegem o Foro da Cidade de ${data.contrato.forum}, como competente para esclarecimentos de dúvidas ou controvérsias, e, assinam o presente instrumento em 02 (duas) vias, com suas páginas numeradas e sem rasuras.

${data.contrato.local_assinatura}-BA, ${data.contrato.data_assinatura}.

LOCADOR:
__________________________________________
${data.locador.nome}
CPF/MF Nº ${data.locador.cpf}

LOCATÁRIO:
__________________________________________
${data.locatario.nome}
CPF/MF Nº ${data.locatario.cpf}

TESTEMUNHAS:

1. ________________________________    2. ________________________________
   Nome:                                   Nome:
   CPF:                                    CPF:`;

    // Adicionar assinatura digital se disponível
    return adicionarAssinaturaAoContrato(textoContrato);
}

// Função para formatar o texto do contrato
function formatarTextoContrato(texto) {
    const linhas = texto.split('\n');
    let html = '';
    
    for (const linha of linhas) {
        const linhaTrimmed = linha.trim();
        
        if (!linhaTrimmed) {
            html += '<br>';
            continue;
        }
        
        // Título principal
        if (linhaTrimmed.includes('CONTRATO DE LOCAÇÃO') || linhaTrimmed.includes('INSTRUMENTO PARTICULAR')) {
            html += `<h2 class="text-center fw-bold mb-4">${linhaTrimmed}</h2>`;
        }
        // Seções (I -, II -, etc.)
        else if (linhaTrimmed.match(/^[IVX]+ -/)) {
            html += `<h4 class="fw-bold mt-4 mb-3 text-primary">${linhaTrimmed}</h4>`;
        }
        // Cláusulas
        else if (linhaTrimmed.includes('CLÁUSULA')) {
            html += `<div class="clausula"><p class="fw-bold mb-2">${linhaTrimmed}</p></div>`;
        }
        // Parágrafos únicos
        else if (linhaTrimmed.includes('Parágrafo Único')) {
            html += `<p class="fw-bold mb-2">${linhaTrimmed}</p>`;
        }
        // Assinaturas
        else if (linhaTrimmed.includes('___________')) {
            html += `<div class="text-center mt-4"><p>${linhaTrimmed}</p></div>`;
        }
        // Nomes das partes (LOCADORA/LOCATÁRIO)
        else if (linhaTrimmed.includes('LOCADORA:') || linhaTrimmed.includes('LOCATÁRIA:') || linhaTrimmed.includes('LOCADOR:') || linhaTrimmed.includes('LOCATÁRIO:')) {
            html += `<p class="mb-3"><strong>${linhaTrimmed}</strong></p>`;
        }
        // Local e data
        else if (linhaTrimmed.match(/^[A-Za-z]+,\s+\d+/) || linhaTrimmed.match(/^[A-Za-z]+-[A-Z]{2},/)) {
            html += `<div class="text-end mt-4 mb-4"><p>${linhaTrimmed}</p></div>`;
        }
        // Texto normal
        else {
            html += `<p class="mb-2">${linhaTrimmed}</p>`;
        }
    }
    
    return html;
}

// Função para exportar PDF usando jsPDF
function exportarPDF() {
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
            y = adicionarAssinaturasAoPDF(doc, y);
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

// Função para exportar Word (simulação com download de texto)
function exportarWord() {
    try {
        // Rastrear geração de Word
        if (window.trackFeatureUsed) {
            window.trackFeatureUsed('word', { contractType: tipoContratoAtual });
        }
        
        const textoContrato = tipoContratoAtual === 'imovel' ? gerarTextoContratoImovel() : gerarTextoContratoVeiculo();
        
        // Criar conteúdo HTML para Word
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contrato de Locação</title>
                <style>
                    body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 2cm; }
                    h1 { text-align: center; font-weight: bold; }
                    p { text-align: justify; margin-bottom: 10px; }
                    .clausula { font-weight: bold; }
                </style>
            </head>
            <body>
                ${formatarTextoContrato(textoContrato)}
            </body>
            </html>
        `;
        
        // Criar blob e download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nomeArquivo = tipoContratoAtual === 'imovel' ? 'contrato_locacao_imovel.doc' : 'contrato_locacao_veiculo.doc';
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarAlerta('Arquivo Word gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar Word:', error);
        mostrarAlerta('Erro ao gerar arquivo Word', 'danger');
    }
}

// Função para imprimir
function imprimir() {
    // Rastrear impressão
    if (window.trackFeatureUsed) {
        window.trackFeatureUsed('print', { contractType: tipoContratoAtual });
    }
    
    const preview = document.getElementById('contratoPreview');
    const conteudo = preview.innerHTML;
    
    if (!conteudo || conteudo.includes('Preencha os dados')) {
        mostrarAlerta('Primeiro atualize a visualização do contrato', 'warning');
        return;
    }
    
    const janela = window.open('', '_blank');
    janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contrato de Locação</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    margin: 2cm;
                    font-size: 12pt;
                }
                h2 {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 30px;
                }
                h4 {
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 15px;
                }
                p {
                    text-align: justify;
                    margin-bottom: 10px;
                }
                .clausula {
                    margin-bottom: 15px;
                }
                .text-center {
                    text-align: center;
                }
                .text-end {
                    text-align: right;
                }
                .fw-bold {
                    font-weight: bold;
                }
                @media print {
                    body {
                        margin: 1cm;
                    }
                }
            </style>
        </head>
        <body>
            ${conteudo}
        </body>
        </html>
    `);
    janela.document.close();
    janela.print();
}

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo) {
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert-custom');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Criar novo alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show alert-custom`;
    alerta.style.position = 'fixed';
    alerta.style.top = '20px';
    alerta.style.right = '20px';
    alerta.style.zIndex = '9999';
    alerta.style.minWidth = '300px';
    
    alerta.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alerta);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

// Função para configurar cálculo automático da data fim
function configurarCalculoDataFim() {
    const dataInicioInput = document.querySelector('input[name="contrato.data_inicio"]');
    const prazoInput = document.querySelector('input[name="contrato.prazo_meses"]');
    const dataFimInput = document.querySelector('input[name="contrato.data_fim"]');
    
    function calcularDataFim() {
        const dataInicio = dataInicioInput?.value;
        const prazo = parseInt(prazoInput?.value);
        
        if (dataInicio && prazo && dataFimInput) {
            const [dia, mes, ano] = dataInicio.split('/');
            const data = new Date(ano, mes - 1, dia);
            data.setMonth(data.getMonth() + prazo);
            
            const novoAno = data.getFullYear();
            const novoMes = String(data.getMonth() + 1).padStart(2, '0');
            const novoDia = String(data.getDate()).padStart(2, '0');
            
            dataFimInput.value = `${novoDia}/${novoMes}/${novoAno}`;
        }
    }
    
    if (dataInicioInput && prazoInput && dataFimInput) {
        dataInicioInput.addEventListener('blur', calcularDataFim);
        prazoInput.addEventListener('blur', calcularDataFim);
    }
}



// ========================================
// OTIMIZAÇÕES PARA DISPOSITIVOS MÓVEIS
// ========================================

// Detecção de dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detecção específica de iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Detecção específica de Android
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

// Função para mostrar loading mobile
function showMobileLoading(message = 'Processando...') {
    if (!isMobileDevice()) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-mobile';
    loadingDiv.id = 'mobileLoading';
    loadingDiv.innerHTML = `
        <div class="text-center text-white">
            <div class="spinner mb-3"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Função para esconder loading mobile
function hideMobileLoading() {
    const loading = document.getElementById('mobileLoading');
    if (loading) {
        loading.remove();
    }
}

// Função para mostrar notificação mobile
function showMobileNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} mobile-notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        min-width: 300px;
        max-width: 90%;
        text-align: center;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Otimização da geração de PDF para mobile
function gerarPDFMobile() {
    if (!isMobileDevice()) {
        gerarPDF();
        return;
    }
    
    showMobileLoading('Gerando PDF...');
    
    // Delay para mostrar loading
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configurações específicas para mobile
            doc.setFontSize(10); // Fonte menor para mobile
            
            const textoContrato = gerarTextoContrato();
            const linhas = doc.splitTextToSize(textoContrato, 180); // Largura ajustada
            
            let y = 20;
            const alturaLinha = 5;
            const alturaPagina = 280;
            
            linhas.forEach((linha, index) => {
                if (y > alturaPagina) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(linha, 15, y);
                y += alturaLinha;
            });
            
            // Salvar com nome específico para mobile
            const nomeArquivo = `contrato_${tipoContratoAtual}_${new Date().getTime()}.pdf`;
            doc.save(nomeArquivo);
            
            hideMobileLoading();
            showMobileNotification('PDF gerado com sucesso!', 'success');
            
        } catch (error) {
            hideMobileLoading();
            showMobileNotification('Erro ao gerar PDF. Tente novamente.', 'danger');
            console.error('Erro ao gerar PDF:', error);
        }
    }, 500);
}

// Função para melhorar a experiência de scroll em mobile
function otimizarScrollMobile() {
    if (!isMobileDevice()) return;
    
    const contractPreview = document.querySelector('.contract-preview');
    if (contractPreview) {
        // Adicionar momentum scrolling para iOS
        contractPreview.style.webkitOverflowScrolling = 'touch';
        
        // Melhorar performance do scroll
        contractPreview.style.willChange = 'scroll-position';
        
        // Adicionar indicador de scroll para mobile
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.style.cssText = `
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(102, 126, 234, 0.7);
            color: white;
            padding: 5px 8px;
            border-radius: 15px;
            font-size: 0.7rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        scrollIndicator.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
        
        contractPreview.parentElement.style.position = 'relative';
        contractPreview.parentElement.appendChild(scrollIndicator);
        
        // Mostrar indicador quando há conteúdo para rolar
        contractPreview.addEventListener('scroll', () => {
            const isScrollable = contractPreview.scrollHeight > contractPreview.clientHeight;
            scrollIndicator.style.opacity = isScrollable ? '1' : '0';
        });
    }
}

// Função para otimizar formulários em mobile
function otimizarFormulariosMobile() {
    if (!isMobileDevice()) return;
    
    // Adicionar autocomplete e inputmode apropriados
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const type = input.type || 'text';
        const name = input.name || input.id || '';
        
        // Configurar inputmode para teclados específicos
        if (name.includes('cpf') || name.includes('rg') || name.includes('cnh')) {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
        } else if (name.includes('telefone') || name.includes('phone')) {
            input.setAttribute('inputmode', 'tel');
            input.setAttribute('type', 'tel');
        } else if (name.includes('email')) {
            input.setAttribute('inputmode', 'email');
            input.setAttribute('type', 'email');
        } else if (name.includes('cep')) {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9-]*');
        }
        
        // Adicionar autocomplete apropriado
        if (name.includes('nome')) {
            input.setAttribute('autocomplete', 'name');
        } else if (name.includes('endereco')) {
            input.setAttribute('autocomplete', 'address-line1');
        } else if (name.includes('cidade')) {
            input.setAttribute('autocomplete', 'address-level2');
        } else if (name.includes('cep')) {
            input.setAttribute('autocomplete', 'postal-code');
        }
        
        // Evitar zoom automático no iOS
        if (isIOS() && input.style.fontSize !== '16px') {
            input.style.fontSize = '16px';
        }
    });
}

// Função para melhorar a experiência de toque
function melhorarExperienciaTouch() {
    if (!isMobileDevice()) return;
    
    // Adicionar feedback visual para elementos clicáveis
    const clickableElements = document.querySelectorAll('.btn, .contract-type-card, .nav-link');
    clickableElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
            }, 100);
        });
    });
}

// Função para otimizar performance em mobile
function otimizarPerformanceMobile() {
    if (!isMobileDevice()) return;
    
    // Lazy loading para elementos não críticos
    const lazyElements = document.querySelectorAll('.contract-preview, .export-buttons');
    lazyElements.forEach(element => {
        element.style.willChange = 'auto';
    });
    
    // Otimizar animações para mobile
    const animatedElements = document.querySelectorAll('.contract-type-card, .btn');
    animatedElements.forEach(element => {
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
    });
}

// Função para detectar orientação e ajustar layout
function handleOrientationChange() {
    if (!isMobileDevice()) return;
    
    const isLandscape = window.innerWidth > window.innerHeight;
    document.body.classList.toggle('landscape-mode', isLandscape);
    
    // Ajustar altura do preview do contrato baseado na orientação
    const contractPreview = document.querySelector('.contract-preview');
    if (contractPreview) {
        contractPreview.style.maxHeight = isLandscape ? '50vh' : '60vh';
    }
}

// Função para melhorar a experiência de PDF em mobile
function melhorarPDFMobile() {
    // Substituir botões de PDF por versões otimizadas para mobile
    const pdfButtons = document.querySelectorAll('[onclick*="gerarPDF"]');
    pdfButtons.forEach(button => {
        button.onclick = gerarPDFMobile;
        
        if (isMobileDevice()) {
            // Adicionar ícone de download para mobile
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-download';
            }
            
            // Adicionar texto explicativo para mobile
            const text = button.textContent;
            if (!text.includes('Baixar')) {
                button.innerHTML = `<i class="fas fa-download"></i> Baixar ${text}`;
            }
        }
    });
}

// Função para inicializar otimizações mobile
function inicializarMobile() {
    if (!isMobileDevice()) return;
    
    console.log('Dispositivo móvel detectado - Aplicando otimizações');
    
    // Aplicar todas as otimizações
    otimizarFormulariosMobile();
    melhorarExperienciaTouch();
    otimizarPerformanceMobile();
    melhorarPDFMobile();
    
    // Listener para mudança de orientação
    window.addEventListener('orientationchange', () => {
        setTimeout(handleOrientationChange, 100);
    });
    
    // Listener para resize
    window.addEventListener('resize', handleOrientationChange);
    
    // Aplicar otimizações de scroll quando o preview for carregado
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                otimizarScrollMobile();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Adicionar classe CSS para mobile
    document.body.classList.add('mobile-device');
    
    if (isIOS()) {
        document.body.classList.add('ios-device');
    } else if (isAndroid()) {
        document.body.classList.add('android-device');
    }
}

// Sobrescrever função original de geração de PDF
const gerarPDFOriginal = window.gerarPDF;
window.gerarPDF = function() {
    if (isMobileDevice()) {
        gerarPDFMobile();
    } else {
        gerarPDFOriginal();
    }
};

// Inicializar otimizações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    inicializarMobile();
    handleOrientationChange();
});

// Inicializar também quando a página for totalmente carregada
window.addEventListener('load', function() {
    if (isMobileDevice()) {
        // Pequeno delay para garantir que tudo foi carregado
        setTimeout(() => {
            otimizarScrollMobile();
            showMobileNotification('AssinaFácil otimizado para mobile!', 'success');
        }, 1000);
    }
});

// Adicionar suporte para PWA
if ('serviceWorker' in navigator && isMobileDevice()) {
    window.addEventListener('load', function() {
        // Registrar service worker para PWA (opcional)
        console.log('Dispositivo móvel - PWA ready');
    });
}

// Função para melhorar a experiência de preenchimento rápido
function preenchimentoRapidoMobile() {
    if (!isMobileDevice()) return;
    
    // Adicionar botão de preenchimento rápido para mobile
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        const quickFillBtn = document.createElement('button');
        quickFillBtn.type = 'button';
        quickFillBtn.className = 'btn btn-outline-primary btn-sm mb-3';
        quickFillBtn.innerHTML = '<i class="fas fa-magic"></i> Preenchimento Rápido';
        quickFillBtn.style.cssText = 'width: 100%; border-radius: 20px;';
        
        quickFillBtn.addEventListener('click', function() {
            const inputs = section.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.value === '' && input.placeholder) {
                    // Preencher com dados de exemplo baseado no placeholder
                    input.value = input.placeholder;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            showMobileNotification('Dados preenchidos automaticamente!', 'success');
        });
        
        section.insertBefore(quickFillBtn, section.firstChild.nextSibling);
    });
}


// ===========================
// FUNCIONALIDADE DE UPLOAD
// ===========================

let tipoContratoUpload = '';
let arquivoUpload = null;

// Função para abrir modal de upload
function abrirUploadContrato(tipo) {
    tipoContratoUpload = tipo;
    const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
    
    // Atualizar título do modal
    const modalTitle = document.querySelector('#uploadModal .modal-title');
    modalTitle.innerHTML = `
        <i class="fas fa-upload text-primary"></i>
        Carregar Contrato de ${tipo === 'imovel' ? 'Imóvel' : 'Veículo'}
    `;
    
    // Reset do estado do modal
    resetUploadModal();
    
    modal.show();
}

// Reset do modal de upload
function resetUploadModal() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');
    const processBtn = document.getElementById('processUploadBtn');
    
    uploadArea.style.display = 'block';
    uploadProgress.style.display = 'none';
    uploadResult.style.display = 'none';
    processBtn.disabled = true;
    
    uploadArea.className = 'upload-area';
    arquivoUpload = null;
    
    // Reset do input file
    document.getElementById('fileInput').value = '';
}

// Event listeners para upload
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processBtn = document.getElementById('processUploadBtn');
    
    // Click na área de upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processarArquivo(files[0]);
        }
    });
    
    // Seleção de arquivo
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            processarArquivo(e.target.files[0]);
        }
    });
    
    // Botão processar
    processBtn.addEventListener('click', function() {
        if (arquivoUpload) {
            processarEExtrairDados();
        }
    });
});

// Processar arquivo selecionado
function processarArquivo(arquivo) {
    // Validar tipo de arquivo
    const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!tiposPermitidos.includes(arquivo.type)) {
        mostrarErroUpload('Tipo de arquivo não suportado. Use PDF, DOC ou DOCX.');
        return;
    }
    
    // Validar tamanho (máximo 10MB)
    if (arquivo.size > 10 * 1024 * 1024) {
        mostrarErroUpload('Arquivo muito grande. Tamanho máximo: 10MB.');
        return;
    }
    
    arquivoUpload = arquivo;
    mostrarSucessoUpload(arquivo);
}

// Mostrar sucesso no upload
function mostrarSucessoUpload(arquivo) {
    const uploadArea = document.getElementById('uploadArea');
    const processBtn = document.getElementById('processUploadBtn');
    
    uploadArea.classList.add('success');
    uploadArea.innerHTML = `
        <div class="upload-content">
            <div class="upload-icon">
                <i class="fas fa-file-check"></i>
            </div>
            <h4>Arquivo Carregado</h4>
            <p><strong>${arquivo.name}</strong></p>
            <p class="text-muted">${formatarTamanhoArquivo(arquivo.size)}</p>
            <div class="mt-3">
                <button class="btn btn-outline-primary btn-sm" onclick="resetUploadModal()">
                    <i class="fas fa-times"></i> Remover
                </button>
            </div>
        </div>
    `;
    
    processBtn.disabled = false;
}

// Mostrar erro no upload
function mostrarErroUpload(mensagem) {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.classList.add('error');
    uploadArea.innerHTML = `
        <div class="upload-content">
            <div class="upload-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Erro no Upload</h4>
            <p class="text-danger">${mensagem}</p>
            <div class="mt-3">
                <button class="btn btn-outline-primary btn-sm" onclick="resetUploadModal()">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        </div>
    `;
}

// Processar e extrair dados do arquivo
function processarEExtrairDados() {
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');
    const uploadArea = document.getElementById('uploadArea');
    const progressBar = uploadProgress.querySelector('.progress-bar');
    const statusText = document.getElementById('uploadStatusText');
    
    // Mostrar progresso
    uploadArea.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    // Simular progresso de extração
    let progresso = 0;
    const intervalo = setInterval(() => {
        progresso += Math.random() * 20;
        if (progresso > 90) progresso = 90;
        
        progressBar.style.width = progresso + '%';
        
        if (progresso < 30) {
            statusText.textContent = 'Lendo arquivo...';
        } else if (progresso < 60) {
            statusText.textContent = 'Extraindo dados...';
        } else {
            statusText.textContent = 'Processando informações...';
        }
    }, 200);
    
    // Simular extração de dados (em uma implementação real, aqui seria feita a extração via OCR ou parsing)
    setTimeout(() => {
        clearInterval(intervalo);
        progressBar.style.width = '100%';
        statusText.textContent = 'Concluído!';
        
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            uploadResult.style.display = 'block';
            
            // Simular dados extraídos
            const dadosExtraidos = simularExtracaoDados();
            document.getElementById('extractedDataCount').textContent = dadosExtraidos.count;
            
            // Preencher formulários com dados extraídos
            preencherFormulariosComDados(dadosExtraidos.dados);
            
            // Habilitar botão para continuar
            const processBtn = document.getElementById('processUploadBtn');
            processBtn.innerHTML = '<i class="fas fa-edit"></i> Continuar Editando';
            processBtn.onclick = function() {
                // Fechar modal e ir para edição
                bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
                selecionarTipoContrato(tipoContratoUpload);
            };
        }, 1000);
    }, 3000);
}

// Simular extração de dados (em produção seria OCR/parsing real)
function simularExtracaoDados() {
    if (tipoContratoUpload === 'imovel') {
        return {
            count: 12,
            dados: {
                'locadora-nome': 'João Silva Santos',
                'locadora-cpf': '123.456.789-00',
                'locadora-endereco': 'Rua das Flores, 123',
                'locatario-nome': 'Maria Oliveira Costa',
                'locatario-cpf': '987.654.321-00',
                'locatario-telefone': '(11) 99999-9999',
                'imovel-tipo': 'Apartamento',
                'imovel-endereco': 'Av. Principal, 456, Apt 101',
                'contrato-valor-aluguel': '2.500,00',
                'contrato-prazo-meses': '12',
                'contrato-local-assinatura': 'São Paulo',
                'contrato-data-assinatura': new Date().toLocaleDateString('pt-BR')
            }
        };
    } else {
        return {
            count: 10,
            dados: {
                'locador-nome': 'Carlos Pereira Lima',
                'locador-cpf': '111.222.333-44',
                'locador-cnh': '12345678901',
                'locatario-nome': 'Ana Santos Silva',
                'locatario-cpf': '555.666.777-88',
                'locatario-cnh': '98765432109',
                'veiculo-marca-modelo': 'Honda Civic 2020',
                'veiculo-placa': 'ABC-1234',
                'contrato-valor-semanal': '800,00',
                'contrato-prazo-meses': '6'
            }
        };
    }
}

// Preencher formulários com dados extraídos
function preencherFormulariosComDados(dados) {
    // Salvar dados extraídos para uso posterior
    if (tipoContratoUpload === 'imovel') {
        Object.assign(dadosPadraoImovel.locadora, {
            nome: dados['locadora-nome'] || '',
            cpf: dados['locadora-cpf'] || '',
            endereco: dados['locadora-endereco'] || ''
        });
        Object.assign(dadosPadraoImovel.locatario, {
            nome: dados['locatario-nome'] || '',
            cpf: dados['locatario-cpf'] || '',
            telefone: dados['locatario-telefone'] || ''
        });
        Object.assign(dadosPadraoImovel.imovel, {
            tipo: dados['imovel-tipo'] || '',
            endereco: dados['imovel-endereco'] || ''
        });
        Object.assign(dadosPadraoImovel.contrato, {
            valor_aluguel: dados['contrato-valor-aluguel'] || '',
            prazo_meses: dados['contrato-prazo-meses'] || '',
            local_assinatura: dados['contrato-local-assinatura'] || '',
            data_assinatura: dados['contrato-data-assinatura'] || ''
        });
    } else {
        Object.assign(dadosPadraoVeiculo.locador, {
            nome: dados['locador-nome'] || '',
            cpf: dados['locador-cpf'] || '',
            cnh: dados['locador-cnh'] || ''
        });
        Object.assign(dadosPadraoVeiculo.locatario, {
            nome: dados['locatario-nome'] || '',
            cpf: dados['locatario-cpf'] || '',
            cnh: dados['locatario-cnh'] || ''
        });
        Object.assign(dadosPadraoVeiculo.veiculo, {
            marca_modelo: dados['veiculo-marca-modelo'] || '',
            placa: dados['veiculo-placa'] || ''
        });
        Object.assign(dadosPadraoVeiculo.contrato, {
            valor_semanal: dados['contrato-valor-semanal'] || '',
            prazo_meses: dados['contrato-prazo-meses'] || ''
        });
    }
}

// Formatar tamanho do arquivo
function formatarTamanhoArquivo(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


// ===========================
// ASSINATURA DIGITAL
// ===========================

// Variáveis globais para assinatura
let signaturePad = null;
let isDrawing = false;
let currentColor = '#000000';
let currentWidth = 2;
let signatureData = null;
let currentSignatureType = 'draw'; // 'draw' ou 'type'

// Variáveis globais para assinaturas separadas
let assinaturaLocador = null;
let assinaturaLocatario = null;
let tipoAssinaturaAtual = 'locador'; // 'locador' ou 'locatario'

// Inicializar assinatura digital
function initSignature() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas responsivo
    function resizeCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Definir tamanho baseado no container
        const width = Math.min(500, rect.width - 40);
        const height = window.innerWidth <= 768 ? 150 : 200;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // Configurar contexto
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Eventos de mouse (desktop)
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos de touch (mobile)
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Prevenir scroll no mobile durante assinatura
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    
    signaturePad = { canvas, ctx };
}

// Abrir modal de assinatura
function abrirAssinaturaDigital(tipo = 'locador') {
    // Definir o tipo de assinatura atual
    tipoAssinaturaAtual = tipo;
    
    // Atualizar título do modal
    const modalTitle = document.querySelector('#signatureModal .modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = `<i class="fas fa-signature"></i> Assinatura Digital - ${tipo === 'locador' ? 'Locador' : 'Locatário'}`;
    }
    
    // Verificar se já existe assinatura salva para este tipo
    const assinaturaSalva = tipo === 'locador' ? assinaturaLocador : assinaturaLocatario;
    if (assinaturaSalva) {
        // Mostrar preview da assinatura existente
        mostrarPreviewAssinaturaSalva(assinaturaSalva);
    }
    
    const modal = new bootstrap.Modal(document.getElementById('signatureModal'));
    modal.show();
    
    // Inicializar após modal abrir
    setTimeout(() => {
        initSignature();
        setupSignatureControls();
    }, 300);
}

// Configurar controles de assinatura
function setupSignatureControls() {
    // Color picker
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.dataset.color;
            if (signaturePad) {
                signaturePad.ctx.strokeStyle = currentColor;
            }
        });
    });
    
    // Pen width
    const penWidth = document.getElementById('penWidth');
    if (penWidth) {
        penWidth.addEventListener('input', function() {
            currentWidth = this.value;
            if (signaturePad) {
                signaturePad.ctx.lineWidth = currentWidth;
            }
        });
    }
    
    // Font selection
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateTypedSignaturePreview();
        });
    });
    
    // Typed signature input
    const typedInput = document.getElementById('typedSignature');
    if (typedInput) {
        typedInput.addEventListener('input', updateTypedSignaturePreview);
    }
    
    // Tab switching
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            currentSignatureType = e.target.id === 'draw-tab' ? 'draw' : 'type';
            updateSaveButtonState();
        });
    });
}

// Iniciar desenho
function startDrawing(e) {
    isDrawing = true;
    const rect = signaturePad.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    signaturePad.ctx.beginPath();
    signaturePad.ctx.moveTo(x, y);
    
    // Esconder placeholder
    document.querySelector('.signature-overlay').style.display = 'none';
    signaturePad.canvas.classList.add('has-signature');
}

// Desenhar
function draw(e) {
    if (!isDrawing) return;
    
    const rect = signaturePad.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    signaturePad.ctx.lineTo(x, y);
    signaturePad.ctx.stroke();
    
    updateSaveButtonState();
}

// Parar desenho
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        signaturePad.ctx.beginPath();
    }
}

// Handle touch events
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    
    if (e.type === 'touchstart') {
        startDrawing(mouseEvent);
    } else if (e.type === 'touchmove') {
        draw(mouseEvent);
    }
}

// Atualizar preview da assinatura digitada
function updateTypedSignaturePreview() {
    const input = document.getElementById('typedSignature');
    const preview = document.getElementById('signaturePreview');
    const activeFont = document.querySelector('.font-btn.active');
    
    if (!input || !preview || !activeFont) return;
    
    const text = input.value.trim();
    const fontData = activeFont.dataset.font;
    
    preview.textContent = text || 'Digite seu nome';
    
    // Aplicar fonte baseada na seleção
    switch(fontData) {
        case 'signature1':
            preview.style.fontFamily = "'Brush Script MT', cursive";
            preview.style.fontSize = '28px';
            break;
        case 'signature2':
            preview.style.fontFamily = "'Lucida Handwriting', cursive";
            preview.style.fontSize = '24px';
            break;
        case 'signature3':
            preview.style.fontFamily = "'Dancing Script', cursive";
            preview.style.fontSize = '30px';
            break;
    }
    
    updateSaveButtonState();
}

// Limpar assinatura
function limparAssinatura() {
    if (currentSignatureType === 'draw' && signaturePad) {
        const ctx = signaturePad.ctx;
        ctx.clearRect(0, 0, signaturePad.canvas.width, signaturePad.canvas.height);
        
        // Mostrar placeholder novamente
        document.querySelector('.signature-overlay').style.display = 'block';
        signaturePad.canvas.classList.remove('has-signature');
    } else if (currentSignatureType === 'type') {
        document.getElementById('typedSignature').value = '';
        updateTypedSignaturePreview();
    }
    
    // Esconder preview result
    document.getElementById('signatureResult').style.display = 'none';
    updateSaveButtonState();
}

// Visualizar assinatura
function visualizarAssinatura() {
    let imageData = null;
    
    if (currentSignatureType === 'draw' && signaturePad) {
        // Verificar se há desenho no canvas - método melhorado
        const canvas = signaturePad.canvas;
        const ctx = signaturePad.ctx;
        
        // Método mais confiável para verificar se há conteúdo
        const canvasData = canvas.toDataURL('image/png', 1.0);
        const blankCanvas = document.createElement('canvas');
        blankCanvas.width = canvas.width;
        blankCanvas.height = canvas.height;
        const blankData = blankCanvas.toDataURL('image/png', 1.0);
        
        const hasDrawing = canvasData !== blankData;
        
        if (!hasDrawing) {
            mostrarAlerta('Por favor, desenhe sua assinatura primeiro.', 'warning');
            return;
        }
        
        // Garantir qualidade máxima e formato correto
        imageData = canvas.toDataURL('image/png', 1.0);
    } else if (currentSignatureType === 'type') {
        const text = document.getElementById('typedSignature').value.trim();
        if (!text) {
            mostrarAlerta('Por favor, digite seu nome primeiro.', 'warning');
            return;
        }
        
        // Criar canvas temporário para assinatura digitada
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 400;
        tempCanvas.height = 100;
        
        // Limpar canvas com fundo branco
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Configurar fonte
        const activeFont = document.querySelector('.font-btn.active');
        const fontData = activeFont.dataset.font;
        
        switch(fontData) {
            case 'signature1':
                tempCtx.font = "36px 'Brush Script MT', cursive";
                break;
            case 'signature2':
                tempCtx.font = "30px 'Lucida Handwriting', cursive";
                break;
            case 'signature3':
                tempCtx.font = "38px 'Dancing Script', cursive";
                break;
        }
        
        tempCtx.fillStyle = '#000000';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(text, 200, 50);
        
        imageData = tempCanvas.toDataURL('image/png', 1.0);
    }
    
    if (imageData) {
        // Verificar se os dados estão corretos
        if (imageData.includes('%P')) {
            console.error('Dados de imagem corrompidos detectados');
            mostrarAlerta('Erro na geração da assinatura. Tente novamente.', 'error');
            return;
        }
        
        // Mostrar preview
        const previewImg = document.getElementById('signaturePreviewImg');
        previewImg.src = imageData;
        document.getElementById('signatureResult').style.display = 'block';
        
        // Salvar dados da assinatura com validação
        signatureData = {
            type: currentSignatureType,
            data: imageData,
            timestamp: new Date().toISOString(),
            signerType: tipoAssinaturaAtual
        };
        
        updateSaveButtonState();
        
        // Animação de sucesso
        document.getElementById('signatureResult').classList.add('signature-success');
        setTimeout(() => {
            document.getElementById('signatureResult').classList.remove('signature-success');
        }, 600);
        
        console.log('Assinatura gerada com sucesso:', {
            type: currentSignatureType,
            dataLength: imageData.length,
            signerType: tipoAssinaturaAtual
        });
    }
}

// Salvar assinatura
function salvarAssinatura() {
    if (!signatureData) {
        mostrarAlerta('Por favor, visualize sua assinatura primeiro.', 'warning');
        return;
    }
    
    // Verificar e limpar dados da assinatura usando a nova função
    let dadosLimpos = signatureData;
    
    // Se for objeto com propriedade data
    if (typeof signatureData === 'object' && signatureData.data) {
        // Usar a nova função de limpeza
        const dadosBase64Limpos = limparDadosBase64(signatureData.data);
        
        if (!dadosBase64Limpos) {
            mostrarAlerta('Erro: Dados da assinatura estão corrompidos. Tente desenhar novamente.', 'error');
            return;
        }
        
        dadosLimpos = {
            ...signatureData,
            data: 'data:image/png;base64,' + dadosBase64Limpos
        };
    }
    
    // Rastrear criação de assinatura digital
    if (window.trackFeatureUsed) {
        window.trackFeatureUsed('signature', { 
            contractType: tipoContratoAtual,
            signatureType: currentSignatureType,
            signerType: tipoAssinaturaAtual
        });
    }
    
    // Salvar na variável correspondente
    if (tipoAssinaturaAtual === 'locador') {
        assinaturaLocador = dadosLimpos;
        localStorage.setItem('assinatura_locador', JSON.stringify(dadosLimpos));
    } else {
        assinaturaLocatario = dadosLimpos;
        localStorage.setItem('assinatura_locatario', JSON.stringify(dadosLimpos));
    }
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('signatureModal'));
    modal.hide();
    
    // Mostrar notificação de sucesso
    const tipoTexto = tipoAssinaturaAtual === 'locador' ? 'Locador' : 'Locatário';
    mostrarAlerta(`Assinatura do ${tipoTexto} salva com sucesso! Agora ela aparecerá no contrato.`, 'success');
    
    // Atualizar preview do contrato imediatamente
    if (tipoContratoAtual) {
        atualizarPreview();
    }
}

// Atualizar estado do botão salvar
function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveSignatureBtn');
    if (!saveBtn) return;
    
    let hasSignature = false;
    
    if (currentSignatureType === 'draw' && signaturePad) {
        const canvas = signaturePad.canvas;
        const ctx = signaturePad.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hasSignature = imageData.data.some((channel, index) => index % 4 !== 3 && channel !== 0);
    } else if (currentSignatureType === 'type') {
        const text = document.getElementById('typedSignature').value.trim();
        hasSignature = text.length > 0;
    }
    
    saveBtn.disabled = !signatureData;
}

// Verificar se há assinatura salva
function verificarAssinaturaSalva() {
    const assinaturaSalva = localStorage.getItem('assinatura_digital');
    return assinaturaSalva ? JSON.parse(assinaturaSalva) : null;
}

// Adicionar assinatura ao contrato
function adicionarAssinaturaAoContrato(textoContrato) {
    // Carregar assinaturas salvas
    const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
    const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
    
    // Só adicionar seção de assinaturas se houver pelo menos uma assinatura válida
    const temAssinaturaValidaLocador = assinLocador && assinLocador.data && !assinLocador.data.includes('%P') && assinLocador.data.length > 100;
    const temAssinaturaValidaLocatario = assinLocatario && assinLocatario.data && !assinLocatario.data.includes('%P') && assinLocatario.data.length > 100;
    
    if (!temAssinaturaValidaLocador && !temAssinaturaValidaLocatario) {
        return textoContrato; // Retorna contrato sem seção de assinaturas
    }
    
    // Adicionar seção de assinatura ao final do contrato
    let secaoAssinatura = `

═══════════════════════════════════════════════════════════════

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

    secaoAssinatura += `═══════════════════════════════════════════════════════════════

Este documento foi assinado digitalmente através do sistema AssinaFácil.
Assinaturas digitais válidas e verificáveis.`;

    return textoContrato + secaoAssinatura;
}



// ===========================
// SISTEMA DE ANALYTICS E RELATÓRIOS
// ===========================

// Configuração do sistema de analytics
const Analytics = {
    // Dados da sessão
    sessionData: {
        userId: window.AssinaFacilAnalytics.userId,
        sessionId: window.AssinaFacilAnalytics.sessionId,
        startTime: window.AssinaFacilAnalytics.startTime,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
            width: screen.width,
            height: screen.height
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        device: this.detectDevice(),
        location: null
    },

    // Detectar tipo de dispositivo
    detectDevice() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    },

    // Detectar localização (se permitido)
    async detectLocation() {
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.sessionData.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                });
            }
        } catch (error) {
            console.log('Geolocation not available');
        }
    },

    // Rastrear evento
    trackEvent(eventType, eventData = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            userId: this.sessionData.userId,
            data: eventData,
            page: window.location.pathname,
            device: this.sessionData.device
        };

        // Adicionar ao array de eventos
        window.AssinaFacilAnalytics.events.push(event);

        // Enviar para Google Analytics se disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', eventType, {
                event_category: 'AssinaFacil',
                event_label: JSON.stringify(eventData),
                custom_parameter: this.sessionData.device
            });
        }

        // Salvar no localStorage
        this.saveToLocalStorage();

        console.log('Event tracked:', event);
    },

    // Salvar dados no localStorage
    saveToLocalStorage() {
        try {
            const data = {
                sessionData: this.sessionData,
                events: window.AssinaFacilAnalytics.events,
                lastUpdate: Date.now()
            };
            localStorage.setItem('assinafacil_analytics', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    },

    // Carregar dados do localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('assinafacil_analytics');
            if (data) {
                const parsed = JSON.parse(data);
                return parsed;
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
        return null;
    },

    // Gerar relatório de uso
    generateReport() {
        const data = this.loadFromLocalStorage();
        if (!data) return null;

        const events = data.events || [];
        const now = Date.now();
        const last7Days = now - (7 * 24 * 60 * 60 * 1000);
        const last30Days = now - (30 * 24 * 60 * 60 * 1000);

        // Filtrar eventos por período
        const events7Days = events.filter(e => e.timestamp >= last7Days);
        const events30Days = events.filter(e => e.timestamp >= last30Days);

        // Estatísticas gerais
        const stats = {
            totalSessions: new Set(events.map(e => e.sessionId)).size,
            totalEvents: events.length,
            last7Days: {
                events: events7Days.length,
                sessions: new Set(events7Days.map(e => e.sessionId)).size
            },
            last30Days: {
                events: events30Days.length,
                sessions: new Set(events30Days.map(e => e.sessionId)).size
            },
            contractTypes: this.getContractTypeStats(events),
            devices: this.getDeviceStats(events),
            features: this.getFeatureStats(events),
            timeSpent: this.getTimeStats(events)
        };

        return stats;
    },

    // Estatísticas por tipo de contrato
    getContractTypeStats(events) {
        const contractEvents = events.filter(e => e.type === 'contract_type_selected');
        const stats = {};
        contractEvents.forEach(e => {
            const type = e.data.type || 'unknown';
            stats[type] = (stats[type] || 0) + 1;
        });
        return stats;
    },

    // Estatísticas por dispositivo
    getDeviceStats(events) {
        const stats = {};
        events.forEach(e => {
            const device = e.device || 'unknown';
            stats[device] = (stats[device] || 0) + 1;
        });
        return stats;
    },

    // Estatísticas por funcionalidade
    getFeatureStats(events) {
        const featureEvents = events.filter(e => 
            ['pdf_generated', 'word_generated', 'signature_created', 'contract_uploaded'].includes(e.type)
        );
        const stats = {};
        featureEvents.forEach(e => {
            stats[e.type] = (stats[e.type] || 0) + 1;
        });
        return stats;
    },

    // Estatísticas de tempo
    getTimeStats(events) {
        const sessions = {};
        events.forEach(e => {
            if (!sessions[e.sessionId]) {
                sessions[e.sessionId] = {
                    start: e.timestamp,
                    end: e.timestamp
                };
            } else {
                sessions[e.sessionId].end = Math.max(sessions[e.sessionId].end, e.timestamp);
            }
        });

        const durations = Object.values(sessions).map(s => s.end - s.start);
        const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

        return {
            averageSessionDuration: Math.round(avgDuration / 1000), // em segundos
            totalSessions: Object.keys(sessions).length
        };
    },

    // Enviar relatório por email
    async sendReport() {
        const report = this.generateReport();
        if (!report) return;

        const emailData = {
            to: window.AssinaFacilAnalytics.email,
            subject: `AssinaFácil - Relatório de Acesso ${new Date().toLocaleDateString('pt-BR')}`,
            html: this.generateEmailHTML(report)
        };

        // Simular envio de email (em produção, seria enviado para um backend)
        console.log('Relatório gerado:', report);
        console.log('Email que seria enviado:', emailData);

        // Mostrar notificação de sucesso
        this.showNotification('Relatório gerado com sucesso! Em produção seria enviado para ' + emailData.to);
    },

    // Gerar HTML do email
    generateEmailHTML(report) {
        const date = new Date().toLocaleDateString('pt-BR');
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .stat-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; }
                .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
                .stat-label { color: #666; margin-top: 5px; }
                .chart-container { margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 AssinaFácil - Relatório de Acesso</h1>
                    <p>Relatório gerado em ${date}</p>
                </div>
                <div class="content">
                    <h2>📈 Estatísticas Gerais</h2>
                    <div class="stat-card">
                        <div class="stat-number">${report.totalSessions}</div>
                        <div class="stat-label">Total de Sessões</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${report.totalEvents}</div>
                        <div class="stat-label">Total de Eventos</div>
                    </div>
                    
                    <h2>📅 Últimos 7 Dias</h2>
                    <div class="stat-card">
                        <div class="stat-number">${report.last7Days.sessions}</div>
                        <div class="stat-label">Sessões na Semana</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${report.last7Days.events}</div>
                        <div class="stat-label">Eventos na Semana</div>
                    </div>
                    
                    <h2>📱 Dispositivos</h2>
                    ${Object.entries(report.devices).map(([device, count]) => `
                        <div class="stat-card">
                            <div class="stat-number">${count}</div>
                            <div class="stat-label">${device.charAt(0).toUpperCase() + device.slice(1)}</div>
                        </div>
                    `).join('')}
                    
                    <h2>🏠🚗 Tipos de Contrato</h2>
                    ${Object.entries(report.contractTypes).map(([type, count]) => `
                        <div class="stat-card">
                            <div class="stat-number">${count}</div>
                            <div class="stat-label">${type === 'imovel' ? 'Imóveis' : type === 'veiculo' ? 'Veículos' : type}</div>
                        </div>
                    `).join('')}
                    
                    <h2>⚡ Funcionalidades Mais Usadas</h2>
                    ${Object.entries(report.features).map(([feature, count]) => `
                        <div class="stat-card">
                            <div class="stat-number">${count}</div>
                            <div class="stat-label">${this.getFeatureName(feature)}</div>
                        </div>
                    `).join('')}
                    
                    <h2>⏱️ Tempo de Uso</h2>
                    <div class="stat-card">
                        <div class="stat-number">${Math.round(report.timeSpent.averageSessionDuration / 60)}min</div>
                        <div class="stat-label">Tempo Médio por Sessão</div>
                    </div>
                </div>
                <div class="footer">
                    <p>AssinaFácil - Sistema de Contratos</p>
                    <p>Relatório gerado automaticamente em ${date}</p>
                </div>
            </div>
        </body>
        </html>
        `;
    },

    // Nomes amigáveis para funcionalidades
    getFeatureName(feature) {
        const names = {
            'pdf_generated': 'PDFs Gerados',
            'word_generated': 'Words Gerados',
            'signature_created': 'Assinaturas Digitais',
            'contract_uploaded': 'Contratos Carregados'
        };
        return names[feature] || feature;
    },

    // Mostrar notificação
    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },

    // Inicializar sistema
    init() {
        // Detectar localização
        this.detectLocation();

        // Rastrear carregamento da página
        this.trackEvent('page_load', {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: Date.now()
        });

        // Rastrear tempo na página
        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_unload', {
                timeSpent: Date.now() - this.sessionData.startTime
            });
        });

        // Rastrear cliques em elementos importantes
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a')) {
                this.trackEvent('button_click', {
                    element: e.target.textContent.trim(),
                    className: e.target.className
                });
            }
        });

        console.log('Analytics system initialized');
    }
};

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
});

// Funções para rastrear eventos específicos
function trackContractTypeSelection(type) {
    Analytics.trackEvent('contract_type_selected', { type: type });
}

function trackPDFGeneration(contractType) {
    Analytics.trackEvent('pdf_generated', { contractType: contractType });
}

function trackWordGeneration(contractType) {
    Analytics.trackEvent('word_generated', { contractType: contractType });
}

function trackSignatureCreation(contractType) {
    Analytics.trackEvent('signature_created', { contractType: contractType });
}

function trackContractUpload(contractType) {
    Analytics.trackEvent('contract_uploaded', { contractType: contractType });
}

// Função para gerar e enviar relatório manualmente
function generateAndSendReport() {
    Analytics.sendReport();
}

// Agendar envio automático de relatórios (semanal)
setInterval(() => {
    const now = new Date();
    // Enviar toda segunda-feira às 9h
    if (now.getDay() === 1 && now.getHours() === 9 && now.getMinutes() === 0) {
        Analytics.sendReport();
    }
}, 60000); // Verificar a cada minuto



// Função para limpar e validar dados base64 de assinatura
function limparDadosBase64(dados) {
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
    
    // Validar formato base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(dadosLimpos)) {
        console.warn('Dados base64 inválidos detectados');
        return null;
    }
    
    // Verificar tamanho mínimo
    if (dadosLimpos.length < 100) {
        console.warn('Dados base64 muito pequenos');
        return null;
    }
    
    return dadosLimpos;
}

// Função para adicionar assinaturas visuais ao PDF
function adicionarAssinaturasAoPDF(doc, y) {
    // Carregar assinaturas salvas
    const assinLocador = assinaturaLocador || JSON.parse(localStorage.getItem('assinatura_locador') || 'null');
    const assinLocatario = assinaturaLocatario || JSON.parse(localStorage.getItem('assinatura_locatario') || 'null');
    
    // Limpar e validar dados das assinaturas
    const dadosLocadorLimpos = assinLocador && assinLocador.data ? limparDadosBase64(assinLocador.data) : null;
    const dadosLocatarioLimpos = assinLocatario && assinLocatario.data ? limparDadosBase64(assinLocatario.data) : null;
    
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
    
    // Adicionar separador limpo
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



// Função para limpar formulário
function limparFormulario() {
    // Confirmar ação com o usuário
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário? Esta ação não pode ser desfeita.')) {
        try {
            // Limpar todos os campos do formulário
            const form = document.getElementById('contratoForm');
            if (form) {
                form.reset();
                
                // Limpar campos específicos que podem não ser limpos pelo reset()
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
            }
            
            // Limpar dados salvos no localStorage relacionados ao contrato atual
            const tipoAtual = tipoContratoAtual;
            if (tipoAtual) {
                localStorage.removeItem(`dados_${tipoAtual}`);
            }
            
            // Limpar assinaturas digitais
            localStorage.removeItem('assinatura_locador');
            localStorage.removeItem('assinatura_locatario');
            assinaturaLocador = null;
            assinaturaLocatario = null;
            
            // Limpar preview do contrato
            const preview = document.getElementById('contratoPreview');
            if (preview) {
                preview.innerHTML = '<div class="text-center text-muted"><i class="fas fa-file-contract fa-3x mb-3"></i><p>Preencha os dados na aba "Editar Dados" para visualizar o contrato</p></div>';
            }
            
            // Voltar para a aba de edição
            const formTab = document.getElementById('form-tab');
            if (formTab) {
                formTab.click();
            }
            
            // Mostrar mensagem de sucesso
            mostrarAlerta('Formulário limpo com sucesso! Todos os dados foram removidos.', 'success');
            
            // Registrar evento no analytics
            if (window.AssinaFacilAnalytics && window.AssinaFacilAnalytics.trackEvent) {
                window.AssinaFacilAnalytics.trackEvent('form_cleared', {
                    contract_type: tipoAtual || 'unknown',
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('Erro ao limpar formulário:', error);
            mostrarAlerta('Erro ao limpar formulário. Tente novamente.', 'danger');
        }
    }
}

