import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
      charList: [],
      loading: true, // первичная загрузка элементов
      error: false,
      newItemloading: false, // загрузка на "load more"
      offset: 210,
      charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    // когда пользователь кликает на "load more"
    onRequest = (offset) => {
      this.onCharListLoading();

      this.marvelService.getAllCharacters(offset)
          .then(this.onCharListLoaded)
          .catch(this.onError)
    }

    onCharListLoading = () => {
      this.setState({
        newItemloading: true
      })
    }

    onCharListLoaded = (newCharList) => {

      // проверка на то, что массив дозагрузки персонажей закончился
      let ended = false;
      if (newCharList.length < 9) {
        ended = true;
      }


      this.setState(({ offset, charList}) => ({ 
        charList: [...charList, ...newCharList], //при Load more
        loading: false,
        newItemloading: false,
        offset: offset + 9,
        charEnded: ended,
      }));
    }

    onError = () => {
        this.setState({
          error: true,
          loading: false,
        });
    }

      // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
      const items =  arr.map((item) => {
          const fixPosterPath = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
          let imgStyleFit = {'objectFit' : 'cover'};
          if (item.thumbnail === fixPosterPath) imgStyleFit = {'objectFit' : 'unset'};
          
          return (
              <li 
                  className="char__item"
                  key={item.id}
                  onClick={() => this.props.onCharSelected(item.id)}>
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

    render() {
      const {charList, loading, error, offset, newItemloading, charEnded} = this.state;
      const items = this.renderItems(charList);
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
                    onClick={() => this.onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
      )
    }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
}

export default CharList;