export const searchRecipes = async (searchTerm: string, page: number, diet: string) => {
  const baseUrl = new URL(`http://localhost:5001/api/recipes/search?`);
  baseUrl.searchParams.append("diet", diet);
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));
  

  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};