import React, { forwardRef } from 'react';
import { Smartphone, Mail, MapPin } from 'lucide-react';
import type { CVData } from '../types';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  return (
    <div className="bg-slate-200 p-8 min-h-full flex justify-center overflow-y-auto">
      {/* Target for PDF generation */}
      <div 
        ref={ref}
        id="cv-document"
        className="bg-white w-[210mm] min-h-[297mm] shadow-[0_0_20px_rgba(0,0,0,0.1)] p-[20mm] font-serif flex flex-col gap-6 text-slate-900 border border-slate-100"
        style={{ width: '210mm' }}
      >
        {/* Header Section */}
        <header className="border-b-2 border-slate-900 pb-4 flex justify-between items-start gap-6">
          <div className="flex flex-col flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-left uppercase leading-none">
              {data.fullName || "Seu Nome Completo"}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-wider font-sans">
              {data.phone && <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {data.phone}</span>}
              {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {data.email}</span>}
              {(data.address.neighborhood || data.address.city || data.address.state) && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {[
                  data.address.neighborhood,
                  data.address.city,
                  data.address.state
                ].filter(Boolean).join(', ')}</span>
              )}
            </div>
          </div>
          {data.photo && (
            <div className="w-28 h-32 border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center shadow-sm">
              <img 
                src={data.photo} 
                className="w-full h-full object-cover origin-center"
                style={{
                  transform: `scale(${data.photoConfig?.scale || 1}) translate(${data.photoConfig?.position.x || 0}px, ${data.photoConfig?.position.y || 0}px)`
                }}
              />
            </div>
          )}
        </header>

        {/* Objective */}
        {data.objective && (
          <section className="flex flex-col gap-2">
            <h2 className="text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest text-slate-900 pb-1">
              Objetivo Profissional
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
              {data.objective}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest text-slate-900 pb-1">
              Experiência Profissional
            </h2>
            <ul className="flex flex-col gap-4 list-none">
              {data.experience.map((exp) => (
                <li key={exp.id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-slate-800 tracking-tight">{exp.role}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">{exp.period}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase font-sans tracking-widest">
                    {exp.company}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans mt-0.5">
                    {exp.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Professional Education */}
        {data.education && data.education.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest text-slate-900 pb-1">
              Formação Acadêmica
            </h2>
            <ul className="flex flex-col gap-2 list-none">
              {data.education.map((edu) => (
                <li key={edu.id} className="flex flex-col">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[11px] text-slate-800">{edu.degree}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">{edu.period}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans tracking-wider font-bold">
                    {edu.institution}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills & Complementary */}
        <div className="grid grid-cols-2 gap-8">
          {data.skills && data.skills.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest text-slate-900 pb-1">
                Habilidades
              </h2>
              <ul className="grid grid-cols-1 gap-y-1 list-none">
                {data.skills.map((skill, index) => (
                  <li key={index} className="text-[10px] text-slate-700 font-sans font-medium flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.complementary && data.complementary.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest text-slate-900 pb-1">
                Formação Complementar
              </h2>
              <ul className="flex flex-col gap-1 list-none">
                {data.complementary.map((comp, index) => (
                  <li key={index} className="text-[10px] text-slate-700 font-sans font-medium flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    {comp}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
