import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Smartphone, Mail, MapPin, Briefcase, GraduationCap, Star, BookOpen, Camera, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import type { CVData, Experience, Education } from '../types';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex flex-col gap-4"
  >
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
      <Icon className="w-5 h-5 text-blue-600" />
      <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export function CVForm({ data, onChange }: CVFormProps) {
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const updateData = useCallback((updates: Partial<CVData>) => {
    onChange({ ...data, ...updates });
  }, [data, onChange]);

  const updateAddress = useCallback((updates: Partial<CVData['address']>) => {
    updateData({ address: { ...data.address, ...updates } });
  }, [data.address, updateData]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const applyCrop = useCallback(async () => {
    if (tempPhoto && croppedAreaPixels) {
      updateData({ 
        photo: tempPhoto,
        photoConfig: {
          scale: zoom,
          position: { x: crop.x, y: crop.y },
          crop: croppedAreaPixels
        }
      });
      setTempPhoto(null);
    }
  }, [tempPhoto, croppedAreaPixels, zoom, crop, updateData]);

  const addItem = useCallback(<T extends { id: string }>(key: keyof CVData, newItem: T) => {
    const list = (data[key] || []) as any[];
    updateData({ [key]: [...list, newItem] });
  }, [data, updateData]);

  const removeItem = useCallback((key: keyof CVData, id: string) => {
    const list = (data[key] || []) as { id: string }[];
    updateData({ [key]: list.filter(item => item.id !== id) });
  }, [data, updateData]);

  const updateListItem = useCallback(<T extends { id: string }>(key: keyof CVData, id: string, updates: Partial<T>) => {
    const list = (data[key] || []) as any[];
    updateData({ [key]: list.map(item => item.id === id ? { ...item, ...updates } : item) });
  }, [data, updateData]);

  const addSimpleItem = useCallback((key: 'skills' | 'complementary') => {
    updateData({ [key]: [...(data[key] || []), ''] });
  }, [data, updateData]);

  const removeSimpleItem = useCallback((key: 'skills' | 'complementary', index: number) => {
    const list = [...(data[key] || [])];
    list.splice(index, 1);
    updateData({ [key]: list });
  }, [data, updateData]);

  const updateSimpleItem = useCallback((key: 'skills' | 'complementary', index: number, value: string) => {
    const list = [...(data[key] || [])];
    list[index] = value;
    updateData({ [key]: list });
  }, [data, updateData]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto pb-24">
      {/* Photo Cropper Modal */}
      <AnimatePresence>
        {tempPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-full max-w-md aspect-square bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <Cropper
                image={tempPhoto}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="mt-8 w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aproximar (Zoom)</label>
                <input 
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setTempPhoto(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Cancelar
                </button>
                <button 
                  onClick={applyCrop}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  <Check className="w-5 h-5" /> Salvar Foto
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dados Pessoais */}
      <Section title="Dados Pessoais" icon={Smartphone}>
        <div className="flex flex-col gap-6">
          {/* Photo Upload Area */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
                {data.photo ? (
                  <img 
                    src={data.photo} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${data.photoConfig?.scale}) translate(${data.photoConfig?.position.x}px, ${data.photoConfig?.position.y}px)`
                    }}
                  />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <label htmlFor="input-photo" className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity backdrop-blur-[2px]">
                <Plus className="w-6 h-6 text-white" />
                <span className="sr-only">Upload de foto</span>
                <input 
                  id="input-photo"
                  type="file" 
                  className="hidden" 
                  accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.bmp,.gif" 
                  onChange={handlePhotoUpload} 
                />
              </label>
              {data.photo && (
                <button 
                  onClick={() => updateData({ photo: '' })}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800">Foto de Perfil</h4>
              <p className="text-xs text-slate-500 mt-1">Carregue uma foto em formato profissional. Clique na foto para alterar.</p>
              {data.photo && (
                <button 
                  onClick={() => setTempPhoto(data.photo!)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Ajustar enquadramento
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="input-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Nome Completo</label>
              <input 
                id="input-name"
                type="text"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                value={data.fullName}
                onChange={(e) => updateData({ fullName: e.target.value })}
                placeholder="Ex: Carlos Eduardo Silva"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">WhatsApp / Celular</label>
                <input 
                  id="input-phone"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={data.phone}
                  onChange={(e) => updateData({ phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div>
                <label htmlFor="input-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">E-mail</label>
                <input 
                  id="input-email"
                  type="email"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                  placeholder="carlos.silva@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="input-neighborhood" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Bairro</label>
                <input 
                  id="input-neighborhood"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={data.address.neighborhood}
                  onChange={(e) => updateAddress({ neighborhood: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="input-city" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Cidade</label>
                <input 
                  id="input-city"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={data.address.city}
                  onChange={(e) => updateAddress({ city: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="input-state" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Estado (Sigla)</label>
                <input 
                  id="input-state"
                  type="text"
                  maxLength={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase placeholder:text-slate-400"
                  value={data.address.state}
                  onChange={(e) => updateAddress({ state: e.target.value })}
                  placeholder="UF"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Objetivo */}
      <Section title="Objetivo Profissional" icon={MapPin}>
        <div>
          <label htmlFor="input-objective" className="sr-only">Objetivo Profissional</label>
          <textarea 
            id="input-objective"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-[100px] resize-none"
            value={data.objective}
            onChange={(e) => updateData({ objective: e.target.value })}
            placeholder="Descreva brevemente seu objetivo profissional..."
          />
        </div>
      </Section>

      {/* Experiência Profissional */}
      <Section title="Experiência Profissional" icon={Briefcase}>
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {(data.experience || []).map((exp) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border border-slate-200 rounded bg-slate-50 relative group"
              >
                <button 
                  onClick={() => removeItem('experience', exp.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-500 bg-white border border-slate-200 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 gap-4 pr-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`exp-role-${exp.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Cargo</label>
                      <input 
                        id={`exp-role-${exp.id}`}
                        type="text"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                        value={exp.role}
                        onChange={(e) => updateListItem('experience', exp.id, { role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`exp-company-${exp.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Empresa</label>
                      <input 
                        id={`exp-company-${exp.id}`}
                        type="text"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                        value={exp.company}
                        onChange={(e) => updateListItem('experience', exp.id, { company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`exp-period-${exp.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Período</label>
                    <input 
                      id={`exp-period-${exp.id}`}
                      type="text"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                      value={exp.period}
                      onChange={(e) => updateListItem('experience', exp.id, { period: e.target.value })}
                      placeholder="Ex: Jan/2020 - Atual"
                    />
                  </div>
                  <div>
                    <label htmlFor={`exp-desc-${exp.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Descrição das Atividades</label>
                    <textarea 
                      id={`exp-desc-${exp.id}`}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs min-h-[80px] resize-none"
                      value={exp.description}
                      onChange={(e) => updateListItem('experience', exp.id, { description: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={() => addItem('experience', { id: crypto.randomUUID(), role: '', company: '', period: '', description: '' })}
            className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-200 rounded text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Adicionar Experiência</span>
          </button>
        </div>
      </Section>

      {/* Formação Profissional */}
      <Section title="Formação Profissional" icon={GraduationCap}>
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {(data.education || []).map((edu) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border border-slate-200 rounded bg-slate-50 relative group"
              >
                <button 
                  onClick={() => removeItem('education', edu.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-500 bg-white border border-slate-200 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 gap-4 pr-10">
                  <div>
                    <label htmlFor={`edu-degree-${edu.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Curso / Formação</label>
                    <input 
                      id={`edu-degree-${edu.id}`}
                      type="text"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                      value={edu.degree}
                      onChange={(e) => updateListItem('education', edu.id, { degree: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`edu-inst-${edu.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Instituição</label>
                      <input 
                        id={`edu-inst-${edu.id}`}
                        type="text"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                        value={edu.institution}
                        onChange={(e) => updateListItem('education', edu.id, { institution: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`edu-period-${edu.id}`} className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Período</label>
                      <input 
                        id={`edu-period-${edu.id}`}
                        type="text"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                        value={edu.period}
                        onChange={(e) => updateListItem('education', edu.id, { period: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={() => addItem('education', { id: crypto.randomUUID(), degree: '', institution: '', period: '' })}
            className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-200 rounded text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all font-bold uppercase"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs tracking-wider">Adicionar Formação</span>
          </button>
        </div>
      </Section>

      {/* Habilidades */}
      <Section title="Habilidades" icon={Star}>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {(data.skills || []).map((skill, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center bg-slate-100 border border-slate-200 rounded pl-2 pr-1 py-1"
              >
                <input 
                  type="text"
                  aria-label="Habilidade"
                  className="bg-transparent text-[10px] font-bold text-slate-700 outline-none w-24"
                  value={skill}
                  onChange={(e) => updateSimpleItem('skills', index, e.target.value)}
                  placeholder="Excel"
                />
                <button 
                  onClick={() => removeSimpleItem('skills', index)}
                  className="p-1 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={() => addSimpleItem('skills')}
            className="px-3 py-1 border border-dashed border-slate-300 rounded text-[10px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> NOVO
          </button>
        </div>
      </Section>

      {/* Formação Complementar */}
      <Section title="Formação Complementar" icon={BookOpen}>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {(data.complementary || []).map((comp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded"
              >
                <input 
                  type="text"
                  aria-label="Formação Complementar"
                  className="flex-1 bg-transparent text-xs font-medium text-slate-700 outline-none"
                  value={comp}
                  onChange={(e) => updateSimpleItem('complementary', index, e.target.value)}
                  placeholder="Curso de Inglês"
                />
                <button 
                  onClick={() => removeSimpleItem('complementary', index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={() => addSimpleItem('complementary')}
            className="py-2 border-2 border-dashed border-slate-200 rounded text-slate-500 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar Item</span>
          </button>
        </div>
      </Section>
    </div>
  );
}
