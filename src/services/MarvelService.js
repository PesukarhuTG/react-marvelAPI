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

  getAllCharacters = () => {
      return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
  }

  getCharacter = (id) => {
      return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
  }
}

export default MarvelService;