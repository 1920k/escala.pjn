import React, { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  const [dia, setDia] = useState('Domingo');
  const [horario, setHorario] = useState('08:00');
  const [cargo, setCargo] = useState('Principal');
  const [nome, setNome] = useState('');
  const [dados, setDados] = useState({});
  const [editando, setEditando] = useState({});
  const [editandoHorario, setEditandoHorario] = useState(null);

  const cargosPreDefinidos = ['Principal', 'Credencia', 'Palavra', 'Turibulo 1', 'Turibulo 2', 'Naveta 1', 'Naveta 2'];

  const BACKEND_URL = "https://escal.onrender.com"; // URL do backend online

  // 🔹 Buscar dados ao carregar
  useEffect(() => {
    fetch(`${BACKEND_URL}/dados`)
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("Erro ao carregar dados:", err));
  }, []);

  // 🔹 Salvar dados no backend sempre que alterar
  useEffect(() => {
    fetch(`${BACKEND_URL}/dados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }).catch(err => console.error("Erro ao salvar dados:", err));
  }, [dados]);

  // 🔹 Funções principais
  const adicionarNome = () => {
    if (!nome) return;
    setDados(prev => {
      const diaAtual = prev[dia] || [];
      let horarioAtual = diaAtual.find(h => h.horario === horario);

      if (horarioAtual) {
        let cargoExistente = horarioAtual.cargos.find(c => c.nome === cargo);
        if (cargoExistente) {
          if (!cargoExistente.pessoas.includes(nome)) {
            cargoExistente.pessoas.push(nome);
          }
        } else {
          horarioAtual.cargos.push({ nome: cargo, pessoas: [nome] });
        }
      } else {
        diaAtual.push({ horario, cargos: [{ nome: cargo, pessoas: [nome] }] });
      }
      return { ...prev, [dia]: diaAtual };
    });
    setNome('');
  };

  const apagarNome = (diaKey, horarioKey, cargoKey, nomeKey) => {
    setDados(prev => {
      const diaAtual = [...prev[diaKey]];
      const horarioAtual = diaAtual.find(h => h.horario === horarioKey);
      if (!horarioAtual) return prev;
      const cargoAtual = horarioAtual.cargos.find(c => c.nome === cargoKey);
      if (!cargoAtual) return prev;
      cargoAtual.pessoas = cargoAtual.pessoas.filter(n => n !== nomeKey);
      return { ...prev, [diaKey]: diaAtual };
    });
  };

  const iniciarEdicaoNome = (diaKey, horarioKey, cargoKey, nomeKey) => {
    setEditando({ dia: diaKey, horario: horarioKey, cargo: cargoKey, nome: nomeKey });
  };

  const salvarNomeEditado = (novoNome) => {
    const { dia, horario, cargo, nome } = editando;
    apagarNome(dia, horario, cargo, nome);
    setDados(prev => {
      const diaAtual = prev[dia] || [];
      let horarioAtual = diaAtual.find(h => h.horario === horario);
      if (!horarioAtual) {
        diaAtual.push({ horario, cargos: [{ nome: cargo, pessoas: [novoNome] }] });
      } else {
        let cargoExistente = horarioAtual.cargos.find(c => c.nome === cargo);
        if (cargoExistente) {
          cargoExistente.pessoas.push(novoNome);
        } else {
          horarioAtual.cargos.push({ nome: cargo, pessoas: [novoNome] });
        }
      }
      return { ...prev, [dia]: diaAtual };
    });
    setEditando({});
  };

  const iniciarEdicaoHorario = (diaKey, horario) => setEditandoHorario({ dia: diaKey, horario });
  const salvarHorarioEditado = (diaKey, horarioAntigo, novoHorario) => {
    setDados(prev => {
      const diaAtual = [...prev[diaKey]];
      const horarioAtual = diaAtual.find(h => h.horario === horarioAntigo);
      if (!horarioAtual) return prev;
      horarioAtual.horario = novoHorario;
      return { ...prev, [diaKey]: diaAtual };
    });
    setEditandoHorario(null);
  };

  const apagarHorario = (diaKey, horarioKey) => {
    setDados(prev => {
      const diaAtual = [...prev[diaKey]];
      const novosHorarios = diaAtual.filter(h => h.horario !== horarioKey);
      return { ...prev, [diaKey]: novosHorarios };
    });
  };

  const apagarDia = (diaKey) => {
    setDados(prev => {
      const novosDados = { ...prev };
      delete novosDados[diaKey];
      return novosDados;
    });
  };

  const gerarTextoEscala = () => {
    let texto = "📅 *Escala da Semana*\n\n";
    Object.keys(dados).forEach(dia => {
      texto += `📌 *${dia}*\n`;
      dados[dia].forEach(h => {
        texto += `⏰ ${h.horario}\n`;
        h.cargos.forEach(c => {
          texto += `   • ${c.nome}: ${c.pessoas.join(", ") || "—"}\n`;
        });
      });
      texto += "\n";
    });
    return texto;
  };

  const enviarWhatsApp = () => {
    const texto = encodeURIComponent(gerarTextoEscala());
    const url = `https://wa.me/?text=${texto}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <h1>Escala da Semana</h1>

      <div className="adicionar">
        <select value={dia} onChange={e => setDia(e.target.value)}>
          {['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado','Domingo'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input type="time" value={horario} onChange={e => setHorario(e.target.value)} />

        <select value={cargo} onChange={e => setCargo(e.target.value)}>
          {cargosPreDefinidos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <button onClick={adicionarNome} disabled={!nome}>Adicionar</button>
        <button onClick={enviarWhatsApp}>📲 Enviar para WhatsApp</button>
      </div>

      <div className="escala">
        {Object.entries(dados).map(([diaKey, horarios]) => (
          <div key={diaKey} className="dia">
            <h2>{diaKey} <button onClick={() => apagarDia(diaKey)}>🗑️ Apagar Dia</button></h2>
            {horarios.map(h => (
              <div key={h.horario} className="horario">
                {editandoHorario?.dia === diaKey && editandoHorario?.horario === h.horario ? (
                  <input
                    type="time"
                    defaultValue={h.horario}
                    onBlur={e => salvarHorarioEditado(diaKey, h.horario, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && salvarHorarioEditado(diaKey, h.horario, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <h3 onDoubleClick={() => iniciarEdicaoHorario(diaKey, h.horario)}>
                    {h.horario} <button onClick={() => apagarHorario(diaKey, h.horario)}>🗑️</button>
                  </h3>
                )}
                {h.cargos.map(c => (
                  <div key={c.nome} className="cargo">
                    <h4>{c.nome}</h4>
                    <ul>
                      {c.pessoas.map(n => (
                        <li key={n}>
                          {editando.dia === diaKey && editando.horario === h.horario && editando.cargo === c.nome && editando.nome === n ? (
                            <input
                              type="text"
                              defaultValue={n}
                              onBlur={e => salvarNomeEditado(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && salvarNomeEditado(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span onDoubleClick={() => iniciarEdicaoNome(diaKey, h.horario, c.nome, n)}>{n}</span>
                          )}
                          <button onClick={() => apagarNome(diaKey, h.horario, c.nome, n)}>❌</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
