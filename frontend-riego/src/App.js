import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'https://backend-riego.onrender.com/api/sensor';

function App() {
  const [lecturas, setLecturas] = useState([]);
  const [ultimaLectura, setUltimaLectura] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [bombaActiva, setBombaActiva] = useState(false);
  const [enviandoComando, setEnviandoComando] = useState(false);

  // ---------- Obtener datos del backend ----------
  const obtenerDatos = async () => {
    try {
      const [historialRes, ultimaRes] = await Promise.all([
        axios.get(`${API_URL}/lecturas`),
        axios.get(`${API_URL}/ultima`)
      ]);
      
      setLecturas(historialRes.data || []);
      
      if (ultimaRes.data && ultimaRes.data.id) {
        setUltimaLectura(ultimaRes.data);
        setBombaActiva(ultimaRes.data.bomba_activa === 1);
      }
      
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setCargando(false);
    }
  };

  // ---------- Enviar comando de control remoto ----------
  const toggleBomba = async () => {
    const nuevoEstado = !bombaActiva;
    setEnviandoComando(true);

    setBombaActiva(nuevoEstado);

    if (ultimaLectura) {
      setUltimaLectura({
        ...ultimaLectura,
        bomba_activa: nuevoEstado ? 1 : 0
      });
    }
    
    try {
      await axios.post(`${API_URL}/control`, { 
        bombaActiva: nuevoEstado 
      });

      console.log(` Comando enviado: bomba ${nuevoEstado ? 'ON' : 'OFF'}`);
      
    } catch (error) {
      console.error('Error al enviar comando:', error);
      setBombaActiva(!nuevoEstado);
      if (ultimaLectura) {
        setUltimaLectura({
          ...ultimaLectura,
          bomba_activa: !nuevoEstado ? 1 : 0
        });
      }
      alert('Error al controlar la bomba. Verifica que el backend esté corriendo.');
    } finally {
      setEnviandoComando(false);
    }
  };

  // ---------- Cargar datos al iniciar y cada 4 segundos ----------
  useEffect(() => {
    obtenerDatos();
    const intervalo = setInterval(obtenerDatos, 4000);
    return () => clearInterval(intervalo);
  }, []);

  // Preparar datos para el gráfico (últimas 20 lecturas)
  const datosGrafico = lecturas.slice(0, 20).reverse().map(item => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleTimeString()
  }));

  // ---------- Renderizado ----------
  if (cargando) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos del sistema de riego...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <h1 className="text-center mb-4" style={{ color: '#2c3e50' }}>
        🌱 Sistema de Riego Inteligente - Cacao
      </h1>

      <Row>
        {/* ---------- Tarjeta 1: Estado Actual ---------- */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title> Estado Actual</Card.Title>
              <hr />
              <div className="mb-3">
                <h6>Humedad del Suelo</h6>
                <div className="d-flex align-items-center">
                  <div className="progress flex-grow-1 me-3" style={{ height: '30px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${ultimaLectura?.humedad || 0}%`,
                        backgroundColor: (ultimaLectura?.humedad || 0) < 30 ? '#dc3545' : '#28a745'
                      }}
                    >
                      {ultimaLectura?.humedad || 0}%
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h6>Estado de la Bomba</h6>
                <Badge 
                  bg={bombaActiva ? 'success' : 'danger'}
                  style={{ fontSize: '1.2rem', padding: '8px 16px' }}
                >
                  {bombaActiva ? 'ACTIVA' : 'APAGADA'}
                </Badge>
              </div>
              <div className="mt-3 text-muted small">
                Última actualización: {ultimaLectura?.timestamp ? 
                  new Date(ultimaLectura.timestamp).toLocaleString() : '---'}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ---------- Tarjeta 2: Control Remoto ---------- */}
        <Col md={6} className="mt-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title> Control Remoto</Card.Title>
              <hr />
              <Button 
                variant={bombaActiva ? "danger" : "success"}
                size="lg"
                onClick={toggleBomba}
                disabled={enviandoComando}
                className="w-100"
                style={{ fontSize: '1.5rem', padding: '20px' }}
              >
                {enviandoComando ? (
                  <Spinner animation="border" size="sm" />
                ) : bombaActiva ? (
                  'APAGAR BOMBA'
                ) : (
                  'ENCENDER BOMBA'
                )}
              </Button>
              <div className="mt-3 text-muted small text-center">
                Control de bomba manual
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ---------- Tarjeta 3: Gráfica de historial ---------- */}
        <Col md={12} className="mt-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title> Historial de Humedad</Card.Title>
              <hr />
              {datosGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="humedad" 
                      stroke="#2c3e50" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Humedad (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">No hay datos disponibles para graficar</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;