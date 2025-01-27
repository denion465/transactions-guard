import { Button, Layout, Space } from 'antd';
import { useNavigate } from 'react-router';

const { Header } = Layout;

export function AppHeader () {
  const navigate = useNavigate();

    async function handleDownloadCSVData() {
      try {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API_URL}/confirmed-payments/export-csv`;
        link.download = 'payments.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erro ao fazer download do arquivo:', error);
      }
    }

  return (
    <Header
      style={{
        backgroundColor: '#004B89',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        zIndex: 1
      }}
    >
      <span>Transactions Guard</span>

      <Space style={{ marginLeft: '40px' }}>
        <Button
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#004B89',
          marginBottom: '18px'
        }}
        type="default"
        onClick={() => navigate('/')}
        >
          Arquivos
        </Button>
      </Space>

      <Space style={{ marginLeft: '40px' }}>
        <Button
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#8AC644',
          marginBottom: '18px'
        }}
        type="default"
        onClick={handleDownloadCSVData}
        >
          Exportar dados confirmados para CSV
        </Button>
      </Space>
    </Header>
  );
};
