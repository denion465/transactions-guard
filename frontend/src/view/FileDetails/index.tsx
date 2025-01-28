import { Space, Button, Table, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getAllFileData, IQueryParamsGetAllFileData } from '../../app/services/filesDataService/getAllFiles';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { formatCurrency } from '../../app/utils/formatCurrency';
import { mask } from '../../app/utils/mask';
import { confirmPayments } from '../../app/services/confirmedPayments/confirmPayments';
import toast from 'react-hot-toast';
import { removeFileData } from '../../app/services/filesDataService/removeFileData';
import EditModal from '../components/EditModal';
import { editFileData } from '../../app/services/filesDataService/editFileData';

export function FileDetails() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [fileData, setFileData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [fileDataId, setfileDataId] = useState(null);
  const [isConfirmModalVisible, setConfirmIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setRemoveIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);

  const columns = [
    {
      title: 'Nome do pagante',
      dataIndex: 'name',
    },
    {
      title: 'Idade',
      dataIndex: 'age',
    },
    {
      title: 'Endereço',
      dataIndex: 'address',
    },
    {
      title: 'CPF',
      dataIndex: 'document',
      render: (document: string) => mask(document, '###.###.###-##')
    },
    {
      title: 'Data de Nascimento',
      dataIndex: 'birthDate',
      render: (dateString: string) => moment(dateString).format('DD/MM/YYYY')
    },
    {
      title: 'Quantia Paga',
      dataIndex: 'paidAmount',
      render: (amount: number) => formatCurrency(amount)
    },
    ...(isPending ? [
      {
        title: 'Ações',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              onClick={() => handleEdit(record)}
            >
              Editar
            </Button>
            <Button
              type="link"
              onClick={() => showRemoveModal(record)}
            >
              Excluir
            </Button>
          </Space>
        ),
      }
    ] : []),
  ].map((col, index) => ({ ...col, key: index }));
  const scrollConfig = {
    y: 'calc(80vh - 64px - 64px)',
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  async function fetchAllFileData() {
    try {
      const queryParams: IQueryParamsGetAllFileData = {
        page: currentPage,
        pageSize,
      };

      const response = await getAllFileData(id!, queryParams);
      setFileData(response.results);
      setTotalPages(response.total);
      response.results.find((data: any) => {
        if (data.status === 'PENDING') {
          setIsPending(true);
        }
      });
    } catch (error) {
      toast.error('Erro ao carregar arquivos!');
      console.error('Erro ao carregar arquivos:', error);
    }
  }
  const handleCancel = () => {
    setConfirmIsModalVisible(false);
    setRemoveIsModalVisible(false);
    setfileDataId(null);
  };
  const showConfirmModal = () => {
    setConfirmIsModalVisible(true);
  };
  const showRemoveModal = (value) => {
    setfileDataId(value.id);
    setRemoveIsModalVisible(true);
  };
  const handleEdit = (record) => {
    setSelectedRecord({
      ...record,
      birthDate: moment(record.birthDate).format('DD/MM/YYYY'),
    });
    setfileDataId(record.id);
    setIsEditModalVisible(true);
  };

  async function handleConfirmData() {
    try {
      setIsLoading(true);
      await confirmPayments(id!);
      setConfirmIsModalVisible(false);
      toast.success('Dados confirmados com sucesso!');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Erro ao confirmar arquivos!');
      setConfirmIsModalVisible(false);
      console.error('Erro ao confirmar arquivos:', error);
    }
  }

  async function handleRemoveData() {
    try {
      setIsLoading(true);
      await removeFileData(fileDataId!);
      toast.success('Dado removido com sucesso!');
      setRemoveIsModalVisible(false);
      await fetchAllFileData();
      setfileDataId(null);
      setIsLoading(false);
    } catch (error) {
      toast.error('Erro ao remover dado!');
      console.error('Erro ao confirmar arquivos:', error);
      setRemoveIsModalVisible(false);
    }
  }

  async function handleSaveEdit(values) {
    try {
      await editFileData(fileDataId!, values);
      toast.success('Dado editado com sucesso!');
      await fetchAllFileData();
      setIsEditModalVisible(false);
      setfileDataId(null);
    } catch (error) {
      setIsEditModalVisible(false);
      setfileDataId(null);
      toast.error('Erro ao editar dado!');
      console.error('Erro ao editar dado:', error);
    }
  }

  useEffect(() => {
    fetchAllFileData();
  }, [currentPage, pageSize]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: '100px',
          margin: '25px 25px',
        }}
      >
        { isPending &&
            <Button
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#8AC644',
            }}
            type="primary"
            onClick={showConfirmModal}
          >
            Confirmar Dados deste arquivo
          </Button>
        }
      </div>
      <Modal
        open={isConfirmModalVisible}
        title="Confirmação"
        onOk={handleConfirmData}
        onCancel={handleCancel}
        loading={isLoading}
      >
        <p>Você tem certeza que deseja confirmar os dados deste arquivo?</p>
      </Modal>
      <Modal
        open={isRemoveModalVisible}
        title="Confirmação"
        onOk={handleRemoveData}
        onCancel={handleCancel}
        loading={isLoading}
      >
        <p>Você tem certeza que deseja remover esse dado do arquivo?</p>
      </Modal>
      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSave={handleSaveEdit}
        initialValues={selectedRecord}
      />
      <Table
        columns={columns}
        dataSource={fileData}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalPages,
          onShowSizeChange: (_, newPageSize) => handlePageSizeChange(newPageSize),
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={scrollConfig}
        style={{ height: '100%', margin: '25px 50px' }}
        rowClassName="row-clickable"
      />
    </>
  );
}
