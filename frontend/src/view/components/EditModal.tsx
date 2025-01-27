import React from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import { formatCurrency } from '../../app/utils/formatCurrency';

const EditModal = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((error) => {
        console.log('Erro ao validar campos:', error);
      });
  };

  return (
    <Modal
      title="Editar Dados"
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Nome">
          <Input placeholder="Digite o nome" />
        </Form.Item>

        <Form.Item name="age" label="Idade">
          <InputNumber
            min={0}
            max={150}
            placeholder="Digite a idade"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="address" label="Endereço">
          <Input placeholder="Digite o endereço" />
        </Form.Item>

        <Form.Item
          name="document"
          label="CPF"
          rules={[
            {
              pattern: /^\d{11}$/,
              message: 'O CPF deve conter exatamente 11 dígitos numéricos!',
            },
          ]}
        >
          <Input
            style={{ width: '100%' }}
            placeholder="Digite o CPF"
            maxLength={11}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              e.target.value = value;
            }}
          />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="Data de Nascimento"
          rules={[
            {
              required: true,
              message: 'Por favor, insira a data de nascimento!',
            },
            {
              pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
              message:
                'Por favor, insira uma data válida no formato DD/MM/AAAA',
            },
          ]}
        >
          <Input
            style={{ width: '100%' }}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value;


              let formattedValue = value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/g, '$1/$2')
                .replace(/^(\d{2}\/\d{2})(\d)/g, '$1/$2')
                .slice(0, 10);

              e.target.value = formattedValue;
            }}
          />
        </Form.Item>

        <Form.Item name="paidAmount" label="Quantia Paga">
          <InputNumber
            formatter={(value) => formatCurrency(Number(value))}
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
