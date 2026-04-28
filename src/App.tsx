import './App.css';
import { useState, useRef, useEffect } from 'react';
import * as api from './api';
import { type Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
type Tabs = 'search' | 'favorites';

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [diet] = useState('Lacto-Vegetarian');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<Tabs>('search');
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const pageNumber = useRef(1);

  // fetch favorite recipes when the component mounts (page loads) 
  // and set the state with the results. This will allow us to display
  // the user's favorite recipes when they click on the "Favorites" tab.
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const favoriteRecipes = await api.getFavoriteRecipes();
        setFavoriteRecipes(favoriteRecipes.results);
      } catch (err) {
        console.log('Error fetching favorite recipes:', err);
      }
    };

    fetchFavoriteRecipes();
  }, []);

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
      <div className='tabs'>
        <h1 onClick={() => setSelectedTab('search')}>
          Recipe Search
        </h1>
        <h1 onClick={() => setSelectedTab('favorites')}>
          Favorites
        </h1>
      </div>
      {selectedTab === 'search' && (
        <>
          <form onSubmit={(event) => { handleSearchSubmit(event); }}>
            <input type="text" required placeholder='Enter a search term ...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <button type="submit">Submit</button>
          </form>

            {recipes?.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
      ))}
      <button className='view-more-button' onClick={handleViewMoreClick}>View More</button>
        </>
      )}
      {selectedTab === 'favorites' && (
          <div className='recipe-grid'>
            {favoriteRecipes.map((recipe) => 
              <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
            )}
          </div>
      )}
      {selectedRecipe ? (
        <RecipeModal 
          recipeId={selectedRecipe.id.toString()} 
          onClose={() => setSelectedRecipe(undefined)} />
      ) : null}
</div>
  );
};

export default App;