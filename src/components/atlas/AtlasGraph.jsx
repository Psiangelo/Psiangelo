'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';

const SECTION_COLORS = {
  'psicologia-complexa': '#B48C50',
  allos: '#8B9A68',
  'psicologia-geral': '#6B8FB4',
  'mitologia-humanidades': '#C49344',
  humanistas: '#8B3A2E',
  conceitos: '#9A7A48',
  'tcc-comportamentais': '#7A8B68',
};

const W = 1400;
const H = 900;

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function AtlasGraph({ nodes: nodesProp, links: linksProp, sectionLabels }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const [query, setQuery] = useState('');
  const nodesRef = useRef([]);
  const linksRef = useRef([]);

  useEffect(() => {
    const nodesClone = nodesProp.map((n) => ({ ...n }));
    const linksClone = linksProp.map((l) => ({ ...l }));

    const sim = forceSimulation(nodesClone)
      .force(
        'link',
        forceLink(linksClone).id((d) => d.id).distance(70).strength(0.28),
      )
      .force('charge', forceManyBody().strength((d) => -60 - (d.degree || 0) * 3))
      .force('center', forceCenter(W / 2, H / 2))
      .force('collide', forceCollide((d) => 4 + Math.sqrt((d.degree || 0) + 1) * 2.4 + 2))
      .force('x', forceX(W / 2).strength(0.05))
      .force('y', forceY(H / 2).strength(0.05))
      .stop();

    for (let i = 0; i < 340; i++) sim.tick();

    // normaliza links pra ter source/target resolvidos
    linksClone.forEach((l) => {
      if (typeof l.source === 'object') l.source = l.source.id;
      if (typeof l.target === 'object') l.target = l.target.id;
    });

    nodesRef.current = nodesClone;
    linksRef.current = linksClone;
    setReady(true);
  }, [nodesProp, linksProp]);

  const byId = useMemo(() => {
    const m = new Map();
    for (const n of nodesRef.current) m.set(n.id, n);
    return m;
  }, [ready]);

  const neighbors = useMemo(() => {
    if (!hoverId) return null;
    const set = new Set([hoverId]);
    for (const l of linksRef.current) {
      if (l.source === hoverId) set.add(l.target);
      if (l.target === hoverId) set.add(l.source);
    }
    return set;
  }, [hoverId, ready]);

  const qNorm = normalize(query.trim());
  const matchesQuery = useMemo(() => {
    if (!qNorm) return null;
    const set = new Set();
    for (const n of nodesRef.current) {
      if (normalize(n.title).includes(qNorm)) set.add(n.id);
    }
    return set;
  }, [qNorm, ready]);

  const hoverNode = hoverId ? byId.get(hoverId) : null;

  if (!ready) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <span className="font-mono text-[0.65rem] text-text-dim tracking-[0.22em] uppercase">
          Calculando posições…
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Controles: search + legenda */}
      <div className="flex flex-wrap items-start gap-4 md:gap-6 mb-5">
        <div className="flex-1 min-w-[220px]">
          <label className="block font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1.5">
            Filtrar
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nó…"
            className="w-full max-w-sm bg-bg-card/60 border border-border-subtle focus:border-accent/50 outline-none px-3 py-2 font-serif italic text-text-bright placeholder:text-text-dim/50 text-[0.95rem]"
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase w-full mb-0.5">
            Seções
          </span>
          {Object.entries(sectionLabels).map(([slug, label]) => (
            <span key={slug} className="flex items-center gap-2 text-[0.78rem] text-text-dim">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: SECTION_COLORS[slug] || '#888' }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative bg-bg-warm border border-border-subtle">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto block"
          style={{ maxHeight: '80vh' }}
        >
          {/* Edges */}
          <g stroke="#B48C50" strokeOpacity="0.12">
            {linksRef.current.map((l, i) => {
              const src = byId.get(l.source);
              const tgt = byId.get(l.target);
              if (!src || !tgt) return null;
              const dim =
                matchesQuery && !(matchesQuery.has(l.source) || matchesQuery.has(l.target));
              const highlight =
                neighbors && (neighbors.has(l.source) || neighbors.has(l.target));
              const opacity = dim ? 0.02 : highlight ? 0.45 : 0.12;
              return (
                <line
                  key={i}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  strokeOpacity={opacity}
                  strokeWidth={highlight ? 0.9 : 0.5}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {nodesRef.current.map((n) => {
              const r = 2.8 + Math.sqrt(n.degree + 1) * 1.7;
              const color = SECTION_COLORS[n.section] || '#B48C50';
              const dim = matchesQuery && !matchesQuery.has(n.id);
              const isHover = hoverId === n.id;
              const isNeighbor = neighbors && neighbors.has(n.id);
              const fillOpacity = dim ? 0.1 : isHover ? 1 : isNeighbor ? 0.92 : 0.72;
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <circle
                    r={isHover ? r * 1.4 : r}
                    fill={color}
                    fillOpacity={fillOpacity}
                    stroke={isHover ? '#E8DDD0' : 'none'}
                    strokeWidth={isHover ? 0.8 : 0}
                    style={{ cursor: 'pointer', transition: 'r 0.15s, fill-opacity 0.15s' }}
                    onMouseEnter={() => setHoverId(n.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => router.push(`/atlas/${n.section}/${n.slug}`)}
                  />
                </g>
              );
            })}
          </g>

          {/* Labels dos nós em hover ou pesquisa */}
          <g pointerEvents="none">
            {nodesRef.current
              .filter((n) => {
                if (hoverId === n.id) return true;
                if (neighbors && neighbors.has(n.id)) return true;
                if (matchesQuery && matchesQuery.has(n.id)) return true;
                return false;
              })
              .map((n) => {
                const isHover = hoverId === n.id;
                return (
                  <text
                    key={n.id}
                    x={n.x}
                    y={n.y - 8 - Math.sqrt(n.degree + 1) * 1.7}
                    textAnchor="middle"
                    fontFamily="'DM Serif Display', Georgia, serif"
                    fontSize={isHover ? 13 : 10}
                    fill={isHover ? '#E8DDD0' : '#B8AD9E'}
                    stroke="#0E0C0A"
                    strokeWidth={3}
                    paintOrder="stroke"
                  >
                    {n.title}
                  </text>
                );
              })}
          </g>
        </svg>

        {/* Tooltip flutuante com detalhes */}
        {hoverNode && (
          <div className="pointer-events-none absolute top-4 left-4 bg-bg/95 border border-accent/30 px-4 py-3 backdrop-blur-sm shadow-lg max-w-sm">
            <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase mb-1">
              {sectionLabels[hoverNode.section]}
            </p>
            <p className="font-serif text-[1.05rem] text-text-bright leading-tight mb-2">
              {hoverNode.title}
            </p>
            <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.18em] uppercase">
              {hoverNode.degree} conexões · clique para abrir
            </p>
          </div>
        )}
      </div>

      {/* Dica de uso */}
      <p className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase mt-3 text-center">
        Passe o mouse pra destacar vizinhos · clique num nó pra abrir a nota
      </p>
    </div>
  );
}
