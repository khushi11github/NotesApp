import React,{useState,useEffect} from 'react'
import { Typography ,Box,Paper,IconButton,TextField} from '@mui/material';

import Navbar from './Navbar'
import axios from 'axios';

const FolderManager = () => {
    const [clickfav, clicked] = useState(false);
    const [folderlist, setFolderlist] = useState([]);

    const [folders, setFolders] = useState(
    {
      "color":'',
      "name":'',
      "folderId":'',
      "isFav":false,
      "createdAt": new Date().toISOString(),
      "owner": localStorage.getItem("userId"),
      "parentId": null,
      "tags": [],
      "sharedWith": []

    }

  );
useEffect(() => {
    fetchFolders();
  }, []);
  const fetchFolders = async () => {
    try {
      const url = "http://localhost:8000/api/folders/myfolders";
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          },
          });
      if (res.status === 200) {
        console.log(res.data);
         // check the returned folders
         setFolderlist(res.data);
        }
        } catch (error) {
          console.error(error);
          }
          };

  
  const addFolder = async () => {
  try {
    const url = "http://localhost:8000/api/folders/create";
    const res = await axios.post(url, folders, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.status === 201) {
      alert("Folder created successfully!");
      fetchFolders(); 
      setFolders({
        "name": '',
        "color": '',
        "folderId": '',
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString(),
        "parentId": null,
        "tags": [],
        "sharedWith": []
        });
      console.log(res.data); 
    } else {
      alert("Something went wrong!");
    }

  } catch (err) {
    console.log(err);
    alert("Error creating folder: " + err.message);
  }
}

const setColor=((e)=>{
  const color = e.target.value;
  const url = `http://localhost:8000/api/folders/${folders.folderId}`;
  

}
)

  return (
    <div>

      <Navbar />

    <Box sx={{display :'flex',height:'100vh'}}>
      <Box sx={{width:'30%', backgroundColor:'#e0c5fdff', p:2}}>
     <Typography variant="h4" sx={{textAlign: 'center'}}>
      ADD FOLDER <IconButton onClick={addFolder} color="primary" aria-label="add folder"></IconButton>
      </Typography>
      <Paper sx={{padding:2, marginTop:2, backgroundColor:'#f0f0f0'}}>
        <Typography variant="h6">Folder Name:</Typography>
        <input type="text" value={folders.name} onChange={(e) => setFolders({...folders, name: e.target.value})} />
        <Typography variant="h6">Folder Color:</Typography>
        <input type="color" value={folders.color} onChange={(e) => setFolders({...folders, color: e.target.value})} />
        <Typography variant="h6">Folder Tags:</Typography>
        <TextField 
          value={folders.tags.join(', ')}
          onChange={(e) => setFolders({...folders, tags: e.target.value.split(',').map(tag => tag.trim())})}
          placeholder="Enter tags separated by commas"
          fullWidth="true"
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <button onClick={addFolder}>Create Folder</button>
      </Paper>



      </Box>

      <Box sx={{ flexGrow: 1, backgroundColor: '#afc5b9ff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
  <Typography variant="h4" sx={{ marginBottom: '20px' }}>
    {/* Optional Title */}
  </Typography>

  {clickfav ? (
    <Typography variant="h6" sx={{ padding: '10px', backgroundColor: '#dfe9dfff', borderRadius: '8px' }}>
      You have clicked on a favorite folder!
    </Typography>
  ) : (
    // <Typography variant="h6" sx={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
    //   No Favorite Folders

  

  
<Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'flex-start', // or 'center' if you prefer
    padding: 2
  }}
>
  {folderlist.map((folder, index) => (
    <Paper
      key={index}
      sx={{
        width: 200, // fixed width so they wrap like grid items
        padding: 2,
      
      }}
    >
      <Typography variant="h6">{folder.name}</Typography>
       <input
        type="color"
        value={folder.color}
        onChange={(e) => setColor(folder.folderId, e.target.value)}
      />
      <Typography variant="body2">Tags: {folder.tags.join(', ')}</Typography>
      <IconButton
        onClick={() => clicked(!clickfav)}
        color="primary"
        aria-label="favorite folder"
      >
        
      </IconButton>
    </Paper>
  ))}

</Box>

  )};



















      
  
  
</Box>

      






    </Box>




        

    
    </div>
  )
}

export default FolderManager
