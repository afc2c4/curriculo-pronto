import React, { useState, useRef } from 'react';
import { Download, FileText } from 'lucide-react';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import type { CVData } from './types';
import { saveAs } from 'file-saver';

const initialData: CVData = {
  fullName: '',
  phone: '',
  email: '',
  address: {
    neighborhood: '',
    city: '',
    state: ''
  },
  photo: '',
  photoConfig: {
    scale: 1,
    position: { x: 0, y: 0 }
  },
  objective: '',
  experience: [],
  education: [],
  skills: [],
  complementary: []
};

export default function App() {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    console.log('--- INÍCIO DA GERAÇÃO DO PDF ---');
    if (isGenerating) {
      console.warn('Aviso: Geração de PDF já em progresso.');
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log('Passo 1: Verificando dados do currículo...', { 
        name: cvData.fullName,
        hasPhoto: !!cvData.photo,
        experienceCount: cvData.experience?.length,
        educationCount: cvData.education?.length
      });
      
      // Pequeno delay para garantir que atualizações de estado pendentes sejam refletidas
      console.log('Passo 2: Aguardando sincronização de estado (100ms)...');
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Passo 3: Importando e criando componente CVPDF dinamicamente...');
      // Lazy load react-pdf and CVPDF to reduce initial bundle size
      const { pdf } = await import('@react-pdf/renderer');
      const { CVPDF } = await import('./components/CVPDF');

      const doc = <CVPDF data={cvData} />;
      
      console.log('Passo 4: Gerando Blob a partir do componente react-pdf... (Isso pode demorar um pouco se houver imagens grandes)');
      const start = performance.now();
      const blob = await pdf(doc).toBlob();
      const end = performance.now();
      
      console.log(`Passo 5: Blob gerado com sucesso em ${(end - start).toFixed(2)}ms. Tamanho: ${(blob.size / 1024).toFixed(2)} KB`);
      
      const fileName = `${cvData.fullName.trim().replace(/\s+/g, '_') || 'curriculo'}.pdf`;
      console.log('Passo 6: Iniciando download do arquivo:', fileName);
      
      saveAs(blob, fileName);
      console.log('--- FIM DO PROCESSO: Download disparado com sucesso ---');
    } catch (error) {
      console.error('--- ERRO NA GERAÇÃO DO PDF ---');
      console.error('Informações do erro:', error);
      if (error instanceof Error) {
        console.error('Tipo:', error.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
      }
      
      // Verificação específica para problemas comuns com react-pdf
      if (error && typeof error === 'object' && 'message' in error) {
        const msg = (error as any).message;
        if (msg.includes('fetch')) {
          console.error('Dica: O erro parece estar relacionado ao carregamento de recursos externos (como fontes ou imagens). Verifique se as URLs estão acessíveis.');
        }
      }

      alert('Ocorreu um erro ao gerar o PDF. Verifique os detalhes no console (F12) e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Currículo<span className="text-blue-600">Pro</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[10px] text-slate-500 font-bold uppercase tracking-widest">Preview Instantâneo</span>
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'Processando...' : 'Baixar PDF'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Side */}
        <div className="w-full lg:w-[480px] bg-white overflow-y-auto border-r border-slate-200 custom-scrollbar shadow-inner">
          <CVForm data={cvData} onChange={setCvData} />
        </div>

        {/* Preview Side */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-slate-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          <div className="relative transform origin-top scale-[0.85] xl:scale-95 shadow-2xl transition-transform duration-300">
            <CVPreview data={cvData} ref={cvRef} />
          </div>
        </div>
      </main>

      {/* Mobile Preview Toggle - Floating Action Button for smaller screens could be added if needed, 
          but for now we focus on the desktop experience which is better for CV building */}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f4f4f5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  );
}
