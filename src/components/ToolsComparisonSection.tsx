import React, { useState } from 'react';
import { TOOL_COMPARISONS, HOW_TO_CHOOSE_GUIDE } from '../data/toolComparisons';
import { 
  Compass, 
  Map, 
  Ticket, 
  Hotel, 
  ExternalLink, 
  Check, 
  X as CloseIcon, 
  Star, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ToolsComparisonSection: React.FC = () => {
  const [selectedToolId, setSelectedToolId] = useState<string>('tool-wayfarer');
  const [filterMode, setFilterMode] = useState<string>('all');

  const selectedTool = TOOL_COMPARISONS.find(t => t.id === selectedToolId) || TOOL_COMPARISONS[0];

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1 font-mono text-xs">
        <span className="text-amber-400 font-bold">{score.toFixed(1)}</span>
        <div className="flex text-amber-400">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className={i <= Math.round(score) ? 'text-amber-400' : 'text-neutral-700'}>
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="tools-comparison" className="py-12 px-4 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          All-in-One Route & Travel Planning Tools Compared
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Detailed, objective evaluation of the top platforms combining visual routing maps, 
          multi-modal transportation booking (flights, trains, buses), and hotel reservations.
        </p>
      </div>

      {/* Quick Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOW_TO_CHOOSE_GUIDE.map((guide, idx) => (
          <div key={idx} className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl space-y-1.5">
            <div className="text-xs font-semibold text-emerald-400">{guide.title}</div>
            <div className="text-xs text-neutral-300 leading-relaxed">{guide.recommendation}</div>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              Platform Capability Matrix
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">Click any platform row to inspect detailed profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-3">Visual Route Map</th>
                <th className="py-3 px-3">Multi-Modal (Rail/Bus/Air)</th>
                <th className="py-3 px-3">Direct In-App Ticketing</th>
                <th className="py-3 px-3">Hotel Integration</th>
                <th className="py-3 px-4">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {TOOL_COMPARISONS.map(tool => {
                const isSelected = tool.id === selectedToolId;
                const isWayfarer = tool.id === 'tool-wayfarer';
                return (
                  <tr
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-neutral-800/90' 
                        : isWayfarer
                        ? 'bg-emerald-950/20 hover:bg-emerald-950/40'
                        : 'hover:bg-neutral-850'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-100">{tool.name}</span>
                        {isWayfarer && (
                          <span className="text-[10px] font-bold bg-emerald-500 text-neutral-950 px-1.5 py-0.5 rounded">
                            Unified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{tool.category}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      {renderStars(tool.visualMapScore)}
                    </td>
                    <td className="py-3.5 px-3">
                      {renderStars(tool.multiModalScore)}
                    </td>
                    <td className="py-3.5 px-3">
                      {tool.hasDirectTicketing ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Direct In-App</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-neutral-500 font-medium">
                          <CloseIcon className="w-3.5 h-3.5" />
                          <span>External Redirects</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {renderStars(tool.hotelIntegrationScore)}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {tool.bestFor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Platform In-Depth Profile */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{selectedTool.name}</h3>
              <span className="text-xs bg-neutral-800 px-2.5 py-1 rounded text-neutral-300 border border-neutral-700">
                {selectedTool.category}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">{selectedTool.bestFor}</p>
          </div>

          {selectedTool.websiteUrl !== '#' && (
            <a
              href={selectedTool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 rounded-lg transition-colors border border-neutral-700"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* Key Strengths */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Key Strengths & Features</span>
            </h4>
            <div className="space-y-2">
              {selectedTool.keyStrengths.map((str, i) => (
                <div key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade-offs & Limitations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span>Limitations & Trade-Offs</span>
            </h4>
            <div className="space-y-2">
              {selectedTool.notableLimitations.map((lim, i) => (
                <div key={i} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{lim}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Modes */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Supported Transit Modes:</span>
            <div className="flex gap-1.5">
              {selectedTool.supportedModes.map(mode => (
                <span key={mode} className="bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded border border-neutral-700">
                  {mode}
                </span>
              ))}
            </div>
          </div>
          <div className="text-neutral-400 font-mono">
            Direct Ticketing: <strong className={selectedTool.hasDirectTicketing ? 'text-emerald-400' : 'text-neutral-500'}>
              {selectedTool.hasDirectTicketing ? 'Supported' : 'Third-Party Redirects'}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
};
