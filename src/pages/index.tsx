import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { isCompositeComponent } from 'react-dom/test-utils';

export default function Home(): JSX.Element {

  const fetchImages = async ({pageParam = null})=>{
    const response = await api.get('/api/images',{
     params:{
       after: pageParam,
     }
   }).then(response =>{
     return response.data
    })
    return response
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images', 
     fetchImages
    // TODO AXIOS REQUEST WITH PARAM
    ,{
      getNextPageParam: lastPage=> {
        const { after } = lastPage
  
        return after ?? null;
    }}
    //  GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    // FORMAT AND FLAT DATA ARRAY
    return data?.pages.
    flatMap(page=>{
      return page.data.flat()
    })
  }, [data]);

  //  RENDER LOADING SCREEN
  if(isLoading){
    return (
      <Loading/>
    )
  }
  // TODO RENDER ERROR SCREEN
  if(isError){
    return (
      <Error/>
    )
  }


  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} >
              {isFetchingNextPage ? 'Carregando ...' : 'Carregar mais'}
          </Button>
        )}

      </Box>
    </>
  );
}
