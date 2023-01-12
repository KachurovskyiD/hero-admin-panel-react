import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Spinner from '../spinner/Spinner';

import { useHttp } from '../../hooks/http.hook';

import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from '../../actions/filters';

const HeroesFilters = () => {
  const { request } = useHttp();
  const { filters, filtersLoadingStatus, activeFilter } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(filtersFetching());
    request('http://localhost:3001/filters')
      .then((data) => dispatch(filtersFetched(data)))
      .catch(() => dispatch(filtersFetchingError()));
    // eslint-disable-next-line
  }, []);

  const renderFilters = (filters) => {
    if (filtersLoadingStatus === 'loading') {
      return (
        <div style={{ marginLeft: '45%' }}>
          <Spinner />
        </div>
      );
    } else if (filtersLoadingStatus === 'error') {
      return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    if (filters.length === 0) {
      return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
    }

    return filters.map(({ type, name, className }) => {
      const btnClass = classNames('btn', className, {
        'active': type === activeFilter,
      });

      return (
        <button
          key={type}
          id={type}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(type))}
        >
          {name}
        </button>
      )
    });
  };

  const elements = renderFilters(filters);

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">
          {elements}
        </div>
      </div>
    </div>
  );
};

export default HeroesFilters;
