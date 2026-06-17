import { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
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
import * as THREE from 'three';

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
  const [joystick, setJoystick] = useState({ active: false, dx: 0, dy: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
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

  useEffect(() => {
    if (!joystick.active) return undefined;

    const interval = window.setInterval(() => {
      const speed = isRunning ? 1.15 : 0.62;
      setPlayerPosition((current) => ({
        x: Math.min(94, Math.max(6, current.x + joystick.dx * speed)),
        y: Math.min(86, Math.max(8, current.y + joystick.dy * speed))
      }));
    }, 32);

    return () => window.clearInterval(interval);
  }, [joystick, isRunning]);

  function updateJoystick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawX = event.clientX - centerX;
    const rawY = event.clientY - centerY;
    const distance = Math.min(42, Math.hypot(rawX, rawY));
    const angle = Math.atan2(rawY, rawX);

    setJoystick({
      active: true,
      dx: Number((Math.cos(angle) * (distance / 42)).toFixed(3)),
      dy: Number((Math.sin(angle) * (distance / 42)).toFixed(3)),
      knobX: Math.cos(angle) * distance,
      knobY: Math.sin(angle) * distance
    });
  }

  function stopJoystick() {
    setJoystick({ active: false, dx: 0, dy: 0, knobX: 0, knobY: 0 });
  }

  function jump() {
    setIsJumping(true);
    window.setTimeout(() => setIsJumping(false), 420);
  }

  const districtById = new globalThis.Map(map.districts.map((district) => [district.id, district]));

  return (
    <main className="gameShell">
      <ThreeCityWorld
        isJumping={isJumping}
        isRunning={isRunning}
        joystick={joystick}
        map={map}
        playerPosition={playerPosition}
        setPlayerPosition={setPlayerPosition}
      />

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

      <div
        className="mobileJoystick"
        onPointerCancel={stopJoystick}
        onPointerDown={updateJoystick}
        onPointerLeave={stopJoystick}
        onPointerMove={(event) => joystick.active && updateJoystick(event)}
        onPointerUp={stopJoystick}
        role="presentation"
      >
        <div
          className="joystickKnob"
          style={{ transform: `translate(${joystick.knobX || 0}px, ${joystick.knobY || 0}px)` }}
        />
      </div>

      <div className="mobileActions">
        <button className={isRunning ? 'actionButton active' : 'actionButton'} type="button" onClick={() => setIsRunning((value) => !value)}>Correr</button>
        <button className="actionButton" type="button" onClick={jump}>Pular</button>
        <button className="actionButton" type="button" onClick={() => setOpenPanel(openPanel === 'bag' ? null : 'bag')}>Mochila</button>
        <button className="actionButton primary" type="button" onClick={() => setOpenPanel(openPanel === 'work' ? null : 'work')}>Acoes</button>
      </div>

      {openPanel && (
        <aside className="mobilePanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">{openPanel === 'bag' ? 'Mochila' : 'Acoes'}</p>
              <h3>{openPanel === 'bag' ? 'Inventario' : 'Trabalho rapido'}</h3>
            </div>
            <button className="iconButton" type="button" onClick={() => setOpenPanel(null)}>X</button>
          </div>
          {openPanel === 'bag' ? (
            <div className="compactList">
              {core.inventory.map((item) => (
                <div className="compactRow" key={item.id}>
                  <Package size={18} />
                  <div><strong>{item.name}</strong><span>{item.code} | qtd {item.quantity}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="compactList">
              {jobs.slice(0, 5).map((job) => (
                <button className="panelAction" key={job.id} type="button" onClick={() => onStartJob(job.id)}>
                  {job.name}
                </button>
              ))}
            </div>
          )}
        </aside>
      )}

      <aside className="gameHud centerBottom">
        <span>Analógico no mobile | WASD ou setas no PC | câmera em terceira pessoa</span>
        <span>{core.vehicles.length} veiculos | {core.inventory.length} itens | {economy.prices.length} precos</span>
        <span>{activityLog[0]}</span>
      </aside>
    </main>
  );
}

function ThreeCityWorld({ map, playerPosition, setPlayerPosition, joystick, isRunning, isJumping }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    keys: new Set(),
    player: null,
    velocityY: 0,
    isGrounded: true,
    position: playerPosition,
    joystick,
    isRunning,
    isJumping
  });

  useEffect(() => {
    stateRef.current.position = playerPosition;
    stateRef.current.joystick = joystick;
    stateRef.current.isRunning = isRunning;
    stateRef.current.isJumping = isJumping;
  }, [playerPosition, joystick, isRunning, isJumping]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd8ce);
    scene.fog = new THREE.Fog(0xbfd8ce, 55, 150);

    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 260);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xffffff, 0x6a7f72, 1.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(35, 52, 25);
    sun.castShadow = true;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(190, 190),
      new THREE.MeshStandardMaterial({ color: 0x7fb894, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x2f3835, roughness: 0.88 });
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0xb9c6bd, roughness: 0.86 });
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xf1d36a, roughness: 0.7 });
    for (let i = -4; i <= 4; i += 1) {
      addRoad(scene, 'horizontal', i * 16, roadMaterial, sidewalkMaterial, lineMaterial);
      addRoad(scene, 'vertical', i * 16, roadMaterial, sidewalkMaterial, lineMaterial);
    }

    const river = new THREE.Mesh(
      new THREE.BoxGeometry(210, 0.16, 28),
      new THREE.MeshStandardMaterial({ color: 0x1b7892, roughness: 0.22, metalness: 0.12 })
    );
    river.position.set(0, 0.07, 66);
    scene.add(river);

    for (let i = 0; i < 16; i += 1) {
      const wave = new THREE.Mesh(
        new THREE.BoxGeometry(8 + (i % 3) * 4, 0.02, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x9ed6df, roughness: 0.1 })
      );
      wave.position.set(-78 + i * 10, 0.18, 57 + (i % 5) * 3);
      scene.add(wave);
    }

    const buildingMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xe5ebe7, roughness: 0.76 }),
      new THREE.MeshStandardMaterial({ color: 0xcfd8d2, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0xaec2b8, roughness: 0.82 }),
      new THREE.MeshStandardMaterial({ color: 0xd7c7ae, roughness: 0.8 })
    ];

    map.districts.forEach((district, index) => {
      const center = worldToThree(getDistrictCenter(district));
      const districtBase = new THREE.Mesh(
        new THREE.BoxGeometry(Math.max(7, district.width * 0.8), 0.18, Math.max(6, district.height * 0.8)),
        new THREE.MeshStandardMaterial({ color: district.unlocked ? 0x5ec994 : 0xbfc9c3, roughness: 0.9 })
      );
      districtBase.position.set(center.x, 0.11, center.z);
      scene.add(districtBase);

      const count = district.unlocked ? 4 : 2;
      for (let i = 0; i < count; i += 1) {
        const height = 4 + ((index + i) % 7) * 1.6;
        const building = createBuilding(
          3.2 + (i % 2) * 1.2,
          height,
          3 + ((i + 1) % 2) * 1.4,
          buildingMaterials[(index + i) % buildingMaterials.length],
          index + i
        );
        building.position.set(
          center.x + (i - 1.5) * 3.3,
          0,
          center.z + ((i % 2) - 0.5) * 4.2
        );
        scene.add(building);
      }

      if (district.unlocked) {
        addTree(scene, center.x - district.width * 0.45, center.z - district.height * 0.35);
        addTree(scene, center.x + district.width * 0.45, center.z + district.height * 0.25);
        addStreetLight(scene, center.x - district.width * 0.38, center.z + district.height * 0.42);
      }
    });

    map.landmarks.forEach((landmark) => {
      const position = worldToThree(landmark);
      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 5, 18),
        new THREE.MeshStandardMaterial({ color: landmarkColor(landmark.type), roughness: 0.5 })
      );
      marker.position.set(position.x, 2.5, position.z);
      marker.castShadow = true;
      scene.add(marker);
    });

    const player = createPlayerMesh();
    const initial = worldToThree(playerPosition);
    player.position.set(initial.x, 0, initial.z);
    scene.add(player);
    stateRef.current.player = player;

    function onKeyDown(event) {
      stateRef.current.keys.add(event.key.toLowerCase());
    }

    function onKeyUp(event) {
      stateRef.current.keys.delete(event.key.toLowerCase());
    }

    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.05);
      const state = stateRef.current;
      const speed = state.isRunning ? 22 : 12;
      const direction = new THREE.Vector3();

      if (state.keys.has('w') || state.keys.has('arrowup')) direction.z -= 1;
      if (state.keys.has('s') || state.keys.has('arrowdown')) direction.z += 1;
      if (state.keys.has('a') || state.keys.has('arrowleft')) direction.x -= 1;
      if (state.keys.has('d') || state.keys.has('arrowright')) direction.x += 1;
      direction.x += state.joystick.dx || 0;
      direction.z += state.joystick.dy || 0;

      if (direction.lengthSq() > 0.001) {
        direction.normalize();
        player.position.x += direction.x * speed * delta;
        player.position.z += direction.z * speed * delta;
        player.rotation.y = Math.atan2(direction.x, direction.z);
      }

      if (state.isJumping && state.isGrounded) {
        state.velocityY = 9;
        state.isGrounded = false;
      }

      state.velocityY -= 24 * delta;
      player.position.y += state.velocityY * delta;
      if (player.position.y <= 0) {
        player.position.y = 0;
        state.velocityY = 0;
        state.isGrounded = true;
      }

      player.position.x = THREE.MathUtils.clamp(player.position.x, -76, 76);
      player.position.z = THREE.MathUtils.clamp(player.position.z, -76, 76);

      const targetCamera = new THREE.Vector3(player.position.x, player.position.y + 7.5, player.position.z + 12);
      camera.position.lerp(targetCamera, 0.11);
      camera.lookAt(player.position.x, player.position.y + 2.8, player.position.z - 2);

      const uiPosition = threeToWorld(player.position);
      state.position = uiPosition;
      if (frameId % 12 === 0) {
        setPlayerPosition(uiPosition);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [map]);

  return <section className="threeWorld" ref={mountRef} />;
}

