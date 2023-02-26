import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}
export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return(

    <Modal  isOpen={isOpen} onClose={onClose}>
      <ModalOverlay  bg={`blackAlpha.700`}/>
        <ModalContent   bg={'pGray.900'}>
            <ModalBody>
              <Flex flexDir={`column`} justifyContent='center' align={`center`}>
                <Image maxW={`900px`} maxH={'600px'} src={imgUrl}/>
              </Flex>
            </ModalBody>
            <ModalFooter bg={'pGray.700'} justifyContent={`flex-start`}>
             <Link color={`white`} target="_blank" href={imgUrl}>Abrir original</Link>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}
