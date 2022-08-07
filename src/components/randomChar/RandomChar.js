import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    //чтобы вызвать метод загрузки данных при первом запуске страницы, используем конструктор
    // но вызов конструктора до построения верстки - bad idea
    constructor(props) {
      super(props);
      this.updateChar();
    }

    state = {
      char: {},
      loading: true,
      error: false
    }

    marvelService = new MarvelService();

    //метод ля установки ошибки
    onError = () => {
      this.setState({loading: false, error: true});
    }

    //вынесем в метод загрузку персонажа (для переиспользования)
    onCharacterLoaded = (char) => {
      //обновление
      this.setState({char, loading: false});
    }

    //метод, ктр-й получает данные и записывает в state
    updateChar = () => {
      //данные id примерно находятся в одном диапазоне
      //если данных в API нет, то выдаст 404 и этот момент нужно предусмотреть
      const id = Math.floor(Math.random() * (1011400-1011000) + 1011000);

      //из метода getCharacter мы получаем трансформированный объект и отправляем его в state
      this.marvelService
        .getCharacter(id)
        .then(this.onCharacterLoaded)
        .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null;

        return (
          <div className="randomchar">
              {errorMessage}
              {spinner}
              {content}
              <div className="randomchar__static">
                  <p className="randomchar__title">
                      Random character for today!<br/>
                      Do you want to get to know him better?
                  </p>
                  <p className="randomchar__title">
                      Or choose another one
                  </p>
                  <button className="button button__main">
                      <div className="inner">try it</div>
                  </button>
                  <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
              </div>
          </div>
      )
    }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki} = char;

  return (
    <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img"/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                  <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
  )
};

export default RandomChar;