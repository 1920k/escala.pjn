export default function EscalaCard({ dia, horario, cargos, removerCargo }) {
  return (
    <div className="card">
      <h2>{dia}</h2>
      <h3>{horario}</h3>
      {cargos.map((cargo, idx) => (
        <div key={idx} className="cargo">
          <span>
            <strong>{cargo.nome}:</strong> {Array.isArray(cargo.pessoas) ? cargo.pessoas.join(', ') : cargo.pessoas}
          </span>
          <button onClick={() => removerCargo(dia, horario, idx)}>X</button>
        </div>
      ))}
    </div>
  );
}
