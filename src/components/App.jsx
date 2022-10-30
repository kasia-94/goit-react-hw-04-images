import { useState, useEffect } from 'react';
import { AppMain } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchPhoto } from 'components/fetchPhoto';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const renderGallery = (name, page) => {
      setIsLoading(true);

      try {
        const response = fetchPhoto(name, page);
        response.then(data => {
          if (!data.data.hits.length) {
            setIsLoading(false);
            return toast.error('Nothing found', {
              theme: 'colored',
            });
          }
          const renderPhoto = data.data.hits.map(
            ({ id, webformatURL, largeImageURL, tags }) => ({
              id,
              webformatURL,
              largeImageURL,
              tags,
            })
          );
          setIsLoading(false);
          setGallery(gallery => [...gallery, ...renderPhoto]);
        });
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    if (name !== '' || page !== 1) {
      renderGallery(name, page);
    }
  }, [name, page]);

  const onSubmit = value => {
    if (value !== name) {
      setName(value);
      setPage(1);
      setGallery([]);
      return;
    }
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const toggleModal = () => {
    setShowModal(null);
  };

  const openModal = id => {
    const photo = gallery.find(photo => photo.id === id);
    setShowModal({
      largeImageURL: photo.largeImageURL,
      tags: photo.tags,
    });
  };

  return (
    <AppMain>
      <SearchBar onSubmit={onSubmit} />
      {error &&
        toast.error(`Sorry, but something happened wrong: ${error.message}`, {
          theme: 'colored',
        })}
      {gallery.length !== 0 && (
        <ImageGallery gallery={gallery} openModal={openModal} />
      )}
      {showModal && (
        <Modal
          toggleModal={toggleModal}
          largeImageURL={showModal.largeImageURL}
          tags={showModal.tags}
        />
      )}
      {isLoading && <Loader />}
      {gallery.length >= 12 && <Button nextPage={nextPage} />}
      <ToastContainer autoClose={1500} />
    </AppMain>
  );
}
