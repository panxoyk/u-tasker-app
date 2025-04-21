"use client"
import React, { useState } from 'react';
import { Sidebar } from '@/components/menu/sidebar';
import { Calendar } from '@/components/menu/calendar';
type SelectedView = 'calendario' | 'inicio' | null; 

export default function Home() {

    const [selectedView, setSelectedView] = useState<SelectedView>('calendario');

    const handleSelectView = (view: SelectedView) => {
        setSelectedView(view);
    };

    const renderSelectedComponent = () => {
        switch (selectedView) {
            case 'calendario':
                return <Calendar />;
            case 'inicio':
                return <div >Dashboard Component (Aún no implementado)</div>;
            default:
                return <div>Por favor, selecciona una opción del menú.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Pasa la función handleSelectView y opcionalmente el estado actual al Sidebar */}
            <Sidebar onSelectItem={handleSelectView} currentSelection={selectedView} />
            <main className="flex-1 overflow-auto p-6">
                {/* Llama a la función que decide qué componente renderizar */}
                {renderSelectedComponent()}
            </main>
        </div>
    );
}