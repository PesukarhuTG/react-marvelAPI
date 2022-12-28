import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=979d354cb4d6bb6f8c8081c6e8d9b897';
  const _baseOffset = 210; // загрузка не всех персонажей, а с отступом, т.к. начальные неинтересны

  

  const getAllCharacters = async (offset = _baseOffset) => {
      const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
      return res.data.results.map(_transformCharacter); //массив с "причесаными" объектами

  }

  const getCharacter = async (id) => {
      const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
      return _transformCharacter(res.data.results[0]); //в 1м баннере всегда отображается 1й произвольный элемент
  }

  /* выносим логику получения данных отдельно для лаконичности, будем получать данные
  и возвращать трансформированный объект */
  const _transformCharacter = (сhar) => {
    return {
      id: сhar.id,
      name: сhar.name,
      description: сhar.description ? `${сhar.description.slice(0, 210)}...` : 'Sorry, there is no description',
      thumbnail: сhar.thumbnail.path + '.' + сhar.thumbnail.extension,
      homepage: сhar.urls[0].url,
      wiki: сhar.urls[1].url,
      comics: сhar.comics.items
    }
  }

  return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;