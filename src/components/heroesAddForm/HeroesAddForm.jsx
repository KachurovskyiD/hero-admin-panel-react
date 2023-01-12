import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroCreate } from '../../actions/heroes';

import { useHttp } from '../../hooks/http.hook';

const HeroesAddForm = () => {
  const { request } = useHttp();
  const [heroName, setHeroName] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroElement, setHeroElement] = useState('');
  const { filters, filtersLoadingStatus } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  const onCreateHero = (event) => {
    event.preventDefault();

    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescription,
      element: heroElement,
    };

    request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
      .then((response) => console.log(response, 'Отправка успешна'))
      .then(dispatch(heroCreate(newHero)))
      .catch((err) => console.err(err));

    setHeroName('');
    setHeroDescription('');
    setHeroElement('');
  };

  const renderFilters = (filters) => {
    if (filtersLoadingStatus === 'loading') {
      return <option>Загрузка элементов</option>;
    } else if (filtersLoadingStatus === 'error') {
      return <option>Ошибка загрузки</option>;
    } else if (filters.length === 0) {
      return <option>Фильтры не найдены</option>;
    }

    return filters.map(({ type, name }) => {
      // eslint-disable-next-line
      if (type === 'all') return;
      return (
        <option key={type} value={type}>
          {name}
        </option>
      );
    });
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onCreateHero}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: '130px' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          className="form-select"
          id="element"
          name="element"
          value={heroElement}
          onChange={(e) => setHeroElement(e.target.value)}
          required>
          <option value="">Я владею элементом...</option>
          {renderFilters(filters)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
