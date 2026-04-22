/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { criminals, Criminal } from './data/criminals';
import { getZodiacSign, getMonthNameItalian, getProvocation } from './utils/zodiac';
import { 
  FolderOpen, 
  Stars, 
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [month, setMonth] = useState(3); // March
  const [day, setDay] = useState(15);
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [provocation, setProvocation] = useState("");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const userSign = useMemo(() => getZodiacSign(month, day), [month, day]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400; // Approx card width
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredBySign = useMemo(() => {
    return criminals.filter(c => c.Zodiac_Sign === userSign);
  }, [userSign]);

  const getDayOfYear = (m: number, d: number) => {
    const counts = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let total = 0;
    for (let i = 1; i < m; i++) total += counts[i];
    return total + d;
  };

  const getDistance = (d1: number, d2: number) => {
    const diff = Math.abs(d1 - d2);
    return Math.min(diff, 365 - diff);
  };

  const extractData = () => {
    if (filteredBySign.length === 0) {
      setSelectedCriminal(null);
      return;
    }

    const userDayOfYear = getDayOfYear(month, day);
    let closest = filteredBySign[0];
    let minDistance = 366;

    filteredBySign.forEach(c => {
      const parts = c.Birth_Date_ISO.split('-');
      if (parts.length === 3) {
        const cMonth = parseInt(parts[1]);
        const cDay = parseInt(parts[2]);
        const cDayOfYear = getDayOfYear(cMonth, cDay);
        const dist = getDistance(userDayOfYear, cDayOfYear);
        if (dist < minDistance) {
          minDistance = dist;
          closest = c;
        }
      }
    });

    setSelectedCriminal(closest);
    setProvocation(getProvocation(userSign));
  };

  useEffect(() => {
    extractData();
  }, [userSign]);

  const daysAway = useMemo(() => {
    if (!selectedCriminal) return 0;
    const userDayOfYear = getDayOfYear(month, day);
    const parts = selectedCriminal.Birth_Date_ISO.split('-');
    const cDayOfYear = getDayOfYear(parseInt(parts[1]), parseInt(parts[2]));
    return getDistance(userDayOfYear, cDayOfYear);
  }, [selectedCriminal, month, day]);

  const sortedCrew = useMemo(() => {
    return [...filteredBySign]
      .sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
      .slice(0, 10);
  }, [filteredBySign]);

  return (
    <div className="bg-[#131313] text-[#e2e2e2] min-h-screen font-sans relative selection:bg-primary-container selection:text-black">
      {/* Halftone Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30" 
           style={{ backgroundImage: 'radial-gradient(#212121 15%, transparent 16%), radial-gradient(#212121 15%, transparent 16%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}>
      </div>

      {/* Header */}
      <header className="flex justify-center items-center w-full px-8 py-6 h-24 bg-black border-b-4 border-[#ffc107] relative z-50 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black italic -skew-x-12 bg-[#ffc107] text-black px-6 py-2 border-4 border-black transform hover:scale-105 transition-transform">
          HORRORSCOPO
        </h1>
      </header>

      <main className="relative z-10 container mx-auto px-4 md:px-8 py-4 flex flex-col gap-12 overflow-x-hidden overflow-y-hidden">
        {/* Selector Section */}
        <section className="flex flex-col lg:flex-row gap-12 items-start relative">
          {/* Date Picker */}
          <div className="w-full lg:w-1/3 bg-black border-4 border-white p-8 shadow-[12px_12px_0px_0px_rgba(255,193,7,1)] -skew-x-[2deg] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc107] opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <h2 className="text-2xl text-white mb-8 uppercase italic bg-black px-2 inline-block -skew-y-2 border-b-2 border-[#ffc107] pb-1 font-black">COMPLEANNO</h2>
            
            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex flex-col relative">
                <label className="absolute -top-3 left-4 bg-[#ffc107] text-black font-bold text-xs px-2 py-0.5 -skew-x-6 z-10 border-2 border-black uppercase">MESE</label>
                <select 
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="bg-[#1f1f1f] border-0 border-b-4 border-[#ffc107] text-white font-bold pt-6 pb-2 px-4 focus:ring-0 focus:bg-[#212121] appearance-none rounded-none cursor-pointer"
                >
                  {months.map(m => (
                    <option key={m} value={m}>{getMonthNameItalian(m-1)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-6 text-[#ffc107] pointer-events-none" size={24} />
              </div>

              <div className="flex flex-col relative">
                <label className="absolute -top-3 left-4 bg-[#ffc107] text-black font-bold text-xs px-2 py-0.5 -skew-x-6 z-10 border-2 border-black uppercase">GIORNO</label>
                <select 
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
                  className="bg-[#1f1f1f] border-0 border-b-4 border-[#ffc107] text-white font-bold pt-6 pb-2 px-4 focus:ring-0 focus:bg-[#212121] appearance-none rounded-none cursor-pointer"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-6 text-[#ffc107] pointer-events-none" size={24} />
              </div>

              <button 
                onClick={extractData}
                className="mt-6 bg-[#ffc107] text-black border-4 border-black font-black uppercase py-5 shadow-[6px_6px_0px_0px_white] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all skew-x-2 text-xl"
              >
                CONFERMA
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8 relative">
            <div className="absolute -left-12 top-0 bottom-0 w-2 bg-[#ffc107] -skew-x-12 hidden lg:block"></div>
            
            {/* Zodiac Card */}
            <motion.div 
              layout
              className="bg-[#131313] border-4 border-[#ffc107] p-8 skew-x-2 relative shadow-2xl lg:ml-8"
            >
              <div className="absolute -top-4 -left-4 bg-[#ffc107] text-black font-bold px-4 py-1 italic -skew-x-12 border-2 border-black shadow-lg">IL TUO SEGNO</div>
              <div className="flex flex-col sm:flex-row items-center gap-8 mt-6">
                <div className="w-32 h-32 bg-black border-2 border-white flex items-center justify-center rounded-full shrink-0 relative overflow-hidden shadow-inner">
                  <Stars className="text-[#ffc107] size-16 relative z-10 animate-pulse" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-6xl md:text-7xl font-black text-[#ffc107] uppercase tracking-tighter -skew-x-6 drop-shadow-md">{userSign || 'SCONOSCIUTO'}</h3>
                  <p className="text-lg text-[#e2e2e2] mt-4 border-l-4 border-[#ffc107] pl-4 bg-zinc-900/80 p-4 italic font-medium leading-relaxed">
                    {provocation}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Target Criminal Card */}
            <AnimatePresence mode="wait">
              {selectedCriminal && (
                <motion.div 
                  key={selectedCriminal.Rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#ffc107] border-4 border-black p-8 -skew-x-1 relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] z-10 lg:-mt-12 lg:ml-24 self-end w-full lg:w-[90%]"
                >
                  <div className="absolute -top-4 right-8 bg-black text-white font-bold px-4 py-1 italic skew-x-12 border-2 border-white shadow-xl">CASO PIÙ VICINO</div>
                  <div className="flex flex-col mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-8 border-black pb-4 mb-6">
                      <h4 className="text-4xl font-black text-black uppercase tracking-tight leading-none mb-2 sm:mb-0">{selectedCriminal.Name}</h4>
                      <span className="font-bold bg-black text-white px-3 py-1 rotate-3 text-sm uppercase whitespace-nowrap">{daysAway} GG DI DISTANZA</span>
                    </div>
                    <div className="flex gap-6 items-start">
                      <FolderOpen className="text-black shrink-0 hidden sm:block" size={48} />
                      <p className="text-lg text-black font-black leading-snug">
                        {selectedCriminal.Details}. {selectedCriminal.Biography.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Squadra Carousel */}
        <section className="flex flex-col relative pt-8 border-t-4 border-zinc-800 border-dashed mb-12">
          <div className="flex justify-between items-center mb-8 pr-8">
            <h2 className="text-3xl md:text-4xl text-[#ffc107] uppercase italic inline-flex flex-wrap items-center gap-4">
              <span className="bg-[#ffc107] text-black px-4 py-1 -skew-x-12 font-black">SQUADRA {userSign.toUpperCase()}</span>
              <span className="text-xs font-bold tracking-widest text-[#e2e2e2] opacity-50">/// TOP 10 SOGGETTI CORRISPONDENTI ///</span>
            </h2>
            
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel('left')}
                className="bg-black border-2 border-[#ffc107] text-[#ffc107] p-2 hover:bg-[#ffc107] hover:text-black transition-colors -skew-x-12 shadow-[2px_2px_0px_0px_white]"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="bg-black border-2 border-[#ffc107] text-[#ffc107] p-2 hover:bg-[#ffc107] hover:text-black transition-colors -skew-x-12 shadow-[2px_2px_0px_0px_white]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div ref={carouselRef} className="flex overflow-x-auto gap-8 pb-12 pt-6 snap-x pl-6 pr-12 scrollbar-hide">
            {sortedCrew.map((c, idx) => (
              <div 
                key={c.Rank}
                className="min-w-[340px] md:min-w-[420px] bg-[#fdfbf7] border-4 border-black p-8 flex flex-col gap-6 snap-start relative shadow-[10px_10px_0px_0px_rgba(255,193,7,1)]"
              >
                <div className="absolute -top-4 -right-4 bg-black text-[#ffc107] font-black border-4 border-[#ffc107] w-16 h-16 flex items-center justify-center rotate-12 shadow-lg text-xl z-20">
                  #{idx+1}
                </div>
                <div className="absolute top-4 right-16 z-10">
                  <span className="rotate-[-10deg] border-4 border-red-500 text-red-500 px-3 py-1 font-black tracking-widest text-lg opacity-90 inline-block uppercase">
                    {userSign}
                  </span>
                </div>
                
                <div className="flex flex-col font-mono text-black border-b-4 border-black border-dashed pb-6 mt-6">
                  <h4 className="font-black text-3xl uppercase tracking-widest bg-black text-white inline-block px-3 py-1 mb-4 self-start leading-none">{c.Name}</h4>
                  <p className="text-sm font-black">NASCITA: <span className="font-normal">{c.Birth_Date_ISO}</span></p>
                  <p className="text-sm font-black uppercase">POSIZIONE: <span className="font-normal bg-yellow-200 px-2 font-black text-red-600"> {c.Rank}</span></p>
                </div>
                
                <div className="font-mono text-black font-medium mt-2 text-base leading-relaxed max-h-48 overflow-hidden">
                  <p>&gt; {c.Biography.substring(0, 300)}...</p>
                </div>
                <div className="absolute bottom-2 right-4 text-black/40 font-mono text-xs font-black">ATTO: {c.Rank.padStart(3, '0')}-V2</div>
              </div>
            ))}
            {sortedCrew.length === 0 && (
              <div className="w-full flex justify-center items-center h-64 border-4 border-zinc-800 text-zinc-600 italic">
                Nessun dossier trovato.
              </div>
            )}
          </div>
        </section>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        body { margin: 0; padding: 0; min-height: 100vh; overflow-x: hidden; }
      `}</style>
    </div>
  );
}
