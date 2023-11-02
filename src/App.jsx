import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { auth, db, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  //armazena a  lista de filmes
  const [movieList, setMovieList] = useState([]);

  //new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleasedDate, setReleasedDate] = useState(0);
  const [isNewMovieOscar, setisNewMovieOscar] = useState(false);
  const [updatedtitle, setUpdatedtitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  //constante que armazena a coleção que criei no firestore, que nesse caso, tem o nome de "movies", passado como parâmetro "key" na função "collection"
  const moviesCollectionRef = collection(db, "movies");

  //função para carregar a lista assim que a página é aberta
  //a função foi criada dentro do useEffect pois este não aceita uma denotação assíncrona
  useEffect(() => {
    const getMovieList = async () => {
      try {
        //constante que captura todos os documentos dentro da minha collection "movies"
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          //captura todos os dados, como nesse exemple, o title, releaseData, etc
          ...doc.data(),
          //como a função de cima não captura o id do documento, que nesse caso, é um filme específico, aplicamos essa função que faz esse trabalho
          //o id é o número gerado automaticamente, nesse caso "PBlpOqJpykL4Wh48sERQ"
          id: doc.id,
        }));
        //na estrutura do array de objetos, o id gerado automáticamente se torna uma propriedade, assim como o title, etc.
        setMovieList(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    getMovieList();
  }, [movieList]);

  //função que irá criar um novo filme
  const onSubmitMovie = async () => {
    try {
      //não é necessário passar o valor do id, pois este é criado automáticamente
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleasedDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      alert("filme criado!");
    } catch (error) {
      console.error(error);
    }
  };

  //função para deletar um filme
  const deleteMovie = async (id) => {
    //passa o database, o nome da collection e o id do documento (filme) que está dentro dessa collection
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovietitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    //aqui, chamamos a função updateDoc e colocamos dentro dela qual o documento exato e qual propriedade iremos alterar
    await updateDoc(movieDoc, { title: updatedtitle });
  };

  const uploadFile = async () => {
    //verifica se o estado está vazio
    if (!fileUpload) return;
    //constante que guarda o caminho da pasta criada no storage do firebase
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      //função que envia o arquivo para o caminho específico da pasta
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Auth />

      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release year..."
          type="number"
          onChange={(e) => setReleasedDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setisNewMovieOscar(e.target.checked)}
        />
        <label htmlFor="">Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>

            <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedtitle(e.target.value)}
            />
            <button onClick={() => updateMovietitle(movie.id)}>
              Update title
            </button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
