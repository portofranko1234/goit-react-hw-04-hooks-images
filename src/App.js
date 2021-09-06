import React, { useState } from "react";
import Loader from "react-loader-spinner";
import * as API from "./Api/FetchService";
import Searchbar from "./Components/Searchbar";
import ImageGallery from "./Components//ImageGallery/ImageGallery";
import Button from "./Components/Button";
import Modal from "./Components/Modal";

export default function App() {
  const [searchWords, setSearchWords] = useState("");
  const [images, setImages] = useState([]);
  const [showModal, setModal] = useState(false);
  const [modalImage, setModalItem] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleModal = () => {
    setModal(({ showModal }) => ({ showModal: !showModal }));
  };

  const pushImagesToState = (response) => {
    const imagesFromResponse = response.data.hits;
    let newSearchArray = [];
    newSearchArray = [...images, ...imagesFromResponse];
    setImages(({ images }) => ({ images: newSearchArray }));
  };
  const setModalImage = (linkImg) => {
    return setModalItem(({ modalImage }) => ({ modalImage: linkImg }));
  };
  const openLargeImage = (linkImg) => {
    setModalImage(linkImg);
    toggleModal();
  };

  const loaderToggle = (bool) => {
    return setShowLoader(({ showLoader }) => ({ showLoader: bool }));
  };
  const getImages = (words, page) => {
    let scrollHeight = 0;
    if (page === 1) {
      scrollHeight = 0;
    } else {
      scrollHeight = document.documentElement.scrollHeight + 144;
    }
    const loaderToggle = true;
    API.get(words, page).then((response) => {
      pushImagesToState(response);
      loaderToggle(false);
      setCurrentPage((setCurrentPage) => ({
        currentPage: setCurrentPage + 1,
      }));

      window.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const searchFormSubmit = (event) => {
    event.preventDefault();
    const searchWordsValue = event.target[1].value;

    setSearchWords({ searchWords: searchWordsValue });
    const page = 1;
    getImages(searchWordsValue, page);
    event.target.reset();
  };

  const loadMoreFn = () => {
    loaderToggle(true);
    getImages(searchWords, currentPage);
  };

  return (
    <div className="App">
      {showModal && (
        <Modal closeFn={toggleModal} loader={loaderToggle}>
          <img src={modalImage} alt="modal" />
        </Modal>
      )}
      <Searchbar onSubmit={searchFormSubmit} />

      {searchWords !== "" && (
        <ImageGallery
          loader={loaderToggle}
          imagesArray={images}
          modalFn={openLargeImage}
        ></ImageGallery>
      )}
      {showLoader && <Loader />}
      {searchWords !== "" && <Button fn={loadMoreFn} />}
    </div>
  );
}
