import { Button, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}


export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen} = useDisclosure()

  const [imgUrl, setImageUrl]= useState()
    
  function handleModal(url:string):void{
    setImageUrl(url)
    onOpen()
  }

  return (
    <>
      <SimpleGrid column={3}  minChildWidth='290px'spacing={`40px`}>
            {cards.map(
              (card)=>{
                return(
                  <Card key={card.id} data={card} viewImage={
                    handleModal
                  }/> 
                )
              }
            )}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage onClose={onClose} imgUrl={imgUrl} isOpen={isOpen}/>
    </>
  );
}
