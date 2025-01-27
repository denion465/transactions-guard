import { useRef } from 'react';
import { Button } from 'antd';
import { uploadFile } from '../../app/services/filesService/uploadFile';
import toast from 'react-hot-toast';

export function FileUploadButton({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  async function handleUploadFile(file) {
    try {
      await uploadFile(file);
      toast.success('Sucesso ao fazer upload do arquivo!');
      onUploadSuccess();
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  }

  return (
    <div>
      <Button
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#8AC644',
        }}
        type="primary"
        onClick={handleButtonClick}
      >
        Fazer Upload de arquivo
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