function worldToThree(point) {
  return {
    x: (point.x - 50) * 1.45,
    z: (point.y - 50) * 1.45
  };
}

function threeToWorld(position) {
  return {
    x: Number(THREE.MathUtils.clamp(position.x / 1.45 + 50, 0, 100).toFixed(2)),
    y: Number(THREE.MathUtils.clamp(position.z / 1.45 + 50, 0, 100).toFixed(2))
  };
}

function landmarkColor(type) {
  return {
    aeroporto: 0x6d5dfc,
    hospital: 0xd84d3f,
    porto: 0x1e6b84,
    industria: 0xaa6a1f,
    lazer: 0x17b97f,
    delegacia: 0x1d1d1d,
    forum: 0x7a5bde,
    universidade: 0x287a5c
  }[type] || 0x102019;
}

function addRoad(scene, orientation, offset, roadMaterial, sidewalkMaterial, lineMaterial) {
  const isHorizontal = orientation === 'horizontal';
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(isHorizontal ? 165 : 4.2, 0.08, isHorizontal ? 4.2 : 165),
    roadMaterial
  );
  road.position.set(isHorizontal ? 0 : offset, 0.05, isHorizontal ? offset : 0);
  road.receiveShadow = true;
  scene.add(road);

  const sidewalkA = new THREE.Mesh(
    new THREE.BoxGeometry(isHorizontal ? 165 : 1.8, 0.1, isHorizontal ? 1.8 : 165),
    sidewalkMaterial
  );
  sidewalkA.position.set(isHorizontal ? 0 : offset - 3.2, 0.11, isHorizontal ? offset - 3.2 : 0);
  scene.add(sidewalkA);

  const sidewalkB = sidewalkA.clone();
  sidewalkB.position.set(isHorizontal ? 0 : offset + 3.2, 0.11, isHorizontal ? offset + 3.2 : 0);
  scene.add(sidewalkB);

  for (let marker = -72; marker <= 72; marker += 12) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(isHorizontal ? 4.8 : 0.22, 0.14, isHorizontal ? 0.22 : 4.8),
      lineMaterial
    );
    line.position.set(isHorizontal ? marker : offset, 0.16, isHorizontal ? offset : marker);
    scene.add(line);
  }
}

