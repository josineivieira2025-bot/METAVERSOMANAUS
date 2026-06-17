import { useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  Car,
  CloudRain,
  Home,
  LogIn,
  Map as MapIcon,
  Package,
  Play,
  RefreshCw,
  Shield,
  UserRound,
  Wallet
} from 'lucide-react';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fallbackMap = {
  districts: [
    { id: 'map-centro', name: 'Centro', x: 48, y: 54, width: 14, height: 13, traffic: 76, floodRisk: 58, unlocked: true },
    { id: 'map-distrito-industrial', name: 'Distrito Industrial', x: 68, y: 64, width: 18, height: 16, traffic: 68, floodRisk: 34, unlocked: true },
    { id: 'map-ponta-negra', name: 'Ponta Negra', x: 13, y: 42, width: 16, height: 12, traffic: 42, floodRisk: 18, unlocked: true }
  ],
  landmarks: [],
  routes: [
    { id: 'route-centro-ponta-negra', from: 'map-centro', to: 'map-ponta-negra', traffic: 66 },
    { id: 'route-centro-distrito', from: 'map-centro', to: 'map-distrito-industrial', traffic: 72 }
  ]
};

const fallbackWorld = {
  onlinePlayers: 128,
  weather: { condition: 'chuva amazonica', intensity: 72 },
  time: { day: 1, hour: 6, minute: 30 }
};

const fallbackCore = {
  companies: [],
  properties: [],
  vehicles: [],
  inventory: [],
  missions: [],
  services: []
};

