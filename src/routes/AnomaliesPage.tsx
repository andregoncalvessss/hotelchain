import React from 'react';
import Navbar from '../components/Navbar';

const AnomaliesPage = () => {
    return (
        <>
            <Navbar /> {/* Certifique-se de que a navbar está sempre presente */}
            <div>
                {/* Renderização da página de anomalias */}
                <h1>Anomalias</h1>
                {/* Adicione aqui o conteúdo específico da página de anomalias */}
            </div>
        </>
    );
};

export default AnomaliesPage;