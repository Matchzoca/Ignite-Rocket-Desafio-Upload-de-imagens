import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import axios from 'axios';

interface FormAddImageProps {
  closeModal: () => void;
}

interface imagePropsData{
  title:string;
  description:string;
  url:string;
 
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();
  
  const regex1 =  /[\/.](gif|jpg|jpeg|png)$/i;

  const formValidations = {

    image: {
      required:  'Arquivo obrigatório', 
      validate:{
        lessThenTen: input=> input[0].size < 10000000  || 'O arquivo deve ser menor que 10MB',//.files[0],
        validFormat: input=> regex1.test(input[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      }
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS

    },
    title: {
      required: 'Título obrigatório',
      minLenght:{
        value:2,
        message:'Mínimo de 2 caracteres'
      },
      maxLenght:{
        value:20,
        message:'Máximo de 20 caracteres'
      }
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
    },
    description: {
      required:  'Descrição obrigatória',
      maxLength: {
      value: 65,
      message: 'Máximo de 65 caracteres' // JS only: <p>error message</p> TS only support string
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(  
    // TODO MUTATION API POST REQUEST,
    async (imageSub:imagePropsData) =>{
      return api.post('api/images', {
        ...imageSub, url: imageUrl
      })
    },
    {onSuccess: async ()=>{
       queryClient.invalidateQueries('images')
    }
      // TODO ONSUCCESS MUTATION
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    unregister,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data:imagePropsData ): Promise<void> => {
    try {
      if(imageUrl){
        await mutation.mutateAsync(data)
        toast({
          title: 'Imagem cadastrada.',
          description: "Sua imagem foi cadastrada com sucesso.",
          isClosable: true,
      })
      return (null)
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
      }
      toast({
        title: 'Imagem não adicionada.',
        description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      })

    } catch {
      toast({
        title: 'Falha no cadastro',
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
    } finally {
      reset()
      unregister('image')
      closeModal()
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error= {errors.image}
          {...register('image',formValidations.image)} 
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          error= {errors.title}
          
          {...register('title',formValidations.title)} 
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error= {errors.description}
          // TODO SEND DESCRIPTION ERRORS
          {...register('description',formValidations.description)} 
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
