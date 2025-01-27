import { useEffect, useState } from 'react';
import { Table, Space, Button, DatePicker } from 'antd';
import { FileUploadButton } from '../components/FileUploadButton';
import moment from 'moment';
import { getAllFiles, IQueryParamsGetAllFiles } from '../../app/services/filesService/getAllFiles';

const { RangePicker } = DatePicker;

export function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [dateRange, setDateRange] = useState<string[] | null>([]);
  const pageSize = 30;
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Status do arquivo',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Criado Em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateString: string) => moment(dateString).format('DD/MM/YYYY HH:mm:ss')
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            Ver Detalhes
          </Button>
        </Space>
      ),
    },
  ];
  const handleDateChange = (_dates: Date[], dateString: string[]) => {
    setDateRange(dateString);
  };
  const handleViewDetails = (record) => {
    console.log('Detalhes do arquivo:', record);
    alert(`Detalhes do arquivo: ${record.name}`);
  };
  const scrollConfig = {
    y: 'calc(80vh - 64px - 64px)',
  };

  async function fetchAllFiles() {
    try {
      const queryParams: IQueryParamsGetAllFiles = {
        page: currentPage,
        pageSize,
      };

      if (dateRange?.some(Boolean)) {
        queryParams.startDate = moment(dateRange[0]).valueOf();
        queryParams.endDate = moment(dateRange[1]).valueOf();
      }

      const response = await getAllFiles(queryParams);
      setFiles(response.results);
      console.log(files.length);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    }
  }

  useEffect(() => {
    fetchAllFiles();
  }, []);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: '100px'
      }}>
        <RangePicker onChange={handleDateChange} />
        <Button
          type="primary"
          style={{ margin: '25px 25px' }}
          onClick={() => fetchAllFiles()}
        >
          Pesquisar
        </Button>
        <FileUploadButton onUploadSuccess={fetchAllFiles}/>
      </div>

      <Table
        columns={columns}
        dataSource={files}
        pagination={{
          current: currentPage,
          pageSize,
          total: files.length,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={scrollConfig}
        style={{ height: '100%', margin: '25px 50px' }}
        onRow={(record) => ({
          onClick: () => handleViewDetails(record),
        })}
        rowClassName="row-clickable"
      />
    </>
  );
}
