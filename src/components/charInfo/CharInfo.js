import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
      updateChar(); //...запускаем обновление
    }, [props.charId]) // eslint-disable-line

    const updateChar = () => {
      const {charId} = props;
      //если id не передан (в начале), то заглушка skeleton сработает
      if (!charId) return;

      onCharLoading(); //перед запросом показывается спиннер

      //если же id есть, то делаем запрос на сервер
      marvelService
          .getCharacter(charId) // 1) когда придет ответ от API в формате 1 объекта...
          .then(onCharacterLoaded) // 2) ...он попадет в onCharacterLoaded
          .catch(onError)
    }

    //загрузка персонажа (конечный результат)
    const onCharacterLoaded = (char) => {
      // 3) ...и запишется в наше состояние
      setLoading(false);
      setChar(char);
    }

    //при клике на try грузился спиннер (промежуточный результат)
    const onCharLoading = () => {
      setLoading(true);
    }

    //метод ля установки ошибки
    const onError = () => {
      setError(true);
      setLoading(false);
    }

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

CharInfo.propTypes = {
  charId: PropTypes.number,
}

export default CharInfo;