import "./Bookdetail.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    const fetchBookDetail = async () => {
      const response = await axios.get(`https://fptu-library.xyz/api/book-sets/${id}`);
      setBook(response.data.bookSet);
      const image = response.data.bookSet.image;
      if (image) {
        setImage(`https://fptu-library.xyz/api/book-sets/image/${image.split("/").pop()}`);
      }
    }
   
    fetchBookDetail();
  }, []);


  return (
    <div className="container">
      <h1>Book Detail</h1>
      {book && (
        <div className="row">
          <div className="col-md-3">
            <img src={image} alt={book.title} style={{ width: '200px' }} />
          </div>
          <div className="col-md-9">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Year:</strong> {new Date(book.publishedYear).getFullYear()}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Price:</strong> {book.price} VND</p>
            <p><strong>Total Copies:</strong> {book.totalCopies}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies}</p>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default BookDetail;
