import { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdSearch } from 'react-icons/io';
import {
  SearchBarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormLabel,
  SearchFormInput,
} from './SearchBar.styled';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SearchBar({ onSubmit }) {
  const [inputName, setInputName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (inputName.trim() === '') {
      return toast.warning('Please, I need to know what you are looking for!', {
        theme: 'colored',
      });
    }
    onSubmit(inputName);
    setInputName('');
  };

  const handleChange = e => {
    setInputName(e.target.value.toLowerCase());
  };

  return (
    <SearchBarHeader>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <IoMdSearch style={{ width: 30, height: 30 }} />
          <SearchFormLabel>Search</SearchFormLabel>
        </SearchFormButton>

        <SearchFormInput
          type="text"
          autocomplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
          name="inputName"
          value={inputName}
        />
      </SearchForm>
    </SearchBarHeader>
  );
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
