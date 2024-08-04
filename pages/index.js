import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, updateDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  IconButton,
  InputLabel,
  FormControl 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    };

    fetchItems();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (itemName && itemQuantity && selectedCategory) {
      const itemRef = collection(db, 'items');
      const q = query(itemRef, where('name', '==', itemName.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingItem = querySnapshot.docs[0];
        const existingQuantity = parseInt(existingItem.data().quantity, 10);
        const newQuantity = existingQuantity + parseInt(itemQuantity, 10);
        await updateDoc(doc(db, 'items', existingItem.id), { quantity: newQuantity.toString() });
        setItems(items.map(item => 
          item.id === existingItem.id ? { ...item, quantity: newQuantity.toString() } : item
        ));
        console.log('Item quantity updated:', { name: itemName.trim(), quantity: newQuantity.toString() });
      } else {
        const newItem = { name: itemName.trim(), quantity: itemQuantity.trim(), category: selectedCategory };
        const docRef = await addDoc(itemRef, newItem);
        setItems([...items, { id: docRef.id, ...newItem }]);
        console.log('Item added to Firestore:', newItem);
      }

      setItemName('');
      setItemQuantity('');
      setSelectedCategory('');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      setItems(items.filter(item => item.id !== id));
      console.log('Item deleted:', id);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const filteredItems = items.filter(item =>
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.quantity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (searchCategory === '' || item.category === searchCategory)
  );

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4} textAlign="center">
        <Typography variant="h4">Pantry Inventory Management App</Typography>
      </Box>
      <Box component="form" onSubmit={handleAddItem} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Enter item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Enter quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value=""><em>Select category</em></MenuItem>
                <MenuItem value="fruits">Fruits</MenuItem>
                <MenuItem value="vegetables">Vegetables</MenuItem>
                <MenuItem value="grains">Grains</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="meat">Meat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary"
            >
              Add item
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Search items..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={searchCategory}
                onChange={handleSearchCategoryChange}
                label="Category"
              >
                <MenuItem value=""><em>All categories</em></MenuItem>
                <MenuItem value="fruits">Fruits</MenuItem>
                <MenuItem value="vegetables">Vegetables</MenuItem>
                <MenuItem value="grains">Grains</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="meat">Meat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box display="flex" alignItems="center" p={2} borderBottom={1}>
                <Box flexGrow={1}>
                  <Typography variant="body1"><strong>{item.name}</strong></Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body2">Category: {item.category}</Typography>
                </Box>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
