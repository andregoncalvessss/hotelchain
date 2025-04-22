import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddAnomalyPage = () => {
    const navigate = useNavigate();

    const handleAddAnomaly = async () => {
        // Código para adicionar a anomalia
        navigate('/anomalies'); // Certifique-se de redirecionar para a rota correta
    };

    return (
        <>
            <Navbar />
            <div>
                <h1>Adicionar Anomalia</h1>
                <form>
                    {/* Código para o formulário de adicionar anomalia */}
                </form>
                <button onClick={handleAddAnomaly}>Adicionar Anomalia</button>
            </div>
        </>
    );
};

export default AddAnomalyPage;