function money(cents = 0) {
  return `MNV ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

async function requestJson(path, options) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function getDistrictCenter(district) {
  return {
    x: district.x + district.width / 2,
    y: district.y + district.height / 2
  };
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: 'jogador@manaus.local',
    password: '123456',
    displayName: 'Jogador Manaus'
  });
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('Conectando...');

    try {
      const data = await requestJson(mode === 'login' ? '/auth/login' : '/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      onAuth(data);
    } catch {
      setMessage(mode === 'login' ? 'Login falhou. Cadastre uma conta nova.' : 'Cadastro falhou. Tente outro email.');
    }
  }

  return (
    <main className="authShell">
      <section className="authPanel">
        <p className="eyebrow">Manaus Online</p>
        <h1>Entrar no metaverso</h1>
        <div className="modeSwitch">
          <button className={mode === 'login' ? 'selected' : ''} type="button" onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'selected' : ''} type="button" onClick={() => setMode('register')}>Cadastro</button>
        </div>
        <form className="formStack" onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Nome
              <input value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
            </label>
          )}
          <label>
            Email
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            Senha
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <button type="submit">
            <LogIn size={18} />
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
        {message && <p className="formMessage">{message}</p>}
      </section>
    </main>
  );
}

function CharacterCreator({ account, onCreated }) {
  const [form, setForm] = useState({
    fullName: account.displayName || 'Novo Morador',
    gender: 'Homem',
    heightCm: 175,
    weightKg: 75,
    hair: 'curto',
    outfit: 'casual'
  });

  async function submit(event) {
    event.preventDefault();
    const data = await requestJson('/characters', {
      method: 'POST',
      body: JSON.stringify({ ...form, accountId: account.id })
    });
    onCreated(data.character);
  }

  return (
    <main className="authShell">
      <section className="authPanel wide">
        <p className="eyebrow">Criacao de personagem</p>
        <h1>Novo morador de Manaus</h1>
        <form className="creatorGrid" onSubmit={submit}>
          <label>
            Nome completo
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          </label>
          <label>
            Genero
            <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
              <option>Homem</option>
              <option>Mulher</option>
            </select>
          </label>
          <label>
            Altura
            <input type="number" value={form.heightCm} onChange={(event) => setForm({ ...form, heightCm: event.target.value })} />
          </label>
          <label>
            Peso
            <input type="number" value={form.weightKg} onChange={(event) => setForm({ ...form, weightKg: event.target.value })} />
          </label>
          <label>
            Cabelo
            <select value={form.hair} onChange={(event) => setForm({ ...form, hair: event.target.value })}>
              <option>curto</option>
              <option>longo</option>
              <option>cacheado</option>
              <option>raspado</option>
            </select>
          </label>
          <label>
            Roupa
            <select value={form.outfit} onChange={(event) => setForm({ ...form, outfit: event.target.value })}>
              <option>casual</option>
              <option>social</option>
              <option>operacional</option>
              <option>esportivo</option>
            </select>
          </label>
          <button className="spanButton" type="submit">
            <UserRound size={18} />
            Criar e entrar
          </button>
        </form>
      </section>
    </main>
  );
}

function NeedBar({ label, value, dangerHigh = false }) {
  const danger = dangerHigh ? value > 70 : value < 35;
  return (
    <div className="needRow">
      <span>{label}</span>
      <div className="needTrack"><div className={danger ? 'needFill danger' : 'needFill'} style={{ width: `${value}%` }} /></div>
      <strong>{value}</strong>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <article className="statTile">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function WorldMap({ map, character, onMove }) {
  const districtById = new globalThis.Map(map.districts.map((district) => [district.id, district]));

  return (
    <div className="mapCanvas playMap">
      <div className="riverBand">Rio Negro</div>
      <svg className="routeLayer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {map.routes.map((route) => {
          const from = districtById.get(route.from);
          const to = districtById.get(route.to);
          if (!from || !to) return null;
          const start = getDistrictCenter(from);
          const end = getDistrictCenter(to);
          return <line key={route.id} x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={route.traffic > 70 ? 'routeLine busy' : 'routeLine'} />;
        })}
      </svg>
      {map.districts.map((district) => (
        <button
          className={district.id === character.mapDistrictId ? 'mapDistrict unlocked current' : district.unlocked ? 'mapDistrict unlocked' : 'mapDistrict'}
          disabled={!district.unlocked}
          key={district.id}
          onClick={() => onMove(district.id)}
          style={{ left: `${district.x}%`, top: `${district.y}%`, width: `${district.width}%`, height: `${district.height}%` }}
          type="button"
        >
          <strong>{district.name}</strong>
          <span>T{district.traffic} A{district.floodRisk}</span>
        </button>
      ))}
      <div className="playerMarker" style={{ left: `${character.position?.x || 55}%`, top: `${character.position?.y || 60}%` }}>
        <UserRound size={16} />
      </div>
    </div>
  );
}

export function App() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState('auth');
  const [world, setWorld] = useState(fallbackWorld);
  const [cityMap, setCityMap] = useState(fallbackMap);
  const [characters, setCharacters] = useState([]);
  const [character, setCharacter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [core, setCore] = useState(fallbackCore);
  const [economy, setEconomy] = useState({ prices: [], bank: 'Banco Solimoes' });
  const [activityLog, setActivityLog] = useState(['Cliente web iniciado.']);
  const [apiStatus, setApiStatus] = useState('offline');

  const worldClock = useMemo(() => {
    const hour = String(world.time?.hour ?? 0).padStart(2, '0');
    const minute = String(world.time?.minute ?? 0).padStart(2, '0');
    return `Dia ${world.time?.day ?? 1}, ${hour}:${minute}`;
  }, [world]);

  async function loadGame(accountId = session?.account?.id) {
    const [worldData, mapData, jobsData, economyData, companies, properties, vehicles, inventory, missions, services, characterData] = await Promise.all([
      requestJson('/world/status'),
      requestJson('/map'),
      requestJson('/jobs'),
      requestJson('/economy/prices'),
      requestJson('/companies'),
      requestJson('/properties'),
      requestJson('/vehicles'),
      requestJson('/inventory'),
      requestJson('/missions'),
      requestJson('/services'),
      requestJson(accountId ? `/characters?accountId=${accountId}` : '/characters')
    ]);

    setWorld(worldData);
    setCityMap(mapData.map);
    setJobs(jobsData.jobs);
    setEconomy(economyData);
    setCore({
      companies: companies.companies,
      properties: properties.properties,
      vehicles: vehicles.vehicles,
      inventory: inventory.inventory,
      missions: missions.missions,
      services: services.services
    });
    setCharacters(characterData.characters);
    setApiStatus('online');
    return characterData.characters;
  }

  async function handleAuth(data) {
    setSession(data);
    setActivityLog([`Conta conectada: ${data.account.displayName}`]);
    try {
      const loadedCharacters = await loadGame(data.account.id);
      if (loadedCharacters.length > 0) {
        setCharacter(loadedCharacters[0]);
        setScreen('lobby');
      } else {
        setScreen('create-character');
      }
    } catch {
      setApiStatus('offline');
      setScreen('create-character');
    }
  }

  async function handleCharacterCreated(createdCharacter) {
    setCharacter(createdCharacter);
    setCharacters([createdCharacter]);
    setScreen('world');
    setActivityLog((current) => [`Personagem criado: ${createdCharacter.fullName}`, ...current].slice(0, 6));
    await loadGame(session.account.id);
  }

  async function moveTo(mapDistrictId) {
    const result = await requestJson(`/characters/${character.id}/move`, {
      method: 'POST',
      body: JSON.stringify({ mapDistrictId })
    });
    setCharacter(result.character);
    setActivityLog((current) => [result.result.message, ...current].slice(0, 6));
  }

  async function startJob(jobId) {
    const result = await requestJson(`/jobs/${jobId}/start`, {
      method: 'POST',
      body: JSON.stringify({ characterId: character.id })
    });
    setCharacter(result.character);
    setActivityLog((current) => [result.result.message, ...current].slice(0, 6));
  }

  async function tickNeeds() {
    const result = await requestJson(`/characters/${character.id}/needs/tick`, { method: 'POST' });
    setCharacter(result.character);
    setActivityLog((current) => ['Tempo passou no mundo.', ...current].slice(0, 6));
  }

  useEffect(() => {
    loadGame().catch(() => setApiStatus('offline'));
  }, []);

  if (!session) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (screen === 'create-character') {
    return <CharacterCreator account={session.account} onCreated={handleCharacterCreated} />;
  }

  if (screen === 'lobby') {
    return (
      <main className="authShell">
        <section className="authPanel wide">
          <p className="eyebrow">Lobby</p>
          <h1>Escolha seu personagem</h1>
          <div className="characterSelectList">
            {characters.map((item) => (
              <button key={item.id} type="button" onClick={() => { setCharacter(item); setScreen('world'); }}>
                <UserRound size={20} />
                <span>{item.fullName}</span>
                <b>{item.district}</b>
              </button>
            ))}
          </div>
          <button className="wideButton" type="button" onClick={() => setScreen('create-character')}>Criar outro personagem</button>
        </section>
      </main>
    );
  }

  const activeJob = jobs.find((job) => job.id === character?.activeJobId);

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="brandBlock">
          <span>MMORPG 16+</span>
          <h1>Manaus Online</h1>
        </div>
        <nav className="navList" aria-label="Modulos">
          <a href="#mundo"><MapIcon size={18} /> Mundo</a>
          <a href="#personagem"><UserRound size={18} /> Personagem</a>
          <a href="#profissoes"><BriefcaseBusiness size={18} /> Trabalho</a>
          <a href="#inventario"><Package size={18} /> Inventario</a>
          <a href="#veiculos"><Car size={18} /> Veiculos</a>
          <a href="#servicos"><Shield size={18} /> Servicos</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Jogando como {session.account.displayName}</p>
            <h2>{character.fullName}</h2>
          </div>
          <div className={apiStatus === 'online' ? 'serverPill online' : 'serverPill'}>
            {apiStatus === 'online' ? 'API online' : 'Modo local'}
          </div>
        </header>

        <section className="statsGrid" id="mundo">
          <StatTile icon={CloudRain} label="Clima" value={`${world.weather?.condition} ${world.weather?.intensity}%`} />
          <StatTile icon={MapIcon} label="Horario" value={worldClock} />
          <StatTile icon={Wallet} label="Carteira" value={money(character.walletCents)} />
          <StatTile icon={Building2} label="Empresas" value={core.companies.length} />
          <StatTile icon={Home} label="Imoveis" value={core.properties.length} />
          <StatTile icon={Car} label="Veiculos" value={core.vehicles.length} />
          <StatTile icon={Shield} label="Servicos" value={core.services.length} />
          <StatTile icon={Banknote} label="Mercado" value={economy.prices.length} />
        </section>

        <section className="mainGrid">
          <article className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Mapa 2D jogavel</p>
                <h3>{character.district}</h3>
              </div>
              <button className="iconButton" type="button" onClick={() => loadGame(session.account.id)} aria-label="Atualizar">
                <RefreshCw size={18} />
              </button>
            </div>
            <WorldMap map={cityMap} character={character} onMove={moveTo} />
          </article>

          <article className="panel" id="personagem">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Personagem</p>
                <h3>Nivel {character.level}</h3>
              </div>
              <strong className="activeJob">{activeJob ? activeJob.name : 'Livre'}</strong>
            </div>
            <div className="profileLine">
              <span>{character.gender}</span>
              <span>{character.district}</span>
              <span>{character.experience} XP</span>
              <span>{character.appearance?.outfit || 'casual'}</span>
            </div>
            <div className="needsList">
              <NeedBar label="Fome" value={character.needs.hunger} />
              <NeedBar label="Sede" value={character.needs.thirst} />
              <NeedBar label="Sono" value={character.needs.sleep} />
              <NeedBar label="Energia" value={character.needs.energy} />
              <NeedBar label="Saude" value={character.needs.health} />
              <NeedBar label="Higiene" value={character.needs.hygiene} />
              <NeedBar label="Estresse" value={character.needs.stress} dangerHigh />
              <NeedBar label="Felicidade" value={character.needs.happiness} />
            </div>
            <button className="wideButton" type="button" onClick={tickNeeds}>Passar tempo</button>
          </article>
        </section>

        <section className="panel" id="profissoes">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Trabalho e missoes</p>
              <h3>Acoes jogaveis</h3>
            </div>
          </div>
          <div className="jobsGrid">
            {jobs.map((job) => (
              <article className="jobCard" key={job.id}>
                <div>
                  <span>{job.category} | {job.district}</span>
                  <h4>{job.name}</h4>
                  <p>{job.mission}</p>
                </div>
                <div className="jobFooter">
                  <strong>{money(job.salaryCents)}</strong>
                  <button type="button" onClick={() => startJob(job.id)}><Play size={16} /> Trabalhar</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="systemMatrix">
          <article className="panel" id="inventario">
            <div className="panelHeader"><div><p className="eyebrow">Inventario</p><h3>Itens</h3></div></div>
            <div className="compactList">
              {core.inventory.map((item) => (
                <div className="compactRow" key={item.id}><Package size={18} /><div><strong>{item.name}</strong><span>{item.code} | qtd {item.quantity}</span></div></div>
              ))}
            </div>
          </article>

          <article className="panel" id="veiculos">
            <div className="panelHeader"><div><p className="eyebrow">Veiculos</p><h3>Frota</h3></div></div>
            <div className="compactList">
              {core.vehicles.map((vehicle) => (
                <div className="compactRow" key={vehicle.id}><Car size={18} /><div><strong>{vehicle.model}</strong><span>{vehicle.plate} | combustivel {vehicle.fuelPercent}%</span></div><b>{vehicle.conditionPercent}%</b></div>
              ))}
            </div>
          </article>
        </section>

        <section className="systemMatrix" id="servicos">
          <article className="panel">
            <div className="panelHeader"><div><p className="eyebrow">Missoes</p><h3>Disponiveis</h3></div></div>
            <div className="compactList">
              {core.missions.map((mission) => (
                <div className="compactRow" key={mission.id}><Play size={18} /><div><strong>{mission.title}</strong><span>{mission.district} | {mission.xpReward} XP</span></div><b>{money(mission.rewardCents)}</b></div>
              ))}
            </div>
          </article>
          <article className="panel">
            <div className="panelHeader"><div><p className="eyebrow">Log</p><h3>Eventos</h3></div></div>
            <div className="activityLog">
              {activityLog.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
