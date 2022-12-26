class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=979d354cb4d6bb6f8c8081c6e8d9b897';
  _baseOffset = 210; // загрузка не всех персонажей а с отступом, т.к. начальные неинтересны

  getResource = async (url) => {
      let res = await fetch(url);
  
      if (!res.ok) {
          throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
  
      return await res.json();
  }

  getAllCharacters = async (offset = this._baseOffset) => {
      const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
      //передаем callback который каждый элемент трансформирует (берет только нужное нам)
      return res.data.results.map(this._transformCharacter); //массив с причесаными объектами

  }

  getCharacter = async (id) => {
      const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); //сохраняем персонажа в промеж результат
      //в первом баннере всегда отображается первый произвольный элемент
      return this._transformCharacter(res.data.results[0]);
  }

  // выносим логику получения данных отдельно для лаконичности
  //будем получать данные и возвращать трансформированный объект
  _transformCharacter = (сhar) => {
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
}

export default MarvelService;