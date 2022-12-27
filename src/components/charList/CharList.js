import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true); // первичная загрузка элементов
    const [error, setError] = useState(false);
    const [newItemloading, setNewItemloading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
      onRequest();
    }, []) // eslint-disable-line

    // когда пользователь кликает на "load more"
    const onRequest = (offset) => {
      onCharListLoading();

      marvelService.getAllCharacters(offset)
          .then(onCharListLoaded)
          .catch(onError)
    }

    const onCharListLoading = () => {
      setNewItemloading(true);
    }

    const onCharListLoaded = (newCharList) => {

      // проверка на то, что массив дозагрузки персонажей закончился
      let ended = false;
      if (newCharList.length < 9) {
        ended = true;
      }

      setCharList(charList => [...charList, ...newCharList]); //при Load more
      setLoading(false);
      setNewItemloading(newItemloading => false);
      setOffset(offset => offset + 9);
      setCharEnded(charEnded => ended);
    }

    const onError = () => {
      setError(true);
      setLoading(false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
      itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
      const items =  arr.map((item, i) => {
          const fixPosterPath = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
          let imgStyleFit = {'objectFit' : 'cover'};
          if (item.thumbnail === fixPosterPath) imgStyleFit = {'objectFit' : 'unset'};
          
          return (
              <li 
                  className="char__item"
                  key={item.id}
                  tabIndex={0}
                  ref={el => itemRefs.current[i] = el}
                  onClick={() => {
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                  }}>
                      <img src={item.thumbnail} alt={item.name} style={imgStyleFit}/>
                      <div className="char__name">{item.name}</div>
              </li>
          )
      });

      // А эта конструкция вынесена для центровки спиннера/ошибки
      return (
          <ul className="char__grid">
              {items}
          </ul>
      )
  }

  const items = renderItems(charList);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long"
            disabled={newItemloading}
            style={{'display': charEnded ? 'none' : ''}}
            onClick={() => onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
}

export default CharList;