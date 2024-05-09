import { gql, useQuery } from '@apollo/client';
import { Box, Container, Typography, TextField, Paper, Avatar, Chip, Modal } from '@mui/material';
import { useEffect, useState } from 'react';

const query = (page = 1) => gql`{
  characters(page: ${page}) {
    info {
      pages
      count
      next
      prev
    }
    results {
      id
      name 
      gender
      image
    }
  }
}`;

function App() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useQuery(query(page));
  console.log({ data, loading, error })

  const [chosenCharacter, setChosenCharacter] = useState(null);

  const [filter, setFilter] = useState("");

  const handleClose = () => {
    setChosenCharacter(null);
  }
  
console.log({chosenCharacter})

  if (!loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>Welcome on Rick & Morty page</Typography>

        <TextField id="outlined-basic" label="Search for character" variant="outlined" onChange={ (e) => setFilter(e.target.value)} />
        
        <Box display='flex' gap={2} justifyContent='center'>
         
          <Typography onClick={()=> setPage(1)}>1</Typography>
          <Typography>...</Typography>
          <Typography onClick={()=> setPage(data.characters.info.prev)}>{data.characters.info.prev}</Typography>
          <Typography>{page}</Typography>
          <Typography onClick={()=> setPage(data.characters.info.next)}>{data.characters.info.next}</Typography>
         
          <Typography>...</Typography>
          <Typography onClick={()=> setPage(data.characters.info.pages)}>{data.characters.info.pages}</Typography>
        </Box>

        { filter && (
          <p>You are searching for: <b>{ filter }</b>, { data?.characters.results.filter(user => user.name.includes(filter)).length } items found </p>
        )}
        
        <Paper sx={{
          display: 'flex',
          gap: 2,
          padding: 2,
          maxWidth: 1000,
          flexWrap: 'wrap',
          justifyContent: "space-between",
        }} 
        >
          {data?.characters.results.filter(user => user.name.includes(filter)).map(el => (
            <Box
             onClick={() => {
              setChosenCharacter(el.id);
            }} 
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              border: '1px black solid',
              width: 'fit-content',
              padding: 2,
            }}>
              <Box display="flex" justifyContent="space-between" >
                <Avatar src={el.image} alt={el.name} />
                <Chip label={el.gender} />
              </Box>
              <Box display='flex' justifyContent='space-between' gap={2}> 
                <Typography>{el.id}</Typography>
                <Typography>{el.name}</Typography>
              </Box>
            </Box>
          ))}
        </Paper>
        <Modal open={chosenCharacter} onClose={handleClose}>
          <CharacterModalContent id={chosenCharacter} />
        </Modal>
      </Container>
    )

  }
  return (<Typography>Loading ...</Typography>)

}

export default App;

const queryCharacter = (id) =>  gql`{
  character(id: ${id}) {
    id
    type
    name
    image
    status
    species
    gender
    location {
      name
    }
  }
}`

const CharacterModalContent = ({id}) => {
  console.log('elo,', {id})
  const { data, loading, error } = useQuery(queryCharacter(id));
  const el  = data?.character

  if(!loading) {
    return (
      <Paper sx={{
        backgroundColor: 'whitesmoke',
        height: '80vh',
        width: '80vw',
        margin: 'auto'
      }}>

    
    <Box sx={{
      borderRadius: 2,
      border: '1px black solid',
      width: 'fit-content',
      padding: 2,
    }}>
      <Box display="flex" justifyContent="space-between">
        <Avatar src={el.image} alt={el.name} />
        <Chip label={el.gender} />
        <Chip label={el.species} />
      </Box>
      <Box display='flex' justifyContent='space-between' gap={2}> 
        <Typography>{el.id}</Typography>
        <Typography>{el.name}</Typography>
      </Box>
    </Box>
    </Paper>
    )

    }
  return <Box>Loading ...</Box>
}