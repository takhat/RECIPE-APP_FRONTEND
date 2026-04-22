import './App.css';
import { useState, useRef } from 'react';
import * as api from './api';
import { type Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';


const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [diet] = useState('Lacto-Vegetarian');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const pageNumber = useRef(1);

  // Function that gets called when the user submits the search term. 
  // It makes an API call to the backend to fetch recipes based on the search term and updates the state with the results.
  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1, diet);
      setRecipes(recipes.results);
      pageNumber.current = 1; // Reset page number to 1 for new search
    } catch (err) {
      console.log('Error fetching recipes:', err);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1; // Increment the page number
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage, diet);
      setRecipes([...recipes, ...nextRecipes.results]); // Append new recipes to existing ones
      pageNumber.current = nextPage; // Update the current page number
    } catch (err) {
      console.log('Error fetching more recipes:', err);
    }
  };

  return (
    <div>
      <form onSubmit={(event) => { handleSearchSubmit(event); }}>
        <input type="text" required placeholder='Enter a search term ...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        <button type="submit">Submit</button>
      </form>

      {recipes?.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
      ))}
      <button className='view-more-button' onClick={handleViewMoreClick}>View More</button>
      {selectedRecipe ? <RecipeModal /> : null}
      </div>
  );
};

export default App;