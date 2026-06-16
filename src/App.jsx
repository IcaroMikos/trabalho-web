import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados principais e listagem
  const [veiculos, setVeiculos] = useState([]);
  const [busca, setBusca] = useState('');
  
  // Login Persistente com localStorage
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuario_logado');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });
  
  // Controle de Telas
  const [telaAtiva, setTelaAtiva] = useState('vitrine');
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [veiculoEditando, setVeiculoEditando] = useState(null);
  const [mostrarContato, setMostrarContato] = useState(false);

  // Estados de Login / Registro
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Estados para Edição de Perfil (Minha Conta)
  const [isEditandoPerfil, setIsEditandoPerfil] = useState(false);
  const [perfilNome, setPerfilNome] = useState('');
  const [perfilEmail, setPerfilEmail] = useState('');
  const [perfilSenha, setPerfilSenha] = useState('');
  const [perfilConfirmarSenha, setPerfilConfirmarSenha] = useState(''); // NOVO: Confirmar senha

  // Estados dos Campos Fixos do Formulário (Usado para Criar e Editar Anúncios)
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [preco, setPreco] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [cambio, setCambio] = useState('');
  const [tipoMotor, setTipoMotor] = useState('');
  const [cor, setCor] = useState('');
  const [carroceria, setCarroceria] = useState('');
  const [aceitaTroca, setAceitaTroca] = useState('Não');
  const [imagem, setImagem] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');

  // Buscar veículos do json-server
  const buscarVeiculos = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/veiculos');
      const dados = await resposta.json();
      setVeiculos(dados);
    } catch (error) {
      console.error("Erro ao buscar veículos.", error);
    }
  };

  useEffect(() => {
    buscarVeiculos();
  }, []);

  // Cadastro de novo Usuário
  const lidarComRegistro = async (e) => {
    e.preventDefault();
    const novoUsuario = { nome: nomeUsuario, email, senha };
    await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario)
    });
    alert("Conta criada com sucesso! Faça o seu login.");
    setIsRegistrando(false);
    setEmail(''); setSenha('');
  };

  // Autenticação de Usuário
  const lidarComLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/usuarios');
      const usuarios = await res.json();
      
      const usuarioEncontrado = usuarios.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (usuarioEncontrado) {
        localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
        setUsuarioLogado(usuarioEncontrado);
        setTelaAtiva('vitrine');
        setEmail(''); setSenha('');
      } else {
        alert("E-mail ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API de usuários:", error);
    }
  };

  const sair = () => {
    localStorage.removeItem('usuario_logado');
    setUsuarioLogado(null);
    setTelaAtiva('vitrine');
  };

  // =========== FUNÇÕES DE MINHA CONTA E PERFIL ===========

  const abrirMinhaConta = () => {
    setPerfilNome(usuarioLogado.nome);
    setPerfilEmail(usuarioLogado.email);
    setPerfilSenha(usuarioLogado.senha);
    setPerfilConfirmarSenha(usuarioLogado.senha);
    setIsEditandoPerfil(false); // Inicia sempre no modo de visualização
    setTelaAtiva('minha_conta');
  };

  const atualizarPerfil = async (e) => {
    e.preventDefault();

    // Validação da senha
    if (perfilSenha !== perfilConfirmarSenha) {
      alert("As senhas não coincidem! Verifique e tente novamente.");
      return;
    }

    const usuarioAtualizado = { ...usuarioLogado, nome: perfilNome, email: perfilEmail, senha: perfilSenha };
    
    try {
      await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioAtualizado)
      });
      setUsuarioLogado(usuarioAtualizado);
      localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtualizado));
      alert("Dados da conta atualizados com sucesso!");
      setIsEditandoPerfil(false); // Volta para o modo de visualização
    } catch (error) {
      alert("Erro ao atualizar perfil.");
    }
  };

  // =========== FUNÇÕES DE ANÚNCIOS ===========

  const limparFormulario = () => {
    setMarca(''); setModelo(''); setAno(''); setPreco(''); setQuilometragem(''); setImagem('');
    setCombustivel(''); setCambio(''); setLocalizacao(''); setTipoMotor(''); setCor(''); setCarroceria(''); setAceitaTroca('Não');
    setTelefoneContato('');
  };

  const prepararEdicaoAnuncio = (carro) => {
    setVeiculoEditando(carro);
    setMarca(carro.marca || ''); setModelo(carro.modelo || ''); setAno(carro.ano || '');
    setPreco(carro.preco || ''); setQuilometragem(carro.quilometragem || '');
    setLocalizacao(carro.localizacao || ''); setCombustivel(carro.combustivel || '');
    setCambio(carro.cambio || ''); setTipoMotor(carro.tipo_motor || '');
    setCor(carro.cor || ''); setCarroceria(carro.carroceria || '');
    setAceitaTroca(carro.aceita_troca || 'Não'); setImagem(carro.imagem || '');
    setTelefoneContato(carro.telefone || '');
    setTelaAtiva('editar_anuncio');
  };

  const salvarEdicaoAnuncio = async (e) => {
    e.preventDefault();
    
    const carroAtualizado = {
      ...veiculoEditando,
      marca, modelo, ano, preco, quilometragem, imagem,
      combustivel, cambio, localizacao, tipo_motor: tipoMotor,
      cor, carroceria, aceita_troca: aceitaTroca, telefone: telefoneContato
    };

    await fetch(`http://localhost:3000/veiculos/${veiculoEditando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carroAtualizado)
    });

    alert("Anúncio atualizado com sucesso!");
    buscarVeiculos();
    limparFormulario();
    setTelaAtiva('minha_conta');
  };

  const deletarAnuncio = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja remover este anúncio? Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
      try {
        await fetch(`http://localhost:3000/veiculos/${id}`, {
          method: 'DELETE'
        });
        alert("Anúncio removido com sucesso!");
        buscarVeiculos(); 
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao remover o anúncio.");
      }
    }
  };

  const salvarNovoAnuncio = async (e) => {
    e.preventDefault();

    const novoCarro = {
      marca, modelo, ano, preco, quilometragem, imagem,
      combustivel, cambio, localizacao, tipo_motor: tipoMotor,
      cor, carroceria, aceita_troca: aceitaTroca,
      anunciante: usuarioLogado.nome,      
      email: usuarioLogado.email,          
      telefone: telefoneContato            
    };

    await fetch('http://localhost:3000/veiculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCarro)
    });

    alert("Veículo anunciado com sucesso!");
    limparFormulario();
    buscarVeiculos();
    setTelaAtiva('vitrine');
  };

  const veiculosFiltrados = veiculos.filter(carro => 
    carro.modelo.toLowerCase().includes(busca.toLowerCase()) ||
    carro.marca.toLowerCase().includes(busca.toLowerCase())
  );

  const meusVeiculos = usuarioLogado ? veiculos.filter(carro => carro.email === usuarioLogado.email) : [];

  return (
    <div className="app-container">
      {/* HEADER DO SITE */}
      <header className="site-header">
        <div className="header-content">
          <h1 className="site-logo" onClick={() => setTelaAtiva('vitrine')}>GM IMPORTS</h1>
          <nav className="header-nav">
            <a onClick={() => setTelaAtiva('vitrine')} className={telaAtiva === 'vitrine' ? 'active' : ''}>Comprar</a>
            
            {usuarioLogado && (
              <button className="btn-anuncie-topo" onClick={() => { limparFormulario(); setTelaAtiva('anunciar'); }}>
                + Anuncie aqui
              </button>
            )}

            {/* Menu Usuário */}
            {usuarioLogado ? (
              <div className="user-menu">
                <span onClick={abrirMinhaConta} className="menu-minha-conta">
                  Olá, <strong>{usuarioLogado.nome}</strong>
                </span>
                <button className="btn-sair" onClick={sair}>Sair</button>
              </div>
            ) : (
              <button className="btn-login-header" onClick={() => { setTelaAtiva('login'); setIsRegistrando(false); }}>Entrar</button>
            )}
          </nav>
        </div>
      </header>

      {/* ================= TELAS DA APLICAÇÃO ================= */}

      {/* 1. TELA DE LOGIN / CADASTRO */}
      {telaAtiva === 'login' && (
        <main className="auth-container">
          <div className="auth-card">
            <h2>{isRegistrando ? 'Criar sua Conta' : 'Acessar sua Conta'}</h2>
            <form onSubmit={isRegistrando ? lidarComRegistro : lidarComLogin}>
              {isRegistrando && (
                <input type="text" placeholder="Nome Completo" value={nomeUsuario} onChange={e => setNomeUsuario(e.target.value)} required />
              )}
              <input type="email" placeholder="Seu E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Sua Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
              <button type="submit" className="btn-auth">
                {isRegistrando ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>
            <p onClick={() => setIsRegistrando(!isRegistrando)}>
              {isRegistrando ? 'Já possui uma conta? Acesse aqui' : 'Não tem uma conta? Cadastre-se gratuitamente'}
            </p>
          </div>
        </main>
      )}

      {/* 2. TELA DE MINHA CONTA (Perfil + Meus Anúncios) */}
      {telaAtiva === 'minha_conta' && usuarioLogado && (
        <main className="profile-container">
          <div className="profile-header">
            <h2>Gerenciar Minha Conta</h2>
          </div>
          
          <div className="profile-content">
            {/* Bloco de Dados do Usuário */}
            <div className="profile-card profile-info-card">
              <h3>Meus Dados Pessoais</h3>

              {!isEditandoPerfil ? (
                // MODO DE VISUALIZAÇÃO
                <div className="profile-view-mode">
                  <div className="info-line">
                    <strong>Nome Completo:</strong> <span>{usuarioLogado.nome}</span>
                  </div>
                  <div className="info-line">
                    <strong>E-mail:</strong> <span>{usuarioLogado.email}</span>
                  </div>
                  <div className="info-line">
                    <strong>Status da Conta:</strong> <span className="status-active">Ativa</span>
                  </div>
                  <button className="btn-edit-profile-toggle" onClick={() => setIsEditandoPerfil(true)}>
                    Editar Dados Pessoais
                  </button>
                </div>
              ) : (
                // MODO DE EDIÇÃO DO FORMULÁRIO
                <form onSubmit={atualizarPerfil}>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" value={perfilNome} onChange={e => setPerfilNome(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail de Acesso</label>
                    <input type="email" value={perfilEmail} onChange={e => setPerfilEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input type="password" value={perfilSenha} onChange={e => setPerfilSenha(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input type="password" placeholder="Repita a nova senha" value={perfilConfirmarSenha} onChange={e => setPerfilConfirmarSenha(e.target.value)} required />
                  </div>
                  
                  <div className="profile-form-actions">
                    <button type="button" className="btn-cancel-profile" onClick={() => {
                      setIsEditandoPerfil(false);
                      // Reseta os campos para o original caso o usuário cancele
                      setPerfilNome(usuarioLogado.nome);
                      setPerfilEmail(usuarioLogado.email);
                      setPerfilSenha(usuarioLogado.senha);
                      setPerfilConfirmarSenha(usuarioLogado.senha);
                    }}>Cancelar</button>
                    <button type="submit" className="btn-update-profile">Confirmar Alterações</button>
                  </div>
                </form>
              )}
            </div>

            {/* Listagem dos Anúncios do Usuário */}
            <div className="profile-card my-ads-card">
              <h3>Meus Veículos Anunciados ({meusVeiculos.length})</h3>
              {meusVeiculos.length === 0 ? (
                <p className="no-ads-msg">Você ainda não anunciou nenhum veículo.</p>
              ) : (
                <div className="my-ads-list">
                  {meusVeiculos.map(carro => (
                    <div key={carro.id} className="my-ad-item">
                      <div className="my-ad-img-box">
                        {carro.imagem ? <img src={carro.imagem} alt={carro.modelo} className="my-ad-img" /> : <div className="no-img-small">S/ Foto</div>}
                      </div>
                      
                      <div className="my-ad-details">
                        <h4>{carro.marca} {carro.modelo}</h4>
                        <p>R$ {carro.preco} • {carro.ano} • {carro.quilometragem}</p>
                      </div>
                      
                      <div className="my-ad-actions">
                        <button className="btn-edit-ad" onClick={() => prepararEdicaoAnuncio(carro)}>Editar</button>
                        <button className="btn-delete-ad" onClick={() => deletarAnuncio(carro.id)}>Remover</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 3. TELA DE ANUNCIAR OU EDITAR ANÚNCIO */}
      {(telaAtiva === 'anunciar' || telaAtiva === 'editar_anuncio') && (
        <main className="announce-container">
          <div className="announce-card">
            <h2>{telaAtiva === 'editar_anuncio' ? 'Editar Anúncio' : 'Anunciar Novo Veículo'}</h2>
            <form onSubmit={telaAtiva === 'editar_anuncio' ? salvarEdicaoAnuncio : salvarNovoAnuncio}>
              <div className="form-row">
                <input type="text" placeholder="Marca (ex: Ferrari)" value={marca} onChange={e => setMarca(e.target.value)} required />
                <input type="text" placeholder="Modelo (ex: Roma V8)" value={modelo} onChange={e => setModelo(e.target.value)} required />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Ano (ex: 2023)" value={ano} onChange={e => setAno(e.target.value)} required />
                <input type="text" placeholder="Quilometragem (ex: 1.500 km)" value={quilometragem} onChange={e => setQuilometragem(e.target.value)} required />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Preço em R$ (ex: 3.200.000)" value={preco} onChange={e => setPreco(e.target.value)} required />
                <input type="text" placeholder="Localização (ex: São Paulo - SP)" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Combustível (ex: Gasolina)" value={combustivel} onChange={e => setCombustivel(e.target.value)} required />
                <input type="text" placeholder="Câmbio (ex: Automático)" value={cambio} onChange={e => setCambio(e.target.value)} required />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Tipo de Motor (ex: 3.9 V8 BiTurbo)" value={tipoMotor} onChange={e => setTipoMotor(e.target.value)} required />
                <input type="text" placeholder="Cor (ex: Vinho)" value={cor} onChange={e => setCor(e.target.value)} />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Carroceria (ex: Cupê)" value={carroceria} onChange={e => setCarroceria(e.target.value)} required />
                <input type="text" placeholder="Telefone de Contato (ex: (42) 99999-1234)" value={telefoneContato} onChange={e => setTelefoneContato(e.target.value)} required />
              </div>
              <div className="form-row-select">
                <label>Aceita Troca?</label>
                <select value={aceitaTroca} onChange={e => setAceitaTroca(e.target.value)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>

              <input type="text" placeholder="URL da Foto do Veículo (Deixe em branco para preencher depois)" value={imagem} onChange={e => setImagem(e.target.value)} />
              
              <div className="announce-buttons">
                <button type="button" className="btn-cancel" onClick={() => telaAtiva === 'editar_anuncio' ? setTelaAtiva('minha_conta') : setTelaAtiva('vitrine')}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit-announce">
                  {telaAtiva === 'editar_anuncio' ? 'Salvar Alterações' : 'Publicar Anúncio'}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* 4. TELA DE DETALHES (Visual Webmotors) */}
      {telaAtiva === 'detalhes' && veiculoSelecionado && (
        <main className="detail-container">
          <button className="btn-back" onClick={() => { setTelaAtiva('vitrine'); setMostrarContato(false); }}>
            ← Voltar para a Vitrine
          </button>
          
          <div className="detail-content">
            <div className="detail-image-box">
              {veiculoSelecionado.imagem ? (
                <img src={veiculoSelecionado.imagem} alt={veiculoSelecionado.modelo} />
              ) : (
                <div className="no-image-large">Foto não disponível</div>
              )}
            </div>

            <div className="detail-header-block">
              <span className="detail-brand">{veiculoSelecionado.marca}</span>
              <h2 className="detail-model">{veiculoSelecionado.modelo}</h2>
            </div>

            <div className="detail-body-layout">
              <div className="detail-left-column">
                <h3>Especificações do Veículo</h3>
                <div className="detail-specs">
                  <div className="spec-item"><strong>Ano:</strong> {veiculoSelecionado.ano}</div>
                  <div className="spec-item"><strong>Quilometragem:</strong> {veiculoSelecionado.quilometragem}</div>
                  <div className="spec-item"><strong>Câmbio:</strong> {veiculoSelecionado.cambio || 'Automático'}</div>
                  <div className="spec-item"><strong>Combustível:</strong> {veiculoSelecionado.combustivel || 'Gasolina'}</div>
                  <div className="spec-item"><strong>Motor:</strong> {veiculoSelecionado.tipo_motor || 'N/A'}</div>
                  <div className="spec-item"><strong>Cor:</strong> {veiculoSelecionado.cor || 'A consultar'}</div>
                  <div className="spec-item"><strong>Carroceria:</strong> {veiculoSelecionado.carroceria || 'Cupê'}</div>
                  <div className="spec-item"><strong>Aceita Troca:</strong> {veiculoSelecionado.aceita_troca || 'Não'}</div>
                  <div className="spec-item"><strong>Localização:</strong> {veiculoSelecionado.localizacao || 'São Paulo - SP'}</div>
                </div>
              </div>

              <div className="detail-right-column">
                <div className="action-card">
                  <h3 className="detail-price">R$ {veiculoSelecionado.preco}</h3>
                  
                  {!mostrarContato ? (
                    <button className="btn-contact" onClick={() => setMostrarContato(true)}>Entre em Contato</button>
                  ) : (
                    <div className="contact-info-block">
                      <h4>Informações do Anunciante</h4>
                      <p><strong>Vendedor:</strong> {veiculoSelecionado.anunciante || 'Atendimento Premium'}</p>
                      <p><strong>Telefone:</strong> {veiculoSelecionado.telefone || '(42) 99999-3220'}</p>
                      <p><strong>E-mail:</strong> {veiculoSelecionado.email || 'contato@premiummotors.com'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 5. TELA DA VITRINE NORMAL */}
      {telaAtiva === 'vitrine' && (
        <>
          <section className="search-section">
            <div className="search-box">
              <h2>O carro dos seus sonhos está aqui</h2>
              <input 
                type="text" 
                placeholder="Digite a marca ou o modelo do veículo que procura..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </section>

          <main className="main-content">
            <section className="showcase-section">
              <div className="showcase-header">
                <h3>Carros de Luxo em Destaque ({veiculosFiltrados.length})</h3>
              </div>

              <div className="vehicles-grid">
                {veiculosFiltrados.map((carro) => (
                  <div key={carro.id} className="vehicle-card" onClick={() => { setVeiculoSelecionado(carro); setTelaAtiva('detalhes'); }} style={{cursor: 'pointer'}}>
                    <div className="card-image-wrapper">
                      {carro.imagem ? (
                        <img src={carro.imagem} alt={`${carro.marca} ${carro.modelo}`} />
                      ) : (
                        <div className="no-image">Sem Foto</div>
                      )}
                    </div>
                    <div className="card-info">
                      <span className="car-brand">{carro.marca}</span>
                      <h4 className="car-model">{carro.modelo}</h4>
                      <p className="car-details">
                        <span>{carro.ano}</span>
                        <span>•</span>
                        <span>{carro.quilometragem}</span>
                      </p>
                      <p className="car-price">R$ {carro.preco}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {veiculosFiltrados.length === 0 && (
                <p className="no-results">Nenhum veículo encontrado para a sua pesquisa.</p>
              )}
            </section>
          </main>
        </>
      )}
    </div>
  );
}

export default App;