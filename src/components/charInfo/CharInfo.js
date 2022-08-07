import { Component } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

class CharInfo extends Component {
    state = {
      char: null,
      loading: false,
      error: false
    }

    marvelService = new MarvelService();

    //хук, когда компонент отрендерился
    componentDidMount() {
      this.updateChar(); //...запускаем обновление
    }

    componentDidUpdate(prevProps) {
      //если новые id не равны прошлым
      if (this.props.charId !== prevProps.charId) {
        this.updateChar();
      }


    }

    updateChar = () => {
      const {charId} = this.props;
      //если id не передан (в начале), то заглушка skeleton сработает
      if (!charId) return;

      this.onCharLoading(); //перед запросом показывается спиннер

      //если же id есть, то делаем запрос на сервер
      this.marvelService
          .getCharacter(charId) // 1) когда придет ответ от API в формате 1 объекта...
          .then(this.onCharacterLoaded) // 2) ...он попадет в onCharacterLoaded
          .catch(this.onError)
    }

    //загрузка персонажа (конечный результат)
    onCharacterLoaded = (char) => {
      this.setState({char, loading: false}); // 3) ...и запишется в наше состояние
    }

    //при клике на try грузился спиннер (промежуточный результат)
    onCharLoading = () => {
      this.setState({loading: true});
    }

    //метод ля установки ошибки
    onError = () => {
      this.setState({loading: false, error: true});
    }

    render() {
      const { char, loading, error } = this.state;

      //начальное состояние: если у нас не загружен персонаж, не загрузка, не ошибка, то скелетон
      const skeleton = char || loading || error ? null : <Skeleton />;

      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error || !char) ? <View char={char} /> : null;

      // благодаря условиям отобразится только один из компонентов в зависимости от state
      return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
    }
}

const View = ({char}) => {
  const { name, description, thumbnail, homepage, wiki, comics} = char;
  const comicsPartForRender = comics.slice(0, 10);

  const fixPosterPath = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
  let objectFitStyle = {'objectFit' : 'cover'};
  if (thumbnail === fixPosterPath) objectFitStyle = {'objectFit' : 'contain'};

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={objectFitStyle}/>
        <div>
            <div className="char__info-name">{name}</div>
            <div className="char__btns">
              <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
              </a>
              <a href={wiki} className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
        </div>
      </div>
      <div className="char__descr">
            {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : 'There is no comics with this character'}
        {comicsPartForRender.map((item,i) => {
          return (
                <li className="char__comics-item" key={i}>
                    {item.name}
                </li>
          )
        })}
      </ul>
    </>
  )

}

export default CharInfo;