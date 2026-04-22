import './App.css';
import { useState } from 'react';
import * as api from './api';
import type { Recipe } from './types';


const App = () => {
  const [searchTerm, setSearchTerm] = useState('lunch');
  const [diet, setDiet] = useState('Lacto-Vegetarian');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Function that gets called when the user submits the search term. 
  // It makes an API call to the backend to fetch recipes based on the search term and updates the state with the results.
  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1, diet);
      setRecipes(recipes.results);
    } catch (err) {
      console.log('Error fetching recipes:', err);
    }
  };
  
  return (
    <div>
      <form onSubmit={(event) => { handleSearchSubmit(event); }}>
        <button type="submit">Submit</button>
      </form>

      {recipes?.map((recipe) => (
        <div>
          recipe image location: {recipe.image}
          recipe.title: {recipe.title}
        </div>
      ))}
    </div>
  );
};

export default App;