function createBuilding(width, height, depth, material, seed) {
  const group = new THREE.Group();
  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  tower.position.y = height / 2;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xbde5f0,
    emissive: seed % 3 === 0 ? 0x18333a : 0x000000,
    emissiveIntensity: seed % 3 === 0 ? 0.25 : 0,
    roughness: 0.28
  });
  const rows = Math.max(2, Math.floor(height / 1.5));
  const cols = Math.max(2, Math.floor(width / 1.1));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((row + col + seed) % 5 === 0) continue;
      const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.04), windowMaterial);
      windowMesh.position.set(
        -width / 2 + 0.7 + col * 0.85,
        0.9 + row * 1.05,
        depth / 2 + 0.03
      );
      group.add(windowMesh);
    }
  }

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.35, 0.24, depth + 0.35),
    new THREE.MeshStandardMaterial({ color: 0x39423d, roughness: 0.9 })
  );
  roof.position.y = height + 0.14;
  group.add(roof);

  return group;
}

function addTree(scene, x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.24, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x745132, roughness: 0.9 })
  );
  trunk.position.set(x, 0.75, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x1f7b4e, roughness: 0.75 })
  );
  crown.position.set(x, 1.95, z);
  crown.castShadow = true;
  scene.add(crown);
}

function addStreetLight(scene, x, z) {
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3430, roughness: 0.45 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.4, 8), poleMaterial);
  pole.position.set(x, 1.7, z);
  scene.add(pole);

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff2b0, emissive: 0xffd36a, emissiveIntensity: 0.8 })
  );
  lamp.position.set(x, 3.48, z);
  scene.add(lamp);
}

function createPlayerMesh() {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1f8bd6, roughness: 0.48 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x102019, roughness: 0.7 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xf0c29c, roughness: 0.62 });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.78, 2.1, 7, 14), bodyMaterial);
  body.position.y = 2.35;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.78, 18, 18), skinMaterial);
  head.position.y = 4.25;
  head.castShadow = true;
  group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.82, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.48), darkMaterial);
  hair.position.y = 4.48;
  group.add(hair);

  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.35, 4, 8), skinMaterial);
  leftArm.position.set(-0.95, 2.35, 0.02);
  leftArm.rotation.z = -0.16;
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.95;
  rightArm.rotation.z = 0.16;
  group.add(rightArm);

  const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.3, 4, 8), darkMaterial);
  leftLeg.position.set(-0.38, 0.75, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.38;
  group.add(rightLeg);

  return group;
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
