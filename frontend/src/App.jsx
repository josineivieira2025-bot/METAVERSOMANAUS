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

function LoadingScreen({ account, onCreateCharacter }) {
  return (
    <main className="authShell">
      <section className="authPanel">
        <p className="eyebrow">Carregando</p>
        <h1>Preparando seu personagem</h1>
        <p className="formMessage">Se esta tela demorar, crie um personagem para entrar no mundo.</p>
        <button className="wideButton" type="button" onClick={onCreateCharacter}>
          <UserRound size={18} />
          Criar personagem
        </button>
        {account && <p className="formMessage">Conta: {account.displayName}</p>}
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
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('Criando personagem...');
    try {
      const data = await requestJson('/characters', {
        method: 'POST',
        body: JSON.stringify({ ...form, accountId: account.id })
      });
      onCreated(data.character);
    } catch {
      setMessage('Nao foi possivel criar o personagem. Confira se a API esta online.');
    }
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
        {message && <p className="formMessage">{message}</p>}
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
  if (!character) {
    return <div className="mapCanvas playMap" />;
  }

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

function GameWorldView({
  character,
  world,
  map,
  jobs,
  core,
  economy,
  activityLog,
  onMoveDistrict,
  onStartJob,
  onTickNeeds,
  onRefresh
}) {
  const [playerPosition, setPlayerPosition] = useState(character.position || { x: 55, y: 60 });
  const activeJob = jobs.find((job) => job.id === character?.activeJobId);
  const currentDistrict = map.districts.find((district) => (
    playerPosition.x >= district.x &&
    playerPosition.x <= district.x + district.width &&
    playerPosition.y >= district.y &&
    playerPosition.y <= district.y + district.height
  ));

  useEffect(() => {
    setPlayerPosition(character.position || { x: 55, y: 60 });
  }, [character.id, character.position?.x, character.position?.y]);

  useEffect(() => {
    function handleKeyDown(event) {
      const step = event.shiftKey ? 2.4 : 1.2;
      const movement = {
        ArrowUp: { x: 0, y: -step },
        w: { x: 0, y: -step },
        W: { x: 0, y: -step },
        ArrowDown: { x: 0, y: step },
        s: { x: 0, y: step },
        S: { x: 0, y: step },
        ArrowLeft: { x: -step, y: 0 },
        a: { x: -step, y: 0 },
        A: { x: -step, y: 0 },
        ArrowRight: { x: step, y: 0 },
        d: { x: step, y: 0 },
        D: { x: step, y: 0 }
      }[event.key];

      if (!movement) return;
      event.preventDefault();
      setPlayerPosition((current) => ({
        x: Math.min(94, Math.max(6, current.x + movement.x)),
        y: Math.min(86, Math.max(8, current.y + movement.y))
      }));
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const districtById = new globalThis.Map(map.districts.map((district) => [district.id, district]));

  return (
    <main className="gameShell">
      <section className="gameWorld">
        <div className="gameRiver">Rio Negro</div>
        <svg className="gameRoutes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {map.routes.map((route) => {
            const from = districtById.get(route.from);
            const to = districtById.get(route.to);
            if (!from || !to) return null;
            const start = getDistrictCenter(from);
            const end = getDistrictCenter(to);
            return <line key={route.id} x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={route.traffic > 70 ? 'gameRoad busy' : 'gameRoad'} />;
          })}
        </svg>

        {map.districts.map((district) => (
          <button
            className={district.unlocked ? 'gameDistrict unlocked' : 'gameDistrict'}
            disabled={!district.unlocked}
            key={district.id}
            onClick={() => onMoveDistrict(district.id)}
            style={{ left: `${district.x}%`, top: `${district.y}%`, width: `${district.width}%`, height: `${district.height}%` }}
            type="button"
          >
            <span>{district.name}</span>
          </button>
        ))}

        {map.landmarks.map((landmark) => (
          <div
            className={`gameLandmark ${landmark.type}`}
            key={landmark.id}
            style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
            title={landmark.name}
          />
        ))}

        <div className="avatar" style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}>
          <div className="avatarHead" />
          <div className="avatarBody" />
        </div>
      </section>

      <aside className="gameHud topLeft">
        <p className="eyebrow">Manaus Online</p>
        <h1>{character.fullName}</h1>
        <span>{currentDistrict?.name || character.district}</span>
      </aside>

      <aside className="gameHud topRight">
        <strong>{world.weather?.condition} {world.weather?.intensity}%</strong>
        <span>Carteira {money(character.walletCents)}</span>
        <span>{activeJob ? activeJob.name : 'Sem trabalho ativo'}</span>
      </aside>

      <aside className="gameHud bottomLeft">
        <div className="miniNeeds">
          <NeedBar label="Fome" value={character.needs.hunger} />
          <NeedBar label="Sede" value={character.needs.thirst} />
          <NeedBar label="Energia" value={character.needs.energy} />
          <NeedBar label="Saude" value={character.needs.health} />
        </div>
      </aside>

      <aside className="gameHud bottomRight">
        <button type="button" onClick={onTickNeeds}>Passar tempo</button>
        <button type="button" onClick={onRefresh}>Atualizar mundo</button>
        {jobs.slice(0, 3).map((job) => (
          <button key={job.id} type="button" onClick={() => onStartJob(job.id)}>
            Trabalhar: {job.name}
          </button>
        ))}
      </aside>

      <aside className="gameHud centerBottom">
        <span>WASD ou setas para andar</span>
        <span>{core.vehicles.length} veiculos | {core.inventory.length} itens | {economy.prices.length} precos</span>
        <span>{activityLog[0]}</span>
      </aside>
    </main>
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
    try {
      const loadedCharacters = await loadGame(session.account.id);
      const syncedCharacter = loadedCharacters.find((item) => item.id === createdCharacter.id) || createdCharacter;
      setCharacter(syncedCharacter);
    } catch {
      setApiStatus('offline');
    }
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

  if (!character) {
    return <LoadingScreen account={session.account} onCreateCharacter={() => setScreen('create-character')} />;
  }

  return (
    <GameWorldView
      activityLog={activityLog}
      character={character}
      core={core}
      economy={economy}
      jobs={jobs}
      map={cityMap}
      onMoveDistrict={moveTo}
      onRefresh={() => loadGame(session.account.id)}
      onStartJob={startJob}
      onTickNeeds={tickNeeds}
      world={world}
    />
  );
}
