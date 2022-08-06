class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  //_apiKey = 'apikey=c5d6fc8b83116d92ed468ce36bac6c62'; //lector
  _apiKey = 'apikey=979d354cb4d6bb6f8c8081c6e8d9b897'; //my

  getResource = async (url) => {
      let res = await fetch(url);
  
      if (!res.ok) {
          throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
  
      return await res.json();
  }

  getAllCharacters = async () => {
      const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
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
  _transformCharacter = (сharacter) => {
    return {
      name: сharacter.name,
      description: сharacter.description ? `${сharacter.description.slice(0, 210)}...` : 'Sorry, there is no description',
      thumbnail: сharacter.thumbnail.path + '.' + сharacter.thumbnail.extension,
      homepage: сharacter.urls[0].url,
      wiki: сharacter.urls[1].url
    }

  }
}

export default MarvelService;